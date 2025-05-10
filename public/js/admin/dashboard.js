// Fetch and display dashboard statistics
async function fetchDashboardStats() {
  try {
    // Fetch statistics from different endpoints
    const [ordersRes, usersRes, productsRes] = await Promise.all([
      fetch('/order', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }),
      fetch('/user', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }),
      fetch('/cake', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
    ]);

    // Process the responses
    const orders = await ordersRes.json();
    const users = await usersRes.json();
    const products = await productsRes.json();

    // Calculate statistics
    const stats = {
      totalOrders: orders.total || orders.length || 0,
      totalUsers: users.length || 0,
      totalProducts: products.length || 0,
      lowStock: products.filter(p => (p.stock || 0) <= 10).length || 0
    };

    // Update the UI
    displayDashboardStats(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Fall back to demo data if real data fetch fails
    displayDashboardStats({
      totalOrders: 128,
      totalUsers: 54,
      totalProducts: 32,
      lowStock: 3
    });
  }
}

// Display dashboard statistics in the stat cards
function displayDashboardStats(stats) {
  document.getElementById('totalOrders').textContent = stats.totalOrders;
  document.getElementById('totalUsers').textContent = stats.totalUsers;
  document.getElementById('totalProducts').textContent = stats.totalProducts;
  document.getElementById('lowStock').textContent = stats.lowStock;
}

async function fetchRecentOrders() {
  try {
    const response = await fetch('/order', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const orders = await response.json();
    // Sort by createdAt descending and take the first 5
    const recentOrders = orders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map(order => ({
        _id: order._id,
        user: order.user_id, // Make sure user_id is populated!
        createdAt: order.created_at,
        total: order.total_price,
        status: order.status
      }));
    displayRecentOrders(recentOrders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    // fallback...
  }
}

// Display recent orders in the dashboard table
function displayRecentOrders(orders) {
  const tableBody = document.getElementById('recentOrdersTable');
  tableBody.innerHTML = '';
  
  // Show only the 5 most recent orders
  const recentOrders = orders.slice(0, 5);
  
  recentOrders.forEach(order => {
    const row = document.createElement('tr');
    
    // Prepare customer name - handle possible different data structures
    let customerName = 'N/A';
    if (order.user) {
      if (order.user.first_name || order.user.last_name) {
        customerName = `${order.user.first_name || ''} ${order.user.last_name || ''}`.trim();
      } else if (order.user.name) {
        customerName = order.user.name;
      } else if (order.user.email) {
        customerName = order.user.email;
      }
    } else if (order.customerName) {
      customerName = order.customerName;
    }
    
    // Format date
    const orderDate = order.createdAt || order.date || 'N/A';
    const formattedDate = orderDate !== 'N/A' ? new Date(orderDate).toLocaleDateString() : 'N/A';
    
    // Format order ID
    const orderId = order._id || order.id || 'N/A';
    
    row.innerHTML = `
      <td>#${orderId}</td>
      <td>${customerName}</td>
      <td>${formattedDate}</td>
      <td>${order.total?.toFixed(2) || 0} EGP</td>
      <td><span class="order-status status-${(order.status || 'pending').toLowerCase()}">${order.status || 'Pending'}</span></td>
    `;
    tableBody.appendChild(row);
  });
}

// Initialize dashboard with real-time data
async function initializeDashboard() {
  try {
    // Show loading indicators if needed
    document.querySelectorAll('.stats-card .stats-number').forEach(el => {
      el.textContent = '...';
    });
    
    // Fetch data in parallel
    await Promise.all([
      fetchDashboardStats(),
      fetchRecentOrders()
    ]);
    
  } catch (error) {
    console.error('Dashboard initialization error:', error);
  }
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeDashboard();
  
  // Set up refresh button if it exists
  const refreshBtn = document.getElementById('refreshDashboard');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', initializeDashboard);
  }
});