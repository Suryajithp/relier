const mongoose = require('mongoose')

const ConversationShema =new mongoose.Schema(
    {
        members:{
            type: Array
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model("conversation",ConversationShema)