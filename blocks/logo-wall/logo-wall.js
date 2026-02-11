export default function decorate(block) {
  const pictures = [...block.querySelectorAll('picture')];
  if (pictures.length === 0) return;

  // Extract heading if present
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const headingText = heading ? heading.textContent.trim() : '';

  // Clear block and rebuild
  block.textContent = '';

  // Add heading
  if (headingText) {
    const h3 = document.createElement('h3');
    h3.textContent = headingText;
    block.appendChild(h3);
  }

  // Create marquee container
  const marquee = document.createElement('div');
  marquee.className = 'logo-wall-marquee';

  // Create track with logos duplicated for seamless loop
  const track = document.createElement('div');
  track.className = 'logo-wall-track';

  // Add logos twice for seamless infinite scroll
  for (let i = 0; i < 2; i += 1) {
    pictures.forEach((pic) => {
      const item = document.createElement('div');
      item.className = 'logo-wall-item';
      item.appendChild(pic.cloneNode(true));
      track.appendChild(item);
    });
  }

  marquee.appendChild(track);
  block.appendChild(marquee);
}
