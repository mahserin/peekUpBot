const express = require('express');
const app = express()
const { createServer } = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const userModel = require('./model/user')
const search = require('./controller/search')
const userRouter = require('./router/user');
const configRouter = require('./router/config');
const statusRouter = require('./router/status');
const payRouter = require('./router/pay');

app.use('/public' , express.static('public'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : false}))

const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', "POST"]
    }
})
const onConnection = async (socket) => {
    if(socket.handshake.query.id) await userModel.findByIdAndUpdate(socket.handshake.query.id , {$set: {socketId : socket.id}})
    
    search.connect(io , socket)
}
io.on('connection' ,  onConnection)
app.use((req,res,next) => {
    req.app.set('io', io)
    next()
  })
app.use('/api/user' , userRouter)
app.use('/api/config' , configRouter)
app.use('/api/status' , statusRouter)
app.use('/api/pay' , payRouter)

app.get('/' , (req , res) => {
    res.send('hello')
})

module.exports = server
