const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");



const listingSchema = new Schema({
   title: {
       type: String,
       required: true,
   },
   description: String,
    image: {
      url: String,
      filename: String,
   },
   price: Number,
   location: String,
   country: String,
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: "Review",     // reference from review model
      },
   ],
   owner: {
      type: Schema.Types.ObjectId,
      ref: "User",      // reference form USER schema and must be a registered user,
   }, 
   geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
   }
});




/***** MONGOSE MIDDLEWARE must be created after creating the schema ******/

//mongoose POST middleware for deleting
listingSchema.post("findOneAndDelete", async(listing)=>{  //listing data that should be deleted   &  it call for 'findById' 
   if(listing){
      await Review.deleteMany({_id : {$in: listing.reviews}})
   }
});


const  Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;