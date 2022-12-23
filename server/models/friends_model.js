const mongoose = require('mongoose')

const friendsChema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    followers:{
        type:Array
    }
    ,
    following:{
        type:Array
    }
})

module.exports = mongoose.model("friends",friendsChema)