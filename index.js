// const express = require('express');
// const cors = require('cors');


// const jwt = require('jsonwebtoken'); //new
// const cookieParser = require('cookie-parser'); //new


// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// require('dotenv').config()

// const app = express();
// const port = process.env.PORT || 5000;

// // middleware
// app.use(cors(
//   {
//     origin: [
//       'http://localhost:5173'
//     ],
//     credentials: true
//   }
// ));
// app.use(express.json());
// app.use(cookieParser()); //new



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obyjfl3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// //middleware (new)
// const logger = (req, res, next) =>{
//   console.log('log: info', req.method, req.url);
//   next();

// }


// const verifyToken = (req, res, next) =>{
//   const token = req?.cookies?.token;
//   // console.log('token in middleware', token);
//   //no token available
//   if(!token){
//       return res.status(401).send({message: 'unauthorized access'})
//   }
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoded) =>{
//       if(err){
//           return res.status(401).send({message: 'unauthorized access'})
//       }
//       req.user = decoded;
//       next();
//  })
// }





// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     // await client.connect();
//        const foodCollection = client.db('restaurantDB').collection('food');
//     const userCollection = client.db('restaurantDB').collection('user');
//     const imageCollection = client.db('restaurantDB').collection('image');
//     const purchaseCollection = client.db('restaurantDB').collection('purchase');

//     //auth related api  (new)
//     app.post('/jwt', logger,  async(req, res) =>{
//       const user = req.body;
//       console.log('user for token', user);
//       const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2h'});
//       res.cookie('token', token, 
//       {
//         httpOnly: true,
//         secure:false,
//        sameSite:'strict' // [active  on deploy]
        
//       }
//       )
//       .send({success: true});
//       // res.send({token});
//   })

//   // when user logged out
//   app.post('/logout', async(req, res) =>{
//     const user = req.body;
//     console.log('logging out', user);
//     res.clearCookie('token',{ maxAge: 0 }).send({success:true})
// })



//     //food
//     app.get('/food', async (req, res) => {
//       const { name, email } = req.query; 
//       let query = {};
    
//       if (name) {
//         query.name = { $regex: new RegExp(name, 'i') }; 
//       }
    
//       if (email) {
//         query.email = email; // Exact match by email
//       }
    
//       const cursor = foodCollection.find(query); 
//       const result = await cursor.toArray();
//       res.send(result); 
//     });



// app.post('/purchase', async (req, res) => {
//   try {
//       const newPurchase = req.body;
      
//       const result = await purchaseCollection.insertOne(newPurchase);
//       const updateResult = await foodCollection.updateOne(
//           { _id: new ObjectId(newPurchase.foodId) },
//           { $inc: { count: 1, quantity: -newPurchase.quantity } },
//       );
//       console.log('Update result:', updateResult);
//       res.json(result);
//   } catch (error) {
//       console.error("Error purchasing food:", error);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });


//     // single details
//     app.get('/food/:id', async (req, res) => {
//       const id  = req.params.id;
//       const query = { _id: new ObjectId(id) }; 
//       const result = await foodCollection.findOne(query);
    
//           res.send(result);
     
      
//   });

//     app.get('/purchase/:id', async (req, res) => {
     
//       const id  = req.params.id;
//       const query = { _id: new ObjectId(id) }; 
//       const result = await purchaseCollection.findOne(query);
    
//           res.send(result);
     
      
//   });

  

 

// //new but modified
//   app.get('/my-purchases',logger,verifyToken, async (req, res) => {
//     console.log('token owner info', req.user); //new
//     if(req.user.email !== req.query.email){
//       return res.status(403).send({message: 'forbidden access'})
//     }
//     try {
//         const userEmail = req.query.email; 
//         const purchases = await purchaseCollection.find({ buyerEmail: userEmail }).toArray();
//         res.json(purchases);
//     } catch (error) {
//         console.error("Error retrieving user's purchases:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// app.delete('/my-purchases/:id', async (req,res) =>{
//   const id = req.params.id;
//   const query = {_id: new ObjectId(id) }
//   const result = await purchaseCollection.deleteOne(query);
//   res.send(result);
// })


//   app.get('/topfoods', async (req, res) => {
//     try {
//       const topFoods = await foodCollection.find()
//                         .sort({ count: -1, _id: 1 }) 
//                         .limit(6)
//                         .toArray();
//       res.json(topFoods);
//     } catch (error) {
//       console.error("Error retrieving top foods:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });

//   // update
//   app.get('/food/:id', async(req, res) => {
//     const id = req.params.id;
//     const query = { _id: new ObjectId(id)}
//     const result = await foodCollection.findOne(query);
//     res.send(result)
//   })
//   app.put('/food/:id', async(req, res) =>{
//     const id = req.params.id;
//     const filter = {_id: new ObjectId(id)}
//     const options = { upsert: true };
//     const updatedFood = req.body;
//     const food = {
//       $set: {
//         name:updatedFood.name, 
//          image:updatedFood.image,
//          category:updatedFood.category,
//          origin:updatedFood.origin,
//           description:updatedFood.description,
//            price:updatedFood.price, 
//            quantity:updatedFood.quantity,
           
          
          
//       }
//     }

//     const result = await foodCollection.updateOne(filter, food, options);
//     res.send(result);
//   })

 

//     app.post('/food', async(req,res) =>{
//         const newFood = req.body;
//         newFood.quantity = parseInt(newFood.quantity);
//         console.log(newFood);
//         const result = await foodCollection.insertOne(newFood)
//         res.send(result)
//     })

//     //image api
  

//     app.post('/image', async(req,res) =>{
//       const newImage = req.body;
//       console.log(newImage);
//       const result = await imageCollection.insertOne(newImage);
//       res.send(result)
//       console.log(result)
//   })

//     app.get('/image', async(req, res) =>{
//       const cursor = imageCollection.find();
//        const result = await cursor.toArray();
//         res.send(result);
//       })

//     // user api
//     app.post('/user', async(req, res)=>{
//         const user = req.body;
//         console.log(user);
//         const result = await userCollection.insertOne(user);
//         res.send(result);
//     })

//     // Send a ping to confirm a successful connection
//     // await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);


// app.get('/', (req, res) =>{
//     res.send('Restaurant is running')
// } )

// app.listen(port, ()=>{
//     console.log(`Restaurant is running on port: ${port}`);
// } )





const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors({
  origin: [
     "http://localhost:5173",
     "https://restaurant-management-55f52.web.app",
     "https://restaurant-management-55f52.firebaseapp.com"

  ],
  credentials: true
}));
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
    const purchaseCollection = client.db('restaurantDB').collection('purchase');

    app.get('/food', async (req, res) => {
      const { name, email } = req.query; 
      let query = {};
    
      if (name) {
        query.name = { $regex: new RegExp(name, 'i') }; 
      }
    
      if (email) {
        query.email = email; // Exact match by email
      }
    
      const cursor = foodCollection.find(query); 
      const result = await cursor.toArray();
      res.send(result); 
    });


