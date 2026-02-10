import os
import json
import logging
from flask import Flask, request, jsonify, render_template, Response
from dotenv import load_dotenv
import requests
from io import BytesIO
import base64
from whitenoise import WhiteNoise

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv(override=True)

# Initialize Flask app
app = Flask(__name__)
app.wsgi_app = WhiteNoise(app.wsgi_app, root='static/', prefix='static/')
app.secret_key = os.environ.get("SESSION_SECRET", "shaz-default-secret")

# ---------------------------------------------------------
# API CONFIGURATION DETECTOR
# ---------------------------------------------------------
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

# Determine Active Provider
ACTIVE_PROVIDER = "none"
if OPENROUTER_API_KEY and "your_key" not in OPENROUTER_API_KEY:
    ACTIVE_PROVIDER = "openrouter"
elif GOOGLE_API_KEY and "your_key" not in GOOGLE_API_KEY:
    ACTIVE_PROVIDER = "google"
elif GROQ_API_KEY and "your_key" not in GROQ_API_KEY:
    ACTIVE_PROVIDER = "groq"
elif OPENAI_API_KEY and "your_key" not in OPENAI_API_KEY:
    ACTIVE_PROVIDER = "openai"

logger.info(f"🚀 LUMINA CORE ACTIVE PROVIDER: {ACTIVE_PROVIDER.upper()}")

# Subject-specific persona prompts
WORD_LIMIT_INSTRUCTION = " IMPORTANT: Keep your response concise and under 60 words unless explicitly asked for more."

PERSONAS = {
    "stem": "You are an expert in STEM (Science, Tech, Engineering, Math)." + WORD_LIMIT_INSTRUCTION,
    "coding": "You are a senior software developer." + WORD_LIMIT_INSTRUCTION,
    "business": "You are a business and economics specialist." + WORD_LIMIT_INSTRUCTION,
    "general": "You are a knowledgeable learning coach." + WORD_LIMIT_INSTRUCTION,
    "language": "You are an Arts and Language specialist." + WORD_LIMIT_INSTRUCTION
}

# Home route
@app.route('/')
def home():
    return render_template('index.html')

# Ask route for chat interactions
@app.route('/ask', methods=['POST'])
def ask():
    try:
        # Get request data
        data = request.json
        user_message = data.get('message', '')
        persona = data.get('persona', 'teacher')
        conversation_history = data.get('history', [])
        
        logger.debug(f"Received message: {user_message}, persona: {persona}")
        
        if not user_message:
            return jsonify({
                "error": "No message provided",
                "message": "Please provide a message to continue the conversation."
            }), 400
            
        if not OPENROUTER_API_KEY:
            return jsonify({
                "error": "API key not configured",
                "message": "The OpenRouter API key is not configured. Please contact the administrator."
            }), 500
        
        # Prepare conversation context
        prompt_prefix = PERSONAS.get(persona, PERSONAS['general'])
        
        # Format conversation history for OpenRouter API
        messages = []
        
        # Add system message with persona
        messages.append({"role": "system", "content": prompt_prefix})
        
        # Add conversation history (Limit to last 3 messages for speed)
        recent_history = conversation_history[-3:] if len(conversation_history) > 3 else conversation_history
        for msg in recent_history:
            role = "user" if msg.get('sender') == 'user' else "assistant"
            messages.append({"role": role, "content": msg.get('text', '')})
        
        # Add current message
        messages.append({"role": "user", "content": user_message})
        
        # Make request to OpenRouter API
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5000",  # Optional, for rankings
                "X-Title": "EduBuddy AI"  # Optional, shows in rankings
            },
            json={
                "model": "google/gemini-2.0-flash-001",
                "messages": messages,
                "max_tokens": 200,
                "temperature": 0.7,
                "top_p": 0.9
            }
        )
        
        if response.status_code != 200:
            try:
                error_data = response.json()
                logger.error(f"OpenRouter API error (Status {response.status_code}): {error_data}")
            except:
                logger.error(f"OpenRouter API error (Status {response.status_code}): {response.text}")
            
            return jsonify({
                "error": "API request failed",
                "message": f"AI Error (Status {response.status_code}). Please try again."
            }), 500
        
        result = response.json()
        bot_response = result['choices'][0]['message']['content']
        
        # Use static suggestions to save time and API calls
        suggestions = [
            "Can you explain that in more detail?",
            "What's an example of this concept?",
            "How does this relate to other topics?"
        ]
        
        return jsonify({
            "message": bot_response,
            "suggestions": suggestions
        })
        
    except Exception as e:
        logger.error(f"Error in /ask endpoint: {e}")
        return jsonify({
            "error": "Something went wrong",
            "message": "Oops! Something went wrong. Please try again."
        }), 500

