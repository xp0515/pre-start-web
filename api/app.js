const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes/index.router');
const app = express();

mongoose.connect('mongodb+srv://Peng:JCS6cs93gvVUY9VL@vehicleinspection-ff15g.mongodb.net/vehicleInspection?retryWrites=true&w=majority',
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log('Connected to Mongodb');
  })
  .catch(() => {
    console.log('Connection failed');
  });
mongoose.set('useFindAndModify', false);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/", routes);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Orgin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use((req, res, next) => {
  next();
});

module.exports = app;


