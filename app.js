const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const restaurantRoutes = require('./routes/restaurantRoutes');
const Restaurant = require('./models/restaurant');

const app = express();

// Middleware
app.use(cors());  // Allow requests from your frontend (React app)
app.use(express.json());  // For parsing JSON request bodies
app.use(express.urlencoded({ extended: true }));  // For parsing form submissions
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
connectDB();

// Use restaurant routes for API (routes in /routes/restaurantRoutes)
app.use('/api/restaurants', restaurantRoutes);

// Route to render the add restaurant form (admin or testing page)
app.get('/add-restaurant', (req, res) => {
  res.render('addRestaurant');
});

// Route to display all restaurants on a webpage (EJS rendering for admin page)
app.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.render('viewRestaurants', { restaurants });
  } catch (error) {
    console.error("Error fetching restaurants: ", error.message);
    res.status(500).send("Error fetching restaurants.");
  }
});

// Route to handle POST request for adding a restaurant (for admin usage)
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
      menu,
      profileImage,
      chatbot,
      location,
      timings 
    } = req.body;

    // Validation for required fields
    if (!name || !ratings || !cuisine || !address || !timings) {
      return res.status(400).send("Missing required fields");
    }

    const newRestaurant = new Restaurant({
      name,
      ratings,
      cuisine,
      address,
      dateAndTime,
      price,
      phone,
      food: food.split(','), 
      ambience: ambience.split(','), // Convert comma-separated ambience descriptions to an array
      menu,
      profileImage,
      chatbot,
      location,
      timings 
    });

    const savedRestaurant = await newRestaurant.save();
    res.redirect('/');
  } catch (error) {
    console.error("Error adding restaurant: ", error.message);
    res.status(500).send("Error adding restaurant.");
  }
});


app.get('/api/:name', async (req, res) => {
  const name = req.params.name;
  console.log("Searching for restaurant with name:", name);  // Debugging line
  
  try {
    // Find restaurant with the given name
    const restaurant = await Restaurant.findOne({ name: name });

    // Check if restaurant is found and send appropriate response
    if (restaurant.length === 0) {
      return res.status(404).send({ message: "Restaurant not found" });
    }
    
    // Send the found restaurant data as response
    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error.message);
    res.status(500).send({ message: "Error fetching restaurant" });
  }
});






// Set up your backend server to listen on the appropriate port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
