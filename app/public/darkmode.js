// Add "dark" class to document before page load if the user prefers dark mode.
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (prefersDark) {
  document.documentElement.classList.add("dark");
}
