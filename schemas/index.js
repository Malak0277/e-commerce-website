const connectDB = require('./config/db');
const User = require('./schemas/User');
const Cake = require('./schemas/Cake');
const Order = require('./schemas/Order');

async function main() {
  await connectDB();

  // 1. Create a sample user in Egypt
  const userEmail = 'fatma.saleh@example.com';
  await User.create({
    _id: userEmail,
    password: 'hashed_password_here', // Hash it properly in real apps
    first_name: 'Fatma',
    last_name: 'Saleh',
    address: '15 Talaat Harb Street, Downtown, Cairo',
    phone: '01001234567'
  });
  console.log('User created');

  // 2. Create some Egyptian-style cakes
  const cakes = await Cake.insertMany([
    {
      name: 'Basbousa with Cream',
      category_name: 'birthday',
      description: 'Sweet Egyptian semolina cake soaked in syrup, filled with cream.',
      price: 75.00,
      image_url: 'https://yourcdn.com/images/basbousa.jpg'
    },
    {
      name: 'Kunafa Nutella',
      category_name: 'wedding',
      description: 'Kunafa layered with Nutella and cream cheese filling.',
      price: 90.00,
      image_url: 'https://yourcdn.com/images/kunafa-nutella.jpg'
    }
  ]);
  console.log('Cakes added');

  // 3. Create an order from the user for these cakes
  const order = await Order.create({
    user_id: userEmail,
    total_price: cakes[0].price + cakes[1].price,
    shipping_address: '15 Talaat Harb Street, Downtown, Cairo',
    status: 'processing',
    items: [
      {
        cake_id: cakes[0]._id,
        quantity: 1,
        number_of_people: 6,
        price: cakes[0].price
      },
      {
        cake_id: cakes[1]._id,
        quantity: 1,
        number_of_people: 5,
        price: cakes[1].price
      }
    ]
  });
  console.log('Order created:', order._id);
}

main().catch(console.error);
