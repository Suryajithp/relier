const mongoose = require('mongoose')

const commentschema = new mongoose.Schema({
    comments:[{
        userId:{
            type:mongoose.Types.ObjectId,
            required:true
        },
       message:{
        type:String,
        required:true
       },
       time:{
        type:Date,
        default:Date.now
       }
    }],
    postId:{
        type:mongoose.Types.ObjectId,
        required:true
    }
})

module.exports = mongoose.model("comments",commentschema)