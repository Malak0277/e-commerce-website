const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    percentage: { type: Number, required: true },
    expiry: { type: Date, required: true }
});

module.exports = mongoose.model('Discount', discountSchema);
