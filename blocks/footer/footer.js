import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment (metadata path or root /footer; fallback if 404)
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  let fragment = await loadFragment(footerPath);
  if (!fragment && footerPath !== '/footer') fragment = await loadFragment('/footer');

  if (!fragment) {
    block.textContent = '';
    return;
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  // decorate country selector in last section
  const lastSection = footer.querySelector('.section:last-child');
  if (lastSection) {
    const wrapper = lastSection.querySelector('.default-content-wrapper');
    if (wrapper) {
      const flagParagraph = wrapper.querySelector('p:first-child');
      const countryList = wrapper.querySelector('ul');

      if (flagParagraph && countryList) {
        // add chevron arrow to the flag paragraph
        const chevron = document.createElement('span');
        chevron.classList.add('country-chevron');
        chevron.setAttribute('aria-hidden', 'true');
        flagParagraph.append(chevron);
        flagParagraph.classList.add('country-toggle');

        // toggle dropdown on click
        flagParagraph.addEventListener('click', () => {
          const isOpen = countryList.classList.toggle('open');
          chevron.classList.toggle('open', isOpen);
        });

        // close dropdown when clicking outside
        document.addEventListener('click', (e) => {
          if (!flagParagraph.contains(e.target) && !countryList.contains(e.target)) {
            countryList.classList.remove('open');
            chevron.classList.remove('open');
          }
        });
      }
    }
  }
}
