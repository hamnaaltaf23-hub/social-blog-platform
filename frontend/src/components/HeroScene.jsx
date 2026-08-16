import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';

export default function HeroScene({ bgColor = '#5A6EBA' }) {
  const shapes = useMemo(() => [
    // Positions constrained to visible area: x: -4..4, y: -3..3, z: -3..3
    { pos: [-3.5, 1.5, -1], color: '#1E2A5A', geom: <torusKnotGeometry args={[0.7, 0.25, 100, 16]} />, speed: 0.7, rot: 0.3, float: 0.6 },
    { pos: [-2, -2, 0.5], color: '#2E3E7A', geom: <icosahedronGeometry args={[0.6, 0]} />, speed: 1.1, rot: 0.2, float: 0.5 },
    { pos: [3, 0, -1.5], color: '#4A5DA6', geom: <torusGeometry args={[0.8, 0.2, 16, 100]} />, speed: 0.5, rot: 0.4, float: 0.4 },
    { pos: [-3.5, -1.5, 2.5], color: '#6B7FB5', geom: <octahedronGeometry args={[0.5]} />, speed: 1.4, rot: 0.3, float: 0.7 },
    { pos: [1.5, 2.5, 1.5], color: '#2E3E7A', geom: <boxGeometry args={[0.7, 0.7, 0.7]} />, speed: 0.9, rot: 0.2, float: 0.5 },
    { pos: [-1, 0.5, -2.5], color: '#4A5DA6', geom: <sphereGeometry args={[0.5, 32, 32]} />, speed: 1.0, rot: 0.1, float: 0.6 },
    { pos: [3.5, -1.5, -2], color: '#1E2A5A', geom: <cylinderGeometry args={[0.5, 0.5, 0.8, 32]} />, speed: 0.6, rot: 0.3, float: 0.5 },
    { pos: [-2.5, 2.5, 0], color: '#6B7FB5', geom: <coneGeometry args={[0.5, 0.8, 32]} />, speed: 1.2, rot: 0.2, float: 0.6 },
    { pos: [0, -2.5, 2], color: '#2E3E7A', geom: <dodecahedronGeometry args={[0.5]} />, speed: 0.8, rot: 0.4, float: 0.7 },
    { pos: [-4, 0, -2], color: '#4A5DA6', geom: <ringGeometry args={[0.4, 0.6, 32]} />, speed: 1.1, rot: 0.3, float: 0.5 },
    { pos: [2, -0.5, 3], color: '#1E2A5A', geom: <tetrahedronGeometry args={[0.5]} />, speed: 0.9, rot: 0.2, float: 0.6 },
    { pos: [-0.5, -1.5, -3], color: '#6B7FB5', geom: <torusKnotGeometry args={[0.5, 0.15, 64, 8]} />, speed: 1.3, rot: 0.4, float: 0.7 },
    { pos: [3, 1.5, -0.5], color: '#4A5DA6', geom: <icosahedronGeometry args={[0.5]} />, speed: 1.0, rot: 0.3, float: 0.5 },
    { pos: [-3, -2.5, -0.5], color: '#2E3E7A', geom: <boxGeometry args={[0.6, 0.6, 0.6]} />, speed: 0.8, rot: 0.2, float: 0.6 },
    { pos: [4, -0.5, 1.5], color: '#1E2A5A', geom: <torusGeometry args={[0.6, 0.15, 16, 100]} />, speed: 0.7, rot: 0.4, float: 0.5 },
    { pos: [-1.5, 1.5, -3], color: '#6B7FB5', geom: <octahedronGeometry args={[0.5]} />, speed: 1.2, rot: 0.3, float: 0.6 },
    { pos: [2.5, -2, -2.5], color: '#4A5DA6', geom: <sphereGeometry args={[0.5]} />, speed: 0.9, rot: 0.1, float: 0.5 },
    { pos: [-4, -0.5, 2], color: '#1E2A5A', geom: <coneGeometry args={[0.5, 0.7, 32]} />, speed: 1.0, rot: 0.2, float: 0.7 },
    { pos: [0.5, 3, 0.5], color: '#2E3E7A', geom: <dodecahedronGeometry args={[0.5]} />, speed: 0.8, rot: 0.3, float: 0.6 },
    { pos: [-2, -1, 3.5], color: '#6B7FB5', geom: <ringGeometry args={[0.4, 0.5, 32]} />, speed: 1.1, rot: 0.2, float: 0.5 },
  ], []);

  return (
    <div className="w-full h-screen" style={{ backgroundColor: bgColor }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Environment preset="city" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.2}
        />
        {shapes.map((shape, idx) => (
          <Float
            key={idx}
            speed={shape.speed}
            rotationIntensity={shape.rot}
            floatIntensity={shape.float}
          >
            <mesh position={shape.pos}>
              {shape.geom}
              <meshStandardMaterial
                color={shape.color}
                metalness={0.3}
                roughness={0.4}
                emissive={shape.color}
                emissiveIntensity={0.1}
              />
            </mesh>
          </Float>
        ))}
      </Canvas>
    </div>
  );
}