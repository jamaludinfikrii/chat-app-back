//  imports libraries
const express = require('express')
const http = require('http')
const mysql = require('mysql')
const socket = require('socket.io')
const cors = require('cors')

// initialize variabel
const app = express()
const httpApp = http.createServer(app)
const PORT = 5000
const io = socket(httpApp)

let userConnected = []
io.on('connection' , (socket) => {
    userConnected.push(socket.id)
    console.log('user connected with id ' + socket.id)

    socket.on('test', (data) => {
        console.log(data)
        socket.emit('test' , data + " susilo")
    })

    socket.on('disconnect' , () => {
        let index = userConnected.indexOf(socket.id)
        console.log('user disconnected with id = ' + userConnected[index])
    })
})

// routes
app.get('/' , (req,res) => {
    res.send("Welocome to API Chat")
})

// create server
httpApp.listen(PORT , () => {
    console.log('Server running on port ' + PORT )
})
