const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5001;


// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    
    console.log("Connected successfully to MongoDB server");

    // collection
      const craftCollection = client.db('craftDB').collection('craft');
      const userCollection = client.db('craftDB').collection('user')

// data gulake get korar system such as
app.get('/craft', async(req, res) => {
  const cursor = craftCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})

    app.post('/craft', async(req, res) => {
      const newCraft = req.body;
      console.log(newCraft)
      const result = await craftCollection.insertOne(newCraft);
      res.send(result)
    })

    app.get("/", (req, res) => {
      res.send("craft making is running");
    });
    app.listen(port, () => {
      console.log(`coffee server is running on port ${port}`);
    });

    // For delete
    app.delete('/craft/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })

  // For update
  app.get('/craft/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await craftCollection.findOne(query)
    res.send(result);
  })

  app.post('/user', async(req, res) => {
    const user = req.body;
    console.log(user)
    const result = await userCollection.insertOne(user);
    res.send(result);
  })


  app.put('/craft/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const option = {upsert: true};
    const updatedCraft = req.body;
    const craft = {
      $set: {
        image: updatedCraft.image,
         itemName: updatedCraft.itemName,
         subcategoryName: updatedCraft.subcategoryName,
         price: updatedCraft.price,
        rating: updatedCraft.rating,
        processingTime: updatedCraft.processingTime,
         description: updatedCraft.description,
      }
    }
    const result = await craftCollection.updateOne(filter, craft, option);
    res.send(result)
  })

  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
  }
}


run();