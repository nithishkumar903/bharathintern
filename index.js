const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const path = require("path");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Define registration schema
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Registration = mongoose.model('Registration', registrationSchema);

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route for serving the registration form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "Registration", "index.html"));
});

// Route for handling user registration
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const registrationData = new Registration({
      name,
      email,
      password
    });
    await registrationData.save();
    res.redirect("/success");
  } catch (error) {
    console.error(error);
    res.redirect("/error");
  }
});

// Route for successful registration
app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "Registration", "success.html"));
});

// Route for error during registration
app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "Registration", "error.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
