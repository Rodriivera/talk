(function() {

    const app = document.querySelector('.app');
    const socket = io();

    let uname;

    // Función para manejar el ingreso de usuario
    function joinChat() {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length == 0) {
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    }

    // Manejar click y Enter para unirse al chat
    app.querySelector(".join-screen #join-user").addEventListener("click", joinChat);
    app.querySelector(".join-screen #username").addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            joinChat();
        }
    });

    // Función para enviar un mensaje
    function sendMessage() {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length == 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    }

    // Manejar click y Enter para enviar mensajes
    app.querySelector(".chat-screen #send-message").addEventListener("click", sendMessage);
    app.querySelector(".chat-screen #message-input").addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    // Salir del chat
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function() {
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });

    socket.on("update", function(update) {
        renderMessage("update", update);
    });

    socket.on("chat", function(message) {
        renderMessage("other", message);
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">Tú</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);

        } else if (type == "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }

        // Scroll del chat
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

})();








const inputs = document.querySelectorAll(".input-field");

inputs.forEach((inp) => {
    inp.addEventListener("focus", () => {
      inp.classList.add("active");
    });
    inp.addEventListener("blur", () => {
      if (inp.value != "") return;
      inp.classList.remove("active");
    });
  });

