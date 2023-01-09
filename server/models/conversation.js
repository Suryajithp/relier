const mongoose = require('mongoose')

const ConversationShema =new mongoose.Schema(
    {
        members:{
            type: Array
        },
        lastMessage:{
            type:mongoose.Types.ObjectId,
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model("conversation",ConversationShema)