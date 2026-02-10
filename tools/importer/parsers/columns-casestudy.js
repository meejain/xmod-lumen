/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-casestudy block variant.
 * Extracts industry selector with image and featured case study content
 * from Lumen's industrySelectorBlock component.
 *
 * Source selector: .industrySelectorBlock .industry-selector-container
 * Target block: Columns-Casestudy (2 columns: image | eyebrow + case study details + CTA)
 */
export default function parse(element, { document }) {
  // Extract image (left column)
  const imgEl = element.querySelector('.industry-selector-image img, .industry-selector-img-section img');
  let image;
  if (imgEl) {
    image = document.createElement('img');
    image.src = imgEl.src;
    image.alt = imgEl.alt || '';
  }

  // Build right column content
  const rightColumn = document.createElement('div');

  // Extract eyebrow text
  const eyebrowEl = element.querySelector('.industry-selector-eybrow-text');
  if (eyebrowEl) {
    const eyebrow = document.createElement('p');
    const em = document.createElement('em');
    em.textContent = eyebrowEl.textContent.trim();
    eyebrow.appendChild(em);
    rightColumn.appendChild(eyebrow);
  }

  // Extract first industry item (featured case study)
  const firstItem = element.querySelector('.industry-selector-item');
  if (firstItem) {
    // Case study label
    const nameEl = firstItem.querySelector('.industry-selector-industry-name');
    if (nameEl && nameEl.textContent.trim()) {
      const caseName = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = nameEl.textContent.trim();
      caseName.appendChild(em);
      rightColumn.appendChild(caseName);
    }

    // Company name
    const locationEl = firstItem.querySelector('.industry-selector-industry-location');
    if (locationEl && locationEl.textContent.trim()) {
      const company = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = locationEl.textContent.trim();
      company.appendChild(strong);
      rightColumn.appendChild(company);
    }

    // Title
    const titleEl = firstItem.querySelector('.industry-selector-title');
    if (titleEl && titleEl.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = titleEl.textContent.trim();
      rightColumn.appendChild(h2);
    }

    // Description
    const descEl = firstItem.querySelector('.industry-selector-description');
    if (descEl && descEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      rightColumn.appendChild(p);
    }

    // CTA
    const ctaEl = firstItem.querySelector('.industry-selector-cta-link1, .industry-selector-cta-containers a');
    if (ctaEl) {
      const link = document.createElement('a');
      link.href = ctaEl.href;
      link.textContent = ctaEl.textContent.trim();
      const strong = document.createElement('strong');
      strong.appendChild(link);
      rightColumn.appendChild(strong);
    }
  }

  const col1 = image || document.createTextNode('');
  const cells = [
    [col1, rightColumn],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns-Casestudy',
    cells,
  });

  element.replaceWith(block);
}
