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

app.use('/api/admin', adminUrls)
app.use('/api/', userUrls)
app.use('/api/conversations', conversationUrls)
app.use('/api/messages', messageUrls)
app.listen(4000,()=> console.log("server is up and running"))