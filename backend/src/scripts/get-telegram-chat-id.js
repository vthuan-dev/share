/**
 * Script to get Telegram Chat ID
 * Usage: node src/scripts/get-telegram-chat-id.js <BOT_TOKEN>
 * 
 * Make sure to:
 * 1. Add your bot to the group
 * 2. Send a message in the group
 * 3. Run this script with your bot token
 */

const botToken = process.argv[2];

if (!botToken) {
  console.error('❌ Please provide your bot token');
  console.log('Usage: node src/scripts/get-telegram-chat-id.js <BOT_TOKEN>');
  console.log('Example: node src/scripts/get-telegram-chat-id.js 123456789:ABCdefGHIjklMNOpqrsTUVwxyz');
  process.exit(1);
}

async function getChatIds() {
  try {
    const url = `https://api.telegram.org/bot${botToken}/getUpdates`;
    console.log('🔍 Fetching updates from Telegram API...\n');
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) {
      console.error('❌ Error:', data.description);
      return;
    }

    if (!data.result || data.result.length === 0) {
      console.log('⚠️  No messages found.');
      console.log('💡 Make sure to:');
      console.log('   1. Add your bot to the group');
      console.log('   2. Send a message in the group');
      console.log('   3. Run this script again\n');
      return;
    }

    console.log('📋 Found chat IDs:\n');
    
    const chatIds = new Map();
    
    data.result.forEach((update) => {
      if (update.message && update.message.chat) {
        const chat = update.message.chat;
        const chatId = chat.id;
        const chatType = chat.type;
        const chatTitle = chat.title || chat.first_name || chat.username || 'Unknown';
        
        if (!chatIds.has(chatId)) {
          chatIds.set(chatId, {
            id: chatId,
            type: chatType,
            title: chatTitle,
            username: chat.username || null,
          });
        }
      }
    });

    if (chatIds.size === 0) {
      console.log('⚠️  No chat IDs found in updates');
      return;
    }

    chatIds.forEach((chat) => {
      console.log(`📱 ${chat.type === 'group' || chat.type === 'supergroup' ? '👥 Group' : '👤 Personal'}: ${chat.title}`);
      console.log(`   Chat ID: ${chat.id}`);
      if (chat.username) {
        console.log(`   Username: @${chat.username}`);
      }
      console.log('');
    });

    // Show group chat IDs specifically
    const groupChats = Array.from(chatIds.values()).filter(
      (chat) => chat.type === 'group' || chat.type === 'supergroup'
    );

    if (groupChats.length > 0) {
      console.log('✅ Group Chat IDs (use these in TELEGRAM_CHAT_ID):');
      groupChats.forEach((chat) => {
        console.log(`   ${chat.id}  (${chat.title})`);
      });
      console.log('');
    }

    const personalChats = Array.from(chatIds.values()).filter(
      (chat) => chat.type === 'private'
    );

    if (personalChats.length > 0) {
      console.log('👤 Personal Chat IDs:');
      personalChats.forEach((chat) => {
        console.log(`   ${chat.id}  (${chat.title})`);
      });
      console.log('');
    }

    console.log('💡 Copy the Chat ID and add it to your .env file:');
    console.log('   TELEGRAM_CHAT_ID=<chat_id_here>');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure your bot token is correct');
  }
}

getChatIds();

