if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const path = require("path");
const ExpressError = require("./utils/expressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MongoClient } = require('mongodb');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const DB_URL = process.env.ATLASDB_URL;


//Mongo Session
const clientPromise = MongoClient.connect(DB_URL, {
   
});

const store = MongoStore.create({
    mongoUrl: DB_URL,
    clientPromise,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
})

//for sessions
const sessionOptions = {
    store,                  //mongo session store =>   store: store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,   //Date.now() return milisecond 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, 
    }, 
}



app.use(session(sessionOptions)); //[1]
app.use(flash());  //[2]

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//locals veriable are available for views - ejs..
app.use((req, res, next)=>{ //create middleware to use flash   [3]
    res.locals.success = req.flash("success");  // new listing creation success..
    res.locals.error = req.flash("error"); 
    res.locals.currentUser = req.user;   //store current user object in local if presents       
    next();
});



/* Import router */
const listingRouter = require("./routes/listing.js");   // all listing route
const reviewRouter = require("./routes/reviews.js");   // all review route
const userRouter = require("./routes/user.js");



app.set("view engin", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));   //to use css, js
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method')); 
app.engine('ejs', ejsMate);   // use ejs-locals for all ejs templates:


    
// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
// const DB_URL = process.env.ATLASDB_URL;


main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log("err");
    })

async function main(){
    await mongoose.connect(DB_URL);
}



/*==========================================================================================================*/
/*==========================================================================================================*/



/*  THE  HOME ROUTE */
app.get("/",(req,res)=>{
    res.redirect("/listing");
});


//  All route for listing, review, user signup
app.use("/listing", listingRouter);

app.use("/listing/:id/review", reviewRouter);

app.use("/", userRouter);





/*==========================================    ERROR HANDLING     ============================================*/
/*=============================================================================================================*/


/* Page that not exist */
app.all("*", (req, res, next)=> {
    next(new ExpressError(404, "Page not found!"));
});

/* Create a middleware to handle a basic error */
app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs", {message});

})



/*==========================================================================================================*/

app.listen(8080, ()=>{
    console.log("app listening on port 8080");
});
