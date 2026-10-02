const fakeInput = document.getElementById('fakeInput');
const inputText = document.getElementById('inputText');
const inputCursor = document.getElementById('inputCursor');
const placeholder = document.getElementById('placeholder');
const keyboard = document.getElementById('keyboard');
const msgBox = document.getElementById('msgBox');
const voiceBtn = document.getElementById('voiceBtn');

let sendCallback = null; // Будет заполнено через Firebase
let currentText = "";
let recognition = null;
let isRecording = false;

// Инициализация распознавания речи
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        const resultText = event.results.transcript;
        currentText += (currentText === "" ? "" : " ") + resultText;
        inputText.innerText = currentText;
        placeholder.style.display = 'none';
    };

    recognition.onend = function() {
        isRecording = false;
        voiceBtn.classList.remove('recording');
    };

    recognition.onerror = function() {
        isRecording = false;
        voiceBtn.classList.remove('recording');
    };
}

function toggleVoice() {
    if (!recognition) {
        alert("Голосовой ввод не поддерживается");
        return;
    }
    if (isRecording) {
        recognition.stop();
    } else {
        isRecording = true;
        voiceBtn.classList.add('recording');
        recognition.start();
    }
}

fakeInput.addEventListener('click', (e) => {
    e.stopPropagation();
    keyboard.style.display = 'flex';
    inputCursor.style.display = 'inline-block';
    placeholder.style.display = 'none';
});

window.press = function(char) {
    if (char === 'BACK') {
        currentText = currentText.slice(0, -1);
    } else if (char === 'SEND') {
        const text = currentText.trim();
        if(text !== "") {
            if (sendCallback) {
                sendCallback(text);
            } else {
                const msg = document.createElement('div');
                msg.innerHTML = `<b>Вы:</b> ${text}`;
                msgBox.appendChild(msg);
            }
            currentText = "";
            keyboard.style.display = 'none';
            inputCursor.style.display = 'none';
        }
    } else {
        currentText += char;
    }
    
    inputText.innerText = currentText;
    
    if (currentText === "") {
        placeholder.style.display = 'inline';
    } else {
        placeholder.style.display = 'none';
    }
};

document.addEventListener('click', (e) => {
    if (!keyboard.contains(e.target) && !fakeInput.contains(e.target)) {
        keyboard.style.display = 'none';
        inputCursor.style.display = 'none';
        if (isRecording) recognition.stop();
        if (currentText === "") placeholder.style.display = 'inline';
    }
});
