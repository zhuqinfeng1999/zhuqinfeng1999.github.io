const buttons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-kind]')];

for (const button of buttons) {
  button.addEventListener('click', () => {
    const choice = button.dataset.filter;
    for (const other of buttons) {
      const active = other === button;
      other.classList.toggle('active', active);
      other.setAttribute('aria-pressed', String(active));
    }
    for (const card of cards) {
      const visible = choice === 'all' || card.dataset.kind === choice;
      card.hidden = !visible;
      if (!visible) card.querySelector('video')?.pause();
    }
  });
}

// Keep only one scene video playing at a time, particularly on mobile.
for (const video of document.querySelectorAll('video')) {
  video.addEventListener('play', () => {
    for (const other of document.querySelectorAll('video')) {
      if (other !== video) other.pause();
    }
  });
}

const copyButton = document.querySelector('[data-copy-citation]');
copyButton?.addEventListener('click', async () => {
  const code = document.querySelector('#bibtex');
  const status = document.querySelector('[data-copy-status]');
  try {
    await navigator.clipboard.writeText(code.textContent.trim());
    status.textContent = 'Citation copied.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Select and copy the citation, or download the .bib file.';
  }
});
