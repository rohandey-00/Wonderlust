
const Listing = require("../models/listing.js");
const maptilerClient = require("@maptiler/client");    // for geocoading
const mapToken = process.env.MAP_TOKEN;
maptilerClient.config.apiKey = mapToken;




module.exports.index = async(req, res)=>{
    const allListing =  await Listing.find({});
    res.render("listings/index.ejs", {allListing});
}





module.exports.newListingForm = (req,res)=>{

res.render("listings/new.ejs");
}






module.exports.showIndividualList = async(req, res)=>{

    let { id } = req.params;
    const list = await Listing.findById(id).populate({ path: "reviews", populate: { path:"author"}}).populate("owner");     //Listing.find({_id : id});  POPULATE is use ro send array data also [one to many relation in mongodb]
        if(!list){
         req.flash("error", "Listing you requested for does not exist!");  //show error alert and in the main page
        return res.redirect("/listing");
        }
    res.render("listings/show.ejs", {list});
  
}





module.exports.createNewList = async(req, res, next)=>{
    
        let url = req.file.path;
        let filename = req.file.filename;
        
        let newListing = new Listing(req.body.Listing);   //req.body gave us an object => {  Listing: {  ...  }}

        newListing.owner = req.user._id;     //add new user id
        newListing.image = {url, filename}   // add image details


            // calculate coordinates
             const result = await maptilerClient.geocoding.forward(req.body.Listing.location, { limit: 1 });   // limit result object to 1
             newListing.geometry = result.features[0].geometry;
         
                
        await newListing.save();
        req.flash("success", "New listing created!");  
        res.redirect("/listing");
}






module.exports.updateForm =  async(req, res)=>{

    let { id } = req.params;
    const list = await Listing.findById(id);   //Listing.find({_id : id});  
    if(!list){
        req.flash("error", "Listing you requested for does not exist!");  //show error alert and in the main page
        return res.redirect("/listing");  //if we dont use return keyword then is wiil gave error msg in console that we cant send double responces...
    } 


    //before render new from we update the prview image url to decrease the quality
    let originalUrl = list.image.url;
    let compressedImageUrl = originalUrl.replace("/upload","/upload/c_thumb,g_face,h_135,w_200/");
    
 res.render("listings/edit.ejs", {list, compressedImageUrl});
}





module.exports.updateList = async(req, res)=>{
 
    let {id} = req.params;

    await Listing.findByIdAndUpdate(id, req.body.Listing);  //1st time update all the value

    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        
        req.body.Listing.image = {url, filename};
   }

        // calculate coordinates
        const result = await maptilerClient.geocoding.forward(req.body.Listing.location, { limit: 1 });   // limit result object to 1
        req.body.Listing.geometry = result.features[0].geometry;
    
 await Listing.findByIdAndUpdate(id, req.body.Listing); //2d time update if there a 

    req.flash("success", "Listing updated!"); 
    res.redirect(`/listing/${id}`);
}





module.exports.destroyListing = async(req, res)=>{    //app.delete("/listing/:id", wrapAsync(async(req, res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing successfully Deleted!"); 
    res.redirect("/listing");
}