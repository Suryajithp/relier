const mongoose = require('mongoose')

const notificationschema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    notification:[{
            userId:{
                type:mongoose.Types.ObjectId,
                required:true
            },
            postId:{
                type:mongoose.Types.ObjectId,
                required:true
            },
           type:{
            type:Number,
            required:true
           }
        }] ,
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("notifications",notificationschema)