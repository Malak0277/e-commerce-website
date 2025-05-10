// Demo data for products
let products = [
    {
      id: 1,
      name: "Birthday Cake",
      category: "birthday",
      price: 25.5,
      stock: 10,
      description: "Delicious birthday cake",
      imageUrl: "https://via.placeholder.com/50"
    },
    {
      id: 2,
      name: "Wedding Cake",
      category: "wedding",
      price: 100.0,
      stock: 0,
      description: "Elegant wedding cake",
      imageUrl: "https://via.placeholder.com/50"
    }
  ];
  
 
  // Display the products in the table, applying search, category, and stock filters
  function displayProducts() {
    const tbody = document.getElementById("productsTable");
    tbody.innerHTML = '';
  
    const search = document.getElementById("searchProduct").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const stock = document.getElementById("stockFilter").value;
  
    const filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search);
      const matchesCategory = !category || p.category === category;
      const matchesStock =
        stock === "" ||
        (stock === "in" && p.stock > 5) ||
        (stock === "low" && p.stock > 0 && p.stock <= 5) ||
        (stock === "out" && p.stock === 0);
      return matchesSearch && matchesCategory && matchesStock;
    });
  
    filtered.forEach(product => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${product.imageUrl}" class="product-image"></td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${product.stock}</td>
        <td class="action-buttons">
          <button class="btn btn-sm btn-info" onclick="editProduct(${product.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  // Handle adding new product (add or update in demo)
  document.getElementById("saveProduct").addEventListener("click", () => {
    const id = document.getElementById("productId").value;
    const name = document.getElementById("productName").value;
    const category = document.getElementById("productCategory").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const stock = parseInt(document.getElementById("productStock").value);
    const description = document.getElementById("productDescription").value;
    const imageInput = document.getElementById("productImage");
  
    let imageUrl = "https://via.placeholder.com/50";
    if (imageInput.files && imageInput.files[0]) {
      imageUrl = URL.createObjectURL(imageInput.files[0]);
    }
  
    if (id) {
      // Update
      const index = products.findIndex(p => p.id == id);
      products[index] = { id: +id, name, category, price, stock, description, imageUrl };
    } else {
      // Add new
      const newProduct = {
        id: Date.now(),
        name,
        category,
        price,
        stock,
        description,
        imageUrl
      };
      products.push(newProduct);
    }
  
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = '';
    const modal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
    modal.hide();
  
    displayProducts();
  });
  
  // Edit product: open modal and populate fields
  function editProduct(id) {
    const product = products.find(p => p.id === id);
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;
    document.getElementById("productDescription").value = product.description;
  
    document.getElementById("modalTitle").textContent = "Edit Product";
    const modal = new bootstrap.Modal(document.getElementById("addProductModal"));
    modal.show();
  }
  
  // Delete product by ID (demo only)
  function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
      products = products.filter(p => p.id !== id);
      displayProducts();
    }
  }
  
  // Filter/search event listeners
  document.getElementById("searchProduct").addEventListener("input", displayProducts);
  document.getElementById("categoryFilter").addEventListener("change", displayProducts);
  document.getElementById("stockFilter").addEventListener("change", displayProducts);
  
  // Initial display on page load
  window.onload = displayProducts;
  