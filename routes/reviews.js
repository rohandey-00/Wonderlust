const express = require("express");
const router = express.Router({mergeParams: true});   
/*no use*/ const mongoose = require("mongoose");  
const Listing = require("../models/listing.js");
/*no use*/ const methodOverride = require('method-override')  
/*no use*/ const ejsMate = require('ejs-mate');               
const  wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");  //joi validator
const Review = require("../models/review.js");
const isLogin = require("../middlewares/islogin.js");
const{ isReviewAuthor } = require("../middlewares/islogin.js");

const reviewController = require("../controllers/review.js");  // Import CONTROLLER folder




/* Validation middleware to check joi validation */

const validateReview = (req, res, next)=>{

    let {error} = reviewSchema.validate(req.body);           
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
};






/*  Review create - post route */

router.post("/", isLogin, validateReview, wrapAsync( reviewController.createReview));


/*   Review delete - delete route */
router.delete("/:reviewId", isLogin, isReviewAuthor, wrapAsync( reviewController.destroyReview));



module.exports = router;