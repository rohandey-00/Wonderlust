const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");   //it add automatic username and password

const userSchema = new Schema({
   
    email:{
        type: String,
        required: true,
    },
    // userName: {
    //     type: String,
    //     default: "Users"
    // },
    // password:{
    //     type: String,
    //     required: true,
    // }
});


userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;