import os
import asyncio
from flask import Flask
from google import genai
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# 1. Flask App Qopheessuu (Render akka koodii keenya hin dhiphifneef)
app = Flask(__name__)

@app.route('/')
def home():
    return "Bot hojii irra jira!"

# 2. Token fi API Key fiduu
TELEGRAM_TOKEN = "8057413784:AAGJpC4PSWolsQ4P1EdQgx8eQNpcvnFy8qo"
GEMINI_TOKEN = "AQ.Ab8RN6LHbux6EYQKCo9bjsCU6cR3BwbwrBvwr-_yfUp9B-gl5Q"

# 3. Gemini Client Qopheessuu (gemini-3.5-flash fayyadamuuf)
gemini_client = genai.Client(api_key=GEMINI_TOKEN)

# 4. Ajaja /start Ibsuuf
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🤖Hallo! Ani Oromo AI Bot dha. Waan barbaadde na gaafachuu dandeessa, siifan deebisa!")

# 5. Ergaa Nama Irraa Fudhatanii Gemini'n Deebisuu
async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_message = update.message.text
    
    await context.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")
    
    try:
        # Gemini 3.5 Flash fayyadamuu
        response = gemini_client.models.generate_content(
            model="gemini-3.5-flash",
            contents=user_message,
        )
        await update.message.reply_text(response.text)
        
    except Exception as e:
        await update.message.reply_text("🤖 Dogoggorri uumameera, maaloo irra deebi'ii yaali.")
        print(f"Error: {e}")

# 6. Application Telegram Ka'u
async def main():
    application = Application.builder().token(TELEGRAM_TOKEN).build()
    
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    print("🤖 Telegram Bot hojii jalqabeera...")
    await application.initialize()
    await application.start()
    await application.updater.start_polling()

if __name__ == '__main__':
    # Telegram bot loop duuba oofuu
    loop = asyncio.get_event_loop()
    loop.create_task(main())
    
    # Flask port Render irratti banuuf
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
