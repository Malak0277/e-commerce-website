async function displayPromotions() {
  const tbody = document.getElementById('promosTable');
  tbody.innerHTML = '';
  const search = document.getElementById('searchPromo').value.toLowerCase();

  try {
    const res = await fetch('/discount', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();

    data.filter(p => {
      const matchesSearch =
        p.code.toLowerCase().includes(search)
      return matchesSearch;
    }).forEach(promo => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${promo.code}</td>
        <td>${promo.description}</td>
        <td>${promo.percentage + '% EGP'}</td>
        <td>${promo.expiry ? promo.expiry.split('T')[0] : ''}</td>
        <td class="action-buttons">
          <button class="btn btn-sm btn-info" onclick="editPromo('${promo._id}')"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deletePromo('${promo._id}')"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    alert('Failed to fetch promotions'+error);
  }
}

document.getElementById('addPromotionBtn').addEventListener('click', () => {
  document.getElementById('promoForm').reset();
  document.getElementById('promoId').value = '';
  document.getElementById('promoModalTitle').textContent = 'Add Promotion';
  new bootstrap.Modal(document.getElementById('promoModal')).show();
});

document.getElementById('savePromo').addEventListener('click', async () => {
  const id = document.getElementById('promoId').value;
  const code = document.getElementById('promoCode').value;
  const description = document.getElementById('promoDescription').value;
  const discount = parseFloat(document.getElementById('promoDiscount').value);
  const endDate = document.getElementById('promoEnd').value;

  const payload = { code, percentage:discount, expiry:endDate };

  try {
    if (id) {
      // Edit
      await fetch(`/discount/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
    } else {
      // Add
      await fetch('/discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
    }

    bootstrap.Modal.getInstance(document.getElementById('promoModal')).hide();
    displayPromotions();
  } catch (error) {
    console.error('Error saving promotion:', error);
    alert('Failed to save promotion');
  }
});



window.editPromo = async function (id) {
  try {
    const res = await fetch(`/discount/${id}`, {
      headers: {  'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const promo = await res.json();
    if (!promo) return;

    document.getElementById('promoId').value = promo._id;
    document.getElementById('promoCode').value = promo.code;
    document.getElementById('promoDescription').value = '-';
    document.getElementById('promoDiscount').value = promo.percentage;
    document.getElementById('promoEnd').value = promo.expiry?.split('T')[0] || '';

    document.getElementById('promoModalTitle').textContent = 'Edit Promotion';
    new bootstrap.Modal(document.getElementById('promoModal')).show();
  } catch (error) {
    console.error('Error loading promotion:', error);
  }
};

// Delete a promotion by ID
window.deletePromo = async function (id) {
  if (confirm('Are you sure you want to delete this promotion?')) {
    try {
      await fetch(`/discount/${id}`, {
        method: 'DELETE',
        headers: {  'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      displayPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      alert('Failed to delete promotion');
    }
  }
};

// Delete promotion from modal
document.getElementById('deletePromo').addEventListener('click', () => {
  const id = document.getElementById('promoId').value;
  if (id) {
    window.deletePromo(id);
    bootstrap.Modal.getInstance(document.getElementById('promoModal')).hide();
  }
});

// Filter/search
document.getElementById('searchPromo').addEventListener('input', displayPromotions);

// Export button placeholder
document.getElementById('exportPromos').addEventListener('click', () => {
  alert('Export functionality is not available');
});

// Init
document.addEventListener('DOMContentLoaded', () => {
  displayPromotions();
});
