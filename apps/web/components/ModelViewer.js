import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function BoxModel() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#FF9800" metalness={0.4} roughness={0.3} />
    </mesh>
  );
}

function SphereModel() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4CAF50" metalness={0.5} roughness={0.2} />
    </mesh>
  );
}

function CylinderModel() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.8, 0.8, 2, 32]} />
      <meshStandardMaterial color="#2196F3" metalness={0.6} />
    </mesh>
  );
}

export default function ModelViewer({ type = 'box' }) {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ 
        width: '100%', 
        height: '400px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {type === 'box' && <BoxModel />}
      {type === 'sphere' && <SphereModel />}
      {type === 'cylinder' && <CylinderModel />}
      
      <OrbitControls enableZoom={true} enablePan={true} />
      <gridHelper args={[10, 10]} />
    </Canvas>
  );
}
