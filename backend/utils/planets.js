const axios = require("axios");
const fetchMercuryVectorData = async () => {
  try {
    const now = new Date();
    const currentTime = now.toISOString().split(".")[0] + "Z"; // Current time in ISO format
    const pastTime =
      new Date(now.getTime() - 1000).toISOString().split(".")[0] + "Z"; // 1 second ago in ISO format
    const response = await axios.get(
      "https://ssd.jpl.nasa.gov/api/horizons.api",
      {
        params: {
          format: "json",
          COMMAND: "199", // Mercury"s ID in Horizons
          OBJ_DATA: "YES",
          MAKE_EPHEM: "YES",
          EPHEM_TYPE: "VECTORS",
          CENTER: "@0", // Solar System Barycenter
          START_TIME: pastTime,
          STOP_TIME: currentTime,
          STEP_SIZE: "1d", // Not relevant for single time point
          QUANTITIES: "1", // State vector (x,y,z,vx,vy,vz)
        },
      }
    );
    const mercuryData = response.data.result;
    // console.log(mercuryData);
    const vectorData = extractVectorData(mercuryData);
    return vectorData;
  } catch (error) {
    console.error("Error fetching Mercury vector data:", error);
    throw error;
  }
};

fetchMercuryVectorData();
const extractVectorData = (rawData) => {
  const lines = rawData.split("\n");
  const coordinateString = lines.find((line) => line.includes("X ="));
  let currentLetter = "";
  const digitRegex = /\d/; // Regular expression to match any digit
  const result = {};
  coordinateString.split(" ").forEach((str) => {
    if ("XYZ".includes(str)) {
      currentLetter = str.toLowerCase();
    } else if (digitRegex.test(str)) {
      if (str[0] === "=") result[currentLetter] = str.slice(1);
      else {
        result[currentLetter] = str.slice();
      }
      result[currentLetter] = Number(result[currentLetter]).toFixed(20);
    }
  });
  return result;
};
