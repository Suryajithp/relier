const Conversation = require('../models/conversation')
const Message = require('../models/message')



module.exports = {

    addMessage: async (req, res) => {
        const newMessage = new Message(req.body)
        const conversationId= req.body.conversationId
       await Conversation.findByIdAndUpdate(conversationId,{
            lastMessage : newMessage._id
        })
        try {
            const savedMessage = await newMessage.save()
            res.status(200).json(savedMessage)
        } catch (error) {
            res.status(500).json(error)
        }
    },

    getMessage: async (req, res) => {
        try {
            const messages = await Message.find({
                conversationId: req.params.id
            })
            res.status(200).json(messages)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}