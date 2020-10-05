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

// routes
app.get('/' , (req,res) => {
    res.send("Welocome to API Chat")
})

// create server
httpApp.listen(PORT , () => {
    console.log('Server running on port ' + PORT )
})
