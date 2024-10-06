const express = require("express");
const router = express.Router();
const { fetchPlanetData } = require("../../utils/planets");

// GET all planets
//end time must be after start time
router.get("/", async (req, res) => {
  try {
    let {
      startTime = new Date().toISOString(),
      endTime = new Date(Date.now() + 86400000).toISOString(),
      intervalType = "d",
      intervalVal = 1,
    } = req.query;
    const planets = [
      "Mercury",
      "Venus",
      "Earth",
      "Mars",
      "Jupiter",
      "Saturn",
      "Uranus",
      "Neptune",
    ];

    const planetData = [];
    for (const planet of planets) {
      const data = await fetchPlanetData(
        planet,
        startTime,
        endTime,
        intervalVal,
        intervalType
      );
      planetData.push(data);
    }
    res.json(planetData);
  } catch (e) {
    console.error(e);
    res.json(e.message);
  }
});

// GET vector data for a specific planet
router.get("/:planetName", async (req, res) => {
  const { planetName } = req.params;

  try {
    const vectorData = await fetchPlanetVectorData(planetName);
    res.json(vectorData);
  } catch (error) {
    if (error.message === "Invalid planet name") {
      res.status(400).json({ error: "Invalid planet name" });
    } else {
      console.error(`Error fetching data for ${planetName}:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

module.exports = router;
