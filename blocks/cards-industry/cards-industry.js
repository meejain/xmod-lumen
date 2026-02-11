import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    const hasPicture = li.querySelector('picture');

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-industry-card-image';
      } else if (div.children.length === 0) {
        // Empty cell (intro card has no image)
        div.remove();
      } else {
        div.className = 'cards-industry-card-body';
      }
    });

    // First row with no image = intro card
    if (index === 0 && !hasPicture) {
      li.className = 'cards-industry-intro';
    }

    ul.append(li);
  });

  // Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Add arrow icon to CTA links (skip intro card)
  ul.querySelectorAll('li:not(.cards-industry-intro) .cards-industry-card-body a').forEach((link) => {
    const textSpan = document.createElement('span');
    textSpan.className = 'cards-industry-cta-text';
    textSpan.textContent = link.textContent;
    link.textContent = '';

    const arrowSpan = document.createElement('span');
    arrowSpan.className = 'cards-industry-cta-arrow';
    arrowSpan.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    link.append(textSpan);
    link.append(arrowSpan);
  });

  block.textContent = '';
  block.append(ul);
}
