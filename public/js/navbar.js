// Store original margin globally
let originalMargin = 0;

// Function to update cart count
function updateCartCount() {
    try {
        let count = 0;
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        if (cartItems.length) {
            count = cartItems.reduce((total, item) => total + item.quantity, 0);
        }
        
        const navCartCount = document.getElementById('nav-cart-count');
        const sidebarCartCount = document.getElementById('sidebar-cart-count');
        
        if (navCartCount) navCartCount.textContent = count;
        if (sidebarCartCount) sidebarCartCount.textContent = count;
    } catch (error) {
        console.error("Error updating cart count:", error);
    }
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
}

function closeNav() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");
    
    sidebar.style.width = "0";
    sidebar.style.display = "none";
    main.style.marginLeft = originalMargin + "px";
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
}); 