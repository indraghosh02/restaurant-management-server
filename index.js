const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obyjfl3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
       const foodCollection = client.db('restaurantDB').collection('food');
    const userCollection = client.db('restaurantDB').collection('user');
    const imageCollection = client.db('restaurantDB').collection('image');

    app.get('/food', async (req, res) => {
      const { name, email } = req.query; // Accept both name and email query parameters
      let query = {};
    
      if (name) {
        query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search by name
      }
    
      if (email) {
        query.email = email; // Exact match by email
      }
    
      const cursor = foodCollection.find(query); // Query the collection with the specified query
      const result = await cursor.toArray();
      res.send(result); // Send the filtered result
    });


    // single details
    app.get('/food/:id', async (req, res) => {
      const id  = req.params.id;
      const query = { _id: new ObjectId(id) }; 
      const result = await foodCollection.findOne(query);
    
          res.send(result);
     
      
  });

  // update
  app.get('/food/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id)}
    const result = await foodCollection.findOne(query);
    res.send(result)
  })
  app.put('/food/:id', async(req, res) =>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = { upsert: true };
    const updatedFood = req.body;
    const food = {
      $set: {
        name:updatedFood.name, 
         image:updatedFood.image,
         category:updatedFood.category,
         origin:updatedFood.origin,
          description:updatedFood.description,
           price:updatedFood.price, 
           quantity:updatedFood.quantity,
           
          
          
      }
    }

    const result = await foodCollection.updateOne(filter, food, options);
    res.send(result);
  })

 

    app.post('/food', async(req,res) =>{
        const newFood = req.body;
        console.log(newFood);
        const result = await foodCollection.insertOne(newFood)
        res.send(result)
    })

    //image api
  

    app.post('/image', async(req,res) =>{
      const newImage = req.body;
      console.log(newImage);
      const result = await imageCollection.insertOne(newImage);
      res.send(result)
      console.log(result)
  })

    app.get('/image', async(req, res) =>{
      const cursor = imageCollection.find();
       const result = await cursor.toArray();
        res.send(result);
      })

    // user api
    app.post('/user', async(req, res)=>{
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Restaurant is running')
} )

app.listen(port, ()=>{
    console.log(`Restaurant is running on port: ${port}`);
} )