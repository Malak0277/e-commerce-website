// Demo data 
const demoOrders = [
  { id: 1012, customerName: 'Sarah Ali', date: '2024-05-01', total: 350, status: 'Pending',
    items: [
      { name: 'Birthday Cake', price: 200, quantity: 1 },
      { name: 'Cupcakes', price: 50, quantity: 3 }
    ],
    customerEmail: 'sarah@example.com', customerPhone: '01012345678',
    shippingAddress: '123 Nile St', shippingCity: 'Tanta', shippingPostalCode: '31511',
    notes: 'Please deliver after 5pm.'
  },
  { id: 1011, customerName: 'Ahmed Hassan', date: '2024-04-29', total: 120, status: 'Delivered',
    items: [
      { name: 'Minis', price: 40, quantity: 3 }
    ],
    customerEmail: 'ahmed@example.com', customerPhone: '01087654321',
    shippingAddress: '45 Corniche', shippingCity: 'Tanta', shippingPostalCode: '31512',
    notes: ''
  },
  { id: 1010, customerName: 'Mona Youssef', date: '2024-04-28', total: 220, status: 'Processing',
    items: [
      { name: 'Wedding Cake', price: 220, quantity: 1 }
    ],
    customerEmail: 'mona@example.com', customerPhone: '01011223344',
    shippingAddress: '12 El Galaa', shippingCity: 'Tanta', shippingPostalCode: '31513',
    notes: 'Add extra flowers.'
  }
];

function fetchOrders() {
  const tableBody = document.getElementById('ordersTable');
  tableBody.innerHTML = '';
  demoOrders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>#${order.id}</td>
      <td>${order.customerName}</td>
      <td>${new Date(order.date).toLocaleDateString()}</td>
      <td>$${order.total.toFixed(2)}</td>
      <td><span class="order-status status-${order.status.toLowerCase()}">${order.status}</span></td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="viewOrderDetails(${order.id})">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-sm btn-success" onclick="printOrder(${order.id})">
          <i class="fas fa-print"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function viewOrderDetails(orderId) {
  const order = demoOrders.find(o => o.id === orderId);
  if (!order) return;
  document.getElementById('modalOrderId').textContent = order.id;
  document.getElementById('customerInfo').innerHTML = `
    <strong>Name:</strong> ${order.customerName}<br>
    <strong>Email:</strong> ${order.customerEmail}<br>
    <strong>Phone:</strong> ${order.customerPhone}
  `;
  document.getElementById('shippingInfo').innerHTML = `
    <strong>Address:</strong> ${order.shippingAddress}<br>
    <strong>City:</strong> ${order.shippingCity}<br>
    <strong>Postal Code:</strong> ${order.shippingPostalCode}
  `;
  const itemsTable = document.getElementById('orderItemsTable');
  itemsTable.innerHTML = '';
  order.items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
    `;
    itemsTable.appendChild(row);
  });
  document.getElementById('orderNotes').value = order.notes || '';
  document.getElementById('orderStatus').value = order.status.toLowerCase();
  new bootstrap.Modal(document.getElementById('orderDetailsModal')).show();
}

document.getElementById('saveOrderChanges').addEventListener('click', () => {
  // For demo, just close modal and refresh table
  bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal')).hide();
  fetchOrders();
});

function printOrder(orderId) {
  alert('Print functionality is not available ');
}

document.getElementById('exportOrders').addEventListener('click', () => {
  alert('Export functionality is not available ');
});

document.getElementById('searchOrder').addEventListener('input', filterOrders);
document.getElementById('statusFilter').addEventListener('change', filterOrders);
document.getElementById('dateFilter').addEventListener('change', filterOrders);

function filterOrders() {
  const searchTerm = document.getElementById('searchOrder').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const dateFilter = document.getElementById('dateFilter').value;
  const rows = document.getElementById('ordersTable').getElementsByTagName('tr');
  Array.from(rows).forEach(row => {
    const orderId = row.cells[0].textContent.toLowerCase();
    const customer = row.cells[1].textContent.toLowerCase();
    const date = row.cells[2].textContent;
    const status = row.cells[4].textContent.trim().toLowerCase();
    const matchesSearch = orderId.includes(searchTerm) || customer.includes(searchTerm);
    const matchesStatus = !statusFilter || status === statusFilter.toLowerCase();
    const matchesDate = !dateFilter || date === new Date(dateFilter).toLocaleDateString();
    row.style.display = matchesSearch && matchesStatus && matchesDate ? '' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchOrders();
});



