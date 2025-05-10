async function displayProducts() {
  const tbody = document.getElementById('productsTable');
  tbody.innerHTML = '';
  const search = document.getElementById('searchProduct').value.toLowerCase();
  const categoryFilter = document.getElementById('categoryFilter').value.toLowerCase();
  const stockFilter = document.getElementById('stockFilter').value.toLowerCase();

  try {
    const res = await fetch('/cake', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();

    data.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(search) || 
        product.description?.toLowerCase().includes(search);
      
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      
      // Stock filtering logic - assuming there's a stock field
      // Adjust these values based on your actual stock thresholds
      let matchesStock = true;
      if (stockFilter) {
        const stockLevel = parseInt(product.stock || 0);
        if (stockFilter === 'in' && stockLevel > 10) matchesStock = true;
        else if (stockFilter === 'low' && stockLevel > 0 && stockLevel <= 10) matchesStock = true;
        else if (stockFilter === 'out' && stockLevel <= 0) matchesStock = true;
        else matchesStock = false;
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    }).forEach(product => {
      const tr = document.createElement('tr');
      
      // Adjust image path for correct display
      let imagePath = product.image_url;
      // If the path doesn't start with http or / (for absolute paths), add the relative path
      if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
        imagePath = '../../images/' + imagePath;
      }
      
      tr.innerHTML = `
        <td>
          <img src="${imagePath}" alt="${product.name}" class="product-image">
        </td>
        <td>${product.name}</td>
        <td>${capitalizeFirstLetter(product.category)}</td>
        <td>${product.price.toFixed(2)} EGP</td>
        <td>${product.stock || 0}</td>
        <td class="action-buttons">
          <button class="btn btn-sm btn-info" onclick="editProduct('${product._id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product._id}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    alert('Failed to fetch products: ' + error);
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add event listener to the Add Product button
document.getElementById('addProductModal').addEventListener('show.bs.modal', function(event) {
  const button = event.relatedTarget;
  const isEdit = button.getAttribute('data-edit') === 'true';
  
  document.getElementById('modalTitle').textContent = isEdit ? 'Edit Product' : 'Add New Product';
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
});

// Edit product function
window.editProduct = async function(id) {
  try {
    const res = await fetch(`/cake/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const product = await res.json();
    if (!product) return;
    
    document.getElementById('productId').value = product._id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock || 0;
    document.getElementById('productDescription').value = product.description || '';
    
    document.getElementById('modalTitle').textContent = 'Edit Product';
    new bootstrap.Modal(document.getElementById('addProductModal')).show();
  } catch (error) {
    console.error('Error loading product details:', error);
    alert('Failed to load product details');
  }
};

// Delete product function
window.deleteProduct = async function(id) {
  if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
    try {
      await fetch(`/cake/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      displayProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  }
};

// Save product (create or update)
document.getElementById('saveProduct').addEventListener('click', async () => {
  const productForm = document.getElementById('productForm');
  
  if (!productForm.checkValidity()) {
    productForm.reportValidity();
    return;
  }
  
  const id = document.getElementById('productId').value;
  const name = document.getElementById('productName').value;
  const category = document.getElementById('productCategory').value;
  const price = parseFloat(document.getElementById('productPrice').value);
  const stock = parseInt(document.getElementById('productStock').value);
  const description = document.getElementById('productDescription').value;
  
  const payload = {
    name,
    category,
    price,
    stock,
    description
  };
  
  // Handle image upload
  const imageInput = document.getElementById('productImage');
  if (imageInput.files && imageInput.files[0]) {
    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    
    try {
      // First upload the image - assuming you have a file upload endpoint
      // Note: You may need to adjust this according to your actual file upload implementation
      const imageRes = await fetch('/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      
      const imageData = await imageRes.json();
      
      // Store just the relative path part, not the full URL
      // This assumes your API returns either a full path or just the filename
      let imagePath = imageData.url || '';
      if (imagePath.includes('/images/')) {
        // Extract just the part after /images/
        payload.image_url = imagePath.split('/images/')[1];
      } else {
        payload.image_url = imagePath;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      return;
    }
  }
  
  try {
    if (id) {
      // Update existing product
      await fetch(`/cake/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
    } else {
      // Create new product
      await fetch('/cake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
    }
    
    bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
    displayProducts();
  } catch (error) {
    console.error('Error saving product:', error);
    alert('Failed to save product');
  }
});

// Filter/search functionality
document.getElementById('searchProduct').addEventListener('input', displayProducts);
document.getElementById('categoryFilter').addEventListener('change', displayProducts);
document.getElementById('stockFilter').addEventListener('change', displayProducts);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  displayProducts();
});