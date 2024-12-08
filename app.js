const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const restaurantRoutes = require('./routes/restaurantRoutes');
const Restaurant = require('./models/restaurant'); // Import the Restaurant model

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To handle form submissions

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
connectDB();

// Use restaurant routes for API
app.use('/api/restaurants', restaurantRoutes);

// Route to render the add restaurant form
app.get('/add-restaurant', (req, res) => {
  res.render('addRestaurant');
});

// Route to display all restaurants
app.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.render('viewRestaurants', { restaurants });
  } catch (error) {
    console.error("Error fetching restaurants: ", error.message);
    res.status(500).send("Error fetching restaurants.");
  }
});

// Route to handle POST request for adding a restaurant
app.post('/add-restaurant', async (req, res) => {
  try {
    const {
      name,
      ratings,
      cuisine,
      address,
      dateAndTime,
      price,
      phone,
      food,
      ambience,
      menu, // New field
      profileImage, // New field
      chatbot, // New field
      location // New field
    } = req.body;

    const newRestaurant = new Restaurant({
      name,
      ratings,
      cuisine,
      address,
      dateAndTime,
      price,
      phone,
      food: food.split(','), // Convert comma-separated food items to array
      ambience: ambience.split(','), // Convert comma-separated ambience descriptions to array
      menu,
      profileImage,
      chatbot,
      location // Assign the location field
    });

    const savedRestaurant = await newRestaurant.save();
    res.redirect('/');
  } catch (error) {
    console.error("Error adding restaurant: ", error.message);
    res.status(500).send("Error adding restaurant.");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
