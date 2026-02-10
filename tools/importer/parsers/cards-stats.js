/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-stats block variant.
 * Extracts stat cards with pretitle (stat number), title, description,
 * image, and CTA from Lumen's teaser-stat-tiles component.
 *
 * Source selector: .teaser-stat-tiles.cmp-cards-container
 * Target block: Cards-Stats (2 columns: image | pretitle + title + description + CTA)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract individual stat cards
  const cards = element.querySelectorAll('.cards.wrapper .card');

  cards.forEach((card) => {
    // Extract image
    const imgEl = card.querySelector('.cmp-teaser__image img, .cmp-image img');
    let image;
    if (imgEl) {
      image = document.createElement('img');
      image.src = imgEl.src;
      image.alt = imgEl.alt || '';
    }

    // Build text content column
    const textContent = document.createElement('div');

    // Extract pretitle (stat number like "10x", "97%")
    const pretitleEl = card.querySelector('.cmp-teaser__pretitle');
    if (pretitleEl) {
      const pretitle = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = pretitleEl.textContent.trim();
      pretitle.appendChild(strong);
      textContent.appendChild(pretitle);
    }

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

    // Create row: [image, text content]
    const col1 = image || document.createTextNode('');
    cells.push([col1, textContent]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Stats',
    cells,
  });

  element.replaceWith(block);
}
