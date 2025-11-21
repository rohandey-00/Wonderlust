const Listing = require("../models/listing.js");
const Review = require("../models/review.js");






const isLogin = (req,res, next)=>{
   
    if(!req.isAuthenticated()){

        //if user is not login then only
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
}
module.exports = isLogin;





module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next(); 
}



// module.exports.isOwner = async(req, res, next)=>{
    
//     /* For Backend protection */
//     let {id} = req.params;
//     let list = await Listing.findById(id);
//     if(!list.owner._id.equals(res.locals.currentUser._id)){
//         req.flash("error", "You don't have any permission!");
//         return res.redirect(`/listing/${id}`);
//     }
//     next();
// }

module.exports.isOwner = async (req, res, next) => {   //isOwnerOrAdmin [Technically]
    const { id } = req.params;
    const list = await Listing.findById(id);

    if (!list) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listing");
    }

    const isOwner = list.owner._id.equals(res.locals.currentUser._id);
    const isAdmin = req.session.isAdmin === true;

    if (!isOwner && !isAdmin) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listing/${id}`);
    }

    next();
};





module.exports.isReviewAuthor = async(req, res, next)=>{
    
    let {id ,reviewId } = req.params;
    let review = await(Review.findById(reviewId));

    if(! review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not author of this reiew :(");
        return res.redirect(`/listing/${id}`);
    }
    next();
}





module.exports.isAdmin = (req, res, next)=> {
  if (req.session.isAdmin) {
    return next();
  }
  req.flash("error", "You must be an admin to view this page.");
  return res.redirect("/login"); // or wherever your login page is
}