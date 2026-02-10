import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Activates the first category in a mega menu dropdown
 * and sets up hover listeners for category switching
 */
function activateFirstCategory(navSection) {
  const categories = navSection.querySelectorAll(':scope > ul > li');
  if (!categories.length) return;

  // Remove existing active states
  categories.forEach((cat) => cat.classList.remove('mega-active'));

  // Activate first category with a sub-list
  const firstCat = [...categories].find((cat) => cat.querySelector('ul'));
  if (firstCat) firstCat.classList.add('mega-active');
}

/**
 * Decorates a mega menu right panel with heading and
 * Featured/Categories grouping based on item descriptions
 */
function decorateMegaPanel(subList, categoryName, menuName) {
  const items = [...subList.children];
  if (!items.length) return;

  const isServices = menuName === 'Services';
  const headingText = isServices ? `${categoryName} Portfolio` : categoryName;
  const featuredLabel = isServices ? 'Featured Services' : 'Featured';
  const featured = items.filter((item) => item.querySelector('em'));
  const plain = items.filter((item) => !item.querySelector('em'));
  const hasBothGroups = featured.length > 0 && plain.length > 0;

  subList.textContent = '';

  // Heading
  const headingLi = document.createElement('li');
  headingLi.className = 'mega-panel-heading';
  const title = document.createElement('span');
  title.className = 'mega-panel-title';
  title.textContent = headingText;
  headingLi.appendChild(title);
  subList.appendChild(headingLi);

  // Body with columns
  const bodyLi = document.createElement('li');
  bodyLi.className = 'mega-panel-body';

  if (hasBothGroups) {
    const featCol = document.createElement('div');
    featCol.className = 'mega-col mega-col-featured';
    const featH = document.createElement('h5');
    featH.textContent = featuredLabel;
    featCol.appendChild(featH);
    const featUl = document.createElement('ul');
    featured.forEach((item) => featUl.appendChild(item));
    featCol.appendChild(featUl);
    bodyLi.appendChild(featCol);

    const catCol = document.createElement('div');
    catCol.className = 'mega-col mega-col-categories';
    const catH = document.createElement('h5');
    catH.textContent = 'Categories';
    catCol.appendChild(catH);
    const catUl = document.createElement('ul');
    plain.forEach((item) => catUl.appendChild(item));
    catCol.appendChild(catUl);
    bodyLi.appendChild(catCol);
  } else {
    const col = document.createElement('div');
    col.className = 'mega-col';
    const ul = document.createElement('ul');
    items.forEach((item) => ul.appendChild(item));
    col.appendChild(ul);
    bodyLi.appendChild(col);
  }

  subList.appendChild(bodyLi);
}

/**
 * Extracts only the direct text content of an element,
 * ignoring text from nested child elements.
 */
function getDirectText(el) {
  return [...el.childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join('')
    .trim();
}

/**
 * Sets up mega menu category hover behavior for 2-panel layout
 */
function setupMegaMenuCategories(navSections) {
  const dropdowns = navSections.querySelectorAll('.nav-drop');
  dropdowns.forEach((drop) => {
    const menuName = getDirectText(drop);
    const categories = drop.querySelectorAll(':scope > ul > li');
    categories.forEach((cat) => {
      const subList = cat.querySelector('ul');
      if (subList) {
        const catText = getDirectText(cat);
        if (catText) {
          subList.setAttribute('data-heading', catText);
          if (isDesktop.matches) {
            decorateMegaPanel(subList, catText, menuName);
          }
        }
      }
      cat.addEventListener('mouseenter', () => {
        if (!isDesktop.matches) return;
        categories.forEach((c) => c.classList.remove('mega-active'));
        cat.classList.add('mega-active');
      });
    });
  });
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment (metadata path or root /nav; fallback if 404)
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  let fragment = await loadFragment(navPath);
  if (!fragment && navPath !== '/nav') fragment = await loadFragment('/nav');

  if (!fragment) {
    block.textContent = '';
    return;
  }

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand?.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
      // Desktop hover behavior for mega menu
      navSection.addEventListener('mouseenter', () => {
        if (isDesktop.matches && navSection.classList.contains('nav-drop')) {
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', 'true');
          // Activate first category in the dropdown
          activateFirstCategory(navSection);
        }
      });
      navSection.addEventListener('mouseleave', () => {
        if (isDesktop.matches && navSection.classList.contains('nav-drop')) {
          navSection.setAttribute('aria-expanded', 'false');
        }
      });
    });
    // Setup 2-panel mega menu category hover
    setupMegaMenuCategories(navSections);
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
