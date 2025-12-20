/**
 * Telegram Bot Utility
 * Sends notifications to Telegram when users share posts
 */

/**
 * Send a message to Telegram using Bot API
 * Supports multiple chat IDs (comma-separated) or single chat ID
 * @param {string} message - The message to send
 * @returns {Promise<void>}
 */
export async function sendTelegramMessage(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // If Telegram is not configured, silently skip
  if (!botToken || !chatId) {
    console.log('[Telegram] Skipping notification - Telegram not configured');
    return;
  }

  // Support multiple chat IDs (comma-separated) or single chat ID
  const chatIds = chatId.split(',').map(id => id.trim()).filter(id => id);

  if (chatIds.length === 0) {
    console.log('[Telegram] No valid chat IDs found');
    return;
  }

  // Send to all chat IDs
  const sendPromises = chatIds.map(async (targetChatId) => {
    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: message,
          parse_mode: 'HTML', // Enable HTML formatting
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[Telegram] Failed to send message to chat ${targetChatId}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        
        // Provide helpful error messages
        if (response.status === 401) {
          console.error(`[Telegram] ❌ Unauthorized (401) - Possible causes:`);
          console.error(`   1. Bot token is invalid or expired`);
          console.error(`   2. Bot token in .env doesn't match the bot`);
          console.error(`   3. Bot was deleted or token was revoked`);
          console.error(`   💡 Check your TELEGRAM_BOT_TOKEN in .env file`);
        } else if (response.status === 403) {
          console.error(`[Telegram] ❌ Forbidden (403) - Bot doesn't have permission:`);
          console.error(`   1. Bot might not be added to the group`);
          console.error(`   2. Bot might not have permission to send messages`);
          console.error(`   3. Group might have restricted bot permissions`);
          console.error(`   💡 Add bot to group and ensure it can send messages`);
        } else if (response.status === 400) {
          console.error(`[Telegram] ❌ Bad Request (400) - Possible causes:`);
          console.error(`   1. Chat ID is invalid`);
          console.error(`   2. Bot was removed from the group`);
          console.error(`   3. Group was deleted`);
          console.error(`   💡 Check your TELEGRAM_CHAT_ID in .env file`);
        }
        
        return { success: false, chatId: targetChatId };
      }

      const result = await response.json();
      if (!result.ok) {
        console.error(`[Telegram] Telegram API error for chat ${targetChatId}:`, result.description);
        return { success: false, chatId: targetChatId };
      }

      console.log(`[Telegram] Notification sent successfully to chat ${targetChatId}`);
      return { success: true, chatId: targetChatId };
    } catch (error) {
      // Log error but don't throw - Telegram failures shouldn't break the share operation
      console.error(`[Telegram] Error sending notification to chat ${targetChatId}:`, error.message);
      return { success: false, chatId: targetChatId, error: error.message };
    }
  });

  // Wait for all messages to be sent (but don't fail if some fail)
  await Promise.allSettled(sendPromises);
}

/**
 * Format and send share post notification
 * @param {Object} data - Share post data
 * @param {string} data.userName - User's name
 * @param {string} data.userEmail - User's email
 * @param {string} data.postLink - Facebook post link
 * @param {number} data.groupCount - Number of groups
 * @param {Array} data.groups - Array of group objects with name, region, province
 * @param {boolean} data.isFreeShare - Whether this is a free share
 * @param {Date} data.createdAt - Share timestamp
 */
export async function sendSharePostNotification(data) {
  const {
    userName,
    userEmail,
    postLink,
    groupCount,
    groups = [],
    isFreeShare,
    createdAt,
  } = data;

  // Format date in Vietnam timezone (UTC+7)
  const date = new Date(createdAt);
  date.setHours(date.getHours() + 7);
  const formattedDate = date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  });

  // Build message with HTML formatting for Telegram
  const message = `📢 <b>Có người vừa chia sẻ bài viết!</b>

👤 <b>Người dùng:</b> ${escapeHtml(userName)}
📧 <b>Email:</b> ${escapeHtml(userEmail)}
🔗 <b>Link bài viết:</b> <a href="${postLink}">${postLink}</a>
📊 <b>Số nhóm:</b> ${groupCount}
💰 <b>Loại:</b> ${isFreeShare ? 'Miễn phí' : 'Trả phí'}
🕐 <b>Thời gian:</b> ${formattedDate}`;

  await sendTelegramMessage(message);
}

/**
 * Escape HTML special characters for Telegram HTML parse mode
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

