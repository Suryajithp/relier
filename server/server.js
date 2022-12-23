const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const adminUrls = require('./routes/admin')
const conversationUrls = require('./routes/conversations')
const messageUrls = require('./routes/messages')
const userUrls = require('./routes/user')
const cors = require('cors')
const morgan = require('morgan')

dotenv.config()

app.use(morgan())
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.DATABASE_ACCESS, () =>console.log("database connected"))

app.use('/admin', adminUrls)
app.use('/', userUrls)
app.use('/conversations', conversationUrls)
app.use('/messages', messageUrls)
app.listen(4000,()=> console.log("server is up and running"))