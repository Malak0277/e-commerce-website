    // Cart data structure
    let cart = {
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 5,
        total: 0,
        currentDiscount: null,
        discountAmount: 0
    };

    // Initialize the cart page
    document.addEventListener('DOMContentLoaded', function() {
        loadCart();
        setupEventListeners();
    });
    
    // Load cart from API
    async function loadCart() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to load cart');
            }
            
            const cartData = await response.json();
            cart.items = cartData.items || [];
            updateCartDisplay();
            updateNavCartCount();
        } catch (error) {
            console.error('Error loading cart:', error);
            alert(`Error loading cart: ${error.message}`);
        }
    }

    // Save cart to localStorage
    function saveCartToStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cart.items));
        updateNavCartCount();
    }

    // Update the cart count in the navigation
    function updateNavCartCount() {
        loadCartCount();
    }

    // Add this function to calculate cart totals
    function calculateCartTotals() {
        console.log('Calculating cart totals...'); // Debug log
        console.log('Current cart state:', cart); // Debug log
        
        // Calculate subtotal
        cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Calculate discount if exists
        if (cart.currentDiscount) {
            console.log('Applying discount:', cart.currentDiscount); // Debug log
            cart.discountAmount = (cart.subtotal * cart.currentDiscount.percentage) / 100;
        } else {
            cart.discountAmount = 0;
        }
        
        // Calculate tax (5%)
        cart.tax = cart.subtotal * 0.05;
        
        // Calculate shipping (free over $100)
        cart.shipping = cart.subtotal > 100 ? 0 : 5;
        
        // Calculate final total
        cart.total = cart.subtotal + cart.tax + cart.shipping - cart.discountAmount;
        
        console.log('Calculated totals:', { // Debug log
            subtotal: cart.subtotal,
            discountAmount: cart.discountAmount,
            tax: cart.tax,
            shipping: cart.shipping,
            total: cart.total
        });
        
        // Update discount display
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount');
        
        if (cart.currentDiscount) {
            discountRow.style.display = 'flex';
            discountAmount.textContent = `-$${cart.discountAmount.toFixed(2)}`;
        } else {
            discountRow.style.display = 'none';
            discountAmount.textContent = '$0.00';
        }
    }

    // Update the applyPromoCode function
    async function applyPromoCode() {
        const promoCodeInput = document.getElementById('promo-code');
        const promoMessage = document.getElementById('promo-message');
        const code = promoCodeInput.value.trim().toUpperCase();
        
        console.log('Applying promo code:', code);
        
        if (!code) {
            promoMessage.textContent = 'Please enter a promo code';
            promoMessage.className = 'promo-message invalid-promo';
            return;
        }
        
        try {
            console.log('Sending request to server...');
            const response = await fetch('/cart/apply-discount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ code })
            });
            
            console.log('Server response status:', response.status);
            const data = await response.json();
            console.log('Server response data:', data);
            
            if (!response.ok) {
                console.log('Invalid discount code response');
                promoMessage.textContent = data.message || 'Invalid discount code';
                promoMessage.className = 'promo-message invalid-promo';
                return;
            }
            
            console.log('Valid discount code received');
            const { discount } = data;
            
            // Store discount info in frontend only
            cart.currentDiscount = {
                code: discount.code,
                percentage: discount.percentage,
                description: discount.description
            };
            
            console.log('Updated cart with discount:', cart);
            
            // Calculate new totals
            calculateCartTotals();
            
            // Update the discount amount display
            const discountRow = document.getElementById('discount-row');
            const discountAmount = document.getElementById('discount');
            console.log('Discount elements:', { discountRow, discountAmount });
            
            if (discountRow && discountAmount) {
                discountRow.style.display = 'flex';
                discountAmount.textContent = `-$${cart.discountAmount.toFixed(2)}`;
            }
            
            // Show success message
            promoMessage.textContent = `Promo code applied! ${discount.percentage}% off`;
            promoMessage.className = 'promo-message valid-promo';
            
            updateCartDisplay();
        } catch (error) {
            console.error('Error applying promo code:', error);
            promoMessage.textContent = 'Error applying promo code';
            promoMessage.className = 'promo-message invalid-promo';
        }
    }

    // Add item to cart
    async function addToCart(cakeId, quantity = 1) {
        try {
            const response = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ cakeId, quantity })
            });
            
            if (!response.ok) throw new Error('Failed to add item to cart');
            
            const updatedCart = await response.json();
            cart.items = updatedCart.items;
            updateCartDisplay();
            updateNavCartCount();
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Error adding item to cart');
        }
    }

    // Remove item from cart
    async function removeFromCart(cakeId) {
        try {
            const response = await fetch(`/cart/remove/${cakeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to remove item');
            
            const updatedCart = await response.json();
            cart.items = updatedCart.items;
            updateCartDisplay();
            updateNavCartCount();
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Error removing item from cart');
        }
    }

    // Update item quantity
    async function updateQuantity(cakeId, newQuantity) {
        if (newQuantity < 1) return;
        
        try {
            const response = await fetch(`/cart/update/${cakeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update quantity');
            }
            
            const updatedCart = await response.json();
            cart.items = updatedCart.items;
            updateCartDisplay();
            updateNavCartCount();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert(error.message || 'Error updating quantity');
        }
    }

    // Update the cart display
    function updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        if (!cart.items || cart.items.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCartMessage.style.display = 'block';
            
            // Reset totals when cart is empty
            cart.subtotal = 0;
            cart.discountAmount = 0;
            cart.currentDiscount = null;
            cart.tax = 0;
            cart.shipping = 5;
            cart.total = 0;
            calculateCartTotals();
            return;
        }

        emptyCartMessage.style.display = 'none';
        
        let itemsHTML = '';
        cart.items.forEach(item => {
            const cake = item.cake_id;
            if (!cake) return;
            
            const stockWarning = item.quantity >= cake.stock ? 
                `<span class="stock-warning">Only ${cake.stock} left in stock!</span>` : '';
            
            itemsHTML += `
                <div class="card">
                    <div class="d-flex justify-content-between">
                        <h5>${cake.name}</h5>
                        <button onclick="removeFromCart('${cake._id}')" class="btn-danger">×</button>
                    </div>
                    <p class="item-price">$${item.price.toFixed(2)} each</p>
                    ${stockWarning}
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${cake._id}', ${item.quantity-1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${cake._id}', ${item.quantity+1})" ${item.quantity >= cake.stock ? 'disabled' : ''}>+</button>
                        <span class="ms-auto item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = itemsHTML;
        calculateCartTotals();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', function() {
            if (cart.items.length === 0) {
                alert('Your cart is empty. Please add items before checkout.');
                return;
            }
            
            // Convert cart to URL parameters
            const cartParams = new URLSearchParams();
            cartParams.append('items', JSON.stringify(cart.items));
            cartParams.append('subtotal', cart.subtotal);
            cartParams.append('tax', cart.tax);
            cartParams.append('shipping', cart.shipping);
            cartParams.append('total', cart.total);
            cartParams.append('discount', cart.discountAmount);
            if (cart.currentDiscount) {
                cartParams.append('promoCode', cart.currentDiscount.code);
            }

            // Redirect to checkout
            window.location.href = `checkout.html?${cartParams.toString()}`;
        });
        
        // Add promo code listener
        const applyPromoBtn = document.getElementById('apply-promo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent form submission
                applyPromoCode();
            });
        }
        
        // Also allow Enter key to apply promo
        const promoCodeInput = document.getElementById('promo-code');
        if (promoCodeInput) {
            promoCodeInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent form submission
                    applyPromoCode();
                }
            });
        }
    }