//jshint esversion:6
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds=10;
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb://localhost:27017/userlistDB");
const UserSchema= new mongoose.Schema({
    username:String,
    password:String
});

const User=new mongoose.model('User', UserSchema);



app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
res.render('login');
});
app.get('/register', (req, res) => {
res.render('register');
});


app.post("/register", (req,res) => {
    bcrypt.hash(req.body.password, saltRounds, (err,hash) => {
        User.findOne({username:req.body.username}, (err, user) => {
            if (user==null) {
                const NewUser = new User({
                    username: req.body.username,
                    password: hash
                });
                NewUser.save((err)=>{
                    if (err) {
                        res.send(err);
                    }else{
                        res.render('secrets');
                    }
                });
                
            }else {
                res.render("login");
            }
        });

    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username:username}, (err, user) => {
        if (user){
            bcrypt.compare(password,user.password,(err, result) => {
                if (result===true) {
                    res.render("secrets");
                }else if (result===false) {
                    res.send("<h1 align='center'>please check your password<h1>");
                }
            });
}else{
    res.send("<h1 align='center'>User not found</h1>");
}
    });
});
app.listen(3000,()=>{
    console.log("port listening on localhost:3000");
});