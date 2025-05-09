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

const birthdayCakes = [
  {
    name: "Chocolate Dream Birthday Cake",
    category: "birthday",
    description: "A rich chocolate cake with layers of chocolate ganache and chocolate buttercream frosting. Decorated with chocolate curls and sprinkles.",
    price: 45.99,
    image_url: "../images/subpages/birthday_images/B01.JPG"
  },
  {
    name: "Vanilla Celebration Cake",
    category: "birthday",
    description: "Classic vanilla cake with vanilla buttercream frosting. Decorated with colorful sprinkles and a birthday message.",
    price: 39.99,
    image_url: "../images/subpages/birthday_images/B02.JPG"
  },
  {
    name: "Rainbow Delight Cake",
    category: "birthday",
    description: "Colorful layers of vanilla cake with rainbow buttercream frosting. Topped with rainbow sprinkles and a unicorn topper.",
    price: 49.99,
    image_url: "../images/subpages/birthday_images/B03.JPG"
  },
  {
    name: "Strawberry Shortcake",
    category: "birthday",
    description: "Light and fluffy vanilla cake layered with fresh strawberries and whipped cream. Perfect for summer celebrations.",
    price: 42.99,
    image_url: "../images/subpages/birthday_images/B04.JPG"
  },
  {
    name: "Carrot Cake Delight",
    category: "birthday",
    description: "Moist carrot cake with cream cheese frosting and walnut pieces. A classic favorite with a modern twist.",
    price: 44.99,
    image_url: "../images/subpages/birthday_images/B05.JPG"
  },
  {
    name: "Red Velvet Classic",
    category: "birthday",
    description: "Rich red velvet cake with cream cheese frosting. Elegant and delicious for any celebration.",
    price: 47.99,
    image_url: "../images/subpages/birthday_images/B06.JPG"
  },
  {
    name: "Lemon Blueberry Cake",
    category: "birthday",
    description: "Zesty lemon cake with fresh blueberries and lemon cream cheese frosting. A refreshing summer treat.",
    price: 43.99,
    image_url: "../images/subpages/birthday_images/B07.JPG"
  },
  {
    name: "Chocolate Raspberry Cake",
    category: "birthday",
    description: "Decadent chocolate cake with raspberry filling and chocolate ganache. A perfect combination of sweet and tart.",
    price: 48.99,
    image_url: "../images/subpages/birthday_images/B08.png"
  },
  {
    name: "Coconut Dream Cake",
    category: "birthday",
    description: "Moist coconut cake with coconut cream frosting and toasted coconut flakes. A tropical delight.",
    price: 45.99,
    image_url: "../images/subpages/birthday_images/B09.JPG"
  },
  {
    name: "Funfetti Party Cake",
    category: "birthday",
    description: "Colorful vanilla cake with rainbow sprinkles and vanilla buttercream. Perfect for birthday celebrations.",
    price: 41.99,
    image_url: "../images/subpages/birthday_images/B10.png"
  }
];

const weddingCakes = [
  {
    name: "Elegant White Wedding Cake",
    category: "wedding",
    description: "Classic white wedding cake with delicate sugar flowers and pearl decorations. Multiple tiers with vanilla bean buttercream.",
    price: 299.99,
    image_url: "../images/subpages/wedding_images/W01.jpeg"
  },
  {
    name: "Royal Chocolate Wedding Cake",
    category: "wedding",
    description: "Luxurious chocolate wedding cake with gold leaf accents and chocolate ganache. Decorated with fresh flowers.",
    price: 349.99,
    image_url: "../images/subpages/wedding_images/W02.jpeg"
  },
  {
    name: "Naked Wedding Cake",
    category: "wedding",
    description: "Trendy naked cake with fresh berries and flowers. Vanilla layers with light buttercream and seasonal fruits.",
    price: 279.99,
    image_url: "../images/subpages/wedding_images/W03.jpeg"
  },
  {
    name: "Floral Garden Wedding Cake",
    category: "wedding",
    description: "Elegant white cake decorated with cascading sugar flowers and greenery. Perfect for garden weddings.",
    price: 329.99,
    image_url: "../images/subpages/wedding_images/W04.jpeg"
  },
  {
    name: "Modern Geometric Wedding Cake",
    category: "wedding",
    description: "Contemporary design with geometric patterns and metallic accents. Vanilla bean cake with raspberry filling.",
    price: 359.99,
    image_url: "../images/subpages/wedding_images/W05.jpeg"
  },
  {
    name: "Rustic Wedding Cake",
    category: "wedding",
    description: "Charming naked cake with fresh flowers and berries. Perfect for rustic or outdoor weddings.",
    price: 289.99,
    image_url: "../images/subpages/wedding_images/W06.jpeg"
  },
  {
    name: "Gilded Wedding Cake",
    category: "wedding",
    description: "Luxurious white cake with gold leaf details and pearl accents. Elegant and sophisticated.",
    price: 379.99,
    image_url: "../images/subpages/wedding_images/W07.jpeg"
  },
  {
    name: "Vintage Wedding Cake",
    category: "wedding",
    description: "Classic design with intricate piping and vintage details. Perfect for traditional weddings.",
    price: 319.99,
    image_url: "../images/subpages/wedding_images/W08.jpeg"
  },
  {
    name: "Tropical Wedding Cake",
    category: "wedding",
    description: "Exotic flavors with tropical flowers and fruits. Perfect for destination weddings.",
    price: 339.99,
    image_url: "../images/subpages/wedding_images/W09.jpeg"
  },
  {
    name: "Minimalist Wedding Cake",
    category: "wedding",
    description: "Clean, modern design with subtle textures and elegant simplicity.",
    price: 299.99,
    image_url: "../images/subpages/wedding_images/W10.jpeg"
  }
];

async function insertCakes() {
  try {
    // Clear existing cakes
    await Cake.deleteMany({});
    console.log('Cleared existing cakes');

    // Insert birthday cakes
    for (const cake of birthdayCakes) {
      const cakeId = await getID('cake_id');
      const newCake = new Cake({
        cake_id: cakeId,
        ...cake
      });
      await newCake.save();
    }
    console.log('Inserted birthday cakes');

    // Insert wedding cakes
    for (const cake of weddingCakes) {
      const cakeId = await getID('cake_id');
      const newCake = new Cake({
        cake_id: cakeId,
        ...cake
      });
      await newCake.save();
    }
    console.log('Inserted wedding cakes');

    console.log('All cakes inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting cakes:', error);
    process.exit(1);
  }
}

insertCakes(); 