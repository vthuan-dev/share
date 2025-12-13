/**
 * Script to test Telegram bot token and chat ID
 * Usage: node src/scripts/test-telegram-bot.js
 */

import 'dotenv/config';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!botToken) {
  console.error('❌ TELEGRAM_BOT_TOKEN not found in .env');
  process.exit(1);
}

if (!chatId) {
  console.error('❌ TELEGRAM_CHAT_ID not found in .env');
  process.exit(1);
}

console.log('🔍 Testing Telegram Bot Configuration...\n');
console.log(`Bot Token: ${botToken.substring(0, 20)}...`);
console.log(`Chat ID: ${chatId}\n`);

// Test 1: Get bot info
async function testBotInfo() {
  try {
    console.log('📋 Test 1: Getting bot information...');
    const url = `https://api.telegram.org/bot${botToken}/getMe`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) {
      console.error('❌ Bot token is invalid!');
      console.error(`   Error: ${data.description}`);
      console.error(`   Error code: ${data.error_code}`);
      console.log('\n💡 Solutions:');
      console.log('   1. Check your bot token in .env file');
      console.log('   2. Get new token from @BotFather: /mybots -> Select bot -> API Token');
      return false;
    }

    console.log('✅ Bot token is valid!');
    console.log(`   Bot name: ${data.result.first_name}`);
    console.log(`   Bot username: @${data.result.username}`);
    console.log(`   Bot ID: ${data.result.id}\n`);
    return true;
  } catch (error) {
    console.error('❌ Error testing bot:', error.message);
    return false;
  }
}

// Test 2: Send test message
async function testSendMessage() {
  try {
    console.log('📤 Test 2: Sending test message...');
    const testMessage = '🧪 Test message from Share Notification Bot\n\nIf you see this, the bot is working correctly! ✅';
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('❌ Failed to send message!');
      console.error(`   Error: ${data.description}`);
      console.error(`   Error code: ${data.error_code}`);
      
      if (data.error_code === 401) {
        console.log('\n💡 Solutions for 401 Unauthorized:');
        console.log('   1. Bot token is invalid or expired');
        console.log('   2. Get new token from @BotFather');
        console.log('   3. Update TELEGRAM_BOT_TOKEN in .env');
      } else if (data.error_code === 403) {
        console.log('\n💡 Solutions for 403 Forbidden:');
        console.log('   1. Bot is not added to the group');
        console.log('   2. Add bot to group: Search bot username -> Add to group');
        console.log('   3. Bot might not have permission to send messages');
        console.log('   4. Check group settings -> Admins -> Bot permissions');
      } else if (data.error_code === 400) {
        console.log('\n💡 Solutions for 400 Bad Request:');
        console.log('   1. Chat ID is invalid');
        console.log('   2. Bot was removed from the group');
        console.log('   3. Get chat ID again: https://api.telegram.org/bot<TOKEN>/getUpdates');
        console.log('   4. Update TELEGRAM_CHAT_ID in .env');
      }
      return false;
    }

    console.log('✅ Message sent successfully!');
    console.log(`   Message ID: ${data.result.message_id}`);
    console.log(`   Chat: ${data.result.chat.title || data.result.chat.first_name}`);
    console.log(`   Date: ${new Date(data.result.date * 1000).toLocaleString()}\n`);
    return true;
  } catch (error) {
    console.error('❌ Error sending message:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  const botValid = await testBotInfo();
  if (!botValid) {
    console.log('\n❌ Bot token test failed. Please fix the token first.');
    process.exit(1);
  }

  const messageSent = await testSendMessage();
  if (!messageSent) {
    console.log('\n❌ Message sending test failed. Please check the errors above.');
    process.exit(1);
  }

  console.log('🎉 All tests passed! Telegram bot is configured correctly.');
  console.log('   You should see a test message in your Telegram group/chat.');
}

runTests();

