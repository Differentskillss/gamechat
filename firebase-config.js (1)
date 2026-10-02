import { initializeApp } from "https://gstatic.com";
import { getDatabase, ref, push, onChildAdded } from "https://gstatic.com";

const firebaseConfig = {
    apiKey: "AIzaSyDhElE3m7up-2mqYXTNur8zbfGB06PGZNg",
    authDomain: "://firebaseapp.com",
    databaseURL: "https://firebasedatabase.app",
    projectId: "chatlitl",
    storageBucket: "chatlitl.firebasestorage.app",
    messagingSenderId: "243620230183",
    appId: "1:243620230183:web:853c15960d21da3de6ca02",
    measurementId: "G-E5XY1VCY5T"
};

try {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const messagesRef = ref(db, 'chats/game_chat');
    const myName = "Игрок_" + Math.floor(Math.random() * 100);

    // Связываем внешнюю отправку с основным скриптом клавиатуры
    window.sendCallback = function(text) {
        push(messagesRef, { sender: myName, message: text });
    };

    onChildAdded(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const msg = document.createElement('div');
        const msgBox = document.getElementById('msgBox');
        msg.innerHTML = `<b>${data.sender}:</b> ${data.message}`;
        msgBox.appendChild(msg);
        msgBox.scrollTop = msgBox.scrollHeight;
    });
} catch(e) {
    console.log("Firebase offline");
}
