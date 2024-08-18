
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
// const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY)
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
// const cookieParser = require('cookie-parser')
// const jwt = require('jsonwebtoken');

// console.log(process.env.STRIPE_SERVER_KEY)

app.use(cors())
// app.use(cors({ 
//   origin: ["http://localhost:5173"],
// //   credentials: true

// }))
app.use(express.json())
// app.use(cookieParser())


// app.use(cors({ origin: ["http://localhost:5173", "https://eloquent-dango-c20301.netlify.app"] }))
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PAS)

// 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PAS}@cluster0.uftqkre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb+srv://test-server:test-server123@cluster0.uftqkre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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


    const database = client.db("productsDB-2");
    const productsCollection = database.collection("products");
    // const usersCollection = database.collection("users");
    // const agreementsCollection = database.collection("agreements");
    // const announceCollection = database.collection("announce");
    // const paymentsCollection = database.collection("payments");
    // const couponsCollection = database.collection("coupons");



    // app.get('/products', async (req, res) => {

    //   const result = await productsCollection.find().toArray()
    //   res.send(result)

    // })

    app.get('/productscount', async (req, res) => {

      const count = await productsCollection.estimatedDocumentCount()
      res.send({ count })
    })

    app.get('/products', async (req, res) => {

      const filter = req.query
      const search = filter.search 
      const query ={
        // price : { $lt : 100 , $gt: 50 }
        // name : {  $regex : search  }

      }

      if (search) {
        query.name = { $regex: search, $options: 'i' }; // 'i' for case-insensitive
      }
      console.log("query 3 ", filter)

      const options = {
        sort:
          { price: filter.sort === 'asc' ? 1 :-1},

      }

      const page = parseInt(req?.query.page)
      const size = parseInt(req?.query.size)

      console.log('pagination query ', page, size)
      const result = await productsCollection.find( query ,options  )
      .skip(page * size)
        .limit(size)
        .toArray()
        // console.log( result)

      res.send(result)

    })

// 11111
    app.get('/', (req, res) => {
      res.send(' t 2 server testing successfully ')
    })






  } finally {

  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
