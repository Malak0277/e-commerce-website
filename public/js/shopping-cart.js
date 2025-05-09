      // Get the promo code input field and apply button
      const promoCodes = {
        'SWEET10': { type: 'percentage', value: 10, description: '10% off your order' },
        'FREESHIP': { type: 'shipping', value: 0, description: 'Free shipping' },
        'CAKE20': { type: 'fixed', value: 20, description: '$20 off your order' }
    };
    // Cart data structure
    let cart = {
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 5,
        total: 0
    };

    // Initialize the cart page
    document.addEventListener('DOMContentLoaded', function() {
        loadCart();
        setupEventListeners();
    });
    
    // Load cart from API
    async function loadCart() {
        try {
            const response = await fetch('/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to load cart');
            
            const cartData = await response.json();
            cart.items = cartData.items || [];
            updateCartDisplay();
            updateNavCartCount();
        } catch (error) {
            console.error('Error loading cart:', error);
            alert('Error loading cart');
        }
    }

    // Save cart to localStorage
    function saveCartToStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cart.items));
        updateNavCartCount();
    }

    // Update the cart count in the navigation
    function updateNavCartCount() {
        const count = cart.items.reduce((total, item) => total + item.quantity, 0);
        const navCountElement = document.getElementById('nav-cart-count');
        if (navCountElement) {
            navCountElement.textContent = count;
        }
    }

     // Add this function to handle promo codes
     async function applyPromoCode() {
        const promoCodeInput = document.getElementById('promo-code');
        const promoMessage = document.getElementById('promo-message');
        const code = promoCodeInput.value.trim().toUpperCase();
        
        if (!code) {
            promoMessage.textContent = 'Please enter a promo code';
            promoMessage.className = 'promo-message invalid-promo';
            return;
        }
        
        try {
            const response = await fetch('/cart/apply-discount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ code })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Invalid promo code');
            }
            
            const updatedCart = await response.json();
            cart.items = updatedCart.items;
            cart.discountCode = updatedCart.discountCode;
            cart.discountAmount = updatedCart.discountAmount;
            
            promoMessage.textContent = 'Promo code applied successfully!';
            promoMessage.className = 'promo-message valid-promo';
            updateCartDisplay();
        } catch (error) {
            console.error('Error applying promo code:', error);
            promoMessage.textContent = error.message || 'Invalid promo code';
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
        try {
            const response = await fetch(`/cart/update/${cakeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });
            
            if (!response.ok) throw new Error('Failed to update quantity');
            
            const updatedCart = await response.json();
            cart.items = updatedCart.items;
            updateCartDisplay();
            updateNavCartCount();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Error updating quantity');
        }
    }

    // Calculate cart totals
      function updateCartTotals() {
        cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.tax = cart.subtotal * 0.05;
        cart.shipping = cart.subtotal > 100 ? 0 : 5;
        
        // Reset discount
        cart.discount = 0;
        
        // Apply promo code if valid
        if (cart.promoCode && promoCodes[cart.promoCode]) {
            const promo = promoCodes[cart.promoCode];
            
            if (promo.type === 'percentage') {
                cart.discount = (cart.subtotal * promo.value) / 100;
            } 
            else if (promo.type === 'fixed') {
                cart.discount = promo.value;
            }
            else if (promo.type === 'shipping') {
                cart.shipping = 0;
            }
        }
        
        cart.total = cart.subtotal + cart.tax + cart.shipping - cart.discount;
        updateCartDisplay();
    }

    // Update the cart display
    function updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            
            let itemsHTML = '';
            cart.items.forEach(item => {
                itemsHTML += `
                    <div class="card">
                        <div class="d-flex justify-content-between">
                            <h5>${item.cake_id.name}</h5>
                            <button onclick="removeFromCart('${item.cake_id._id}')" class="btn-danger">×</button>
                        </div>
                        <p class="item-price">$${item.price.toFixed(2)} each</p>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity('${item.cake_id._id}', ${item.quantity-1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity('${item.cake_id._id}', ${item.quantity+1})">+</button>
                            <span class="ms-auto item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                `;
            });
            
            cartItemsContainer.innerHTML = itemsHTML;
        }
         // Update discount display
         if (cart.discount > 0) {
            document.getElementById('discount-row').style.display = 'flex';
            document.getElementById('discount').textContent = `-$${cart.discount.toFixed(2)}`;
        } else {
            document.getElementById('discount-row').style.display = 'none';
        }
        
        // Update summary
        document.getElementById('subtotal').textContent = `$${cart.subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${cart.tax.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${cart.shipping.toFixed(2)}`;
        document.getElementById('total').textContent = `$${cart.total.toFixed(2)}`;
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
            
            // Redirect to checkout 7ta el data fe url till ma n3ml db don't change it 3shan man5sarsh b3d
            window.location.href = `checkout.html?${cartParams.toString()}`;
        });
        
        // testing 
        const demoButtons = `
            <div class="card demo-card mt-3">
                <h5> products </h5>
                <div class="demo-buttons">
                    <button onclick="addToCart('cake001', 1)" class="btn-main demo-btn">Add Chocolate Cake</button>
                    <button onclick="addToCart('cake002', 1)" class="btn-main demo-btn">Add Wedding Cake</button>
                    
                </div>
            </div>
        `;
        document.getElementById('cart-items').insertAdjacentHTML('beforeend', demoButtons);
        // Add promo code listener
        document.getElementById('apply-promo').addEventListener('click', applyPromoCode);
        
        // Also allow Enter key to apply promo
        document.getElementById('promo-code').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }