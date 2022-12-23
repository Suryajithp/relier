const express = require('express');
const router = express.Router()
const ConversationController = require('../controlers/conversationControll.js')


router.post('/',ConversationController.addConversation)

router.get('/:userId',ConversationController.getConversations)

router.post('/check',ConversationController.checkConversation)

module.exports = router;