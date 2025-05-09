// Demo data for dashboard stats
const demoStats = {
  totalOrders: 128,
  totalUsers: 54,
  totalProducts: 32,
  lowStock: 3
};

// Demo data for recent orders
const demoOrders = [
  { id: 1012, customerName: 'Sarah Ali', date: '2024-05-01', total: 350, status: 'Pending' },
  { id: 1011, customerName: 'Ahmed Hassan', date: '2024-04-29', total: 120, status: 'Delivered' },
  { id: 1010, customerName: 'Mona Youssef', date: '2024-04-28', total: 220, status: 'Processing' },
  { id: 1009, customerName: 'Omar Fathy', date: '2024-04-27', total: 180, status: 'Shipped' },
  { id: 1008, customerName: 'Laila Samir', date: '2024-04-26', total: 90, status: 'Cancelled' }
];

// Display dashboard statistics in the stat cards
function displayDashboardStats() {
  document.getElementById('totalOrders').textContent = demoStats.totalOrders;
  document.getElementById('totalUsers').textContent = demoStats.totalUsers;
  document.getElementById('totalProducts').textContent = demoStats.totalProducts;
  document.getElementById('lowStock').textContent = demoStats.lowStock;
}

// Display recent orders in the dashboard table
function displayRecentOrders() {
  const tableBody = document.getElementById('recentOrdersTable');
  tableBody.innerHTML = '';
  demoOrders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>#${order.id}</td>
      <td>${order.customerName}</td>
      <td>${new Date(order.date).toLocaleDateString()}</td>
      <td>$${order.total.toFixed(2)}</td>
      <td><span class="order-status status-${order.status.toLowerCase()}">${order.status}</span></td>
    `;
    tableBody.appendChild(row);
  });
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
  displayDashboardStats();
  displayRecentOrders();
});
