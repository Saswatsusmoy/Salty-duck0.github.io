document.addEventListener('DOMContentLoaded', () => {
  const masked = document.getElementById('masked-content');
  window.addEventListener('mousemove', e => {
    const rect = masked.parentElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    masked.style.setProperty('--mouse-x', `${x}px`);
    masked.style.setProperty('--mouse-y', `${y}px`);
  });
});
