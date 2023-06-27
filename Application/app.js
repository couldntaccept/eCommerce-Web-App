const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes.js');
const app = express();
const mongoose = require('mongoose');
const updateImg = require('./utils/updateurl.js');


const updateDatabasePasswords = require('./utils/updateDatabasePasswords.js');

mongoose.connect('mongodb+srv://test:KIs8WbB5MM2ye84n@cluster0.wwl0mqu.mongodb.net/?retryWrites=true&w=majority').then(async()=>{
// mongoose.connect('mongodb+srv://doadmin:x618tk7j03JTA9e5@comp5347lab03group07-e90fad6b.mongo.ondigitalocean.com/comp5347_demo?tls=true&authSource=admin&replicaSet=comp5347lab03group07').then(async()=>{
  console.log ("DB Connected")

  // Check if the "carts" collection exists
  const collections = await mongoose.connection.db.listCollections({ name: 'carts' }).toArray();

  if (collections.length === 0) {
    // If the "carts" collection doesn't exist, create an empty collection
    await mongoose.connection.db.createCollection('carts');
    console.log('Created empty "carts" collection.');
  }

  
})

updateDatabasePasswords.updateDatabasePasswords();

updateImg.updateAllBrands();
app.use(bodyParser.json());

//Set headers to avoid CORS Errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})



//express.static provides read access to the /build folder
app.use(express.static(path.join(__dirname, 'views/ReactSPA/build')));



//Use the routes file
app.use(routes);


app.listen(4000);

