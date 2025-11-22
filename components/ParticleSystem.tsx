import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateParticles } from '../utils/math';

interface ParticleSystemProps {
  mode: 'scatter' | 'form';
}

// Increased count significantly to fill the volume
const PARTICLE_COUNT = 15000;
const PARTICLE_SIZE = 0.07;

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ mode }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate data once
  const { initialPositions, targetPositions, colors } = useMemo(
    () => generateParticles(PARTICLE_COUNT),
    []
  );

  // Store current positions in a Float32Array for manual interpolation
  const currentPositions = useMemo(() => new Float32Array(initialPositions), [initialPositions]);

  // Animation Loop
  useFrame((state) => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const positionsAttr = geometry.attributes.position as THREE.BufferAttribute;
    
    const time = state.clock.getElapsedTime();

    const isForming = mode === 'form';
    const lerpSpeed = isForming ? 0.025 : 0.015; // Slower, more fluid movement

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Current coords
      let cx = currentPositions[i3];
      let cy = currentPositions[i3 + 1];
      let cz = currentPositions[i3 + 2];

      // Target coords
      let tx, ty, tz;

      if (isForming) {
        // Target is the Volumetric Tai Chi shape
        tx = targetPositions[i3];
        ty = targetPositions[i3 + 1];
        tz = targetPositions[i3 + 2];
        
        // Add subtle organic breathing to the sphere volume
        const noise = Math.sin(time + i * 0.1) * 0.02;
        tx += noise;
        ty += noise;
        tz += noise;

      } else {
        // Target is the scattered cloud
        // We add significant orbital motion to make the chaos look alive
        const ix = initialPositions[i3];
        const iy = initialPositions[i3 + 1];
        const iz = initialPositions[i3 + 2];

        // Orbiting noise
        tx = ix + Math.sin(time * 0.3 + iy) * 2.0;
        ty = iy + Math.cos(time * 0.2 + ix) * 2.0;
        tz = iz + Math.sin(time * 0.4 + i) * 2.0;
      }

      // Interpolate (LERP)
      cx += (tx - cx) * lerpSpeed;
      cy += (ty - cy) * lerpSpeed;
      cz += (tz - cz) * lerpSpeed;

      // Update storage
      currentPositions[i3] = cx;
      currentPositions[i3 + 1] = cy;
      currentPositions[i3 + 2] = cz;

      // Update Geometry
      positionsAttr.setXYZ(i, cx, cy, cz);
    }

    positionsAttr.needsUpdate = true;

    // Rotate the entire system
    if (isForming) {
      // Slow elegant rotation to show off the 3D structure
      pointsRef.current.rotation.y += 0.003;
      pointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.1; // Slight tilt
      pointsRef.current.rotation.z = THREE.MathUtils.lerp(pointsRef.current.rotation.z, 0, 0.05);
    } else {
       pointsRef.current.rotation.y += 0.001;
       pointsRef.current.rotation.z = THREE.MathUtils.lerp(pointsRef.current.rotation.z, 0.2, 0.02);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={currentPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      {/* 
         Using NormalBlending is crucial here because we have Black particles.
         AdditiveBlending would make black particles invisible (adding 0 to background).
         NormalBlending allows black particles to be seen against the background.
      */}
      <pointsMaterial
        size={PARTICLE_SIZE}
        vertexColors
        sizeAttenuation={true}
        depthWrite={false} // Disable depth write to prevent z-fighting, gives a "cloud" feel
        blending={THREE.NormalBlending} 
        transparent
        opacity={0.85}
      />
    </points>
  );
};