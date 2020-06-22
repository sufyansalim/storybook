const express = require("express");
const mongoose = require("mongoose");
const exphbs = require('express-handlebars');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

//Load User Model
require('./models/User')

//Passport config
require("./config/passport")(passport);

//Load Routes
const index = require("./routes/index");
const auth = require("./routes/auth");

//Load Keys
const keys = require("./config/keys");

//Mongoose Connect
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>{
    console.log('MongoDB Connected');
})
.catch(err=>{
    console.log(err);
})

const app = express();

//Handlebars Middleware
app.engine('handlebars',exphbs({
    defaultLayout: "main"
}));

app.set('view engine','handlebars');


app.use(cookieParser());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req,res,next) => {
    res.locals.user = req.user || null;
    next();
})

//Use Route
app.use("/auth", auth);
app.use("/", index);



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
