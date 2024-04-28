const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.faaeiem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");

    const coffeeCollection = client.db(dbName).collection("coffee");


    app.get("/", (req, res) => {
      res.send("coffee making is running");
    });
    app.listen(port, () => {
      console.log(`coffee server is running on port ${port}`);
    });


  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
  }
}


run();