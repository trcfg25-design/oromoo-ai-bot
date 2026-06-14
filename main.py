import os
import asyncio
import threading
from flask import Flask
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from google import genai

# --- CONFIGURATION ---
# Token Telegram Bot fi API Key Gemini tajaajila kee irraa dubbisa
TOKEN = os.getenv("TELEGRAM_TOKEN", "8057417384:AAGjPc4PSWolsQ4P1EdQgx8eQNpcvnFy8qo")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AQ.Ab8RN6LHbux6EYQKCo9bjsCU6cR3BwbwrBvwr-_yfUp9B-gl5Q",)

# Flask Application ijaaruu (Render akka ittiin koodii kee dammaqsuuf)
app = Flask(__name__)

@app.route('/')
def home():
    return "Oromoo AI Bot is Running Live!"

# --- GEMINI AI INTEGRATION ---
# Tajaajila Gemini isa haaraa (google-genai) calqabsiisuu
ai_client = genai.Client(api_key=GEMINI_API_KEY)

async def get_gemini_response(user_text: str) -> str:
    try:
        # Mudela gemini-2.5-flash ykn gemini-1.5-flash haala qubsee kanaan waama
        response = ai_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_text,
        )
        return response.text
    except Exception as e:
        return f"Digoggora uumameera: {str(e)}"

# --- TELEGRAM BOT HANDLERS ---
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Akkam, Ani Oromoo AI Bot dha! Maal siif haa gargaaru?")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_text = update.message.text
    # Ergaa namaa fuudhee gara Gemini tajaajilaatti erga
    ai_response = await get_gemini_response(user_text)
    await update.message.reply_text(ai_response)

# --- BOT STARTUP FUNCTION ---
def run_bot():
    # Dogoggora 'RuntimeError: There is no current event loop' furuuf:
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    # Application Telegram Bot ijaaruu
    application = Application.builder().token(TOKEN).build()

    # Ajajoota (Commands) itti hidhuu
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("Telegram Bot jalqabeera...")
    application.run_polling()

# --- MAIN EXECUTION ---
if __name__ == '__main__':
    # Telegram Bot sarara addaa (Thread) irratti jalqabsiisuu
    bot_thread = threading.Thread(target=run_bot)
    bot_thread.daemon = True
    bot_thread.start()

    # Flask Port Render irratti banuun hojjechiisuu
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
