const socket = io('http://localhost:3000');


const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");

const chatLog = document.getElementById("connectedUsers");

const name = prompt("What is your name?")
appendUsersToLog(name)
appendMessage('You joined')

socket.emit('new-user', name);

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', data => {
    appendMessage(`${data.user} connected`)
    appendUsersToLog(data.connectedUsers)
})

socket.on('user-disconnected', data => {
    console.log(data)
    appendMessage(`${data.user} disconnected`)
    appendUsersToLog(data.users)
})

socket.on("yes", t => {
    appendUsersToLog(t)
})


messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`${message}`, true)
    socket.emit('send-chat-message', message);
    messageInput.value = '';
})

function appendMessage(message, fromYou) {
    const messageElement = document.createElement('div');
    
    const messageBox = document.createElement('div');
    messageBox.className = "message-box";
    fromYou ? messageBox.classList.add('message-from-me') : messageBox.classList.add('message-from-user')
    messageBox.innerText = message;

    messageElement.append(messageBox)


    messageContainer.append(messageElement)
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

function appendUsersToLog(users) {
    chatLog.innerHTML = "";

    if(typeof users === "string") {
        const li = document.createElement("li");
        li.innerText = users === name ? "You" : name;
        chatLog.append(li);
    } else {
        users.forEach(user => {
            const li = document.createElement("li");
            li.innerText = user === name ? "You" : user;
            chatLog.append(li);
        })
    }
}