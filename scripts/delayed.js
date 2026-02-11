/*
 * Delayed functionality (loaded after LCP, ~3s).
 * Optional chat widget: set window.lumenChatWidget to load a third-party embed.
 * Our chat-slide button will open that widget when window.lumenChatOpen is set.
 *
 * Example - load a chat embed script:
 *   window.lumenChatWidget = { script: 'https://example.com/chat-embed.js' };
 *   // Optional: window.lumenChatWidget.key = '...'; window.lumenChatWidget.globalKey = 'widgetKey';
 */

(function loadChatWidget() {
  const config = window.lumenChatWidget;
  if (!config?.script) return;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = config.script;
  if (config.key) window[config.globalKey || 'chatWidgetKey'] = config.key;
  document.head.appendChild(script);
})();
