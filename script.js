// How many squares to render
const TOTAL = 800;

// Mount point
const board = document.getElementById('board');

// Utility: random color (nice saturated palette)
function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Create and attach 800 squares
for (let i = 0; i < TOTAL; i++) {
  const sq = document.createElement('div');
  sq.className = 'square';

  // If a previous fade-back is pending, cancel it
  function clearPending() {
    if (sq._tid) {
      clearTimeout(sq._tid);
      sq._tid = null;
    }
  }

  // Handle mouseover (Cypress uses trigger('mouseover'))
  sq.addEventListener('mouseover', () => {
    clearPending();
    const color = randomColor();
    sq.style.backgroundColor = color;
    // boxShadow must be a string; use template literal
    sq.style.boxShadow = `0 0 10px 2px ${color}`;

    // After 1 second, revert smoothly (CSS transition handles smoothness)
    sq._tid = setTimeout(() => {
      sq.style.backgroundColor = '#1d1d1d'; // matches rgb(29, 29, 29)
      sq.style.boxShadow = 'none';
      sq._tid = null;
    }, 1000);
  });

  // If mouse leaves early, cancel and revert immediately to match tests that
  // trigger mouseout and expect the original color back.
  sq.addEventListener('mouseout', () => {
    // If there's a scheduled revert, clear it and revert now.
    clearPending();
    sq.style.backgroundColor = '#1d1d1d';
    sq.style.boxShadow = 'none';
  });

  board.appendChild(sq);
}
