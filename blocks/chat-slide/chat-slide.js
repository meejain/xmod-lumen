/*
 * Chat slide block - bottom-right chat launcher (Lumen as-is migration).
 *
 * Launch behavior (first match wins):
 * 1. window.lumenChatOpen() - open an embedded widget (set by your chat provider)
 * 2. window.lumenChatUrl - open this URL in a new tab
 * 3. Default - open Lumen's contact page (pre-chat form → Lumen Chat)
 *
 * To use a third-party chat widget, set window.lumenChatWidget in head (see scripts/delayed.js)
 * and window.lumenChatOpen = () => { ... } to open the widget when our button is clicked.
 */

const DEFAULT_MESSAGE = "Ready to Transform Your Business with Lumen's Cutting-Edge Solutions?";

/** Lumen contact page (pre-chat form → Lumen Chat). Used when no widget/URL is set. */
const LUMEN_CHAT_CONTACT_URL = 'https://www.lumen.com/en-us/contact-us.html';

/**
 * Launch chat: embedded widget (lumenChatOpen), URL (lumenChatUrl), or Lumen contact page.
 */
function launchChat() {
  if (typeof window.lumenChatOpen === 'function') {
    window.lumenChatOpen();
    return;
  }
  if (window.lumenChatUrl) {
    window.open(window.lumenChatUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  window.open(LUMEN_CHAT_CONTACT_URL, '_blank', 'noopener,noreferrer');
}

/**
 * Build chat slide DOM to match source HTML structure.
 * @param {Element} block
 */
function buildChatSlideDOM(block) {
  block.id = 'chatSlideContainerid';
  block.classList.add('chatSlideContainer');

  const message = block.dataset.message || DEFAULT_MESSAGE;

  block.innerHTML = `
    <div id="chatIcon" class="chatIconSlider runAnimation" style="visibility: visible;">
      <div class="chi">
        <div class="-d--flex -pt--2 -justify-content--end -align-items--end">
          <section id="popover-closable-chat" class="chi-popover chi-popover--left -active -closable" aria-modal="true" role="dialog" style="visibility: visible;">
            <button type="button" class="chi-popover__close" aria-label="Close">×</button>
            <a href="javascript:void(0);" id="chipopover-chat" style="visibility: visible;">
              <div class="chi-popover__content -pt--1">
                <p class="chi-popover__text" id="bubblemsg">${message}</p>
              </div>
              <div class="chi-popover__arrow"></div>
            </a>
          </section>
          <a href="javascript:void(0);" aria-label="Launch Chat" id="chichatbutton">
            <div id="chiChatButtonContent" class="chi-button__content">
              <svg id="icon-chat-bubble" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
                <circle class="chat-icon-cls-3" cx="32" cy="32" r="31.5"></circle>
                <g>
                  <path class="chat-icon-cls-2" d="M41.78,29.81h6.48c.52,0,.94.42.94.94v16.35c0,.52-.42.94-.94.94h-6.7l-2.97,3.93-3.02-3.93h-6.7c-.52,0-.94-.42-.94-.94v-5.17"></path>
                  <path class="chat-icon-cls-2" d="M41.78,16.51v24.26c0,.66-.52,1.18-1.18,1.18h-23.46c-.66,0-1.18-.52-1.18-1.18v-8.38l-4.92-3.78,4.92-3.72v-8.38c0-.66.52-1.19,1.18-1.19h23.45c.66,0,1.18.54,1.18,1.19h0Z"></path>
                  <line class="chat-icon-cls-1" x1="22.29" y1="24.22" x2="35.67" y2="24.22"></line>
                  <line class="chat-icon-cls-1" x1="22.29" y1="28.62" x2="35.67" y2="28.62"></line>
                  <line class="chat-icon-cls-1" x1="22.29" y1="33.02" x2="35.67" y2="33.02"></line>
                </g>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  `;

  const trigger1 = block.querySelector('#chipopover-chat');
  const trigger2 = block.querySelector('#chichatbutton');
  const popover = block.querySelector('#popover-closable-chat');
  const closeBtn = block.querySelector('.chi-popover__close');
  if (trigger1) trigger1.addEventListener('click', (e) => { e.preventDefault(); launchChat(); });
  if (trigger2) trigger2.addEventListener('click', (e) => { e.preventDefault(); launchChat(); });
  if (closeBtn && popover) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); popover.classList.add('is-closed'); });

  window.launchChat = launchChat;
}

/**
 * Decorate chat-slide block (injected into body by scripts.js).
 * @param {Element} block
 */
export default async function decorate(block) {
  buildChatSlideDOM(block);
}
