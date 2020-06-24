const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const bodyParser = require('body-parser')
const methodOverride = require("method-override")
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

//Load User Model
require('./models/User')
require('./models/Story')

//Passport config
require("./config/passport")(passport);

//Load Routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const stories = require("./routes/stories");

//Load Keys
const keys = require("./config/keys");

//Handlebars Helper
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon

} = require("./helpers/hbs");

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

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Method Override Middleware
app.use(methodOverride('_method'))



//Handlebars Middleware
app.engine('handlebars',exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon
    },
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
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

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Use Route
app.use("/", index);
app.use("/auth", auth);
app.use("/stories", stories);



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
