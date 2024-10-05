const axios = require('axios');

const fetchMercuryData = async () => {
  try {
    const now = new Date();
    const currentTime = now.toISOString().split('.')[0] + 'Z'; // Current time in ISO format
    const pastTime = new Date(now.getTime() - 1000).toISOString().split('.')[0] + 'Z'; // 1 second ago in ISO format

    const response = await axios.get('https://ssd.jpl.nasa.gov/api/horizons.api', {
      params: {
        format: 'json',
        COMMAND: '199', // Mercury's ID in Horizons
        OBJ_DATA: 'YES',
        MAKE_EPHEM: 'YES',
        EPHEM_TYPE: 'ELEMENTS',
        CENTER: '@0', // Solar System Barycenter
        START_TIME: pastTime,
        STOP_TIME: currentTime,
        STEP_SIZE: '1d',
      },
    });

    const mercuryData = response.data.result;
    const proccessedData = processOrbitalElements(mercuryData);
    return mercuryData;
  } catch (error) {
    console.error('Error fetching Mercury data:', error);
    throw error;
  }
};

const processOrbitalElements = (rawData) => {
    const lines = rawData.split('\n');
    // console.log(lines);
    const elementLines = lines.filter(line => line.includes('='));
    // console.log(elementLines);
    console.log(elementLines);

  };



// Export the function
fetchMercuryData();
module.exports = { fetchMercuryData };