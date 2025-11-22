import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ParticleSystem } from './ParticleSystem';

interface TaiChiExperienceProps {
  mode: 'scatter' | 'form';
}

export const TaiChiExperience: React.FC<TaiChiExperienceProps> = ({ mode }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 45 }}
      dpr={[1, 2]} // Handle high DPI screens
      gl={{ antialias: true, alpha: false }}
    >
      {/* Slate-500 Grey background allows both White and Black particles to be visible */}
      <color attach="background" args={['#64748b']} />
      
      <Suspense fallback={null}>
        <ParticleSystem mode={mode} />
        
        {/* Lighting - Minimalist but effective for points */}
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Interaction */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={5} 
          maxDistance={20}
          autoRotate={false}
          dampingFactor={0.05}
        />
      </Suspense>
    </Canvas>
  );
};