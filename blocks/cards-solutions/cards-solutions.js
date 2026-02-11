import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-solutions-card-image';
      else div.className = 'cards-solutions-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Add arrow icon to CTA links for circle-to-pill hover effect
  ul.querySelectorAll('.cards-solutions-card-body a').forEach((link) => {
    const textSpan = document.createElement('span');
    textSpan.className = 'cards-solutions-cta-text';
    textSpan.textContent = link.textContent;
    link.textContent = '';

    const arrowSpan = document.createElement('span');
    arrowSpan.className = 'cards-solutions-cta-arrow';
    arrowSpan.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    link.append(textSpan);
    link.append(arrowSpan);
  });

  block.textContent = '';
  block.append(ul);
}
