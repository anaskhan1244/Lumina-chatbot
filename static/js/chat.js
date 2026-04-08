// Prevent markdown image rendering so legacy/logo PNG content never appears in chat bubbles
let isMarkedConfigured = false;
function ensureMarkedConfigured() {
    if (isMarkedConfigured || typeof marked === 'undefined') return;
    try {
        const markdownRenderer = new marked.Renderer();
        markdownRenderer.image = () => '';
        marked.setOptions({ breaks: true, gfm: true, renderer: markdownRenderer });
        isMarkedConfigured = true;
    } catch (e) {
        console.error('Marked setup failed:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    function renderMarkdown(text) {
        ensureMarkedConfigured();
        if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
            return marked.parse(text);
        }
        return text;
    }

    // DOM Elements
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesContainer = document.getElementById('messages-container');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const openRouterStatus = document.getElementById('openrouter-status');
    const whisperStatus = document.getElementById('whisper-status');
    
    // Persona Selection (Header + Grid)
    const personaSelector = document.getElementById('persona-selector');
    const personaCards = document.querySelectorAll('.persona-card');
    let selectedPersona = 'stem'; // default
    
    function updatePersonaState(newPersona) {
        selectedPersona = newPersona;
        // Update Selector
        if (personaSelector) personaSelector.value = newPersona;
        // Update Grid Cards
        personaCards.forEach(card => {
            if (card.dataset.persona === newPersona) {
                card.classList.add('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'dark:bg-indigo-900/40');
            } else {
                card.classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'dark:bg-indigo-900/40');
            }
        });
    }

    // Header Selector Event
    if (personaSelector) {
        personaSelector.addEventListener('change', (e) => {
            updatePersonaState(e.target.value);
        });
    }

    // Grid Card Events
    personaCards.forEach(card => {
        card.addEventListener('click', () => {
            updatePersonaState(card.dataset.persona);
        });
    });

    // Quick Actions
    const summarizeBtn = document.getElementById('summarize-btn');
    const simplifyBtn = document.getElementById('simplify-btn');
    const elaborateBtn = document.getElementById('elaborate-btn');
    const examplesBtn = document.getElementById('examples-btn');
    
    // Templates
    const userMessageTemplate = document.getElementById('user-message-template');
    const botMessageTemplate = document.getElementById('bot-message-template');
    const typingIndicatorTemplate = document.getElementById('typing-indicator-template');
    
    // Chat state
    let conversationHistory = [];
    let isWaitingForResponse = false;

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
    });

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // Use requestSubmit to properly trigger the 'submit' event listener
            if (typeof chatForm.requestSubmit === 'function') {
                chatForm.requestSubmit();
            } else {
                // Fallback for older browsers
                const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
                chatForm.dispatchEvent(submitEvent);
            }
        }
    });

    // Load conversation from localStorage
    function loadConversation() {
        const savedConversation = localStorage.getItem('LuminaConversation');
        if (savedConversation) {
            conversationHistory = JSON.parse(savedConversation);
            if (conversationHistory.length > 0) {
                hideHero();
                conversationHistory.forEach(message => {
                    if (message.sender === 'user') appendUserMessage(message.text);
                    else appendBotMessage(message.text);
                });
            }
        }
    }

    function saveConversation() {
        localStorage.setItem('LuminaConversation', JSON.stringify(conversationHistory));
    }

    function hideHero() {
        const hero = document.querySelector('.welcome-container');
        if (hero) hero.style.display = 'none';
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message || isWaitingForResponse) return;
        userInput.value = '';
        userInput.style.height = 'auto';
        await sendMessage(message);
    });

    async function sendMessage(message) {
        if (isWaitingForResponse) return;
        isWaitingForResponse = true;
        hideHero();
        appendUserMessage(message);
        conversationHistory.push({ sender: 'user', text: message });
        saveConversation();
        
        const typingIndicator = appendTypingIndicator();
        let botMessageElement = null;
        let botText = "";
        
        try {
            const response = await fetch('/ask_stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    persona: selectedPersona,
                    history: conversationHistory
                })
            });
            
            if (typingIndicator) typingIndicator.remove();
            
            if (!response.ok) {
                appendBotMessage("⚠️ System error. Please check your link.");
                isWaitingForResponse = false;
                return;
            }

            // Create initial bot bubble
            botMessageElement = createBotBubbleInstance();
            const contentContainer = botMessageElement.querySelector('.bot-content');
            messagesContainer.appendChild(botMessageElement);
            scrollToBottom();

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));
                            if (data.content) {
                                botText += data.content;
                                // Update UI with markdown
                                contentContainer.innerHTML = renderMarkdown(botText);
                                contentContainer.querySelectorAll('pre code').forEach(hljs.highlightElement);
                                scrollToBottom();
                            }
                        } catch (e) {
                            console.error("Error parsing stream chunk", e);
                        }
                    }
                }
            }

            conversationHistory.push({ sender: 'bot', text: botText });
            saveConversation();
            
            // Add custom suggestions after stream finishes
            updateSuggestions([
                "Can you explain that in more detail?",
                "What's an example of this concept?",
                "How does this relate to other topics?"
            ]);

        } catch (error) {
            console.error("Streaming error:", error);
            if (typingIndicator) typingIndicator.remove();
            appendBotMessage("🌐 Connection lost. Check your internet.");
        } finally {
            isWaitingForResponse = false;
        }
    }

    // New helper to create bubble without appending automatically
    function createBotBubbleInstance() {
        const clone = botMessageTemplate.content.cloneNode(true);
        const container = clone.querySelector('.bot-content');
        
        // Setup copy button for the new instance
        const copyBtn = clone.querySelector('.copy-btn');
        copyBtn.addEventListener('click', (e) => {
            const text = container.innerText;
            navigator.clipboard.writeText(text);
            const icon = e.currentTarget.querySelector('i');
            icon.className = 'fas fa-check text-green-500';
            setTimeout(() => icon.className = 'fas fa-copy', 2000);
        });
        
        // Return the actual element (since querySelector on fragment returns null if looking for root-level children sometimes)
        // Wrapped in a div in template, so we get the first child
        return clone.firstElementChild;
    }

    function appendUserMessage(message) {
        const clone = userMessageTemplate.content.cloneNode(true);
        clone.querySelector('p').textContent = message;
        messagesContainer.appendChild(clone);
        scrollToBottom();
    }

    function appendBotMessage(message) {
        const clone = botMessageTemplate.content.cloneNode(true);
        const container = clone.querySelector('.bot-content');

        container.innerHTML = renderMarkdown(message);
        
        // Copy functionality
        clone.querySelector('.copy-btn').addEventListener('click', (e) => {
            navigator.clipboard.writeText(message);
            const icon = e.currentTarget.querySelector('i');
            icon.className = 'fas fa-check text-green-500';
            setTimeout(() => icon.className = 'fas fa-copy', 2000);
        });

        messagesContainer.appendChild(clone);
        container.querySelectorAll('pre code').forEach(hljs.highlightElement);
        scrollToBottom();
    }

    function appendTypingIndicator() {
        const clone = typingIndicatorTemplate.content.cloneNode(true);
        messagesContainer.appendChild(clone);
        scrollToBottom();
        return messagesContainer.lastElementChild;
    }

    function updateSuggestions(suggestions) {
        if (!suggestions || suggestions.length === 0) {
            suggestionsContainer.classList.add('hidden');
            return;
        }
        suggestionsContainer.innerHTML = '';
        suggestions.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-indigo-500 transition-all';
            btn.textContent = text;
            btn.onclick = () => sendMessage(text);
            suggestionsContainer.appendChild(btn);
        });
        suggestionsContainer.classList.remove('hidden');
    }

    function scrollToBottom() {
        const container = document.getElementById('chat-container');
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }

    // Quick Actions
    summarizeBtn.onclick = () => {
        const last = conversationHistory.filter(m => m.sender === 'bot').pop();
        if (last) sendMessage("Summarize this briefly: " + last.text);
    }
    
    simplifyBtn.onclick = () => {
        const last = conversationHistory.filter(m => m.sender === 'bot').pop();
        if (last) sendMessage("Explain this as if I am 10 years old: " + last.text);
    }

    elaborateBtn.onclick = () => {
        const last = conversationHistory.filter(m => m.sender === 'bot').pop();
        if (last) sendMessage("Please elaborate more on this topic: " + last.text);
    }

    examplesBtn.onclick = () => {
        const last = conversationHistory.filter(m => m.sender === 'bot').pop();
        if (last) sendMessage("Please provide practical examples related to: " + last.text);
    }

    clearChatBtn.onclick = () => {
        if (confirm('Permanently delete all chat history?')) {
            // Nuke everything
            conversationHistory = [];
            localStorage.removeItem('LuminaConversation');
            localStorage.clear(); // Safety clear for any other potential keys
            
            // Force reload to ensure clean state
            location.reload();
        }
    }

    // Initialize API Status
    async function checkStatus() {
        try {
            const res = await fetch('/api_status');
            const data = await res.json();
            
            const providerName = data.active_provider ? data.active_provider.toUpperCase() : 'NONE';
            openRouterStatus.innerHTML = `<i class="fas fa-circle ${data.active_provider !== 'none' ? 'text-emerald-500' : 'text-red-500'} mr-1 scale-75"></i> AI Core: ${providerName}`;
            
            if (data.openai) {
                whisperStatus.innerHTML = '<i class="fas fa-circle text-emerald-500 mr-1 scale-75"></i> Voice: Active';
            } else {
                whisperStatus.innerHTML = '<i class="fas fa-circle text-gray-500 mr-1 scale-75"></i> Voice: Manual Only';
            }
        } catch (e) {
            console.error("Status check failed", e);
        }
    }

    loadConversation();
    checkStatus();
});
