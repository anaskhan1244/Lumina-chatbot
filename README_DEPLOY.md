# 🚀 Lumina AI - Deployment Guide

This guide will help you host your **Lumina Chatbot** for free.

## Option 1: Render (Easiest)
1. **Sign up** at [Render.com](https://render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repo `Lumina-Chatbot`.
4. Click **Deploy**.
5. Go to **Dashboard** -> **Environment Variables** and add:
   - `OPENROUTER_API_KEY`: Your key.
   - `SESSION_SECRET`: Any random text (e.g., `shaz_secret_123`).

## Option 2: Hugging Face Spaces (Best Performance)
1. **Sign up** at [Hugging Face](https://huggingface.co).
2. Click **New Space**.
3. Name it and select **Docker** as the SDK.
4. Go to **Settings** -> **Variables and Secrets** and add your `OPENROUTER_API_KEY`.
5. Upload your files or sync with GitHub.

## Important Notes:
- **Free Tier**: On Render, the site "goes to sleep" after 15 minutes of inactivity. The first person to visit it after that will wait ~30 seconds for it to wake up.
- **Port**: The app is configured to use Port `5000` (Render/Local) or `7860` (Hugging Face).
