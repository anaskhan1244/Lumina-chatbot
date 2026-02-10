document.addEventListener('DOMContentLoaded', () => {
    const voiceBtn = document.getElementById('voice-input-btn');
    const inputField = document.getElementById('user-input');
    const indicator = document.getElementById('recording-indicator');
    
    // Check support
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
        voiceBtn.style.opacity = '0.3';
        voiceBtn.title = "Browser not supported";
        return;
    }

    const rec = new SpeechRec();
    rec.continuous = false; // Stop automatically after you finish speaking
    rec.interimResults = true; // Show words while you are speaking
    rec.lang = 'en-US';

    let active = false;

    voiceBtn.addEventListener('click', () => {
        if (!active) {
            start();
        } else {
            stop();
        }
    });

    function start() {
        active = true;
        // Make stop button VERY prominent
        voiceBtn.innerHTML = '<i class="fas fa-stop-circle text-3xl text-red-500 animate-pulse shadow-lg shadow-red-500/50"></i>';
        indicator.classList.remove('hidden');
        
        // Specific instruction requested by user
        inputField.placeholder = 'Click "STOP" icon after speaking';
        inputField.value = ""; 

        try {
            rec.start();
            console.log("REC STARTED");
        } catch (e) {
            console.error(e);
            stop();
        }
    }

    function stop() {
        active = false;
        try { rec.stop(); } catch(e) {}
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        indicator.classList.add('hidden');
        inputField.placeholder = "Type a message or use voice...";
        console.log("REC STOPPED");
    }

    rec.onstart = () => {
        inputField.placeholder = "Listening... I can hear you!";
    };

    rec.onspeechstart = () => {
        console.log("Speech detected...");
        inputField.placeholder = "Transcribing...";
    };

    rec.onresult = (event) => {
        let text = "";
        for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
        }
        
        // Update input field INSTANTLY
        inputField.value = text;
        
        // Auto-resize textarea
        inputField.style.height = 'auto';
        inputField.style.height = inputField.scrollHeight + 'px';
        
        // If the result is final, stop and let user review
        if (event.results[event.results.length - 1].isFinal) {
            console.log("Final result arrived");
            // Optionally we could stop here, but let onend handle it
        }
    };

    rec.onerror = (e) => {
        console.error("REC ERROR", e.error);
        if (e.error === 'not-allowed') {
            alert("Please allow microphone access in your browser bar!");
        }
        stop();
    };

    rec.onend = () => {
        // Since continuous is false, it will end naturally when you stop talking
        stop();
    };
});
