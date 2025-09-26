document.addEventListener('DOMContentLoaded', () => {
  const masked = document.getElementById('masked-content');
  const wrapper = document.querySelector('.wrapper');
  const textContent = document.querySelector('.text-content');
  
  if (!masked || !wrapper || !textContent) return;
  
  // Simple mouse tracking without animations
  const updateMousePosition = (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    masked.style.setProperty('--mouse-x', `${x}px`);
    masked.style.setProperty('--mouse-y', `${y}px`);
  };
  
  // Mouse events
  textContent.addEventListener('mouseenter', () => {
    wrapper.style.cursor = 'crosshair';
  });
  
  textContent.addEventListener('mouseleave', () => {
    wrapper.style.cursor = 'default';
    masked.style.setProperty('--mouse-x', '50%');
    masked.style.setProperty('--mouse-y', '50%');
  });
  
  wrapper.addEventListener('mousemove', updateMousePosition);
});
