const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ratings: { type: Number, min: 0, max: 5, required: true },
  cuisine: { type: String, required: true },
  address: { type: String, required: true },
  dateTime: { type: Date, required: false },
  price: { type: String, required: true },
  phone: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // 10-digit phone number validation
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  food: { type: [String], required: true }, // Array of food items
  ambience: { type: [String], required: true }, // Array of ambience descriptions
  menu: { type: String, required: false }, // Menu link or description
  profileImage: { type: String, required: false }, // URL of the restaurant's profile image
  chatbot: { type: String, required: false }, // Chatbot link or description
  location: { type: String, required: true } // New Location field
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
