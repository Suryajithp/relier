const Conversation = require('../models/conversation')




module.exports={

    addConversation:async(req,res)=>{
          const newConversation = new Conversation({
            members:[req.body.senderId,req.body.receiverId],
          })
    
          try {
            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation);
          } catch (error) {
            res.status(500).json(error)
          }
    },

    getConversations:async (req,res)=>{
        try {
            const item ={updatedAt:-1}
            const conversation = await Conversation.find({
                members:{ $in:[req.params.userId]},
            }).sort(item)
            res.status(200).json(conversation)
        } catch (error) {
            res.status(500).json(error)
        }
    },

    checkConversation:async (req,res)=>{
        try {
            const conversation = await Conversation.find({
                members:{ $all:[req.body.senderId,req.body.receiverId]},
            })
            res.status(200).json(conversation)
        } catch (error) {
            res.status(500).json(error)
            
        }
      }

}