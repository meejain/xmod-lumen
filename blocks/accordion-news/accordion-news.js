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
  header.setAttribute('aria-expanded', 'false');

  const icon = document.createElement('span');
  icon.className = 'accordion-news-icon';
  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';

  const title = document.createElement('span');
  title.className = 'accordion-news-title';
  title.textContent = headerText;

  const caret = document.createElement('span');
  caret.className = 'accordion-news-caret';

  header.append(icon, title, caret);

  // Panel (expandable content)
  const panel = document.createElement('div');
  panel.className = 'accordion-news-panel';
  panel.setAttribute('aria-hidden', 'true');

  // Move panel content children
  while (panelContent.firstChild) {
    panel.append(panelContent.firstChild);
  }

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
