const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    username:{
        type:String,
        reuired:true
    },
    email:{
        type:String,
        required:true
    },
    profile:{
        type:String,
        default:null
    },
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String,
    },
    place:{
        type:String
    },
    status:{
        type:String,
        default:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("users",userschema)