import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from google import genai

# Logging qopheessuu (Dogoggora ka'u arguf)
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

# 🔑 Furtuulee Keetii Asitti Galchi
TELEGRAM_TOKEN = "8057417384:AAGjPc4PSWolsQ4P1EdQgx8eQNpcvnFy8qo"
GEMINI_TOKEN = "AQ.Ab8RN6LHbux6EYQKCo9bjsCU6cR3BwbwrBvwr-_yfUp9B-gl5Q"

# Gemini Client qopheessuu
gemini_client = genai.Client(api_key=GEMINI_TOKEN)

# Ergaa jalqabaa (/start) deebisuuf
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        "🤖Hallo! Ani Oromo AI Bot dha. "
        "Waan barbaadde na gaafachuu dandeessa, siifnan deebisa!"
    )

# Haasawa namni barreessu Gemini'tti erguuf
async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_message = update.message.text
    
    # Bot'n "barreessaa jira..." akka jedhu gochuuf
    await context.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")
    
    try:
        # Gemini irraa deebii fiduu
        response = gemini_client.models.generate_content(
            model="gemini-3.5-flash",
            contents=user_message,
        )
        # Deebii AI sana gara Telegram-itti deebisanii erguu
        await update.message.reply_text(response.text)
        
    except Exception as e:
        await update.message.reply_text("🤖 Dogoggorri uumameera,maaloo irra deebi'ii yaali.")
        print(f"Error: {e}")

def main():
    # Application Telegram uumuu
    application = Application.builder().token(TELEGRAM_TOKEN).build()

    # Ajajoota (Commands) addaan baasuu
    application.add_handler(CommandHandler("start", start))

    # Ergaa idilee (text) hunda ittiin simachuuf
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Bot hojii jalqabsiisuu
    print("🤖 Telegram Bot hojii jalqabeera...")
    application.run_polling()

if __name__ == '__main__':
    main()
