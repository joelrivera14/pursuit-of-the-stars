import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

function Planet({ position, color, size = 0.5 }) {
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(position.x, position.y, position.z);
    }
  }, [position]);

  useFrame(() => {
    // You can add any per-frame updates here if needed
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default Planet;
