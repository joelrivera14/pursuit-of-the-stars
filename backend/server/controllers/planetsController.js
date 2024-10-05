const express = require('express');
const router = express.Router();
const { fetchPlanetVectorData } = require('../../utils/planets');

// GET all planets
router.get('/', (req, res) => {
  const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  res.json(planets);
});

// GET vector data for a specific planet
router.get('/:planetName', async (req, res) => {
  const { planetName } = req.params;
  
  try {
    const vectorData = await fetchPlanetVectorData(planetName);
    res.json(vectorData);
  } catch (error) {
    if (error.message === 'Invalid planet name') {
      res.status(400).json({ error: 'Invalid planet name' });
    } else {
      console.error(`Error fetching data for ${planetName}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

module.exports = router;