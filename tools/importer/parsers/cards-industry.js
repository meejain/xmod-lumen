/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-industry block variant.
 * Extracts staggered industry cards with image, title, description, and CTA
 * from Lumen's teaser-staggered-cards component.
 * Note: First card is a header card (title + description, no image/CTA).
 *
 * Source selector: .teaser-staggered-cards.cmp-cards-container
 * Target block: Cards-Industry (2 columns: image | title + description + CTA)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract individual cards (skip first which is header card)
  const cards = element.querySelectorAll('.cards.wrapper .card');

  cards.forEach((card, index) => {
    const titleEl = card.querySelector('.cmp-teaser__title');
    const descEl = card.querySelector('.cmp-teaser__description p, .cmp-teaser__description');
    const ctaEl = card.querySelector('.cmp-teaser__action-link');
    const imgEl = card.querySelector('.cmp-teaser__image img, .cmp-image img');

    // First card is header-only (no CTA, no image) - skip it for block rows
    if (index === 0 && !ctaEl && !imgEl) {
      return;
    }

    // Extract image
    let image;
    if (imgEl) {
      image = document.createElement('img');
      image.src = imgEl.src;
      image.alt = imgEl.alt || '';
    }

    // Build text content column
    const textContent = document.createElement('div');

    if (titleEl) {
      const title = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      title.appendChild(strong);
      textContent.appendChild(title);
    }

    if (descEl) {
      const desc = document.createElement('p');
      desc.textContent = descEl.textContent.trim();
      textContent.appendChild(desc);
    }

    if (ctaEl) {
      const link = document.createElement('a');
      link.href = ctaEl.href;
      link.textContent = ctaEl.textContent.trim();
      const strong = document.createElement('strong');
      strong.appendChild(link);
      textContent.appendChild(strong);
    }

    // Create row: [image, text content]
    const col1 = image || document.createTextNode('');
    cells.push([col1, textContent]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Industry',
    cells,
  });

  element.replaceWith(block);
}
