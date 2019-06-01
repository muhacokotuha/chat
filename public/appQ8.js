let updateMainChat = () => {
    fetch('/messages').then((response) => {
        return response.text()
    }).then( (body) => {
        let messages = JSON.parse(body)
        let parentN = document.getElementById("messageList")
        parentN.innerHTML = ""
       if(messages.length !== 0){
           messages.forEach(element => {
               let li = document.createElement("li")
               li.innerHTML = '<span class="' + element.color +'">' + element.name+"</span> : "+element.msg
               parentN.appendChild(li)
           });
       }
   })
}
let updateUsersList = () => {
    fetch('/activeUsers').then((response) => {
        return response.text()
    }).then( (body) => {
        let list = JSON.parse(body)
        let parentN = document.querySelector("#usersList")
        parentN.innerHTML = ""
        if( list) {
        list.forEach( (username) => {
            let p = document.createElement("p")
            p.innerHTML = username
            parentN.appendChild(p)
          })
        }
    })

}
let updatePrivateChat = () => {
    fetch('/privateChat').then( (response) => {
        return response.text()
    }).then( (body) => {
        let fullResponse = JSON.parse(body)
        let activeUser = fullResponse.activeUser;
        delete fullResponse.activeUser
        let privateMessages = fullResponse[activeUser]
        let parentN = document.getElementById("privateMessageList")
        parentN.innerHTML = ""
       if(privateMessages.length !== 0){
           privateMessages.forEach(element => {
               let li = document.createElement("li")
               li.innerHTML = element.sender + " : " + element.message
               parentN.appendChild(li)
           });
       }
    })
}
updateMainChat()
updatePrivateChat()
updateUsersList()
setInterval(updateMainChat, 500)
setInterval(updatePrivateChat, 500)
setInterval(updateUsersList, 500)