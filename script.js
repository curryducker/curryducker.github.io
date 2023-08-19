const darkModeToggle = document.getElementById('darkModeToggle');

// Check if the user has already set a dark mode preference
const hasDarkModePreference = localStorage.getItem('darkMode') !== null;

// If the user hasn't set a preference, default to dark mode
if (!hasDarkModePreference) {
  document.body.classList.add('dark-mode');
  darkModeToggle.checked = true;
  localStorage.setItem('darkMode', true);
} else {
  // Get the user's manual preference and apply it
  const userDarkModePreference = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark-mode', userDarkModePreference);
  darkModeToggle.checked = userDarkModePreference;
}

darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', darkModeToggle.checked);
  localStorage.setItem('darkMode', darkModeToggle.checked);
});