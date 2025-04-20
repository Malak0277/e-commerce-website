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
        updateCartDisplay();
        setupEventListeners();
    });
     // Add this function to handle promo codes
     function applyPromoCode() {
        const promoCodeInput = document.getElementById('promo-code');
        const promoMessage = document.getElementById('promo-message');
        const code = promoCodeInput.value.trim().toUpperCase();
        
        if (!code) {
            promoMessage.textContent = 'Please enter a promo code';
            promoMessage.className = 'promo-message invalid-promo';
            return;
        }
        
        if (promoCodes[code]) {
            cart.promoCode = code;
            promoMessage.textContent = promoCodes[code].description;
            promoMessage.className = 'promo-message valid-promo';
            updateCartTotals();
        } else {
            cart.promoCode = null;
            promoMessage.textContent = 'Invalid promo code';
            promoMessage.className = 'promo-message invalid-promo';
            updateCartTotals();
        }
    }

    // Add item to cart 
    function addToCart(productId, quantity = 1) {
        // have a products database
        const sampleProducts = {
            'cake001': { id: 'cake001', name: 'Birthday Chocolate Cake', price: 45.99 },
            'cake002': { id: 'cake002', name: 'Vanilla Wedding Cake', price: 39.99 }
        };
        
        const product = sampleProducts[productId];
        if (!product) return;

        const existingItem = cart.items.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }
        updateCartTotals();
    }

    // Remove item from cart
    function removeFromCart(productId) {
        cart.items = cart.items.filter(item => item.id !== productId);
        updateCartTotals();
    }

    // Update item quantity
    function updateQuantity(productId, newQuantity) {
        const item = cart.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            updateCartTotals();
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
                            <h5>${item.name}</h5>
                            <button onclick="removeFromCart('${item.id}')" class="btn btn-sm btn-danger">x</button>
                        </div>
                        <p>$${item.price.toFixed(2)} each</p>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity('${item.id}', ${item.quantity-1})" class="btn btn-sm btn-outline-secondary">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity('${item.id}', ${item.quantity+1})" class="btn btn-sm btn-outline-secondary">+</button>
                            <span class="ms-auto">$${(item.price * item.quantity).toFixed(2)}</span>
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
            <div class="card mt-3">
                <h5>TESTTTTTTTTT</h5>
                <button onclick="addToCart('cake001', 1)" class="btn btn-sm btn-primary me-2">Add Cake 1</button>
                <button onclick="addToCart('cake002', 1)" class="btn btn-sm btn-primary">Add Cake 2</button>
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