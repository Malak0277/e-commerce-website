// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format currency for display
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Get status badge HTML
function getStatusBadge(status) {
  const badgeClasses = {
    'pending': 'bg-warning',
    'processing': 'bg-info',
    'shipped': 'bg-primary',
    'delivered': 'bg-success',
    'cancelled': 'bg-danger'
  };
  
  return `<span class="badge ${badgeClasses[status] || 'bg-secondary'}">${status}</span>`;
}

// Fetch and display all orders
async function displayOrders() {
  const tbody = document.getElementById('ordersTable');
  tbody.innerHTML = '';
  const search = document.getElementById('searchOrder').value.toLowerCase();
  const dateFilter = document.getElementById('dateFilter').value;

  try {
    const res = await fetch('/order', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    
    const orders = await res.json();

    // Filter orders based on search and date
    const filteredOrders = orders.filter(order => {
      const matchesSearch = 
        order.order_number.toString().includes(search) ||
        (order.shipping_address?.toLowerCase() || '').includes(search);
      
      const matchesDate = !dateFilter || 
        new Date(order.created_at).toISOString().substring(0, 10) === dateFilter;
      
      return matchesSearch && matchesDate;
    });

    // Sort orders by created_at (newest first)
    filteredOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Populate the table
    filteredOrders.forEach(order => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#${order.order_number}</td>
        <td>${order.user_id.first_name}</td>
        <td>${formatDate(order.created_at)}</td>
        <td>${formatCurrency(order.total_price)}</td>
        <td>${order.payment_method.replace(/_/g, ' ')}</td>
        <td class="action-buttons">
          <button class="btn btn-sm btn-info" onclick="viewOrderDetails('${order._id}')">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-warning" onclick="updateOrderStatus('${order._id}', '${order.status}')">
            <i class="fas fa-edit"></i> ${order.status}
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    alert('Failed to fetch orders: ' + error.message);
  }
}

// View order details
window.viewOrderDetails = async function(id) {
  try {
    const res = await fetch(`/order/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    
    const order = await res.json();
    
    // Populate modal with order details
    document.getElementById('modalOrderId').textContent = order.order_number;
    
    // Customer info will need to be fetched separately if not included in the order data
    document.getElementById('customerInfo').textContent = `
      ID: ${order.user_id}
      Order Date: ${formatDate(order.created_at)}
      Status: ${order.status}
    `;
    
    document.getElementById('shippingInfo').textContent = order.shipping_address;
    
    // Populate order items table
    const itemsTable = document.getElementById('orderItemsTable');
    itemsTable.innerHTML = '';
    
    order.items.forEach(item => {
      const tr = document.createElement('tr');
      const cakeName = item.cake_id.name || 'Product';
      
      tr.innerHTML = `
        <td>
          ${cakeName}
          <br>
          <small>For ${item.number_of_people} people</small>
        </td>
        <td>${formatCurrency(item.price)}</td>
        <td>${item.quantity}</td>
        <td>${formatCurrency(item.price * item.quantity)}</td>
      `;
      itemsTable.appendChild(tr);
    });
    
    // Clear any previous notes
    document.getElementById('orderNotes').value = order.notes || '';
    
    // Show the modal
    new bootstrap.Modal(document.getElementById('orderDetailsModal')).show();
  } catch (error) {
    console.error('Error loading order details:', error);
    alert('Failed to load order details: ' + error.message);
  }
};

// Update order status
window.updateOrderStatus = async function(id, currentStatus) {
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  // Create status selection dropdown
  const selectHtml = statuses.map(status => 
    `<option value="${status}" ${status === currentStatus ? 'selected' : ''}>${status}</option>`
  ).join('');
  
  const newStatus = prompt(`Update order status:`, currentStatus);
  if (!newStatus || newStatus === currentStatus) return;
  
  if (!statuses.includes(newStatus)) {
    alert(`Invalid status. Please choose from: ${statuses.join(', ')}`);
    return;
  }
  
  try {
    const res = await fetch(`/order/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    
    // Refresh order list after successful update
    displayOrders();
  } catch (error) {
    console.error('Error updating order status:', error);
    alert('Failed to update order status: ' + error.message);
  }
};

// Save order changes (notes and potentially other editable fields)
document.getElementById('saveOrderChanges').addEventListener('click', async () => {
  const orderId = document.getElementById('modalOrderId').textContent;
  const notes = document.getElementById('orderNotes').value;
  
  try {
    // This endpoint would need to be implemented on the backend
    await fetch(`/order/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ notes })
    });
    
    bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal')).hide();
    displayOrders();
  } catch (error) {
    console.error('Error updating order:', error);
    alert('Failed to update order: ' + error.message);
  }
});

// Export orders functionality
document.getElementById('exportOrders').addEventListener('click', async () => {
  try {
    const res = await fetch('/order', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    
    const orders = await res.json();
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Customer ID,Date,Total,Payment Method,Status,Shipping Address\n";
    
    orders.forEach(order => {
      csvContent += `${order.order_number},`;
      csvContent += `${order.user_id},`;
      csvContent += `"${formatDate(order.created_at)}",`;
      csvContent += `${order.total_price},`;
      csvContent += `${order.payment_method},`;
      csvContent += `${order.status},`;
      csvContent += `"${order.shipping_address.replace(/"/g, '""')}"\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting orders:', error);
    alert('Failed to export orders: ' + error.message);
  }
});

// Filter/search functionality
document.getElementById('searchOrder').addEventListener('input', displayOrders);
document.getElementById('dateFilter').addEventListener('change', displayOrders);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  displayOrders();
  
  // Check authorization on page load
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../login.html';
    alert('Please login to access admin panel');
  }
});