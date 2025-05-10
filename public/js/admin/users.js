async function displayUsers() {
  const tbody = document.getElementById('usersTable');
  tbody.innerHTML = '';
  const search = document.getElementById('searchUser').value.toLowerCase();
  const roleFilter = document.getElementById('roleFilter').value.toLowerCase();

  try {
    const res = await fetch('/user', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();

    data.filter(u => {
      const matchesSearch = 
        (u.first_name?.toLowerCase() || '').includes(search) || 
        (u.last_name?.toLowerCase() || '').includes(search) || 
        u.email.toLowerCase().includes(search);
      const matchesRole = !roleFilter || 
        (roleFilter === 'admin' && u.isAdmin) || 
        (roleFilter === 'user' && !u.isAdmin);
      return matchesSearch && matchesRole;
    }).forEach(user => {
      const tr = document.createElement('tr');
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A';
      const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
      
      tr.innerHTML = `
        <td>${user._id}</td>
        <td>${fullName}</td>
        <td>${user.email}</td>
        <td>
          <span class="user-role ${user.isAdmin ? 'role-admin' : 'role-user'}">
            ${user.isAdmin ? 'Admin' : 'User'}
          </span>
        </td>
        <td>${joinDate}</td>
        <td class="action-buttons">
          <button class="btn btn-sm btn-info" onclick="editUser('${user._id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    alert('Failed to fetch users: ' + error);
  }
}

window.editUser = async function(id) {
  try {
    const res = await fetch(`/user/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const user = await res.json();
    if (!user) return;
    
    document.getElementById('userId').value = user._id;
    document.getElementById('userName').value = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.isAdmin ? 'admin' : 'user';
    document.getElementById('userPassword').value = '';
    
    new bootstrap.Modal(document.getElementById('userDetailsModal')).show();
  } catch (error) {
    console.error('Error loading user details:', error);
    alert('Failed to load user details');
  }
};

window.deleteUser = async function(id) {
  if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    try {
      await fetch(`/user/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      displayUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  }
};

document.getElementById('saveUserChanges').addEventListener('click', async () => {
  const id = document.getElementById('userId').value;
  const fullName = document.getElementById('userName').value.trim();
  const nameParts = fullName.split(' ');
  const first_name = nameParts[0] || '';
  const last_name = nameParts.slice(1).join(' ') || '';
  const email = document.getElementById('userEmail').value;
  const isAdmin = document.getElementById('userRole').value === 'admin';
  const password = document.getElementById('userPassword').value;
  
  const payload = { 
    first_name,
    last_name,
    email,
    isAdmin
  };
  
  // Only include password if it was entered
  if (password) {
    payload.password = password;
  }

  try {
    await fetch(`/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });
    
    bootstrap.Modal.getInstance(document.getElementById('userDetailsModal')).hide();
    displayUsers();
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Failed to update user');
  }
});

document.getElementById('deleteUser').addEventListener('click', () => {
  const id = document.getElementById('userId').value;
  if (id) {
    window.deleteUser(id);
    bootstrap.Modal.getInstance(document.getElementById('userDetailsModal')).hide();
  }
});

// Filter/search functionality
document.getElementById('searchUser').addEventListener('input', displayUsers);
document.getElementById('roleFilter').addEventListener('change', displayUsers);

// Export button placeholder
document.getElementById('exportUsers').addEventListener('click', () => {
  alert('Export functionality is not available');
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  displayUsers();
});