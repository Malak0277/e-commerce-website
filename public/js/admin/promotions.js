// Demo data for promotions
let promotions = [
  {
    id: 1,
    code: 'WELCOME10',
    description: '10% off for new users',
    discount: 10,
    status: 'active',
    start: '2024-05-01',
    end: '2024-06-01'
  },
  {
    id: 2,
    code: 'EID20',
    description: 'Eid special 20% off',
    discount: 20,
    status: 'upcoming',
    start: '2024-06-10',
    end: '2024-06-20'
  },
 
];

function displayPromotions() {
  const tbody = document.getElementById('promosTable');
  tbody.innerHTML = '';
  const search = document.getElementById('searchPromo').value.toLowerCase();
  const status = document.getElementById('statusFilter').value;
  const date = document.getElementById('dateFilter').value;
  promotions.filter(p => {
    const matchesSearch = p.code.toLowerCase().includes(search) || p.description.toLowerCase().includes(search);
    const matchesStatus = !status || p.status === status;
    const matchesDate = !date || (p.start <= date && p.end >= date);
    return matchesSearch && matchesStatus && matchesDate;
  }).forEach(promo => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${promo.code}</td>
      <td>${promo.description}</td>
      <td>${ promo.discount + '%'  + ' EGP'}</td>
      <td><span class="promo-status status-${promo.status}">${capitalize(promo.status)}</span></td>
      <td>${promo.start}</td>
      <td>${promo.end}</td>
      <td class="action-buttons">
        <button class="btn btn-sm btn-info" onclick="editPromo(${promo.id})"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deletePromo(${promo.id})"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

window.editPromo = function(id) {
  const promo = promotions.find(p => p.id === id);
  if (!promo) return;
  document.getElementById('promoId').value = promo.id;
  document.getElementById('promoCode').value = promo.code;
  document.getElementById('promoDescription').value = promo.description;
  document.getElementById('promoDiscount').value = promo.discount;
  document.getElementById('promoStart').value = promo.start;
  document.getElementById('promoEnd').value = promo.end;
  document.getElementById('promoStatus').value = promo.status;
  document.getElementById('promoModalTitle').textContent = 'Edit Promotion';
  new bootstrap.Modal(document.getElementById('promoModal')).show();
};

document.getElementById('addPromotionBtn').addEventListener('click', () => {
  document.getElementById('promoForm').reset();
  document.getElementById('promoId').value = '';
  document.getElementById('promoModalTitle').textContent = 'Add Promotion';
  new bootstrap.Modal(document.getElementById('promoModal')).show();
});

document.getElementById('savePromo').addEventListener('click', () => {
  const id = document.getElementById('promoId').value;
  const code = document.getElementById('promoCode').value;
  const description = document.getElementById('promoDescription').value;
  const discount = parseFloat(document.getElementById('promoDiscount').value);
  const start = document.getElementById('promoStart').value;
  const end = document.getElementById('promoEnd').value;
  const status = document.getElementById('promoStatus').value;
  if (id) {
    // Edit
    const idx = promotions.findIndex(p => p.id == id);
    if (idx !== -1) {
      promotions[idx] = { ...promotions[idx], code, description, discount, start, end, status };  // copies the existing object.
    }
  } else {
    // Add
    const newId = promotions.length ? Math.max(...promotions.map(p => p.id)) + 1 : 1;
    promotions.push({ id: newId, code, description, discount,start, end, status });
  }
  bootstrap.Modal.getInstance(document.getElementById('promoModal')).hide();
  displayPromotions();
});

window.deletePromo = function(id) {
  if (confirm('Are you sure you want to delete this promotion?')) {
    promotions = promotions.filter(p => p.id !== id);
    displayPromotions();
  }
};

document.getElementById('deletePromo').addEventListener('click', () => {
  const id = document.getElementById('promoId').value;
  if (id) {
    window.deletePromo(Number(id));
    bootstrap.Modal.getInstance(document.getElementById('promoModal')).hide(); //closes the modal programmatically after deleting the promotion.
  }
});

document.getElementById('searchPromo').addEventListener('input', displayPromotions);
document.getElementById('statusFilter').addEventListener('change', displayPromotions);
document.getElementById('dateFilter').addEventListener('change', displayPromotions);

document.getElementById('exportPromos').addEventListener('click', () => {
  alert('Export functionality is not available ');
});

document.addEventListener('DOMContentLoaded', () => {
  displayPromotions();
});
