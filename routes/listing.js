const express = require("express");
const router = express.Router();    
const Listing = require("../models/listing.js");            // "../" means first we go to the root directory then search for the file 
const  wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");       
const { listingSchema, reviewSchema } = require("../schema.js");  //joi validator
const isLogin = require("../middlewares/islogin.js");
const  {isOwner} = require("../middlewares/islogin.js");

const listingController = require("../controllers/listing.js"); /* IMPORTS controller file */

const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });




/* Validation middleware to check joi validation */

const validateListing = (req, res, next)=>{
      
    let {error} = listingSchema.validate(req.body);           
        if(error){
            throw new ExpressError(400, error);
        }else{
            next();
        }
};







// /*  Show all the list */
// router.get("/", wrapAsync(listingController.index));



// //get a new form for new list  [ we place before "/listing/:id" because it will confused and gave err]  // [1]
// router.get("/new", isLogin, listingController.newListingForm);



// /* show route individually */
// router.get("/:id", wrapAsync(listingController.showIndividualList));



// /* CREATE: received request from  /listing/new  {new list form} */                                          // [2] 
// router.post("/", isLogin, validateListing, wrapAsync(listingController.createNewList));



// /* Get a edit route form for UPDATE */
// router.get("/:id/edit", isLogin, isOwner, wrapAsync(listingController.updateForm));



// /* UPDATE route*/
// router.patch("/:id", isLogin, isOwner, validateListing, wrapAsync(listingController.updateList));



// /* DELETE route*/
// router.delete("/:id", isLogin, isOwner, wrapAsync(listingController.destroyListing));




////////////////////////////////////////////////         ReStructure With Router.route() , it's more compact       //////////////////////////////////////////////////////////////////////////



router.get("/new", isLogin, listingController.newListingForm);    //get a new form for new list  [ we place before "/listing/:id" because it will confused and gave err]  // [1]





/*  Show all the list      &&    CREATE: received request from  /listing/new  {new list form}                                         // [2] */
router.route("/")
.get( wrapAsync(listingController.index))
.post( isLogin,  upload.single('Listing[image]'), validateListing, wrapAsync(listingController.createNewList));     //upload.single('Listing[image]') middleware save the image to cloud





/* show list individually   &&    UPDATE(edit) list   &&   DELETE list*/
router.route("/:id")
.get( wrapAsync(listingController.showIndividualList))
.patch( isLogin, isOwner, upload.single('Listing[image]'), validateListing, wrapAsync(listingController.updateList))
.delete( isLogin, isOwner, wrapAsync(listingController.destroyListing));



router.get("/:id/edit", isLogin, isOwner, wrapAsync(listingController.updateForm)); /* Get a edit route form for UPDATE */




module.exports = router;
