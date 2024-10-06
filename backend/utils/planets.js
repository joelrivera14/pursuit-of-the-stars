const axios = require("axios");
const getPlanetId = (planetName) => {
  switch (planetName.toLowerCase()) {
    case "mercury":
      return "199";
    case "venus":
      return "299";
    case "earth":
      return "399";
    case "mars":
      return "499";
    case "jupiter":
      return "599";
    case "saturn":
      return "699";
    case "uranus":
      return "799";
    case "neptune":
      return "899";
    default:
      throw new Error("Invalid planet name");
  }
};
//interval val is how many
//intervalType is day, hour,min => 1d, 20min
//start and end time are ISOStrings
const fetchPlanetData = async (
  planetName,
  startTime = 0,
  endTime = 0,
  intervalVal,
  intervalType
) => {
  try {
    console.log(planetName);
    const planetId = getPlanetId(planetName);
    const startTimeFormatted = startTime.split(".")[0] + "Z"; // Current time in ISO format
    const endTimeFormatted = endTime.split(".")[0] + "Z"; // 1 second ago in ISO format
    const response = await axios.get(
      "https://ssd.jpl.nasa.gov/api/horizons.api",
      {
        params: {
          format: "json",
          COMMAND: planetId, // Mercury"s ID in Horizons
          OBJ_DATA: "YES",
          MAKE_EPHEM: "YES",
          EPHEM_TYPE: "VECTORS",
          CENTER: "@0", // Solar System Barycenter
          START_TIME: startTimeFormatted,
          STOP_TIME: endTimeFormatted,
          STEP_SIZE: String(intervalVal) + intervalType, // Not relevant for single time point
          QUANTITIES: "1", // State vector (x,y,z,vx,vy,vz)
        },
      }
    );
    const planetData = response.data.result;
    const vectorData = extractVectorData(planetData);
    const velocityData = extractVelocityData(planetData);
    return { planetName, vectorData, velocityData, startTime, endTime };
  } catch (error) {
    throw error;
  }
};
const now = new Date();
const past = new Date(now.getTime() - 1000 * 86400);

// fetchPlanetData("earth", past.toISOString(), now.toISOString(), 20, "d").then(
//   (e) => console.log(e)
// );

const extractVectorData = (rawData) => {
  const lines = rawData.split("\n");
  console.log(lines);
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
      result[currentLetter] = Number(Number(result[currentLetter]).toFixed(20));
    }
  });
  return result;
};
const extractVelocityData = (rawData) => {
  const lines = rawData.split("\n");
  let velocityString = lines.find((line) => line.includes("VX="));
  const keys = ["VX", "VY", "VZ"];
  let currentKeyPointer = 0;
  const digitRegex = /\d/; // Regular expression to match any digit
  const result = {};
  velocityString.split("=").forEach((str) => {
    if (digitRegex.test(str)) {
      const currentKey = keys[currentKeyPointer];
      if (str[0] === " ") {
        str = str.slice(1);
      }
      result[currentKey] = Number(Number(str.split(" ")[0]).toFixed(20));
      currentKeyPointer++;
    }
  });
  return result;
};

module.exports = { fetchPlanetData };
