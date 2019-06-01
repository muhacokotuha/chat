let express = require('express')
let multer = require('multer')
let cookieParser = require('cookie-parser')
let app = express()
let upload = multer()
let passwordAss = {}
let sessions = {}
let messages = []
let activeUsers = []
let time = new Date()
app.use(cookieParser())
app.use('/static', express.static('public'))
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
    res.send("<html><body>You've succesfully signed up <div><a href='/static/index.html'>Back to the signup page</a></div></body></html")
} )
app.post('/login', upload.none(), (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let expectedPassword = passwordAss[username]
    if(password !== expectedPassword){
        res.send("<html><body>Wrong password <div><a href='/static/index.html'>Back to the login page</a></div></body></html")
        return
    }
    let sessionID = Math.floor(Math.random()*100000000)
    sessions[sessionID] = username
    res.cookie('sid',sessionID)
    res.sendFile(__dirname+'/public/chat.html')
})
app.post('/messages', upload.none(), (req,res) => {
    let message = req.body.newMessage
    let sessionID = req.cookies.sid
    let currentTime = time.getTime()
    messages.push({ name: sessions[sessionID], msg: message, color: "black"})
    res.sendFile(__dirname+'/public/chat.html')
})
app.get('/messages', (req,res) => {
    res.send(JSON.stringify(messages))
})
app.post('/changeUsername', upload.none(), (req,res) => {
    let sessionID = req.cookies.sid
    let oldUsername = sessions[sessionID]
    let newUserName = req.body.newUsername
    if(!passwordAss[newUserName]){
    sessions[sessionID] = newUserName
    passwordAss[newUserName] = passwordAss[oldUsername]
    delete passwordAss[oldUsername]
    messages.forEach(element => { 
        if(element.name === oldUsername) element.name=newUserName       
    });
    }
    res.sendFile(__dirname+'/public/chat.html')
})
app.post('/pink', (req,res) => {
    let sessionID = req.cookies.sid
    let username = sessions[sessionID]
    messages.forEach((element) => {
        if(element.name === username) element.color="pink"
    })    
    res.sendFile(__dirname+'/public/chat.html')
})

app.post('/red', (req,res) => {
    let sessionID = req.cookies.sid
    let username = sessions[sessionID]
    messages.forEach((element) => {
        if(element.name === username) element.color="red"
    })    
    res.sendFile(__dirname+'/public/chat.html')
})

app.post('/black', (req,res) => {
    let sessionID = req.cookies.sid
    let username = sessions[sessionID]
    messages.forEach((element) => {
        if(element.name === username) element.color="black"
    })    
    res.sendFile(__dirname+'/public/chat.html')
})

app.post("/activeUsers", (req.res) => {

})

app.listen(222)