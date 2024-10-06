const axios = require("axios");
const {
  PlanetPositionInformation,
  TimeStampedData,
  VelocityCoords,
  VectorCoords,
} = require("./planetClasses");
const fs = require("fs");
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
    // fs.writeFileSync("sampleData.txt", planetData);
    //get unformatted data for planet at different points in time
    const dataPointsWithTimeStamps = retrieveDataPoints(planetData);
    //create an object containing relevant planet information
    const vectorData = extractVectorData(planetData);
    const velocityData = extractVelocityData(planetData);
    return { planetName, vectorData, velocityData, startTime, endTime };
  } catch (error) {
    throw error;
  }
};
const now = new Date();
const past = new Date(now.getTime() - 86400000);

fetchPlanetData(
  "earth",
  past.toISOString(),
  now.toISOString(),
  500,
  "min"
).then((e) => e);

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
const extractVectorDataArray = (rawData) => {
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

//i want to output an object that has time vectors and velocities
//so i want to take the input rawdata and get the unclean times and velocities first
const v = `*******************************************************************************
 Revised: April 12, 2021                 Earth                              399

 GEOPHYSICAL PROPERTIES (revised May 9, 2022):
  Vol. Mean Radius (km)    = 6371.01+-0.02   Mass x10^24 (kg)= 5.97219+-0.0006
  Equ. radius, km          = 6378.137        Mass layers:
  Polar axis, km           = 6356.752          Atmos         = 5.1   x 10^18 kg
  Flattening               = 1/298.257223563   oceans        = 1.4   x 10^21 kg
  Density, g/cm^3          = 5.51              crust         = 2.6   x 10^22 kg
  J2 (IERS 2010)           = 0.00108262545     mantle        = 4.043 x 10^24 kg
  g_p, m/s^2  (polar)      = 9.8321863685      outer core    = 1.835 x 10^24 kg
  g_e, m/s^2  (equatorial) = 9.7803267715      inner core    = 9.675 x 10^22 kg
  g_o, m/s^2               = 9.82022         Fluid core rad  = 3480 km
  GM, km^3/s^2             = 398600.435436   Inner core rad  = 1215 km
  GM 1-sigma, km^3/s^2     =      0.0014     Escape velocity = 11.186 km/s
  Rot. Rate (rad/s)        = 0.00007292115   Surface area:
  Mean sidereal day, hr    = 23.9344695944     land          = 1.48 x 10^8 km
  Mean solar day 2000.0, s = 86400.002         sea           = 3.62 x 10^8 km
  Mean solar day 1820.0, s = 86400.0         Love no., k2    = 0.299
  Moment of inertia        = 0.3308          Atm. pressure   = 1.0 bar
  Mean surface temp (Ts), K= 287.6           Volume, km^3    = 1.08321 x 10^12
  Mean effect. temp (Te), K= 255             Magnetic moment = 0.61 gauss Rp^3
  Geometric albedo         = 0.367           Vis. mag. V(1,0)= -3.86
  Solar Constant (W/m^2)   = 1367.6 (mean), 1414 (perihelion), 1322 (aphelion)
 HELIOCENTRIC ORBIT CHARACTERISTICS:
  Obliquity to orbit, deg  = 23.4392911  Sidereal orb period  = 1.0000174 y
  Orbital speed, km/s      = 29.79       Sidereal orb period  = 365.25636 d
  Mean daily motion, deg/d = 0.9856474   Hill's sphere radius = 234.9
*******************************************************************************


*******************************************************************************
Ephemeris / API_USER Sat Oct  5 18:05:20 2024 Pasadena, USA      / Horizons
*******************************************************************************
Target body name: Earth (399)                     {source: DE441}
Center body name: Solar System Barycenter (0)     {source: DE441}
Center-site name: BODY CENTER
*******************************************************************************
Start time      : A.D. 2024-Oct-05 01:05:20.0000 TDB
Stop  time      : A.D. 2024-Oct-06 01:05:20.0000 TDB
Step-size       : 500 minutes
*******************************************************************************
Center geodetic : 0.0, 0.0, 0.0                   {E-lon(deg),Lat(deg),Alt(km)}
Center cylindric: 0.0, 0.0, 0.0                   {E-lon(deg),Dxy(km),Dz(km)}
Center radii    : (undefined)
Output units    : KM-S
Calendar mode   : Mixed Julian/Gregorian
Output type     : GEOMETRIC cartesian states
Output format   : 3 (position, velocity, LT, range, range-rate)
Reference frame : Ecliptic of J2000.0
*******************************************************************************
JDTDB
   X     Y     Z
   VX    VY    VZ
   LT    RG    RR
*******************************************************************************
$$SOE
2460588.545370370 = A.D. 2024-Oct-05 01:05:20.0000 TDB
 X = 1.454168855639352E+08 Y = 3.029955846865854E+07 Z = 2.594508728441969E+04
 VX=-6.648538817305808E+00 VY= 2.903231457651984E+01 VZ=-8.397590923632237E-04
 LT= 4.954761398344271E+02 RG= 1.485400098413146E+08 RR=-5.866669677247751E-01
2460588.892592593 = A.D. 2024-Oct-05 09:25:20.0000 TDB
 X = 1.452148093802969E+08 Y = 3.116996204234166E+07 Z = 2.591928403618187E+04
 VX=-6.823168994428340E+00 VY= 2.899440722742993E+01 VZ=-8.813161913039380E-04
 LT= 4.954174532586424E+02 RG= 1.485224160485086E+08 RR=-5.862457488634080E-01
2460589.239814815 = A.D. 2024-Oct-05 17:45:20.0000 TDB
 X = 1.450074977396990E+08 Y = 3.203921193104903E+07 Z = 2.589215768805891E+04
 VX=-6.997567631855111E+00 VY= 2.895540276109474E+01 VZ=-9.279350970974320E-04
 LT= 4.953588109218740E+02 RG= 1.485048355182258E+08 RR=-5.857823462158560E-01
$$EOE
*******************************************************************************

TIME

  Barycentric Dynamical Time ("TDB" or T_eph) output was requested. This
continuous coordinate time is equivalent to the relativistic proper time
of a clock at rest in a reference frame co-moving with the solar system
barycenter but outside the system's gravity well. It is the independent
variable in the solar system relativistic equations of motion.

  TDB runs at a uniform rate of one SI second per second and is independent
of irregularities in Earth's rotation.

CALENDAR SYSTEM

  Mixed calendar mode was active such that calendar dates after AD 1582-Oct-15
(if any) are in the modern Gregorian system. Dates prior to 1582-Oct-5 (if any)
are in the Julian calendar system, which is automatically extended for dates
prior to its adoption on 45-Jan-1 BC.  The Julian calendar is useful for
matching historical dates. The Gregorian calendar more accurately corresponds
to the Earth's orbital motion and seasons. A "Gregorian-only" calendar mode is
available if such physical events are the primary interest.

REFERENCE FRAME AND COORDINATES

  Ecliptic at the standard reference epoch

    Reference epoch: J2000.0
    X-Y plane: adopted Earth orbital plane at the reference epoch
               Note: IAU76 obliquity of 84381.448 arcseconds wrt ICRF X-Y plane
    X-axis   : ICRF
    Z-axis   : perpendicular to the X-Y plane in the directional (+ or -) sense
               of Earth's north pole at the reference epoch.

  Symbol meaning:

    JDTDB    Julian Day Number, Barycentric Dynamical Time
      X      X-component of position vector (km)
      Y      Y-component of position vector (km)
      Z      Z-component of position vector (km)
      VX     X-component of velocity vector (km/sec)
      VY     Y-component of velocity vector (km/sec)
      VZ     Z-component of velocity vector (km/sec)
      LT     One-way down-leg Newtonian light-time (sec)
      RG     Range; distance from coordinate center (km)
      RR     Range-rate; radial velocity wrt coord. center (km/sec)

ABERRATIONS AND CORRECTIONS

 Geometric state vectors have NO corrections or aberrations applied.

Computations by ...

    Solar System Dynamics Group, Horizons On-Line Ephemeris System
    4800 Oak Grove Drive, Jet Propulsion Laboratory
    Pasadena, CA  91109   USA

    General site: https://ssd.jpl.nasa.gov/
    Mailing list: https://ssd.jpl.nasa.gov/email_list.html
    System news : https://ssd.jpl.nasa.gov/horizons/news.html
    User Guide  : https://ssd.jpl.nasa.gov/horizons/manual.html
    Connect     : browser        https://ssd.jpl.nasa.gov/horizons/app.html#/x
                  API            https://ssd-api.jpl.nasa.gov/doc/horizons.html
                  command-line   telnet ssd.jpl.nasa.gov 6775
                  e-mail/batch   https://ssd.jpl.nasa.gov/ftp/ssd/hrzn_batch.txt
                  scripts        https://ssd.jpl.nasa.gov/ftp/ssd/SCRIPTS
    Author      : Jon.D.Giorgini@jpl.nasa.gov
*******************************************************************************
`;
//every individual data point looks like
//[time,vectors,velocity,LTRGRR]
function retrieveDataPoints(rawResponseData) {
  const regex = /\$\$SOE\n([\s\S]*?)\$\$EOE/;
  //grab raw time stamps and positional data
  //remove the "$$SOE"
  const rawPositionData = rawResponseData.match(regex)[0].split("\n").slice(1);
  //remove the "$$EOE"
  rawPositionData.pop();
  //4 is how many lines a single time stamp's data takes up
  const numberOfEntries = rawPositionData.length / 4;

  let timeStampEntries = Array(numberOfEntries).fill(null);
  timeStampEntries = timeStampEntries.map((_, idx) => {
    const singleTimeStampEntry = [];
    //start from a line with a date and iterate over all of its data
    const start = idx * 4;
    for (let dataLine = start; dataLine < start + 4; dataLine++) {
      singleTimeStampEntry.push(rawPositionData[dataLine]);
    }
    return singleTimeStampEntry;
  });
  return timeStampEntries;
}
// input is output of retrieveDataPoints functions; will be one single date raw string
// take that; grab date and output iso date string
const convertRawDateStringToISO = (rawDateString) => {

  const stringArr = rawDateString.split(" ")
  // get date by finding the string with a dash
  const date = stringArr.find(str => str.includes("-"))
  // turn our mmm to the month number
  let splitDate = date.split("-")
  let month = getMonthIndex(splitDate[1])
  let day = splitDate[2]
  let year = splitDate[0]
  let formattedDate = [month,day,year].join("-")

  let stringToDate = (date,format,delimiter) => {
    let formatLowerCase = format.toLowerCase();
    let formatItems = formatLowerCase.split(delimiter);
    let dateItems = date.split(delimiter);
    let monthIndex = formatItems.indexOf("mm");
    let dayIndex = formatItems.indexOf("dd");
    let yearIndex = formatItems.indexOf("yyyy");
    month = parseInt(dateItems[monthIndex]);
    month-=1
    let formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    return formatedDate;
  }
  let isoDate = stringToDate(formattedDate,"mm-dd-yyyy","-")
  return isoDate;
};

// Helper function to get month index
const getMonthIndex = (monthStr) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.indexOf(monthStr);
};

// console.log(retrieveDataPoints(v));

const dataPoints = retrieveDataPoints(v);
console.log(convertRawDateStringToISO(dataPoints[0][0]));


module.exports = { fetchPlanetData };
