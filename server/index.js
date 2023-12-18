const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

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

    //--------------------- apis----------------------------//
    //********************* jwt api ************************//
    // JWT
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10s",
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
    app.get("/carts", verifyJWT,verifyAdmin, async (req, res) => {
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
