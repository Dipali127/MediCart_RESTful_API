const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        minLength:8
    },
    mobileNumber:{
        type:String,
        unique:true
    },role:{
        type:String,
        enum:["buyer","seller"],
        default: "buyer"
    },
    address:{
        state:{
            type:String
        },
        city:{
            type:String
        },
        pincode:{
            type:Number
        },
        street:{
            type:String
        }
    }
},{timestamps:true})

module.exports = mongoose.model('User', userSchema);