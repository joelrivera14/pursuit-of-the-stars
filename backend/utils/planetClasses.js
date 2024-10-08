class PlanetPositionInformation {
  constructor(name, startTime, endTime, positionalData) {
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.positionalData = positionalData;
  }
}
class TimeStampedData {
  constructor(time = new Date(), velocityData, vectorData) {
    this.time = time;
    this.velocityData = velocityData;
    this.vectorData = vectorData;
  }
}
class VectorCoords {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
class VelocityCoords {
  constructor(vx, vy, vz) {
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
  }
}
module.exports = {
  PlanetPositionInformation,
  TimeStampedData,
  VectorCoords,
  VelocityCoords,
};
