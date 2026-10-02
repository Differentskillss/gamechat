// ============================================
// Игровой чат — логика интерфейса
// ============================================

const fakeInput = document.getElementById('fakeInput');
const inputText = document.getElementById('inputText');
const inputCursor = document.getElementById('inputCursor');
const placeholder = document.getElementById('placeholder');
const keyboard = document.getElementById('keyboard');
const msgBox = document.getElementById('msgBox');
const myNickEl = document.getElementById('myNick');

// Модалка ника
const nickModal = document.getElementById('nickModal');
const nickFakeInput = document.getElementById('nickFakeInput');
const nickText = document.getElementById('nickText');
const nickCursor = document.getElementById('nickCursor');
const nickPlaceholder = document.getElementById('nickPlaceholder');
const nickCounter = document.getElementById('nickCounter');
const nickConfirmBtn = document.querySelector('.modal-btn.confirm');

let currentText = "";
let nickTextValue = "";
let lastSendTime = 0;
let inputMode = 'chat';

const MAX_MSG_LENGTH = 200;
const MAX_NICK_LENGTH = 16;
const ANTISPAM_MS = 500;

function updateInputUI() {
    inputText.innerText = currentText;
    if (currentText === "") {
        placeholder.style.display = 'inline';
        inputCursor.style.display = 'none';
    } else {
        placeholder.style.display = 'none';
        inputCursor.style.display = 'inline-block';
    }
}

function updateNickUI() {
    nickText.innerText = nickTextValue;
    if (nickTextValue === "") {
        nickPlaceholder.style.display = 'inline';
        nickCursor.style.display = 'none';
    } else {
        nickPlaceholder.style.display = 'none';
        nickCursor.style.display = 'inline-block';
    }
    
    const len = nickTextValue.length;
    nickCounter.textContent = len;
    nickCounter.parentElement.classList.remove('warn', 'max');
    if (len >= MAX_NICK_LENGTH) {
        nickCounter.parentElement.classList.add('max');
    } else if (len >= MAX_NICK_LENGTH - 3) {
        nickCounter.parentElement.classList.add('warn');
    }
    
    if (nickConfirmBtn) nickConfirmBtn.disabled = (nickTextValue.trim() === "");
}

window.openNickModal = function() {
    if (!nickModal) return;
    nickTextValue = localStorage.getItem('gameChatNick') || '';
    updateNickUI();
    nickModal.style.display = 'flex';
    inputMode = 'nick';
    keyboard.style.display = 'flex';
};

window.closeNickModal = function() {
    if (!nickModal) return;
    nickModal.style.display = 'none';
    inputMode = 'chat';
    keyboard.style.display = 'none';
    updateInputUI();
};

window.confirmNick = function() {
    const clean = nickTextValue.trim().slice(0, MAX_NICK_LENGTH);
    if (clean === "") return;
    localStorage.setItem('gameChatNick', clean);
    if (myNickEl) myNickEl.textContent = clean;
    closeNickModal();
};

if (nickModal) {
    nickModal.addEventListener('click', (e) => {
        if (e.target === nickModal) closeNickModal();
    });
}

if (nickFakeInput) {
    nickFakeInput.addEventListener('click', (e) => {
        e.stopPropagation();
        inputMode = 'nick';
        keyboard.style.display = 'flex';
        updateNickUI();
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const nick = localStorage.getItem('gameChatNick');
    if (nick && myNickEl) myNickEl.textContent = nick;
});

fakeInput.addEventListener('click', (e) => {
    e.stopPropagation();
    inputMode = 'chat';
    if (keyboard.style.display !== 'flex') keyboard.style.display = 'flex';
    updateInputUI();
});

window.press = function(char) {
    if (inputMode === 'nick') handleNickKey(char);
    else handleChatKey(char);
};

function handleNickKey(char) {
    if (char === 'BACK') nickTextValue = nickTextValue.slice(0, -1);
    else if (char === 'SEND') { confirmNick(); return; }
    else if (nickTextValue.length < MAX_NICK_LENGTH) nickTextValue += char;
    updateNickUI();
}

function handleChatKey(char) {
    if (char === 'BACK') {
        currentText = currentText.slice(0, -1);
    } else if (char === 'SEND') {
        const text = currentText.trim().slice(0, MAX_MSG_LENGTH);
        if (text !== "") {
            const now = Date.now();
            if (now - lastSendTime < ANTISPAM_MS) return;
            lastSendTime = now;
            
            if (window.sendCallback) {
                window.sendCallback(text);
            } else {
                const msg = document.createElement('div');
                msg.className = 'msg';
                const head = document.createElement('div');
                head.className = 'msg-head';
                const b = document.createElement('b');
                b.textContent = "Вы (локально)";
                head.appendChild(b);
                const body = document.createElement('div');
                body.className = 'msg-body';
                body.textContent = text;
                msg.appendChild(head);
                msg.appendChild(body);
                msgBox.appendChild(msg);
                msgBox.scrollTop = msgBox.scrollHeight;
            }
            currentText = "";
            keyboard.style.display = 'none';
        }
    } else {
        if (currentText.length < MAX_MSG_LENGTH) currentText += char;
    }
    updateInputUI();
}

document.addEventListener('click', (e) => {
    if (nickModal && nickModal.style.display === 'flex') return;
    if (!keyboard.contains(e.target) && !fakeInput.contains(e.target)) {
        keyboard.style.display = 'none';
        updateInputUI();
    }
});

window.addEventListener('offline', () => document.body.classList.add('offline'));
window.addEventListener('online', () => document.body.classList.remove('offline'));
if (!navigator.onLine) document.body.classList.add('offline');
