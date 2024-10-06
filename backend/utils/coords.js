const {
  PlanetPositionInformation,
  TimeStampedData,
  VelocityCoords,
  VectorCoords,
} = require("./planetClasses");
const v = `

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
`;
//[time,vectors,velocity,LTRGRR]
//the output of this function is
//the positionalData property PlanetPositionInformation
function getTimeStampedDataPoints(unformattedDataArray) {
  const formattedDataArray = [];
  for (const data of unformattedDataArray) {
    const time = data[0];
    const vectorData = extractVectorData(data[1]);
    const velocityData = extractVelocityData(data[2]);
    const timeAndPositionalData = new TimeStampedData(
      time,
      velocityData,
      vectorData
    );
    formattedDataArray.push(timeAndPositionalData);
  }
  return formattedDataArray;
}

const extractVectorData = (vectorString) => {
  let currentLetter = "";
  const digitRegex = /\d/; // Regular expression to match any digit
  const result = new VectorCoords();
  vectorString.split(" ").forEach((str) => {
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
const extractVelocityData = (velocityString) => {
  const keys = ["VX", "VY", "VZ"];
  let currentKeyPointer = 0;
  const digitRegex = /\d/; // Regular expression to match any digit
  const result = new VelocityCoords();
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
