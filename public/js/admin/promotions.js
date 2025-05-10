// Demo data for promotions
let promotions = [
  {
    id: 1,
    code: 'WELCOME10',
    description: '10% off for new users',
    discount: 10,
    end: '2024-06-01'
  },
  {
    id: 2,
    code: 'EID20',
    description: 'Eid special 20% off',
    discount: 20,
    end: '2024-06-20'
  },
];

// Display the promotions in the table, applying search, status, and date filters
function displayPromotions() {
  const tbody = document.getElementById('promosTable');
  tbody.innerHTML = '';
  const search = document.getElementById('searchPromo').value.toLowerCase();
 
  
  promotions.filter(p => {
    const matchesSearch = p.code.toLowerCase().includes(search) || p.description.toLowerCase().includes(search);
  
  
    return matchesSearch ;
  }).forEach(promo => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${promo.code}</td>
      <td>${promo.description}</td>
      <td>${ promo.discount + '%'  + ' EGP'}</td>
      <td>${promo.end}</td>
      <td class="action-buttons">
        <button class="btn btn-sm btn-info" onclick="editPromo(${promo.id})"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deletePromo(${promo.id})"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Capitalize the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Open the edit promotion modal and populate fields
window.editPromo = function(id) {
  const promo = promotions.find(p => p.id === id);
  if (!promo) return;
  document.getElementById('promoId').value = promo.id;
  document.getElementById('promoCode').value = promo.code;
  document.getElementById('promoDescription').value = promo.description;
  document.getElementById('promoDiscount').value = promo.discount;
 
  document.getElementById('promoEnd').value = promo.end;

  document.getElementById('promoModalTitle').textContent = 'Edit Promotion';
  new bootstrap.Modal(document.getElementById('promoModal')).show();
};

// Add Promotion button event: open modal for new promo
document.getElementById('addPromotionBtn').addEventListener('click', () => {
  document.getElementById('promoForm').reset();
  document.getElementById('promoId').value = '';
  document.getElementById('promoModalTitle').textContent = 'Add Promotion';
  new bootstrap.Modal(document.getElementById('promoModal')).show();
});

// Save promotion changes or add a new promotion (demo only)
document.getElementById('savePromo').addEventListener('click', () => {
  const id = document.getElementById('promoId').value;
  const code = document.getElementById('promoCode').value;
  const description = document.getElementById('promoDescription').value;
  const discount = parseFloat(document.getElementById('promoDiscount').value);
 
  const end = document.getElementById('promoEnd').value;
 
  if (id) {
    // Edit
    const idx = promotions.findIndex(p => p.id == id);
    if (idx !== -1) {
      promotions[idx] = { ...promotions[idx], code, description, discount, end };  // copies the existing object.
    }
  } else {
    // Add
    const newId = promotions.length ? Math.max(...promotions.map(p => p.id)) + 1 : 1;
    promotions.push({ id: newId, code, description, discount, end });
  }
  bootstrap.Modal.getInstance(document.getElementById('promoModal')).hide();
  displayPromotions();
});

// Delete a promotion by ID (demo only)
window.deletePromo = function(id) {
  if (confirm('Are you sure you want to delete this promotion?')) {
    promotions = promotions.filter(p => p.id !== id);
    displayPromotions();
  }
};

// Delete promotion from modal (demo only)
document.getElementById('deletePromo').addEventListener('click', () => {
  const id = document.getElementById('promoId').value;
  if (id) {
    window.deletePromo(Number(id));
    bootstrap.Modal.getInstance(document.getElementById('promoModal')).hide(); //closes the modal programmatically after deleting the promotion.
  }
});

// Filter/search event listeners
document.getElementById('searchPromo').addEventListener('input', displayPromotions);


// Export button (demo only)
document.getElementById('exportPromos').addEventListener('click', () => {
  alert('Export functionality is not available ');
});

// Initialize table on page load
document.addEventListener('DOMContentLoaded', () => {
  displayPromotions();
});
