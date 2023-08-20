const darkModeToggle = document.getElementById('darkModeToggle');

// Check if the user has already set a dark mode preference
const hasDarkModePreference = localStorage.getItem('darkMode') !== null;

// If the user hasn't set a preference, default to dark mode
if (!hasDarkModePreference) {
  document.body.classList.add('dark-mode');
  darkModeToggle.checked = true;
  localStorage.setItem('darkMode', true);
  modeIcon.textContent = 'bedtime'; // Set moon icon
} else {
  // Get the user's manual preference and apply it
  const userDarkModePreference = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark-mode', userDarkModePreference);
  darkModeToggle.checked = userDarkModePreference;
  modeIcon.textContent = userDarkModePreference ? 'bedtime' : 'wb_sunny'; // Set icon based on preference
}

darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', darkModeToggle.checked);
  localStorage.setItem('darkMode', darkModeToggle.checked);
  modeIcon.style.opacity = 0;
  setTimeout(() => {
    modeIcon.textContent = darkModeToggle.checked ? 'bedtime' : 'wb_sunny';
    modeIcon.style.opacity = 1;
  }, 300);
});

const menu = document.querySelector('.foldable-menu');
const button = document.querySelector('.menu-icon');
menuIcon.textContent = 'menu';

button.addEventListener('click', () => {
  if (menu.classList.contains('open')) {
    menuIcon.style.opacity = 0;
    menu.classList.add('close');
    setTimeout(() => {
      menu.classList.remove('open', 'close');
      menuIcon.textContent = 'menu';
      menuIcon.style.opacity = 1;
    }, 300); // Match the animation duration
  } else {
    menu.classList.add('open');
    menuIcon.style.opacity = 0;
    setTimeout(() => {
      menuIcon.textContent = 'close';
      menuIcon.style.opacity = 1;
    }, 300);
  }
});
