/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-homepage block variant.
 * Extracts hero banner with heading, description, and background image
 * from Lumen's .herobanner.teaser component.
 *
 * Source selector: .herobanner.teaser
 * Target block: Hero-Homepage (1 column: image, heading, description)
 */
export default function parse(element, { document }) {
  // Extract heading
  const headingEl = element.querySelector('.cmp-teaser__title');
  const heading = headingEl ? headingEl.textContent.trim() : '';

  // Extract description
  const descEl = element.querySelector('.cmp-teaser__description p, .cmp-teaser__description');
  const description = descEl ? descEl.textContent.trim() : '';

  // Extract background image
  const imgEl = element.querySelector('.cmp-teaser__image img');
  let image;
  if (imgEl) {
    image = document.createElement('img');
    image.src = imgEl.src;
    image.alt = imgEl.alt || '';
  }

  // Extract CTA links (if any)
  const ctaContainer = element.querySelector('.cmp-teaser__action-container');
  const ctaLinks = ctaContainer ? ctaContainer.querySelectorAll('a') : [];

  // Build cell content
  const cellContent = document.createElement('div');

  if (image) {
    cellContent.appendChild(image);
    cellContent.appendChild(document.createElement('br'));
  }

  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading;
    cellContent.appendChild(h1);
  }

  if (description) {
    const p = document.createElement('p');
    p.textContent = description;
    cellContent.appendChild(p);
  }

  ctaLinks.forEach((cta) => {
    const link = document.createElement('a');
    link.href = cta.href;
    link.textContent = cta.textContent.trim();
    const strong = document.createElement('strong');
    strong.appendChild(link);
    cellContent.appendChild(strong);
  });

  const cells = [
    [cellContent],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Hero-Homepage',
    cells,
  });

  element.replaceWith(block);
}
