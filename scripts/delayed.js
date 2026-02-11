/*
 * Delayed functionality (loaded after LCP, ~3s).
 * - Creates and loads the chat-slide block (bottom-right chat launcher).
 * - Optional: set window.lumenChatWidget to load a third-party chat embed.
 *   Our chat-slide button will open that widget when window.lumenChatOpen is set.
 *
 * Example - load a chat embed script:
 *   window.lumenChatWidget = { script: 'https://example.com/chat-embed.js' };
 *   // Optional: window.lumenChatWidget.key / globalKey
 */

async function loadChatSlide() {
  const { buildBlock, decorateBlock, loadBlock } = await import('./aem.js');
  const chatSlideBlock = buildBlock('chat-slide', '');
  document.body.append(chatSlideBlock);
  decorateBlock(chatSlideBlock);
  await loadBlock(chatSlideBlock);
}

(function runDelayed() {
  loadChatSlide();

  const config = window.lumenChatWidget;
  if (!config?.script) return;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = config.script;
  if (config.key) window[config.globalKey || 'chatWidgetKey'] = config.key;
  document.head.appendChild(script);
}());
