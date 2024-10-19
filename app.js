// if(process.env.NODE_ENV !=="production"){
//     require("dotenv").config();
// }
require("dotenv").config();

// console.log(process.env.CLOUDINARY_KEY)

//Mongo atlas
const dbUrl = process.env.db_url

const express = require("express")
const app = express()
const path = require("path")
const PORT = 2000;
const localhostUrl ='mongodb://localhost:27017/yelp-camp';
const ejsMate = require("ejs-mate")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require('./models/user')
const flash = require("connect-flash");

const MongoStore = require('connect-mongo');
//sql injection 
const mongoSanitize = require('express-mongo-sanitize');

app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

//helmet 
const helmet = require("helmet")
app.use(helmet({ contentSecurityPolicy: false }));
//session
const session = require("express-session");

const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        ttl: 14 * 24 * 60 * 60 // = 14 days. Default
    }),
    name: "session",
    secret: "thisshouldbesecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
// cookies and session
app.use(flash());
app.use(session(sessionConfig))

//passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



const Joi = require("joi") // Validating Schema for error handling using postman
const { campgroundSchema, reviewSchema } = require("./schemas")
const ExpressError = require("./utilities/ExpressError");

app.engine("ejs", ejsMate)
app.use(express.urlencoded({ extended: true }))

//for updating database 
const methodOverride = require("method-override")
app.use(methodOverride("_method"))

const mongoose = require('mongoose');
const { error } = require("console");

// Routes
const campgroundsRoutes = require("./routes/campgrounds")
const reviewsRoutes = require("./routes/reviews")
const userRoutes = require("./routes/users")

//views 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
//mongoose

// 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl)
    .then(() => {
        console.log("Database Connected")
    })
    .catch(err => {
        console.log("Error")
        console.log(err)
    })


app.use((req, res, next) => {
    // console.log(req.query)
    // console.log(req.session)
    res.locals.currentuser = req.user;
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next();

})


app.get('/', (req, res) => {
    res.render("home")
})

app.use("/", userRoutes)
app.use("/campgrounds", campgroundsRoutes)
app.use("/campgrounds/:id/reviews", reviewsRoutes)

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})
//next pass to the next error
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no, Something Went wrong";
    res.status(statusCode).render("error", { err })
    // res.send("OOPS")

})
app.listen(PORT, () => {
    console.log(`Server starting at Port ${PORT}`);
})