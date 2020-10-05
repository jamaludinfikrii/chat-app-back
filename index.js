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

    // form login
        // add user login to database
        // send user login to all client except sender
        // send greeting message to client
    
    socket.on('user-login' , (name) => {
        console.log(name)
        socket.broadcast.emit('user-login' , name + ' has joined the chat')
        socket.emit('user-login','welcome to the chat ' + name)
    })

    // user send message
        // send message to db
        // send message to all client
    
    socket.on('send-message' , (data) => {
        console.log(data) // {username, message}
        io.emit('send-message' , data)

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
