export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Extract image from the first row's first column
  const firstRow = rows[0];
  const firstCols = [...firstRow.children];
  const imageCol = firstCols[0];
  const picture = imageCol ? imageCol.querySelector('picture') : null;

  // Extract eyebrow and tab data from each row's content column
  const contentColFirst = firstCols.length > 1 ? firstCols[1] : firstCols[0];
  const eyebrowEl = contentColFirst.querySelector('em');
  const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : 'Industries we serve';

  // Parse each row into tab data
  const tabsData = [];
  rows.forEach((row) => {
    const cols = [...row.children];
    const content = cols.length > 1 ? cols[1] : cols[0];
    if (!content) return;

    // Find the industry name (first <strong> element)
    const strongEl = content.querySelector('strong');
    if (!strongEl) return;

    const industryName = strongEl.textContent.trim();

    // Clone the content for the panel, removing eyebrow and industry name
    const panel = content.cloneNode(true);
    const emInPanel = panel.querySelector('em');
    if (emInPanel) {
      const emParent = emInPanel.closest('p');
      if (emParent) emParent.remove();
    }
    const strongInPanel = panel.querySelector('strong');
    if (strongInPanel) {
      const strongParent = strongInPanel.closest('p');
      if (strongParent) strongParent.remove();
    }

    tabsData.push({ industryName, panelHTML: panel.innerHTML });
  });

  if (tabsData.length === 0) return;

  // Build new DOM
  block.textContent = '';

  // Image section
  const imageSection = document.createElement('div');
  imageSection.classList.add('columns-casestudy-img-section');
  if (picture) {
    imageSection.appendChild(picture);
  }
  block.appendChild(imageSection);

  // Content section
  const contentSection = document.createElement('div');
  contentSection.classList.add('columns-casestudy-content-section');

  // Eyebrow
  const eyebrow = document.createElement('div');
  eyebrow.classList.add('columns-casestudy-eyebrow');
  eyebrow.textContent = eyebrowText;
  contentSection.appendChild(eyebrow);

  // Dropdown
  const dropdown = document.createElement('div');
  dropdown.classList.add('columns-casestudy-dropdown');

  const header = document.createElement('button');
  header.classList.add('columns-casestudy-dropdown-header');
  header.setAttribute('aria-expanded', 'false');
  header.setAttribute('aria-haspopup', 'listbox');

  const selectedText = document.createElement('span');
  selectedText.classList.add('columns-casestudy-selected-text');
  selectedText.textContent = tabsData[0].industryName;
  header.appendChild(selectedText);

  const arrow = document.createElement('span');
  arrow.classList.add('columns-casestudy-arrow');
  header.appendChild(arrow);

  dropdown.appendChild(header);

  const list = document.createElement('div');
  list.classList.add('columns-casestudy-dropdown-list');
  list.setAttribute('role', 'listbox');

  tabsData.forEach((tab, index) => {
    const option = document.createElement('div');
    option.classList.add('columns-casestudy-option');
    option.setAttribute('role', 'option');
    option.setAttribute('data-index', index);
    if (index === 0) {
      option.classList.add('selected');
      option.setAttribute('aria-selected', 'true');
    }
    option.textContent = tab.industryName;
    list.appendChild(option);
  });

  dropdown.appendChild(list);
  contentSection.appendChild(dropdown);

  // Tab panels
  const panelsContainer = document.createElement('div');
  panelsContainer.classList.add('columns-casestudy-panels');

  tabsData.forEach((tab, index) => {
    const panelEl = document.createElement('div');
    panelEl.classList.add('columns-casestudy-panel');
    panelEl.setAttribute('data-index', index);
    if (index === 0) panelEl.classList.add('active');
    panelEl.innerHTML = tab.panelHTML;
    panelsContainer.appendChild(panelEl);
  });

  contentSection.appendChild(panelsContainer);
  block.appendChild(contentSection);

  // Switch to a specific tab index
  function switchTab(idx) {
    selectedText.textContent = tabsData[idx].industryName;
    list.querySelectorAll('.columns-casestudy-option').forEach((opt) => {
      opt.classList.remove('selected');
      opt.setAttribute('aria-selected', 'false');
    });
    const activeOption = list.querySelector(`.columns-casestudy-option[data-index="${idx}"]`);
    if (activeOption) {
      activeOption.classList.add('selected');
      activeOption.setAttribute('aria-selected', 'true');
    }
    panelsContainer.querySelectorAll('.columns-casestudy-panel').forEach((p) => p.classList.remove('active'));
    const activePanel = panelsContainer.querySelector(`.columns-casestudy-panel[data-index="${idx}"]`);
    if (activePanel) activePanel.classList.add('active');
    dropdown.classList.remove('open');
    header.setAttribute('aria-expanded', 'false');
  }

  // Toggle dropdown
  header.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Option click
  list.querySelectorAll('.columns-casestudy-option').forEach((option) => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      switchTab(idx);
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      header.setAttribute('aria-expanded', 'false');
    }
  });

  // Keyboard navigation
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      header.setAttribute('aria-expanded', 'false');
    }
  });
}
