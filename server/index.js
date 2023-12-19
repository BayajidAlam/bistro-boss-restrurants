const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// set up mailgun
if (!process.env.MAIL_GUN_API_KEY) {
  console.error("Error: MAIL_GUN_API_KEY is not defined!");
  process.exit(1); // Exit the process with an error code
}
const Mailgun = require("mailgun-js");

const mg = new Mailgun({
  apiKey: process.env.MAIL_GUN_API_KEY,
  domain: process.env.MAIL_SENDING_DOMAIN,
});

// middlewares
app.use(cors());
app.use(express.json());

// mongodb and apis
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@myclaster-1.wxhqp81.mongodb.net/bistroDB?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//********************* verifyJWT middleware ************************//
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "unauthorized access" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res
        .status(401)
        .send({ error: true, message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};
//********************* verifyJWT middleware ************************//

async function run() {
  try {
    await client.connect();

    //--------------------collections---------------------//
    const db = client.db("bistroDB");
    const usersCollection = db.collection("users");
    const menuCollection = db.collection("menu");
    const reviewsCollection = db.collection("reviews");
    const cartCollection = db.collection("carts");
    const paymentsCollection = db.collection("payments");

    //--------------------- apis----------------------------//
    //********************* jwt api ************************//
    // JWT
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1hr",
      });
      res.send({ token });
    });
    //********************* jwt api ************************//

    //********************* verify admin api ************************//
    // use verify admin after verifyToken
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { user_email: email };
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.role === "admin";
      if (!isAdmin) {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };
    //********************* verify admin api ************************//

    //********************* admin apis ************************//
    app.get("/admin/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;

      if (req.decoded.email !== email) {
        return res.send({ admin: false });
      }

      const query = { user_email: email };
      const user = await usersCollection.findOne(query);
      const result = { admin: user?.role === "admin" };
      res.send(result);
    });
    //********************* admin apis ************************//

    //********************* users apis ************************//
    //insert a user to db
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { user_email: user.user_email };
      const isUserExist = await usersCollection.findOne(query);
      if (isUserExist) {
        return res.send({ message: "user already exist!" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // get all users
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // update a user on db
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    //delete a user from db
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
    //********************* users apis ************************//

    //********************* menu apis ************************//
    // get all menu
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    // insert a menu to db
    app.post("/menu", verifyJWT, verifyAdmin, async (req, res) => {
      const item = req.body;
      const result = await menuCollection.insertOne(item);
      res.send(result);
    });

    // delete a menu
    app.delete("/menu/:id", verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      console.log(id, "id");
      const query = { _id: new ObjectId(id) };
      const result = await menuCollection.deleteOne(query);
      console.log(result, "result");
      res.send(result);
    });
    //********************* menu apis ************************//

    //********************* reviews apis ************************//
    // get all reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });
    //********************* reviews apis ************************//

    //********************* cart apis ************************//
    // insert a cart to db
    app.post("/carts", async (req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result);
    });

    // get all cart item of a user
    app.get("/carts", verifyJWT, async (req, res) => {
      const email = req.query.email;
      if (!email) {
        res.send([]);
      }
      const decodedEmail = req.decoded.email;
      if (email !== decodedEmail) {
        return res
          .status(403)
          .send({ error: true, message: "forbidden access" });
      }

      const query = { user_Email: email };
      const result = await cartCollection.find(query).toArray();
      console.log("Right");
      res.send(result);
    });

    // delete a item form cart
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
    //********************* cart apis ************************//

    //********************* payment apis ************************//
    // payment intent
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);
      console.log(amount, "amount inside the intent");

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.get("/payments/:email", verifyJWT, async (req, res) => {
      const query = { email: req.params.email };
      if (req.params.email !== req.decoded.email) {
        return res.status(403).send({ message: "forbidden access" });
      }
      const result = await paymentsCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const paymentResult = await paymentsCollection.insertOne(payment);

      //  carefully delete each item from the cart
      console.log("payment info", payment);
      const query = {
        _id: {
          $in: payment.cartIds.map((id) => new ObjectId(id)),
        },
      };

      const deleteResult = await cartCollection.deleteMany(query);

      // send user email about payment confirmation
      mg.messages()
        .send({
          from: "Mailgun Sandbox <postmaster@sandbox89feb24256414e78b2903ecdc8276001.mailgun.org>",
          to: ["bayajidalam2001@gmail.com"],
          subject: "Hello",
          text: "Testing some Mailgun awesomeness!",
          html: `
          <div>
            <h2>Thank you for your order</h2>
            <h4>Your Transaction Id: <strong>${payment.transactionId}</strong></h4>
            <p>We would like to get your feedback about the food</p>
          </div>
        `,
        })
        .then((msg) => console.log(msg)) // logs response data
        .catch((err) => console.log(err)); // logs any error

      res.send({ paymentResult, deleteResult });
    });
    //********************* payment apis ************************//

    //********************* statistics apis ************************//
    // stats or analytics
    app.get("/admin-stats", verifyJWT, verifyAdmin, async (req, res) => {
      const users = await usersCollection.estimatedDocumentCount();
      const menuItems = await menuCollection.estimatedDocumentCount();
      const orders = await paymentsCollection.estimatedDocumentCount();

      // this is not the best way
      // const payments = await paymentCollection.find().toArray();
      // const revenue = payments.reduce((total, payment) => total + payment.price, 0);

      const result = await paymentsCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: "$price",
              },
            },
          },
        ])
        .toArray();

      const revenue = result.length > 0 ? result[0].totalRevenue : 0;

      res.send({
        users,
        menuItems,
        orders,
        revenue,
      });
    });

    // order status
    /**
     * ----------------------------
     *    NON-Efficient Way
     * ------------------------------
     * 1. load all the payments
     * 2. for every menuItemIds (which is an array), go find the item from menu collection
     * 3. for every item in the menu collection that you found from a payment entry (document)
     */

    // using aggregate pipeline
    app.get("/order-stats", verifyJWT, verifyAdmin, async (req, res) => {
      const result = await paymentsCollection
        .aggregate([
          {
            $unwind: "$menuItemIds",
          },
          {
            $lookup: {
              from: "menu",
              localField: "menuItemIds",
              foreignField: "_id",
              as: "menuItems",
            },
          },
          {
            $unwind: "$menuItems",
          },
          {
            $group: {
              _id: "$menuItems.category",
              quantity: { $sum: 1 },
              revenue: { $sum: "$menuItems.price" },
            },
          },
          {
            $project: {
              _id: 0,
              category: "$_id",
              quantity: "$quantity",
              revenue: "$revenue",
            },
          },
        ])
        .toArray();

      res.send(result);
    });

    //********************* statistics apis ************************//

    //confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Db connected successfully!");
  } finally {
  }
}
run().catch(console.dir);

//base api
app.get("/", (req, res) => {
  res.send("App is listening...!");
});

app.listen(port, () => {
  console.log(`App is listening on port${port}`);
});
