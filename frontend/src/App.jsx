import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import React, { useRef, useMemo, useEffect } from 'react'
import { TrackballControls } from '@react-three/drei'
import { Object3D, MathUtils, Color, Vector2  } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {BloomPass} from 'three/examples/jsm/postprocessing/BloomPass'
/* import { useEffectComposer } from '@react-three/postprocessing' */
import './App.css'

// Extend three.js objects for use in JSX
extend({ EffectComposer, RenderPass, UnrealBloomPass, TrackballControls });

function Sun() {
  const sunRef = useRef();

  useEffect(() => {
    // Configure sun layers
    sunRef.current.layers.set(0);
  }, []);

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1, 15]} />
      <meshBasicMaterial color={new Color('#FDB813')} />
    </mesh>
  );
}


function OrbitingSphere({ radius = 5, speed = 0.01, color }) {
  const sphereRef = useRef(null);
  let angle = 0; // Initial angle
  const randomOffset = Math.random() * 10

  useFrame(() => {
    // Update the angle to animate the orbit
    angle += speed;
    // Calculate the x and z positions for the sphere based on a circular orbit
    sphereRef.current.position.x = radius * Math.cos(angle);
    sphereRef.current.position.y = radius * Math.cos(angle) + randomOffset;
    sphereRef.current.position.z = radius * Math.sin(angle);
  });

  return (
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
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
      const x = MathUtils.randFloatSpread(200); // random x position
      const y = MathUtils.randFloatSpread(200); // random y position
      const z = MathUtils.randFloatSpread(200); // random z position
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

function Effects() {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef();

  useEffect(() => {
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new BloomPass(
      new Vector2(size.width, size.height),
      1.5, // intensity
      0.4,
      0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 10; // intensity of glow
    bloomPass.radius = 1;

    composer.current = new EffectComposer(gl);
    composer.current.addPass(renderPass);
    composer.current.addPass(bloomPass);

    // Resize the composer when the window resizes
    const onResize = () => {
      composer.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [gl, scene, camera, size]);

  useFrame(() => composer.current && composer.current.render(), 0);

  return null;
}

function App() {
  return (
   <div id="canvas-container">
     <Canvas>
     <Effects/>

     <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Sun/>
      <InstancedStars count={1000} />
      <OrbitingSphere radius={20} speed={0.02} color={"red"}/>
      <OrbitingSphere radius={8} speed={0.02} color={"green"}/>
      <OrbitingSphere radius={22} speed={0.01} color={"orange"}/>

      <TrackballControls/>
    </Canvas>
   </div>
  );
}

export default App
