require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;
const API_KEY = process.env.API_KEY;
const URL = process.env.URL;

app.use(cors());
app.use(express.json());

// Serve Frontend (Build Vite)
// app.use(express.static(path.join(__dirname, "dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// Hero
app.get("/movies", async (req, res) => {
  try {
    const response = await axios.get(`${URL}movie/upcoming?api_key=${API_KEY}`);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "error fetching data" });
  }
});

app.get("/genresMovies", async (req, res) => {
  try {
    const response = await axios.get(
      `${URL}genre/movie/list?api_key=${API_KEY}`
    );
    // data here
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "error fetching data" });
  }
});

// Category Movie Lists : Now Playing, Popular, Top Rated, Upcoming
app.get("/movies/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const response = await axios.get(
      `${URL}movie/${category}?api_key=${API_KEY}`
    );
    console.log(response);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "error fetching data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
