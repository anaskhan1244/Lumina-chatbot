document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('LuminaTheme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('LuminaTheme', currentTheme);
        
        // Add a nice splash effect on toggle
        body.style.transition = 'background-color 0.5s ease-in-out';
    });
});
