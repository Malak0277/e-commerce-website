const mongoose = require('mongoose');
const Cake = require('../schemas/Cake');
const getID = require('../utils/idGenerator');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


const miniCakes = [
  {
    name: "Classic Mini Chocolate",
    category: "minis",
    description: "Delightful bite-sized chocolate cake perfect for individual servings or small gatherings.",
    price: 24.99,
    image_url: "../images/subpages/minis_images/M01.jpg"
  },
  {
    name: "Mini Red Velvet",
    category: "minis",
    description: "Charming mini red velvet cake with cream cheese frosting, perfect for two.",
    price: 26.99,
    image_url: "../images/subpages/minis_images/M02.jpg"
  },
  {
    name: "Mini Carrot Cake",
    category: "minis",
    description: "Moist mini carrot cake with walnuts and cream cheese frosting.",
    price: 25.99,
    image_url: "../images/subpages/minis_images/M03.jpg"
  },
  {
    name: "Mini Vanilla Bean",
    category: "minis",
    description: "Elegant mini vanilla bean cake with fresh berries and whipped cream.",
    price: 23.99,
    image_url: "../images/subpages/minis_images/M04.jpg"
  },
  {
    name: "Mini Lemon Delight",
    category: "minis",
    description: "Tangy mini lemon cake with citrus glaze and candied lemon peel.",
    price: 24.99,
    image_url: "../images/subpages/minis_images/M05.jpg"
  },
  {
    name: "Mini Coffee Crunch",
    category: "minis",
    description: "Rich coffee-flavored mini cake with chocolate ganache and coffee beans.",
    price: 25.99,
    image_url: "../images/subpages/minis_images/M06.jpg"
  },
  {
    name: "Mini Strawberry Dream",
    category: "minis",
    description: "Fresh strawberry mini cake with whipped cream and fresh berries.",
    price: 26.99,
    image_url: "../images/subpages/minis_images/M07.jpg"
  },
  {
    name: "Mini Tiramisu",
    category: "minis",
    description: "Classic Italian mini tiramisu with coffee-soaked layers and mascarpone cream.",
    price: 27.99,
    image_url: "../images/subpages/minis_images/M08.jpg"
  },
  {
    name: "Mini Cheesecake",
    category: "minis",
    description: "Creamy mini cheesecake with graham cracker crust and berry compote.",
    price: 24.99,
    image_url: "../images/subpages/minis_images/M09.jpg"
  },
  {
    name: "Mini Black Forest",
    category: "minis",
    description: "Decadent mini black forest cake with cherries and chocolate shavings.",
    price: 26.99,
    image_url: "../images/subpages/minis_images/M10.jpg"
  },
  {
    name: "Mini Caramel Delight",
    category: "minis",
    description: "Rich caramel-flavored mini cake with salted caramel drizzle and toffee bits.",
    price: 25.99,
    image_url: "../images/subpages/minis_images/M11.jpg"
  },
  {
    name: "Mini Coconut Dream",
    category: "minis",
    description: "Tropical mini coconut cake with coconut cream frosting and toasted coconut flakes.",
    price: 24.99,
    image_url: "../images/subpages/minis_images/M12.jpg"
  },
  {
    name: "Mini Hazelnut Crunch",
    category: "minis",
    description: "Nutty mini hazelnut cake with chocolate ganache and crushed hazelnuts.",
    price: 26.99,
    image_url: "../images/subpages/minis_images/M13.jpg"
  },
  {
    name: "Mini Raspberry Bliss",
    category: "minis",
    description: "Fresh raspberry mini cake with white chocolate ganache and fresh berries.",
    price: 25.99,
    image_url: "../images/subpages/minis_images/M14.jpg"
  }
];

const specialCakes = [
  {
    name: "Anniversary Celebration",
    category: "others",
    description: "Elegant anniversary cake with romantic decorations and personalized message.",
    price: 89.99,
    image_url: "../images/subpages/others_images/O01.jpg"
  },
  {
    name: "Graduation Cap Cake",
    category: "others",
    description: "Creative graduation-themed cake with edible cap and diploma decorations.",
    price: 79.99,
    image_url: "../images/subpages/others_images/O02.jpg"
  },
  {
    name: "Baby Shower Delight",
    category: "others",
    description: "Adorable baby shower cake with pastel colors and baby-themed decorations.",
    price: 84.99,
    image_url: "../images/subpages/others_images/O03.jpg"
  },
  {
    name: "Corporate Event Cake",
    category: "others",
    description: "Professional corporate-themed cake perfect for business celebrations.",
    price: 94.99,
    image_url: "../images/subpages/others_images/O04.jpg"
  },
  {
    name: "Holiday Special",
    category: "others",
    description: "Festive holiday-themed cake with seasonal decorations and flavors.",
    price: 89.99,
    image_url: "../images/subpages/others_images/O05.jpg"
  }
];

async function insertOrUpdateCakes() {
  try {
    console.log('Starting cake insertion/update process...');

    // Process Mini cakes
    for (const cake of miniCakes) {
      const existingCake = await Cake.findOne({ 
        name: cake.name,
        category: cake.category 
      });

      if (existingCake) {
        await Cake.findByIdAndUpdate(
          existingCake._id,
          cake,
          { new: true, runValidators: true }
        );
        console.log(`Updated cake: ${cake.name}`);
      } else {
        const cakeId = await getID('cake_id');
        const newCake = new Cake({
          cake_id: cakeId,
          ...cake
        });
        await newCake.save();
        console.log(`Inserted new cake: ${cake.name}`);
      }
    }
    console.log('Mini cakes processed');

    // Process Other cakes
    for (const cake of specialCakes) {
      const existingCake = await Cake.findOne({ 
        name: cake.name,
        category: cake.category 
      });

      if (existingCake) {
        await Cake.findByIdAndUpdate(
          existingCake._id,
          cake,
          { new: true, runValidators: true }
        );
        console.log(`Updated cake: ${cake.name}`);
      } else {
        const cakeId = await getID('cake_id');
        const newCake = new Cake({
          cake_id: cakeId,
          ...cake
        });
        await newCake.save();
        console.log(`Inserted new cake: ${cake.name}`);
      }
    }
    console.log('Other cakes processed');

    console.log('All cakes processed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error processing cakes:', error);
    process.exit(1);
  }
}

insertOrUpdateCakes(); 