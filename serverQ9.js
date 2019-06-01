let express = require('express')
let multer = require('multer')
let fs = require('fs')
let cookieParser = require('cookie-parser')
let app = express()
let upload = multer({ dest: __dirname + '/upload/'})
let chatroom = -1
let passwordAss = {}
let colorAss = {}
let sessions = {}
let messages = [[]]
let activeUsers = [[]]
let privateMessages = [{}]
app.use(cookieParser())
app.use('/static', express.static('public'))
app.use('/images', express.static('upload'))
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html')
})
app.post('/signup', upload.none(), (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if(passwordAss[username]) {
        res.send("<html><body>User already exists. <div><a href='/static/index.html'>Back to the signup page</a></div></body></html")
        return
    }
    passwordAss[username] = password
    colorAss[username] = "black"
    privateMessages[username] = []
    res.send("<html><body>You've succesfully signed up <div><a href='/static/index.html'>Back to the signup page</a></div></body></html")
} )
app.post('/login', upload.none(), (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let chatroomName = req.body.chatroom
    let expectedPassword = passwordAss[username]
    if(password !== expectedPassword){
        res.send("<html><body>Wrong password <div><a href='/static/index.html'>Back to the login page</a></div></body></html")
        return
    }
    let sessionID = Math.floor(Math.random()*100000000)
    sessions[sessionID] = username
    res.cookie('sid',sessionID)
    switch (chatroomName){
        case "hockey":
          chatroom = 0
          break
        case "soccer":
          chatroom = 1
          break
    }
    res.sendFile(__dirname+'/public/chat.html')
})
app.post('/messages', upload.none(), (req,res) => {
    let message = req.body.newMessage
    let sessionID = req.cookies.sid
    let username = sessions[sessionID]
    messages[chatroom].push({ name: username, type: "msg", content: message, color: colorAss[username]})
    let user = activeUsers[chatroom].filter( (user) => {
        return user === username
    })
    if( user.length === 0) activeUsers[chatroom].push(username)
    res.sendFile(__dirname+'/public/chat.html')
})
app.get('/messages', (req,res) => {
    res.send(JSON.stringify(messages[chatroom]))
})
app.post('/changeUsername', upload.none(), (req,res) => {
    let sessionID = req.cookies.sid
    let oldUsername = sessions[sessionID]
    let newUsername = req.body.newUsername
    if(!passwordAss[newUsername]){
    sessions[sessionID] = newUsername
    passwordAss[newUsername] = passwordAss[oldUsername]
    delete passwordAss[oldUsername]
    messages[chatroom].forEach(element => { 
        if(element.name === oldUsername) element.name=newUsername       
    });
    activeUsers[chatroom].forEach( (activeUser, index) => {
        if( activeUser === oldUsername) activeUsers[chatrom][index] = newUsername
    })
    }
    res.sendFile(__dirname+'/public/chat.html')
})
app.post('/pink', (req,res) => {
    let sessionID = req.cookies.sid
    let username = sessions[sessionID]
    colorAss[sessions[sessionID]] = "pink"
    messages[chatroom].forEach((element) => {
        if(element.name === username) element.color="pink"
    })    
    res.sendFile(__dirname+'/public/chat.html')
})

app.post('/red', (req,res) => {
    let sessionID = req.cookies.sid
    let username = sessions[sessionID]
    colorAss[sessions[sessionID]] = "red"
    messages[chatroom].forEach((element) => {
        if(element.name === username) element.color="red"
    })    
    res.sendFile(__dirname+'/public/chat.html')
})

app.post('/black', (req,res) => {
    let sessionID = req.cookies.sid
    let username = sessions[sessionID]
    colorAss[sessions[sessionID]] = "black"
    messages[chatroom].forEach((element) => {
        if(element.name === username) element.color="black"
    })    
    res.sendFile(__dirname+'/public/chat.html')
})

app.get("/activeUsers", (req,res) => {
     res.send(JSON.stringify(activeUsers))
})

app.post('/privateChat', upload.none(), (req,res) => {
     let receiver = req.body.receiver
     let sessionID = req.cookies.sid
     let sender = sessions[sessionID]
     let message = req.body.privateMessage
     privateMessages[receiver].push({ sender: sender, message: message })
     res.sendFile(__dirname+'/public/chat.html')
})

app.get('/privateChat', (req,res) => {
    let fullResponse = privateMessages
    let sessionID = req.cookies.sid
    fullResponse.activeUser = sessions[sessionID]
    res.send(JSON.stringify(fullResponse))
})

app.post('/addImages', upload.single('attachedImage'), (req,res) => {
    let file = req.file
    let extension = file.originalname.split('.').pop()
    let newFilename = file.filename + "." + extension
    console.log(file.filename + ":" +file.originalname + ":" + file.path + ":" +file.destination)
    fs.renameSync(__dirname + '/upload/' + file.filename, __dirname + '/upload/' + newFilename)
    let sessionID = req.cookies.sid
    let username = sessions[sessionID]
    messages.push({ name: username, type: "image", content: newFilename, color: colorAss[username]})
    res.sendFile(__dirname+'/public/chat.html')

})

setInterval(() => {
    activeUsers =[]
}, 80000)

app.listen(222)