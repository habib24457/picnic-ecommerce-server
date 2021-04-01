const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const port = process.env.PORT ||5055;

app.use(cors());
app.use(bodyParser.json());

//console.log(process.env.DB_USER);


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.usac8.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('Connection error..',err);
  const productsCollection = client.db("picnicDB").collection("products");
  const orderCollection = client.db("picnicDB").collection("order");
  console.log('OK');

  //Getting products from DB
  app.get('/products',(req, res) => {
      productsCollection.find()
      .toArray((err,items) => {
        res.send(items)
          //console.log('From database',items);
      })
  })
 
 //Adding products to the DB
  app.post('/addProduct',(req, res)=>{
      const newProduct = req.body;
      //console.log('New product is here',newProduct);
      productsCollection.insertOne(newProduct)
      .then(result=>{
          //console.log(result.insertedCount)
          res.send(result.insertedCount>0)
      })
  })  

  //deleting items from DB
  app.delete('/deleteItem/:id',(req, res)=>{
    const id = ObjectID(req.params.id);
    console.log('deleting',id);
    productsCollection.findOneAndDelete({_id:id})
    .then(result=>{
        res.send(result.deletedCount>0);
    })
  })


  //ordered products adding to the DB
  app.post('/addOrder',(req, res)=>{
    const nreOrder = req.body;
    orderCollection.insertOne(nreOrder)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
  })

  //getting ordered data
  app.get('/orders',(req, res)=>{
      orderCollection.find({})
      .toArray((err,Documents)=>{
          res.send(Documents);
      })
  })
  

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})