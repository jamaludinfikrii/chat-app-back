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

    // form login
        // add user login to database
        // send user login to all client except sender
        // send previous message
        // send greeting message to client
    
    socket.on('user-login' , (name) => {
        userConnected.push({
            id : socket.id,
            username : name
        })
        console.log(name)
        socket.broadcast.emit('send-message' ,{username : "bot" , message : name + ' has joined the chat'})
        socket.emit('send-message',{username : "bot", message :'welcome to the chat ' + name})
        io.emit('user-online',userConnected)
    })

    // user send message
        // send message to db
        // send message to all client
    
    socket.on('send-message' , (data) => {
        console.log(data) // {username, message}
        io.emit('send-message' , data)

    })
    
    // user disconnect
        // get username on userConnected
        // send to all user except sender that user has ledt the chat

    
    socket.on('disconnect' , () => {
        let index = -1
        console.log(userConnected)
        userConnected.forEach((val,idx) => {
            if(val.id === socket.id){
                index = idx
            }
        })
        console.log(index)
        if(index !== -1){
            let username = userConnected[index].username
            userConnected.splice(index,1)
            socket.broadcast.emit('send-message' , {username : "bot",message : username + ' has left the chat'})
            io.emit('user-online',userConnected)
        }

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