// app.post('/purchase', async (req, res) => {
//   try {
//     const newPurchase = req.body;
//     const result = await purchaseCollection.insertOne(newPurchase);
//     await foodCollection.updateOne(
//       { _id: new ObjectId(newPurchase.foodId) },
//       { $inc: { count: 1 } }
//     );
//     res.json(result);
//   } catch (error) {
//     console.error("Error purchasing food:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post('/purchase', async (req, res) => {
  try {
      const newPurchase = req.body;
      
      const result = await purchaseCollection.insertOne(newPurchase);
      const updateResult = await foodCollection.updateOne(
          { _id: new ObjectId(newPurchase.foodId) },
          { $inc: { count: 1, quantity: -newPurchase.quantity } },
      );
      console.log('Update result:', updateResult);
      res.json(result);
  } catch (error) {
      console.error("Error purchasing food:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


    // single details
    app.get('/food/:id', async (req, res) => {
      const id  = req.params.id;
      const query = { _id: new ObjectId(id) }; 
      const result = await foodCollection.findOne(query);
    
          res.send(result);
     
      
  });

    app.get('/purchase/:id', async (req, res) => {
      const id  = req.params.id;
      const query = { _id: new ObjectId(id) }; 
      const result = await purchaseCollection.findOne(query);
    
          res.send(result);
     
      
  });
 


  app.get('/my-purchases', async (req, res) => {
    try {
        const userEmail = req.query.email; 
        const purchases = await purchaseCollection.find({ buyerEmail: userEmail }).toArray();
        res.json(purchases);
    } catch (error) {
        console.error("Error retrieving user's purchases:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete('/my-purchases/:id', async (req,res) =>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id) }
  const result = await purchaseCollection.deleteOne(query);
  res.send(result);
})


  app.get('/topfoods', async (req, res) => {
    try {
      const topFoods = await foodCollection.find()
                        .sort({ count: -1, _id: 1 }) 
                        .limit(6)
                        .toArray();
      res.json(topFoods);
    } catch (error) {
      console.error("Error retrieving top foods:", error);
      res.status(500).json({ error: "Internal server error" });
    }
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
        newFood.quantity = parseInt(newFood.quantity);
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