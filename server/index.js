const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
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

async function run() {
  try {
    await client.connect();

    //--------------------collections---------------------//
    const db = client.db("bistroDB");
    const usersCollection = db.collection("users");
    const menuCollection = db.collection("menu");
    const reviewsCollection = db.collection("reviews");
    const cartCollection = db.collection("carts");

    //---------------------apis----------------------------//
    //insert a user to db
    // insert a cart to db
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = user.user_Email;
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

    })

    //delete a user from db
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // get all menu
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    // get all reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    // insert a cart to db
    app.post("/carts", async (req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result);
    });

    // get all cart item of a user
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        res.send([]);
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

    //confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("App is listening...!");
});

app.listen(port, () => {
  console.log(`App is listening on port${port}`);
});
