document.addEventListener("DOMContentLoaded", () => {
    // Load navbar
    fetch('../html/components/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
    });
}); 