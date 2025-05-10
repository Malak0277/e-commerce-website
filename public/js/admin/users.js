// Demo data for users
let users = [
  {
    id: 1,
    name: 'Sarah Ali',
    email: 'sarah@example.com',
    role: 'admin',
    joinedDate: '2024-04-01'
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    role: 'user',
    joinedDate: '2024-04-10'
  },
  {
    id: 3,
    name: 'Mona Youssef',
    email: 'mona@example.com',
    role: 'user',
    joinedDate: '2024-03-15'
  }
];

// Display the users in the table, applying search, role, and status filters
function displayUsers() {
  const tbody = document.getElementById('usersTable');
  tbody.innerHTML = '';
  const search = document.getElementById('searchUser').value.toLowerCase();
  const role = document.getElementById('roleFilter').value;
  users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search);
    const matchesRole = !role || u.role === role;
 
    return matchesSearch && matchesRole;
  }).forEach(user => {

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><span class="user-role role-${user.role}">${capitalize(user.role)}</span></td>
      <td>${user.joinedDate}</td>
      <td class="action-buttons">
        <button class="btn btn-sm btn-info" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Capitalize the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Open the edit user modal and populate fields
window.editUser = function(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;
  document.getElementById('userId').value = user.id;
  document.getElementById('userName').value = user.name;
  document.getElementById('userEmail').value = user.email;
  document.getElementById('userRole').value = user.role;
  document.getElementById('userPassword').value = '';
  new bootstrap.Modal(document.getElementById('userDetailsModal')).show();
};

// Save user changes or add a new user (demo only)
document.getElementById('saveUserChanges').addEventListener('click', () => {
  const id = document.getElementById('userId').value;
  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;
  const role = document.getElementById('userRole').value;
  // Password is not handled in demo
  if (id) {
    // Edit
    const idx = users.findIndex(u => u.id == id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], name, email, role };
    }
  } else {
    // Add
    const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    users.push({ id: newId, name, email, role, joinedDate: new Date().toISOString().slice(0,10) });
  }
  bootstrap.Modal.getInstance(document.getElementById('userDetailsModal')).hide();
  displayUsers();
});

// Delete a user by ID (demo only)
window.deleteUser = function(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    users = users.filter(u => u.id !== id);
    displayUsers();
  }
};

// Delete user from modal (demo only)
document.getElementById('deleteUser').addEventListener('click', () => {
  const id = document.getElementById('userId').value;
  if (id) {
    window.deleteUser(Number(id));
    bootstrap.Modal.getInstance(document.getElementById('userDetailsModal')).hide();
  }
});

// Filter/search event listeners
document.getElementById('searchUser').addEventListener('input', displayUsers);
document.getElementById('roleFilter').addEventListener('change', displayUsers);

// Export button (demo only)
document.getElementById('exportUsers').addEventListener('click', () => {
  alert('Export functionality is not available in demo mode.');
});

// Initialize table on page load
document.addEventListener('DOMContentLoaded', () => {
  displayUsers();
});
