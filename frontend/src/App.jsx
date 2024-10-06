import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import React, { useRef, useMemo, useEffect, useState } from "react";
import { TrackballControls } from "@react-three/drei";
import { Object3D, MathUtils, Color, Vector2 } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
import axios from "axios";
import PlayButton from "./components/ui/PlayButton";
/* import { useEffectComposer } from '@react-three/postprocessing' */
import "./App.css";
import DateSlider from "./components/ui/DateSlider";
import DateForm from "./components/ui/DateForm";
// Extend three.js objects for use in JSX
extend({ EffectComposer, RenderPass, UnrealBloomPass, TrackballControls });

const G = 6.6743e-11;
const M_sun = 1.989e30;
const SCALE = 1000000;
const VELOCITY_SCALE = 2;

const planetColorMap = {
  mercury: "red",
  venus: "orange",
  earth: "green",
  mars: "purple",
  jupiter: "brown",
  saturn: "pink",
  uranus: "gray",
  neptune: "blue",
};

function Sun() {
  const sunRef = useRef();

  useEffect(() => {
    // Configure sun layers
    sunRef.current.layers.set(0);
  }, []);

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1, 15]} />
      <meshBasicMaterial color={new Color("#FDB813")} />
    </mesh>
  );
}

function OrbitingSphere({
  position,
  radius = 5,
  speed = 0.01,
  color,
  togglePlay,
}) {
  const sphereRef = useRef(null);
  let angle = 0; // Initial angle
  const scaledPosition = useMemo(() => {
    return [
      position.vectorData.x / 1000000,
      position.vectorData.y / 1000000,
      position.vectorData.z / 1000000,
    ];
  }, [position]);

  console.log(scaledPosition);

  useFrame(() => {
    // Update the angle to animate the orbit
    angle += speed;
    if (togglePlay) {
      sphereRef.current.position.x =
        sphereRef.current.position.y =
        sphereRef.current.position.z =
          0;
    }
  }, [togglePlay]);

  return (
    <mesh ref={sphereRef} position={scaledPosition}>
      <sphereGeometry args={[radius, 10, 10]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function InstancedStars({ count = 1000 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new Object3D(), []);

  // Create random positions for each star
  const positions = useMemo(() => {
    const tempPositions = [];
    for (let i = 0; i < count; i++) {
      const x = MathUtils.randFloatSpread(700); // random x position
      const y = MathUtils.randFloatSpread(700); // random y position
      const z = MathUtils.randFloatSpread(700); // random z position
      tempPositions.push([x, y, z]);
    }
    return tempPositions;
  }, [count]);

  useFrame(() => {
    positions.forEach((position, i) => {
      // Set position for each instance
      dummy.position.set(position[0], position[1], position[2]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color="white" />
    </instancedMesh>
  );
}

function PlanetSystem({ coords, togglePlay, planetColorMap }) {
  const planetRefs = useRef([]);

  const planets = useMemo(() => {
    if (coords) {
      console.log(coords);
      return coords.data.map((coord, index) => ({
        name: coord.name,
        initialPosition: coord.positionalData[0].vectorData,
        velocity: coord.positionalData[0].velocityData,
        color: planetColorMap[coord.name.toLowerCase()],
        ref: planetRefs.current[index] || React.createRef(),
      }));
    }
    return [];
  }, [coords, planetColorMap]);

  useFrame((state, delta) => {
    if (togglePlay) {
      planets.forEach((planet, index) => {
        const ref = planetRefs.current[index];
        if (ref.current) {
          ref.current.position.x += (planet.velocity.vx * delta) / SCALE;
          ref.current.position.y += (planet.velocity.vy * delta) / SCALE;
          ref.current.position.z += (planet.velocity.vz * delta) / SCALE;
        }
      });
    }
  });

  return (
    <>
      {planets.map((planet, index) => (
        <OrbitingSphere
          key={planet.name}
          ref={(el) => (planetRefs.current[index] = el)}
          initialPosition={planet.initialPosition}
          velocity={planet.velocity}
          radius={8}
          color={planet.color}
        />
      ))}
    </>
  );
}

function App() {
  const [coords, setCoords] = useState(null);
  const [currentData, setCurrentDate] = useState(null);
  const [togglePlay, setTogglePlay] = useState(false);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:3000/planets/");
    setCoords(res);
    return res;
  };

  useEffect(() => {
    if (!coords) {
      fetchData();
    }
  }, []);

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    // TODO: update planet positions
  };

  const Planets = useMemo(() => {
    if (coords) {
      return coords.data.map((coord) => {
        return (
          <OrbitingSphere
            radius={8}
            key={coord.name}
            position={coord.positionalData[0]}
            color={planetColorMap[coord.name.toLowerCase()]}
            togglePlay={togglePlay}
          />
        );
      });
    }
  }, [coords, PlayButton]);

  return coords ? (
    <div id="canvas-container">
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <InstancedStars count={10000} />
        <Sun />

        {Planets}
        <TrackballControls />
      </Canvas>
      <DateSlider onDateChange={handleDateChange} />
      <DateForm />
    </div>
  ) : (
    <div>Loading ...</div>
  );
}

export default App;
