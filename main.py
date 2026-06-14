import os
import asyncio
from flask import Flask
from telegram.ext import Application, CommandHandler, MessageHandler, filters
from google import genai

# Configuration
TOKEN = "8057417384:AAGjPc4PSWolsQ4P1EdQgx8eQNpcvnFy8qo"
GEMINI_API_KEY = "AQ.Ab8RN6LHbux6EYQKCo9bjsCU6cr3BwbwrBvwr-_yfUp9B-g15Q"

app = Flask(__name__)

@app.route('/')
def home():
    return "Oromoo AI Bot is Running!"

# AI Logic
ai_client = genai.Client(api_key=GEMINI_API_KEY)

async def start(update, context):
    await update.message.reply_text("Akkam! Ani Oromoo AI Bot.")

async def handle_message(update, context):
    user_text = update.message.text
    response = ai_client.models.generate_content(model='gemini-2.5-flash', contents=user_text)
    await update.message.reply_text(response.text)

# Haala sirreeffame: Asyncio-n Bot fi Flask walitti makuu
async def main():
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    # Bot dammaqsuu
    await application.initialize()
    await application.start()
    await application.updater.start_polling()
    
    # Flask app run gochuu (Blocking call, kanaaf booda kaa'a)
    # Render irratti 'PORT' fayyadamuu qabna
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

if __name__ == '__main__':
    asyncio.run(main())
