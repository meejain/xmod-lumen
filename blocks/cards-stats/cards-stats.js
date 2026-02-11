import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];
    if (cols.length < 1) return;

    const imageCol = cols.find((c) => c.querySelector('picture'));
    const bodyCol = cols.find((c) => !c.querySelector('picture'));
    if (!bodyCol) return;

    bodyCol.className = 'cards-stats-card-body';
    const ctaEl = bodyCol.querySelector('a')?.closest('strong') || bodyCol.querySelector('a');

    const imageWrap = document.createElement('div');
    imageWrap.className = 'cards-stats-card-image-wrap';
    if (imageCol) {
      const imageDiv = imageCol.querySelector('picture')?.closest('div') || imageCol;
      imageDiv.className = 'cards-stats-card-image';
      imageWrap.append(imageDiv);
      if (ctaEl) {
        const ctaWrap = document.createElement('div');
        ctaWrap.className = 'cards-stats-card-cta';
        ctaWrap.append(ctaEl);
        imageWrap.append(ctaWrap);
      }
    } else if (ctaEl) {
      bodyCol.append(ctaEl);
    }

    li.append(bodyCol, imageWrap);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
