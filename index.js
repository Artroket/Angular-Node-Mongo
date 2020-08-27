const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')
const config = require('./config/db');
const account = require('./routes/accounts');


const app = express();


const port = 3000;

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


app.use(express.static(path.join(__dirname, "public")));


app.use(cors ());
app.use(bodyParser.json());

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected',()=>{
  console.log("bd is working");
});

mongoose.connection.on('error',(err)=>{
  console.log("fail: "+ err);
});

app.get('/',(req, res)=>{
  res.send('main page');
});

app.use('/account', account);

app.listen(port,()=>{
  console.log("server was started on port: " + port);
});
