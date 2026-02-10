/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-numbered block variant.
 * Extracts tabbed content panels with numbered tabs (01/02/03),
 * each having image, title, description, and CTA.
 *
 * Source selector: .stackedContent .lumen-tabs
 * Target block: Tabs-Numbered (2 columns per row: tab label | image + title + description + CTA)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract tab panels
  const panels = element.querySelectorAll('.lumen-tabs__panel');

  panels.forEach((panel, index) => {
    // Extract tab label (use title as label)
    const titleEl = panel.querySelector('.lumen-tabs__title');
    const tabLabel = titleEl ? titleEl.textContent.trim() : `Tab ${index + 1}`;

    // Build content column
    const contentDiv = document.createElement('div');

    // Extract image
    const imgEl = panel.querySelector('.lumen-tabs__imageWrap img, .lumen-tabs__media img');
    if (imgEl) {
      const image = document.createElement('img');
      image.src = imgEl.src;
      image.alt = imgEl.alt || '';
      contentDiv.appendChild(image);
      contentDiv.appendChild(document.createElement('br'));
    }

    // Extract title
    if (titleEl) {
      const h2 = document.createElement('h2');
      h2.textContent = titleEl.textContent.trim();
      contentDiv.appendChild(h2);
    }

    // Extract description
    const descEl = panel.querySelector('.lumen-tabs__desc p, .lumen-tabs__desc');
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      contentDiv.appendChild(p);
    }

    // Extract CTA
    const ctaEl = panel.querySelector('.lumen-tabs__cta');
    if (ctaEl) {
      const link = document.createElement('a');
      link.href = ctaEl.href;
      link.textContent = ctaEl.textContent.trim();
      const strong = document.createElement('strong');
      strong.appendChild(link);
      contentDiv.appendChild(strong);
    }

    // Create row: [tab label, content]
    cells.push([tabLabel, contentDiv]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Tabs-Numbered',
    cells,
  });

  element.replaceWith(block);
}
