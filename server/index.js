const { MongoClient, ServerApiVersion } = require("mongodb");
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

    // collections
    const db = client.db("bistroDB");
    const menuCollection = db.collection("menu");
    const reviewsCollection = db.collection("reviews");
    const cartCollection = db.collection("carts");

    // apis
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
