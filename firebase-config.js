import { initializeApp } from "https://gstatic.com";
import { getDatabase, ref, push, onChildAdded } from "https://gstatic.com";

const firebaseConfig = {
  apiKey: "AIzaSyCJstYm3EU160eBsgPN3JoTB0OmuHkzHAY",
  authDomain: "://firebaseapp.com",
  databaseURL: "https://firebasedatabase.app",
  projectId: "chatgamee",
  storageBucket: "chatgamee.firebasestorage.app",
  messagingSenderId: "271860888911",
  appId: "1:271860888911:web:fe5d20b115571df8b0c13a",
  measurementId: "G-66BP31NH2F"
};

try {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const messagesRef = ref(db, 'chats/game_chat');
    const myName = "Игрок_" + Math.floor(Math.random() * 100);

    // Связываем отправку кнопок со скриптом базы данных
    window.sendCallback = function(text) {
        push(messagesRef, { sender: myName, message: text });
    };

    onChildAdded(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const msg = document.createElement('div');
        const msgBox = document.getElementById('msgBox');
        if (msgBox) {
            msg.innerHTML = `<b>${data.sender}:</b> ${data.message}`;
            msgBox.appendChild(msg);
            msgBox.scrollTop = msgBox.scrollHeight;
        }
    });
} catch(e) {
    console.log("Firebase offline mode");
}
