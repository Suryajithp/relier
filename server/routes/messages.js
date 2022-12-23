const express = require('express');
const router = express.Router()
const messageController = require('../controlers/messageController')

router.post('/', messageController.addMessage)

router.get('/:id', messageController.getMessage)


module.exports = router;