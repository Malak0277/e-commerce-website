// Shared cart functions
function updateNavCartCount() {
    const count = cart.items.reduce((total, item) => total + item.quantity, 0);
    const navCountElement = document.getElementById('nav-cart-count');
    if (navCountElement) {
        navCountElement.textContent = count;
    }
}

// Function to load cart count on any page
async function loadCartCount() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/cart', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) return;
        
        const cartData = await response.json();
        const count = cartData.items.reduce((total, item) => total + item.quantity, 0);
        const navCountElement = document.getElementById('nav-cart-count');
        if (navCountElement) {
            navCountElement.textContent = count;
        }
    } catch (error) {
        console.error('Error loading cart count:', error);
    }
} 