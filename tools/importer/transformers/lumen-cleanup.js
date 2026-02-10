/* eslint-disable */
/* global WebImporter */

/**
 * Lumen site-wide DOM cleanup transformer.
 * Removes navigation, footer, cookie banners, overlays, and other non-content elements.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Remove navigation and header elements
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--enterprise-navigation',
      '.cmp-experiencefragment--cf-master-nav',
      'header.header',
      '.header-v2',
      '.singlesignin-v2',
      '.cmp-header__search',
      '.is-navigation-sticky',
    ]);

    // Remove footer elements
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '.cmp-experiencefragment--footer',
      '.experiencefragment .cmp-experiencefragment--enterprise-footer',
    ]);

    // Remove cookie banners, overlays, and modals
    WebImporter.DOMUtils.remove(element, [
      '.idlePopup',
      '.loaderbox',
      '.warningDiv',
      '.overlay-bg',
      '.ie-popup',
    ]);

    // Remove accordion navigation (mobile menu)
    WebImporter.DOMUtils.remove(element, [
      '.lmn-accordion.solution-stack',
    ]);

    // Remove carousel dots (UI-only elements)
    WebImporter.DOMUtils.remove(element, [
      '.carousel-dots',
      '.lumen-tabs__dots',
    ]);

    // Remove duplicated partner logo carousel group
    const carouselGroups = element.querySelectorAll('.carousel-group');
    if (carouselGroups.length > 1) {
      for (let i = 1; i < carouselGroups.length; i++) {
        carouselGroups[i].remove();
      }
    }

    // Remove empty containers and env settings
    WebImporter.DOMUtils.remove(element, [
      '#env-run-mode-setting',
    ]);
  }

  if (hookName === 'afterTransform') {
    // Clean up any remaining empty divs that might interfere with content
    const emptyDivs = element.querySelectorAll('div:empty');
    emptyDivs.forEach((div) => {
      if (!div.closest('table') && !div.querySelector('img')) {
        div.remove();
      }
    });
  }
}
