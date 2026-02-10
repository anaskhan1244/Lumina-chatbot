<div align="center">
  <img src="logo1.png" alt="Lumina Logo" width="200"/>
  
  # Lumina - AI-Powered Educational Assistant Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/flask-2.3.0-green.svg)](https://flask.palletsprojects.com/)
</div>

> **Lumina** is a next-generation educational AI platform designed to provide personalized, subject-specific learning assistance with ultra-fast response times and premium user experience.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Target Users](#-target-users)
- [Features](#-features)
- [System Requirements](#-system-requirements)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Software Requirements Specification](#-software-requirements-specification)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Project Overview

**Lumina** is an intelligent educational assistant platform that leverages state-of-the-art Large Language Models (LLMs) to provide personalized tutoring across multiple academic domains. The platform features a premium glassmorphic UI with dark/light mode support, voice input capabilities, and optimized response delivery.

### Key Objectives
- Provide instant, accurate educational assistance across STEM, Coding, Business, Language Arts, and General Learning
- Deliver a premium, responsive user experience with modern design patterns
- Optimize response times through smart context management and model selection
- Enable accessible learning through voice input and intuitive interface design

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Presentation Layer (HTML/CSS/JS)                     │  │
│  │  - Glassmorphic UI (index.html + style.css)          │  │
│  │  - Chat Interface (chat.js)                           │  │
│  │  - Theme Management (theme.js)                        │  │
│  │  - Voice Input Handler (voice.js)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER (Flask)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Flask Web Server (app.py)                            │  │
│  │  - Route Handlers (/ask, /transcribe, /api_status)   │  │
│  │  - Session Management                                 │  │
│  │  - Request Validation & Error Handling               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES LAYER                     │
│  ┌──────────────────┐         ┌──────────────────────────┐ │
│  │  OpenRouter API  │         │  OpenAI Whisper API      │ │
│  │  (LLM Inference) │         │  (Voice Transcription)   │ │
│  └──────────────────┘         └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

1. **User Input** → Browser captures text/voice input
2. **Client Processing** → JavaScript validates and formats request
3. **API Request** → Sends POST request to Flask backend with conversation context
4. **Backend Processing** → Flask app prepares messages and calls OpenRouter API
5. **AI Response** → LLM generates response based on persona and context
6. **Client Rendering** → JavaScript receives response and renders with markdown support
7. **State Management** → Conversation saved to localStorage for persistence

---

## 🛠️ Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **HTML5** | - | Semantic structure and accessibility |
| **CSS3** | - | Glassmorphic design, animations, responsive layout |
| **JavaScript (ES6+)** | - | Client-side logic, DOM manipulation, async operations |
| **Tailwind CSS** | 3.x (CDN) | Utility-first CSS framework for rapid styling |
| **Marked.js** | 4.3.0 | Markdown parsing for AI responses |
| **Highlight.js** | 11.7.0 | Syntax highlighting for code blocks |
| **Font Awesome** | 6.4.0 | Icon library for UI elements |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.8+ | Core backend language |
| **Flask** | 2.3.0 | Lightweight web application framework |
| **python-dotenv** | 1.0.0 | Environment variable management |
| **Requests** | 2.31.0 | HTTP client for external API calls |
| **Gunicorn** | 21.2.0 | Production WSGI HTTP server |

### External APIs
| Service | Purpose | Model/Service Used |
|---------|---------|-------------------|
| **OpenRouter** | AI Conversation | `meta-llama/llama-3.1-8b-instruct:free` |
| **OpenAI** | Voice Transcription | Whisper API |

### Design Patterns & Architectural Principles
- **MVC Architecture**: Separation of concerns (Model-View-Controller)
- **RESTful API Design**: Stateless, resource-based endpoints
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Responsive Design**: Mobile-first approach with breakpoints
- **Client-Side Rendering**: Dynamic UI updates without page reloads
- **Optimistic UI Updates**: Immediate feedback with typing indicators

---

## 👥 Target Users

### Primary User Groups

1. **Students (High School & College)**
   - Need quick clarification on academic topics
   - Require assistance with homework and assignments
   - Seeking explanations in simpler terms
   - Benefit from voice input for accessibility

2. **Self-Learners & Lifelong Learners**
   - Exploring new subjects independently
   - Need structured guidance across multiple domains
   - Value quick, concise explanations
   - Appreciate modern, intuitive interfaces

3. **Educators & Tutors**
   - Use as supplementary teaching tool
   - Generate examples and explanations
   - Provide students with additional learning resources
   - Demonstrate AI-assisted learning methods

4. **Coding Enthusiasts & Developers**
   - Need quick syntax help and debugging assistance
   - Seek algorithm explanations
   - Require code examples and best practices
   - Value technical accuracy

5. **Business & Economics Students**
   - Need case study analysis
   - Require concept clarifications
   - Seek practical business examples
   - Value real-world applications

---

## ✨ Features

### Core Features
- ✅ **Subject-Specific AI Personas**: Specialized assistance in STEM, Coding, Business, Language Arts, and General Learning
- ✅ **Ultra-Fast Response Times**: Optimized context management and direct model routing
- ✅ **Voice Input Support**: Speak your questions using Whisper API integration
- ✅ **Markdown & Code Syntax Highlighting**: Beautiful formatting for technical content
- ✅ **Dark/Light Mode**: Premium glassmorphic design with theme persistence
- ✅ **Smart Conversation History**: Last 3 messages for faster processing
- ✅ **Quick Action Buttons**: Summarize, Simplify, Elaborate, and Examples
- ✅ **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ✅ **Offline-First Storage**: Conversation persistence using localStorage
- ✅ **Copy & Retry Functions**: User-friendly message management

### Advanced Features
- 🎨 **Premium UI/UX**: Calligraphy logo, mesh gradients, floating animations
- 🔄 **Context-Aware Suggestions**: Follow-up question chips for continued learning
- 📊 **API Status Indicators**: Real-time monitoring of service availability
- ⚡ **Optimized Token Usage**: 60-word limit for faster, concise responses
- 🎯 **Persona Synchronization**: Header dropdown and grid cards stay in sync
- 🌐 **Multi-Browser Support**: Works on Chrome, Firefox, Safari, Edge

---

## 💻 System Requirements

### Minimum Requirements
- **Operating System**: Windows 10, macOS 10.14+, Ubuntu 18.04+
- **Python**: 3.8 or higher
- **RAM**: 2 GB minimum
- **Storage**: 100 MB free space
- **Internet**: Stable broadband connection (10 Mbps+)
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Recommended Specifications
- **RAM**: 4 GB or higher
- **Internet**: 50 Mbps+ for voice input
- **Browser**: Latest version of Chrome or Edge

---

## 📦 Installation

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/IC-PROJECT-EXPO-.git
   cd IC-PROJECT-EXPO-
   ```

2. **Create Virtual Environment** (Recommended)
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   
   If `requirements.txt` doesn't exist, install manually:
   ```bash
   pip install flask python-dotenv requests gunicorn
   ```

4. **Set Up Environment Variables**
   
   Create a `.env` file in the project root:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   SESSION_SECRET=your_random_secret_key_here
   ```

5. **Run the Application**
   ```bash
   python main.py
   ```

6. **Access the Application**
   
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

---

## ⚙️ Configuration

### API Keys Setup

#### OpenRouter API Key
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to API Keys section
4. Generate a new API key
5. Add to `.env` file as `OPENROUTER_API_KEY`

#### OpenAI API Key (for Voice Input)
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new secret key
5. Add to `.env` file as `OPENAI_API_KEY`

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | API key for OpenRouter LLM service |
| `OPENAI_API_KEY` | Optional | API key for Whisper voice transcription |
| `SESSION_SECRET` | Yes | Secret key for Flask session management |

---

## 🚀 Usage

### Basic Usage Flow

1. **Select a Persona**
   - Choose from the subject grid or header dropdown:
     - **STEM**: Science, Technology, Engineering & Mathematics
     - **Coding**: Software development assistance
     - **Business**: Business & Economics guidance
     - **Arts**: Language arts and humanities
     - **General**: General learning coaching

2. **Ask a Question**
   - Type your question in the input box
   - Press **Enter** or click the Send button
   - Alternatively, click the **Microphone** icon for voice input

3. **Use Quick Actions**
   - **Summarize**: Get a brief summary of the last response
   - **Simplify**: Explain in simpler terms (ELI10 style)
   - **Elaborate**: Get more detailed information
   - **Examples**: Request practical examples

4. **Manage Conversation**
   - Copy responses using the copy button
   - Clear chat history with the Reset button
   - Toggle dark/light mode for comfort

---

## 🌐 Deployment

### Deploy to Render

1. **Prepare Repository**
   ```bash
   # Ensure render-requirements.txt exists or rename requirements.txt
   mv render-requirements.txt requirements.txt
   ```

2. **Create Render Account**
   - Sign up at [Render.com](https://render.com/)
   - Connect your GitHub repository

3. **Configure Web Service**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn main:app`
   - **Environment**: Python 3

4. **Set Environment Variables**
   - Add all variables from your `.env` file in Render dashboard
   - `OPENROUTER_API_KEY`
   - `OPENAI_API_KEY`
   - `SESSION_SECRET`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build completion
   - Access your live application URL

---

## 📡 API Documentation

### Endpoints

#### 1. GET `/`
**Description**: Serves the main application page

**Response**: HTML page with Lumina interface

---

#### 2. POST `/ask`
**Description**: Processes user messages and returns AI responses

**Request Body**:
```json
{
  "message": "Explain photosynthesis",
  "persona": "stem",
  "history": [
    {
      "sender": "user",
      "text": "What is biology?"
    },
    {
      "sender": "bot",
      "text": "Biology is the study of living organisms..."
    }
  ]
}
```

**Response**:
```json
{
  "message": "Photosynthesis is the process by which plants...",
  "suggestions": [
    "Can you explain that in more detail?",
    "What's an example of this concept?",
    "How does this relate to other topics?"
  ]
}
```

**Error Response**:
```json
{
  "error": "API request failed",
  "message": "Failed to get response from AI. Status: 500. Please try again."
}
```

---

#### 3. POST `/transcribe`
**Description**: Transcribes audio to text using OpenAI Whisper

**Request**: Multipart form data with audio file

**Response**:
```json
{
  "text": "What is machine learning?"
}
```

---

#### 4. GET `/api_status`
**Description**: Checks the configuration status of external APIs

**Response**:
```json
{
  "openrouter_configured": true,
  "whisper_configured": true
}
```

---

## 📋 Software Requirements Specification

### 1. Introduction

#### 1.1 Purpose
This document specifies the functional and non-functional requirements for the Lumina AI Educational Assistant Platform.

#### 1.2 Scope
Lumina is a web-based application designed to provide personalized educational assistance across multiple academic domains using advanced AI technology.

#### 1.3 Definitions and Acronyms
- **LLM**: Large Language Model
- **API**: Application Programming Interface
- **UI/UX**: User Interface/User Experience
- **SPA**: Single Page Application
- **REST**: Representational State Transfer

---

### 2. Functional Requirements

#### FR1: User Interface
- FR1.1: System shall provide a responsive web interface
- FR1.2: System shall support dark and light themes
- FR1.3: System shall display typing indicators during AI processing
- FR1.4: System shall render markdown-formatted responses
- FR1.5: System shall highlight code syntax in responses

#### FR2: AI Conversation
- FR2.1: System shall support 5 distinct subject personas
- FR2.2: System shall maintain conversation context (last 3 messages)
- FR2.3: System shall limit responses to 60 words by default
- FR2.4: System shall allow users to request detailed explanations
- FR2.5: System shall provide follow-up suggestions

#### FR3: Voice Input
- FR3.1: System shall support voice recording
- FR3.2: System shall transcribe audio to text
- FR3.3: System shall handle audio file format validation

#### FR4: Data Persistence
- FR4.1: System shall save conversation history locally
- FR4.2: System shall restore previous sessions on page load
- FR4.3: System shall allow users to clear conversation history

#### FR5: Quick Actions
- FR5.1: System shall provide Summarize function
- FR5.2: System shall provide Simplify function
- FR5.3: System shall provide Elaborate function
- FR5.4: System shall provide Examples function

---

### 3. Non-Functional Requirements

#### NFR1: Performance
- NFR1.1: System shall respond to queries within 5 seconds (95th percentile)
- NFR1.2: System shall load initial page within 2 seconds
- NFR1.3: System shall support 100 concurrent users

#### NFR2: Security
- NFR2.1: API keys shall be stored securely in environment variables
- NFR2.2: All external API calls shall use HTTPS
- NFR2.3: User data shall not be stored on the server

#### NFR3: Usability
- NFR3.1: System shall be accessible on mobile devices
- NFR3.2: System shall follow Web Content Accessibility Guidelines (WCAG 2.1)
- NFR3.3: System shall provide clear error messages

#### NFR4: Reliability
- NFR4.1: System shall have 99% uptime
- NFR4.2: System shall gracefully handle API failures
- NFR4.3: System shall log errors for debugging

#### NFR5: Maintainability
- NFR5.1: Code shall follow PEP 8 style guidelines
- NFR5.2: Frontend code shall use ES6+ standards
- NFR5.3: System shall have comprehensive documentation

---

### 4. System Constraints

- SC1: Requires active internet connection
- SC2: Dependent on external API availability (OpenRouter, OpenAI)
- SC3: Browser must support JavaScript ES6+
- SC4: Python 3.8 or higher required for backend

---

### 5. User Stories

#### As a Student:
- I want to ask questions about my homework so that I can understand difficult concepts
- I want simple explanations so that I can grasp complex topics easily
- I want voice input so that I can ask questions hands-free

#### As an Educator:
- I want subject-specific assistance so that I can provide accurate supplementary resources
- I want to see example questions so that I can guide students effectively

#### As a Developer:
- I want code examples so that I can learn programming concepts quickly
- I want syntax highlighting so that I can read code clearly

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Follow PEP 8 for Python code
- Use ES6+ standards for JavaScript
- Write descriptive commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2026 Lumina Educational Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact & Support

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/yourusername/IC-PROJECT-EXPO-/issues)
- **Project Maintainer**: Your Name
- **Email**: your.email@example.com

---

## 🙏 Acknowledgments

- **OpenRouter** for providing accessible LLM API service
- **OpenAI** for Whisper voice transcription technology
- **Flask** community for excellent documentation
- **Tailwind CSS** for rapid UI development
- **Google Fonts** for premium typography

---

**Built with ❤️ for learners everywhere**

*Last Updated: February 2026*