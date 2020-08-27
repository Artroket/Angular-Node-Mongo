const express = require('express');
const router = express.Router();
const User = require('../models/users');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');



//router.get('/reg',(req, res)=>{
  //res.send('regestration page');
//});

router.post('/reg',(req, res)=>{
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    login: req.body.login,
    password: req.body.password,
  });
  User.addUser(newUser, (err,user)=>{
    if(err)
      res.json({success: false, msg: 'user was not added'});
    else
      res.json({success: true, msg: 'user was added'});
  });
});

router.post('/auth',(req, res)=>{
  const login = req.body.login;
  const password = req.body.password;

  User.getuserbylogin(login, (err, user)=>{
    if(err) throw err;
    if(!user)
      return res.json({success: false, msg: 'user does not exist'});
    User.comparePass(password, user.password, (err, isMatch)=>{
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user.toJSON(), config.secret, {
        expiresIn: 3600 * 24
        });
        res.json({
         success: true,
         token: 'JWT' + token,
         user:{
           id: user._id,
           name: user.name,
           login: user.login,
           email: user.email,
         }
        });
      } else
      return res.json({success: false, msg: 'wrong pass'});
    });
  });
});



router.get('/dashboard', passport.authenticate('jwt',{session: false}) , (req, res)=>{
  res.send('user page');
});


module.exports = router;
