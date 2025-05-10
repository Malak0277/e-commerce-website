document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/html/login.html';
        return;
    }

    loadStockLevels();
    setupEventListeners();
});

async function loadStockLevels() {
    try {
        const response = await fetch('/cake/stock-levels', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch stock levels');
        }

        const cakes = await response.json();
        displayStockLevels(cakes);
    } catch (error) {
        console.error('Error loading stock levels:', error);
        alert('Error loading stock levels: ' + error.message);
    }
}

function displayStockLevels(cakes) {
    const tableBody = document.getElementById('stock-table-body');
    tableBody.innerHTML = '';

    cakes.forEach(cake => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cake.cake_id}</td>
            <td>${cake.name}</td>
            <td>${cake.stock}</td>
            <td>
                <input type="number" 
                       class="form-control stock-input" 
                       value="${cake.stock}" 
                       min="0" 
                       data-cake-id="${cake._id}"
                       style="width: 100px">
            </td>
            <td>
                <button class="btn btn-sm btn-success save-btn" data-cake-id="${cake._id}">
                    Save
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function setupEventListeners() {
    // Save individual stock updates
    document.getElementById('stock-table-body').addEventListener('click', async (e) => {
        if (e.target.classList.contains('save-btn')) {
            const cakeId = e.target.dataset.cakeId;
            const input = document.querySelector(`.stock-input[data-cake-id="${cakeId}"]`);
            const newStock = parseInt(input.value);

            if (isNaN(newStock) || newStock < 0) {
                alert('Please enter a valid stock number');
                return;
            }

            try {
                const response = await fetch('/cake/update-stock', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        stockUpdates: [{
                            cake_id: cakeId,
                            stock: newStock
                        }]
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to update stock');
                }

                alert('Stock updated successfully');
                loadStockLevels(); // Refresh the table
            } catch (error) {
                console.error('Error updating stock:', error);
                alert('Error updating stock: ' + error.message);
            }
        }
    });

    // Save all changes
    document.getElementById('save-all-btn').addEventListener('click', async () => {
        const inputs = document.querySelectorAll('.stock-input');
        const stockUpdates = Array.from(inputs).map(input => ({
            cake_id: input.dataset.cakeId,
            stock: parseInt(input.value)
        }));

        try {
            const response = await fetch('/cake/update-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ stockUpdates })
            });

            if (!response.ok) {
                throw new Error('Failed to update stocks');
            }

            alert('All stock levels updated successfully');
            loadStockLevels(); // Refresh the table
        } catch (error) {
            console.error('Error updating stocks:', error);
            alert('Error updating stocks: ' + error.message);
        }
    });
} 