const mongoose = require('mongoose');
const Discount = require('../schemas/Discount');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Promo codes to insert
const promoCodes = [
    {
        code: 'WELCOME10',
        percentage: 10,
        expiry: new Date('2024-12-31'), // Valid until end of 2024
        description: '10% off your first order'
    },
    {
        code: 'BIRTHDAY20',
        percentage: 20,
        expiry: new Date('2024-12-31'), // Valid until end of 2024
        description: '20% off on your birthday month'
    }
];

// Function to insert promo codes
async function insertPromoCodes() {
    try {
        // Clear existing promo codes
        await Discount.deleteMany({});
        console.log('Cleared existing promo codes');

        // Insert new promo codes
        const insertedPromos = await Discount.insertMany(promoCodes);
        console.log('Successfully inserted promo codes:');
        insertedPromos.forEach(promo => {
            console.log(`- ${promo.code}: ${promo.percentage}% off (Expires: ${promo.expiry.toLocaleDateString()})`);
        });

    } catch (error) {
        console.error('Error inserting promo codes:', error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

// Run the insertion
insertPromoCodes(); 