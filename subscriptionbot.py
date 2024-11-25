from telegram import Update, Bot
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackContext,
)
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timedelta

# Telegram API Token
TELEGRAM_API_TOKEN = "7735833450:AAGY2i2e0fUxi0ZTbhdwHkjLJF5-aQURk-M"

# MySQL Database Connection
DB_USER = "root"
DB_PASSWORD = ""
DB_HOST = "localhost"  # Or your server's IP
DB_PORT = "3306"  # Default MySQL port
DB_NAME = "telegram_bot"

# SQLAlchemy Engine
DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL, echo=True)
Session = sessionmaker(bind=engine)
session = Session()

# Define Subscription Model
Base = declarative_base()

class Subscription(Base):
    __tablename__ = 'subscriptions'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, unique=True)
    username = Column(String(255))  # VARCHAR requires length in MySQL
    subscription_end = Column(DateTime)
    is_active = Column(Integer, default=0)

Base.metadata.create_all(engine)

# Bot Handlers
async def start(update: Update, context: CallbackContext):
    await update.message.reply_text(
        "Welcome! To join the channel, you need a subscription. Use /subscribe to get started."
    )

async def subscribe(update: Update, context: CallbackContext):
    user_id = update.message.from_user.id
    username = update.message.from_user.username

    # Check if the user already exists in the database
    subscription = session.query(Subscription).filter_by(user_id=user_id).first()
    if not subscription:
        subscription = Subscription(user_id=user_id, username=username)
        session.add(subscription)
        session.commit()

    await update.message.reply_text(
        "To subscribe, please send $10 (or the specified amount) via WishPay to [admin's account details].\n"
        "Once you have made the payment, please notify the admin with your username. "
        "The admin will approve your subscription manually."
    )

async def check_payment(update: Update, context: CallbackContext):
    user_id = update.message.from_user.id
    subscription = session.query(Subscription).filter_by(user_id=user_id).first()
    
    if subscription and subscription.is_active:
        await update.message.reply_text("Your subscription is active.")
    else:
        await update.message.reply_text(
            "No active subscription found. Please make your payment and notify the admin for approval."
        )

async def approve(update: Update, context: CallbackContext):
    try:
        user_id = int(context.args[0])  # Admin provides user ID as argument
        subscription = session.query(Subscription).filter_by(user_id=user_id).first()
        if subscription:
            subscription.is_active = 1
            subscription.subscription_end = datetime.now() + timedelta(days=30)
            session.commit()
            await update.message.reply_text(f"Subscription approved for user ID: {user_id}.")
            bot = Bot(token=TELEGRAM_API_TOKEN)
            await bot.send_message(user_id, "Your subscription is now active! You can access the channel.")
        else:
            await update.message.reply_text("User not found in the subscription database.")
    except (IndexError, ValueError):
        await update.message.reply_text("Usage: /approve <user_id>")

# Main Function
def main():
    # Initialize the bot application
    application = Application.builder().token(TELEGRAM_API_TOKEN).build()

    # Add command handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("subscribe", subscribe))
    application.add_handler(CommandHandler("check", check_payment))
    application.add_handler(CommandHandler("approve", approve))

    # Start the bot
    application.run_polling()

if __name__ == "__main__":
    main()