@app.route('/ask_stream', methods=['POST'])
def ask_stream():
    try:
        data = request.json
        user_message = data.get('message', '')
        persona = data.get('persona', 'general')
        conversation_history = data.get('history', [])

        prompt_prefix = PERSONAS.get(persona, PERSONAS['general'])
        messages = [{"role": "system", "content": prompt_prefix}]
        
        recent_history = conversation_history[-3:] if len(conversation_history) > 3 else conversation_history
        for msg in recent_history:
            role = "user" if msg.get('sender') == 'user' else "assistant"
            messages.append({"role": role, "content": msg.get('text', '')})
        messages.append({"role": "user", "content": user_message})

        def generate():
            if ACTIVE_PROVIDER == "openrouter":
                response = requests.post(
                    url="https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"},
                    json={"model": "google/gemini-2.0-flash-001", "messages": messages, "stream": True},
                    stream=True
                )
                for line in response.iter_lines():
                    if line:
                        l = line.decode('utf-8')
                        if l.startswith('data: '):
                            if l == 'data: [DONE]': break
                            try:
                                content = json.loads(l[6:])['choices'][0]['delta'].get('content', '')
                                if content: yield f"data: {json.dumps({'content': content})}\n\n"
                            except: continue

            elif ACTIVE_PROVIDER == "google":
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key={GOOGLE_API_KEY}"
                payload = {"contents": [{"parts": [{"text": f"{prompt_prefix}\n\nUser: {user_message}"}]}]}
                response = requests.post(url, json=payload, stream=True)
                for line in response.iter_lines():
                    if line:
                        chunk = json.loads(line.decode('utf-8'))
                        content = chunk.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                        if content: yield f"data: {json.dumps({'content': content})}\n\n"

            elif ACTIVE_PROVIDER == "groq":
                response = requests.post(
                    url="https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
                    json={"model": "llama3-70b-8192", "messages": messages, "stream": True},
                    stream=True
                )
                for line in response.iter_lines():
                    if line:
                        l = line.decode('utf-8')
                        if l.startswith('data: '):
                            if l == 'data: [DONE]': break
                            try:
                                content = json.loads(l[6:])['choices'][0]['delta'].get('content', '')
                                if content: yield f"data: {json.dumps({'content': content})}\n\n"
                            except: continue

            elif ACTIVE_PROVIDER == "openai":
                response = requests.post(
                    url="https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"},
                    json={"model": "gpt-4o-mini", "messages": messages, "stream": True},
                    stream=True
                )
                for line in response.iter_lines():
                    if line:
                        l = line.decode('utf-8')
                        if l.startswith('data: '):
                            if l == 'data: [DONE]': break
                            try:
                                content = json.loads(l[6:])['choices'][0]['delta'].get('content', '')
                                if content: yield f"data: {json.dumps({'content': content})}\n\n"
                            except: continue

        return app.response_class(generate(), mimetype='text/event-stream')

    except Exception as e:
        logger.error(f"Streaming error: {e}")
        return jsonify({"error": str(e)}), 500

# Whisper route for voice-to-text
@app.route('/whisper', methods=['POST'])
def whisper():
    try:
        if not OPENAI_API_KEY or "your_key" in OPENAI_API_KEY:
            return jsonify({"error": "OpenAI API key for Whisper not configured."}), 500
        audio_data = request.json.get('audio')
        if not audio_data: return jsonify({"error": "No audio data"}), 400
        audio_binary = base64.b64decode(audio_data.split(',')[1])
        url = "https://api.openai.com/v1/audio/transcriptions"
        headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
        files = {"file": ("audio.webm", BytesIO(audio_binary), "audio/webm"), "model": (None, "whisper-1")}
        response = requests.post(url, headers=headers, files=files)
        if response.status_code == 200:
            return jsonify({"transcription": response.json().get("text", "")})
        return jsonify({"error": "Transcription failed"}), 500
    except Exception as e:
        logger.error(f"Whisper error: {e}")
        return jsonify({"error": "Something went wrong"}), 500

@app.route('/api_status', methods=['GET'])
def api_status():
    return jsonify({
        "active_provider": ACTIVE_PROVIDER,
        "openrouter": bool(OPENROUTER_API_KEY and "your_key" not in OPENROUTER_API_KEY),
        "google": bool(GOOGLE_API_KEY and "your_key" not in GOOGLE_API_KEY),
        "groq": bool(GROQ_API_KEY and "your_key" not in GROQ_API_KEY),
        "openai": bool(OPENAI_API_KEY and "your_key" not in OPENAI_API_KEY)
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
