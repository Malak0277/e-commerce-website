// Store original margin globally
let originalMargin = 0;

// Function to update cart count
function updateCartCount() {
    loadCartCount();
}

// Define these functions globally so they can be called from HTML
function toggleNav() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        closeNav();
    } else {
        openNav();
    }
}
function openNav() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");
    sidebar.style.width = "250px";
    sidebar.style.display = "block";
    main.style.marginLeft = "250px";
    document.body.classList.add('sidebar-open'); // <-- Add this line
}

function closeNav() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");
    sidebar.style.width = "0";
    sidebar.style.display = "none";
    main.style.marginLeft = originalMargin + "px";
    document.body.classList.remove('sidebar-open'); // <-- Add this line
}
// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Store the original margin when page loads
    const main = document.getElementById("main");
    if (main) {
        originalMargin = parseInt(window.getComputedStyle(main).marginLeft) || 0;
    }
    
    // Update cart count when page loads
    updateCartCount();

    // Handle dropdown menu
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        dropdownContent.style.display = 
            dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdownContent.style.display = 'none';
        }
    });

    const profileImage = localStorage.getItem('profileImage');
    if (profileImage) {
        document.querySelectorAll('.profile-picture img').forEach(img => {
            img.src = profileImage;
        });
    }
}); 