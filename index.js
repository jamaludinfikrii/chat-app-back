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


// db connection
const db = mysql.createConnection({
    user : "root",
    password : "111111111",
    database : "chat-app",
    port : 3306
})

let userConnected = []
io.on('connection' , (socket) => {

    // form login
        // add user login to database
        // send user login to all client except sender
        // send previous message
        // send greeting message to client
    
    socket.on('user-login' , ({name,room}) => {
        console.log(room)
        userConnected.push({
            id : socket.id,
            username : name,
            room : room
        })
        console.log(name)
        socket.join(room)
        let userInRoom = userConnected.filter((val) => val.room === room)
        
        db.query('select * from chats where room = ?' , room,(err,result) => {
            try {
                if(err) throw err

                // result = [{username, chat,created_at,room}]
                let dataChat = result.map((val) => {
                    return {
                        username : val.username,
                        message : val.chat
                    }
                })

                dataChat.push({username : "bot", message :'welcome to the chat ' + name + ', you in room ' + room})

                socket.to(room).emit('send-message' ,[{username : "bot" , message : name + ' has joined the room ' + room}])

                socket.emit('send-message',dataChat)
                io.in(room).emit('user-online',userInRoom)
            } catch (error) {
                
            }
        })

       
            
      
    })

    // user send message
        // send message to db
        // send message to all client
    
    socket.on('send-message' , (data) => {

        let index = -1
        console.log(userConnected)
        userConnected.forEach((val,idx) => {
            if(val.id === socket.id){
                index = idx
            }
        })

        let room = userConnected[index].room
        console.log(data) // {username, message}        
       
        let dataToInsert = {
            username : data.username,
            chat : data.message,
            room : room
        }

        db.query('insert into chats set ?' , dataToInsert, (err,result) => {
            try {
                if(err) throw err
                io.in(room).emit('send-message' , [data])
            } catch (error) {
                console.log(error)
            }
        })


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
            let room = userConnected[index].room
            userConnected.splice(index,1)

            let userInRoom = userConnected.filter((val) => val.room === room)
            socket.to(room).emit('send-message' , [{username : "bot",message : username + ' has left the chat'}])
            io.in(room).emit('user-online',userInRoom)
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
