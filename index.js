const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;



//middleware 
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a7x3bqu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
   
    const craftsCollection = client.db("craftsDb").collection("crafts");


    app.get('/crafts', async(req, res) => {
      const result = await craftsCollection.find().toArray();
      res.send(result)
    })

    // for showing details page 
    // app.get('/productDetails/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const craft = await craftsCollection.findOne({_id: new ObjectId(id) });
    //   res.send(craft);
    // });
    app.get('/productDetails/:id', async(req, res) => {
      const id = req.params.id;
      const details = await craftsCollection.findOne({_id: new ObjectId(id)})
      res.send(details)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('craft is running')
})

app.listen(port, () => {
  console.log(`Craft and arts are running on port ${port}`)
})

