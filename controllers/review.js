
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");



module.exports.createReview = async( req, res)=>{   // router.post("/listing/:id/review"
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review( req.body.Review );
    newReview.author = req.user._id;  //add new fiield and add user id

    listing.reviews.push(newReview);  //push to reviews 

    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!"); 
    
    res.redirect(`/listing/${listing._id}`);
}




module.exports.destroyReview = async(req, res)=>{    // router.delete("/listing/:id/review/:reviewId"

    let {id ,reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);  //delete review schema
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});       // in review array match review id and pull it (remove) 

    req.flash("success", "Review deleted!"); 

    res.redirect(`/listing/${id}`);
}