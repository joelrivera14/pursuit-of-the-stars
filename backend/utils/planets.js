const axios = require('axios');

const fetchMercuryVectorData = async () => {
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
        EPHEM_TYPE: 'VECTORS',
        CENTER: '@0', // Solar System Barycenter
        START_TIME: pastTime,
        STOP_TIME: currentTime,
        STEP_SIZE: '1d', // Not relevant for single time point
        QUANTITIES: '1', // State vector (x,y,z,vx,vy,vz)
      },
    });

    const mercuryData = response.data.result;
    // console.log(mercuryData);
    const vectorData = extractVectorData(mercuryData);

    console.log(vectorData);

    return vectorData;
  } catch (error) {
    console.error('Error fetching Mercury vector data:', error);
    throw error;
  }
};

const extractVectorData = (rawData) => {
  const lines = rawData.split('\n');
//   console.log(lines);
// finding the line that contains 'X ='
  for (const line of lines) {
    if (line.includes('X =')) {
        console.log('found it');
        const values = line.split(/\s+/);
        const vector = [];
        let count = 0

        console.log(values);
        for (const value of values) {

            console.log('new iteration',value)
            if (value.length > 3) {
              vector.push(value);
              console.log(vector,value)
              count++;
              if (count === 3) break;
            }
          }

          console.log(vector);

          if (vector.length === 3) {
            return {
              position: {
                x: vector[0],
                y: vector[1],
                z: vector[2]
              }
            }
          }
        
        // console.log(line);
    }

    
  }

//   const convertStringArrayToVector = (stringArray) => {
//     const vector = []
//     for (const string of stringArray) {
//         let count = 0
//         // if the string is a number, then we add it to our vector
//         // loop over entire string; if its one number; then its a number
//         for (const char of string) {
//             if (!isNaN(char)) {
//                 // its a number
//                 // our string is a number
//                 vector.push(string)
//                 count++
//                 break
//             }
//         }
//     }
//   }

//   const dataLine = lines.find(line => line.trim().startsWith('2'));

//   console.log(dataLine);
  
//   if (dataLine) {
//     const [date, x, y, z, vx, vy, vz] = dataLine.trim().split(/\s+/);
//     return {
//       date,
//       position: {
//         x: x,
//         y: y,
//         z: z
//       },
//       velocity: {
//         x: vx,
//         y: vy,
//         z: vz
//       }
//     };
//   }
  
  return null;
};

const output = fetchMercuryVectorData();
// console.log(output)
