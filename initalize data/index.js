const mongoose = require("mongoose");
const Listing = require("../models/listing.js");     //schema
const initData = require("./data.js");               //all data require


const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log("err");
    })

async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDB = async()=>{
    await Listing.deleteMany({});                      // to all the data first..

    // to add user id for owner, phase 2 project
    initData.data = initData.data.map((obj)=>({ ...obj, owner:'66b81e99992acc5eb3cbf78e' }));    //update the data and store in same 
    await Listing.insertMany(initData.data);           //initData is an obbject and it has data key{ data: sampleListings }
    console.log("Data was initialize");
}

initDB();  // call function