/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-support block variant.
 * Extracts icon-based support resource cards with icon image, title,
 * description, and CTA from Lumen's teaser-with-cards component.
 *
 * Source selector: .teaser-with-cards.cmp-cards-container
 * Target block: Cards-Support (2 columns: icon image | title + description + CTA)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract individual support cards
  const cards = element.querySelectorAll('.cards.wrapper .card');

  cards.forEach((card) => {
    // Extract icon image
    const imgEl = card.querySelector('.cmp-teaser__image img, .cmp-image img');
    let image;
    if (imgEl) {
      image = document.createElement('img');
      image.src = imgEl.src;
      image.alt = imgEl.alt || '';
    }

    // Build text content column
    const textContent = document.createElement('div');

    // Extract title
    const titleEl = card.querySelector('.cmp-teaser__title');
    if (titleEl) {
      const title = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      title.appendChild(strong);
      textContent.appendChild(title);
    }

    // Extract description
    const descEl = card.querySelector('.cmp-teaser__description p, .cmp-teaser__description');
    if (descEl) {
      const desc = document.createElement('p');
      desc.textContent = descEl.textContent.trim();
      textContent.appendChild(desc);
    }

    // Extract CTA
    const ctaEl = card.querySelector('.cmp-teaser__action-link');
    if (ctaEl) {
      const link = document.createElement('a');
      link.href = ctaEl.href;
      link.textContent = ctaEl.textContent.trim();
      const strong = document.createElement('strong');
      strong.appendChild(link);
      textContent.appendChild(strong);
    }

    // Create row: [icon image, text content]
    const col1 = image || document.createTextNode('');
    cells.push([col1, textContent]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Support',
    cells,
  });

  element.replaceWith(block);
}
