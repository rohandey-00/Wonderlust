if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const User =require("../models/user.js");   // require user model
const Listing = require("../models/listing.js"); //require for admin data
const Review = require("../models/review.js");  // for admin database



/* SignUp */
module.exports.signupForm = (req,res)=>{
    res.render("./users/signup.ejs");
}


module.exports.userSignup = async(req, res)=>{
   
    try{                                             // We want to flash the error if user is register..so use try catch block
     let{username, email, password} = req.body;
 
     let newUser  = new User({username, email});
     let registerUser = await User.register(newUser, password);      //passport register with salt and hasing
     req.login(registerUser, (err)=>{   // passport auto login
         if(err){
             return next(err);
         }
         req.flash("success", "Welcome to Wonderlust");
         res.redirect("/listing"); // main page 
     
     }) 
 
    
    }catch(e){
     req.flash("error", e.message); //error message
     res.redirect("/signup");
    }   
}






/* LogIn */
module.exports.loginForm = (req, res)=>{
    res.render("./users/login.ejs");
}



module.exports.userLogin =  async(req, res)=>{
    req.flash("success", "Welcome back to Wonderlust!");

    if(!res.locals.redirectUrl){
        return res.redirect("/listing");
    }
    res.redirect(res.locals.redirectUrl);
}



/* Admin Login */

module.exports.adminLoginForm = async(req,res)=>{
  
    res.render("./users/adminloginform.ejs");
    
}

module.exports.adminLogin = async(req,res)=>{
    try{
        let user = process.env.ADMIN;
        let admin_pass = process.env.ADMIN_PASSWORD;
        let{username, password} = req.body;
    
        if(username === user && password ===admin_pass){
            req.session.isAdmin = true;  //session store that admin is logged in
            res.redirect("/admin/databasePage");
               
        }else{
            req.flash("failure", "Invalid admin credentials");
            res.redirect("/login/admin");
        }
    }catch(e){
        req.flash("error", e.message); //error message
        res.redirect("/signup");
       }   
    
}

/*Get admin database*/
module.exports.getDB = async(req,res)=>{
    const allListing = await Listing.find({}).populate("owner").populate("reviews");    //.populate helps to access very easy
    res.render("listings/admindata.ejs", {allListing});
}



/* LogOut */

module.exports.userLogout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);   // passport get any error
        }

        req.flash("success", "You are logged out!");
        res.redirect("/listing");

    });
}