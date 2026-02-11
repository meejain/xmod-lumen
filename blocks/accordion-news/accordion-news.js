export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const row = rows[0];
  const cols = [...row.children];
  if (cols.length < 2) return;

  // Extract header (col 1) and panel content (col 2)
  const headerText = cols[0].textContent.trim();
  const panelContent = cols[1];

  // Build accordion structure
  const wrapper = document.createElement('div');
  wrapper.className = 'accordion-news-wrapper';

  // Header bar (clickable toggle)
  const header = document.createElement('button');
  header.className = 'accordion-news-header';
  header.setAttribute('type', 'button');
  header.setAttribute('aria-expanded', 'true');

  const icon = document.createElement('span');
  icon.className = 'accordion-news-icon';
  const iconImg = document.createElement('img');
  iconImg.src = `${window.hlx?.codeBasePath ?? ''}/icons/networking.svg`;
  iconImg.alt = '';
  iconImg.setAttribute('aria-hidden', 'true');
  icon.append(iconImg);

  const title = document.createElement('span');
  title.className = 'accordion-news-title';
  title.textContent = headerText;

  const caret = document.createElement('span');
  caret.className = 'accordion-news-caret';

  header.append(icon, title, caret);

  // Panel (expandable content) — inner wrapper so only max-height animates
  const panel = document.createElement('div');
  panel.className = 'accordion-news-panel';
  panel.setAttribute('aria-hidden', 'false');
  const panelInner = document.createElement('div');
  panelInner.className = 'accordion-news-panel-inner';

  while (panelContent.firstChild) {
    panelInner.append(panelContent.firstChild);
  }
  panel.append(panelInner);

  // Toggle behavior
  header.addEventListener('click', () => {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', !expanded);
    panel.setAttribute('aria-hidden', expanded);
  });

  wrapper.append(header, panel);
  block.textContent = '';
  block.append(wrapper);
}
