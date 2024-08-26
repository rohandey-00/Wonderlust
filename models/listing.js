const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");



const listingSchema = new Schema({
   title: {
       type: String,
       required: true,
   },
   description: String,
   // image: {
   //     type: String,
   //     default: "https://images.unsplash.com/photo-1720457975117-d3f6764358f4?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   //     set: (v) => v===""? "https://images.unsplash.com/photo-1720457975117-d3f6764358f4?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,     //ternary operator  to set default image link if user will not gave any link 
   // },
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