const mongoose = require('mongoose')

const postschema = new mongoose.Schema({
    post:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    like:{
        type:Array
    },
    report:{
        type:Array
    },
    status:{
        type:Boolean,
        default:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("posts",postschema)