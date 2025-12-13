# Share Backend (Express MVC)

## Run

```bash
cd backend
npm install
# create .env
# PORT=4000
# JWT_SECRET=change_me_in_production
# MONGO_URL=mongodb://127.0.0.1:27017/shareapp
# TELEGRAM_BOT_TOKEN=your_bot_token_here (optional)
# TELEGRAM_CHAT_ID=your_chat_id_here (optional)
npm run dev
```

Server runs at http://localhost:4000

## API
- POST /api/auth/register { name, email, password }
- POST /api/auth/login { email, password }
- GET  /api/users/me (Authorization: Bearer <token>)
- GET  /api/groups

## Notes
- DB: MongoDB (local or Atlas). Set `MONGO_URL`.
- Seed/reset sample groups: `npm run db:reset`

## Telegram Notifications Setup

The backend can send Telegram notifications when users share posts. To enable this feature:

### Step 1: Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the instructions to name your bot
4. BotFather will give you a **Bot Token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Save this token - you'll need it for `TELEGRAM_BOT_TOKEN`

### Step 2: Get Your Chat ID

You have several options:

**Option A: Using @userinfobot (for personal chat)**
1. Search for [@userinfobot](https://t.me/userinfobot) on Telegram
2. Start a conversation with it
3. It will reply with your Chat ID (a number like `123456789`)

**Option B: Using Group Chat (Recommended - for sharing with multiple users)**
1. Create a Telegram group or use an existing one
2. Add your bot to the group (search for your bot by username and add it)
3. Send a message in the group
4. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Look for `"chat":{"id":-123456789}` - the negative number is your group chat ID
6. **Note:** All members in the group will receive notifications

**Option C: Multiple Chat IDs (for sending to multiple users/groups)**
1. Get chat IDs for each user/group using methods above
2. In `.env`, separate multiple chat IDs with commas: `TELEGRAM_CHAT_ID=123456789,-987654321,111222333`
3. The bot will send notifications to all specified chats

### Step 3: Configure Environment Variables

Add these to your `.env` file:

**For single chat:**
```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_step_1
TELEGRAM_CHAT_ID=your_chat_id_from_step_2
```

**For multiple chats (comma-separated):**
```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_step_1
TELEGRAM_CHAT_ID=123456789,-987654321,111222333
```

**For group chat (recommended for sharing with team):**
```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_step_1
TELEGRAM_CHAT_ID=-123456789  # Negative number = group chat
```

### Step 4: Test

1. Restart your backend server
2. Have a user share a post
3. Check your Telegram - you should receive a notification with:
   - User name and email
   - Post link
   - Number of groups and list of groups
   - Share type (Free/Paid)
   - Timestamp

### Sharing Bot Access with Others

**Best Method: Use a Group Chat**
1. Create a Telegram group
2. Add your bot to the group
3. Add all team members to the group
4. Use the group chat ID in `TELEGRAM_CHAT_ID`
5. Everyone in the group will receive notifications automatically

**Alternative: Multiple Chat IDs**
- You can specify multiple chat IDs (comma-separated) in `TELEGRAM_CHAT_ID`
- Each user needs to:
  1. Start a chat with your bot
  2. Get their personal chat ID using @userinfobot
  3. Add their chat ID to the comma-separated list

### Notes

- If `TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHAT_ID` are not set, notifications will be silently skipped (no errors)
- Telegram notification failures will not affect the share operation - if Telegram is down, users can still share posts
- Notifications are sent asynchronously and won't slow down the share API response
- **Group chat is recommended** - easier to manage and all members automatically receive notifications
- Bot token is safe to share (it's public), but keep it secure to prevent spam


