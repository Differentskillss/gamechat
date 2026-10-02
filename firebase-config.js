import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded }
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCJstYm3EU160eBsgPN3JoTB0OmuHkzHAY",
    authDomain: "chatgamee.firebaseapp.com",
    databaseURL: "https://chatgamee-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chatgamee",
    storageBucket: "chatgamee.firebasestorage.app",
    messagingSenderId: "271860888911",
    appId: "1:271860888911:web:fe5d20b115571df8b0c13a"
};

const MAX_MSG_LENGTH = 200;
const MAX_VISIBLE_MSGS = 100;

try {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const messagesRef = ref(db, 'chats/game_chat');
    
    // Ник — из localStorage или новый
    let myName = localStorage.getItem('gameChatNick');
    if (!myName) {
        myName = "Игрок_" + Math.floor(Math.random() * 100);
        localStorage.setItem('gameChatNick', myName);
    }
    
    // Показать ник в шапке
    const myNickEl = document.getElementById('myNick');
    if (myNickEl) myNickEl.textContent = myName;
    
    // Отправка сообщения
    window.sendCallback = function(text) {
        if (!text || text.length > MAX_MSG_LENGTH) return;
        push(messagesRef, {
            sender: myName,
            message: text.slice(0, MAX_MSG_LENGTH),
            time: Date.now()
        }).catch(err => console.error("Ошибка отправки:", err));
    };
    
    // Приём новых сообщений
    onChildAdded(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const msgBox = document.getElementById('msgBox');
        if (!msgBox || !data) return;
        
        const msg = document.createElement('div');
        msg.className = 'msg';
        
        // Шапка: ник + время
        const head = document.createElement('div');
        head.className = 'msg-head';
        
        const b = document.createElement('b');
        b.textContent = data.sender || '?';
        
        const time = document.createElement('span');
        time.className = 'msg-time';
        if (data.time) {
            const d = new Date(data.time);
            const hh = d.getHours().toString().padStart(2, '0');
            const mm = d.getMinutes().toString().padStart(2, '0');
            time.textContent = hh + ':' + mm;
        }
        
        head.appendChild(b);
        head.appendChild(time);
        
        // Тело сообщения
        const body = document.createElement('div');
        body.className = 'msg-body';
        body.textContent = data.message || '';
        
        msg.appendChild(head);
        msg.appendChild(body);
        msgBox.appendChild(msg);
        
        // Обрезка старых сообщений в DOM
        while (msgBox.children.length > MAX_VISIBLE_MSGS) {
            msgBox.removeChild(msgBox.firstChild);
        }
        
        msgBox.scrollTop = msgBox.scrollHeight;
    });
    
    console.log("✅ Firebase подключён. Ник:", myName);
} catch (e) {
    console.error("❌ Ошибка Firebase:", e);
}
