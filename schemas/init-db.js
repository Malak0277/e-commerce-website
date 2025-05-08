const { publicDecrypt } = require('crypto');
const db = require('./config/db');  // Import the promise-based pool

async function initializeDatabase() {
  const sql = `
    CREATE DATABASE IF NOT EXISTS ecommerce_db;
    USE ecommerce_db;

    CREATE TABLE IF NOT EXISTS users (
      email VARCHAR(100) PRIMARY KEY,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      address TEXT,
      phone VARCHAR(11)
    );

    CREATE TABLE IF NOT EXISTS cakes (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      category_name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id VARCHAR(100) NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      shipping_address TEXT NOT NULL,  
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
      FOREIGN KEY (user_id) REFERENCES users(email)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      order_id INT NOT NULL,
      cake_id INT NOT NULL,
      quantity INT NOT NULL,
      number_of_people INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      PRIMARY KEY (order_id, cake_id),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (cake_id) REFERENCES cakes(id)
    );

    CREATE TABLE IF NOT EXISTS cart (
      user_id VARCHAR(100) NOT NULL,
      cake_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      price DECIMAL(10, 2) NOT NULL,
      PRIMARY KEY (user_id, cake_id),
      FOREIGN KEY (user_id) REFERENCES users(email),
      FOREIGN KEY (cake_id) REFERENCES cakes(id)
    );
  `;

  try {
    // Execute the SQL to create the database and tables
    await db.query(sql);  // Use promisePool to run the query
    console.log("Database and tables created successfully.");
  } catch (err) {
    console.error("Error creating database and tables:", err);
  }
}

initializeDatabase();

