require('dotenv').config({path : '../.env'})
const mongoose = require('mongoose');
const server = require('./app');

(() => {
mongoose.connect(process.env.DB_URL).then(() => console.log('connected to db'))
})()


server.listen(process.env.SERVER_PORT , () => {
    console.log('server connected to '+process.env.SERVER_PORT )
})