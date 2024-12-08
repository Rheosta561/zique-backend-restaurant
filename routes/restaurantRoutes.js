const express = require('express');
const Restaurant = require('../models/restaurant');

const router = express.Router();

// Render the form for adding a new restaurant
router.get('/add', (req, res) => {
  res.render('addRestaurant'); // This will render the addRestaurant.ejs file
});

// Add a new restaurant
router.post('/add', async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
    // You can redirect to the restaurants list page or show a success message
    res.redirect('/restaurants'); // Assuming you have a route for displaying restaurants
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
    // Render restaurants page, passing the restaurants data
    res.render('restaurants', { restaurants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json(restaurant);
    // Render a page with the restaurant details
    res.render('restaurantDetails', { restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a restaurant by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a restaurant by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
