document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);

    if (!urlParams.has('items')) {
        window.location.href = 'checkout.html';
        return;
    }

    try {
        const cart = {
            items: JSON.parse(urlParams.get('items')),
            subtotal: parseFloat(urlParams.get('subtotal')),
            tax: parseFloat(urlParams.get('tax')),
            shipping: parseFloat(urlParams.get('shipping')),
            discount: parseFloat(urlParams.get('discount')) || 0,
            promoCode: urlParams.get('promoCode') || '',
            total: parseFloat(urlParams.get('total'))
            
        };

        displayOrderSummary(cart);
        setupEventListeners(cart);
    } catch (e) {
        console.error('Error parsing cart data:', e);
        window.location.href = 'checkout.html';
    }
});

function displayOrderSummary(cart) {
    const orderItemsContainer = document.getElementById('order-items');
    let itemsHTML = '';
    cart.items.forEach(item => {
        itemsHTML += `
            <div class="d-flex justify-content-between mb-2">
                <span>${item.quantity} x ${item.name}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    orderItemsContainer.innerHTML = itemsHTML;

    document.getElementById('subtotal').textContent = `$${cart.subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${cart.tax.toFixed(2)}`;
    document.getElementById('shipping').textContent = cart.shipping > 0 ? `$${cart.shipping.toFixed(2)}` : 'Free';
    document.getElementById('total').textContent = `$${cart.total.toFixed(2)}`;

    if (cart.discount > 0) {
        document.getElementById('discount-row').style.display = 'flex';
        document.getElementById('discount').textContent = `-$${cart.discount.toFixed(2)}`;
    }

    if (cart.promoCode) {
        const promoMessage = document.getElementById('promo-applied');
        promoMessage.style.display = 'block';
        promoMessage.textContent = `Promo applied: ${cart.promoCode}`;
    }
}

function setupEventListeners(cart) {
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function () {
            document.getElementById('credit-card-details').style.display = this.value === 'credit-card' ? 'block' : 'none';
        });
    });

    document.getElementById('shipping-method').addEventListener('change', function () {
        let shippingCost = 5;
        if (this.value === 'express') shippingCost = 12;
        if (this.value === 'same-day') shippingCost = 20;

        document.getElementById('shipping').textContent = `$${shippingCost.toFixed(2)}`;
        document.getElementById('total').textContent = `$${(cart.subtotal + cart.tax + shippingCost).toFixed(2)}`;
    });

    document.getElementById('checkout-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        clearAllErrors();

        if (validateForm()) {
            const orderData = {
                shipping_address: `${document.getElementById('first-name').value} ${document.getElementById('last-name').value}, ${document.getElementById('address').value}, ${document.getElementById('city').value}, ${document.getElementById('postal-code').value}`,
                shipping_method: document.getElementById('shipping-method').value,
                payment_method: 'cash_on_delivery',
                items: cart.items.map(item => ({
                    name: item.name,
                    cake_id: item.id || item._id,
                    quantity: parseInt(item.quantity),
                    price: parseFloat(item.price),
                    number_of_people: parseInt(item.number_of_people || 1)
                })),
                total_price: parseFloat(cart.total)
            };

            try {
                // Send order to server
                const response = await fetch('/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(orderData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to place order');
                }

                // Clear server-side cart
                const clearCartResponse = await fetch('/cart/clear', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!clearCartResponse.ok) {
                    console.error('Failed to clear server cart');
                }

                // Clear cart from localStorage
                localStorage.removeItem('cart');
                localStorage.removeItem('cartItems');
                
                // Update cart count in navbar
                const navCountElement = document.getElementById('nav-cart-count');
                if (navCountElement) {
                    navCountElement.textContent = '0';
                }
                
                // Redirect to home page
                window.location.href = 'home.html';
            } catch (error) {
                console.error('Error placing order:', error);
                showError('checkout-form', error.message || 'Failed to place order. Please try again.');
            }
        }
    });
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    let error = document.createElement('div');
    error.className = 'error-msg';
    error.innerText = message;
    field.parentNode.appendChild(error);
}

function clearAllErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.remove());
}

function validateForm() {
    let valid = true;

    const requiredFields = ['first-name', 'last-name', 'email', 'address', 'city', 'postal-code'];
    requiredFields.forEach(fieldId => {
        if (!document.getElementById(fieldId).value.trim()) {
            showError(fieldId, 'This field is required.');
            valid = false;
        }
    });

    if (!document.getElementById('shipping-method').value) {
        showError('shipping-method', 'Please select a shipping method.');
        valid = false;
    }

    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    if (paymentMethod === 'credit-card') {
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiryDate = document.getElementById('expiry-date').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        const cardName = document.getElementById('card-name').value.trim();

        const cardNumberRegex = /^\d{16}$/;
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const cvvRegex = /^\d{3}$/;
        const nameRegex = /^[A-Za-z\s]{2,}$/;

        if (!cardNumberRegex.test(cardNumber)) {
            showError('card-number', 'Enter a valid 16-digit card number.');
            valid = false;
        }

        if (!expiryRegex.test(expiryDate)) {
            showError('expiry-date', 'Enter date as MM/YY.');
            valid = false;
        } else {
            const [month, year] = expiryDate.split('/').map(Number);
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear() % 100;

            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                showError('expiry-date', 'Your card is expired.');
                valid = false;
            }
        }

        if (!cvvRegex.test(cvv)) {
            showError('cvv', 'Enter a valid 3-digit CVV.');
            valid = false;
        }

        if (!nameRegex.test(cardName)) {
            showError('card-name', 'Enter a valid name.');
            valid = false;
        }
    }

    return valid;
}
