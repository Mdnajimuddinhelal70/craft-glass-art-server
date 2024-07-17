const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a7x3bqu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const craftsCollection = client.db("craftsDb").collection("crafts");
    const formProductCollection = client
      .db("craftsDb")
      .collection("formProduct");

    app.get("/crafts", async (req, res) => {
      const result = await craftsCollection.find().toArray();
      res.send(result);
    });

    app.get("/productDetails/:id", async (req, res) => {
      const id = req.params.id;
      const details = await craftsCollection.findOne({ _id: new ObjectId(id) });
      res.send(details);
    });

    //API for form product
    app.post("/formProduct", async (req, res) => {
      console.log(req.body);
      const result = await formProductCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
    });

    // get data from form
    app.get("/craftList/:email", async (req, res) => {
      console.log(req.params);
      const result = await formProductCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    //for showing data in myList
    app.get("/myList/:email", async (req, res) => {
      const result = await formProductCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
    //details for card list from form
    app.get("/formDetails/:id", async (req, res) => {
      const id = req.params.id;
      console.log(req.params.id);
      const formDetails = await formProductCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(formDetails);
    });
    // for form data fetching for update
    app.get("/formUpdate/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await formProductCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });
    // for upadte form data
    app.put("/formProductUpdate/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          image: req.body.image,
          itemName: req.body.itemName,
          description: req.body.description,
          userName: req.body.userName,
          price: req.body.price,
          raiting: req.body.raiting,
          processingTime: req.body.processingTime,
          subcategoryName: req.body.subcategoryName,
          stockStatus: req.body.stockStatus,
          email: req.body.email,
        },
      };
      const result = await formProductCollection.updateOne(query, data);
      console.log(result);
      res.send(result);
    });
    //for delete item
    app.delete("/delete/:id", async (req, res) => {
      const result = await formProductCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("craft is running");
});

app.listen(port, () => {
  console.log(`Craft and arts are running on port ${port}`);
});
