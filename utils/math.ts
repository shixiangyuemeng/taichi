import * as THREE from 'three';

// Define colors
const COLOR_BLACK = new THREE.Color('#151515'); // Deep black
const COLOR_WHITE = new THREE.Color('#ffffff'); // Pure white
const SPHERE_RADIUS = 4.5; // Radius of the Tai Chi Sphere

/**
 * Generates particle data.
 * Returns arrays for initial positions, target sphere positions, and colors.
 * The particles now fill the volume of the sphere instead of just the surface.
 */
export const generateParticles = (count: number) => {
  const initialPositions = new Float32Array(count * 3);
  const targetPositions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  // Helper to set array values
  const setVec3 = (arr: Float32Array, i: number, x: number, y: number, z: number) => {
    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  };

  // Used for scattering logic - significantly larger area
  const scatterRadius = SPHERE_RADIUS * 5;

  for (let i = 0; i < count; i++) {
    // --- 1. Target: Volumetric Random Point inside Sphere ---
    // Generate a random point uniformly distributed inside the sphere volume
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    // Cubic root of random ensures uniform distribution in volume (not clustered at center)
    const r = SPHERE_RADIUS * Math.cbrt(Math.random());

    const tx = r * Math.sin(phi) * Math.cos(theta);
    const ty = r * Math.sin(phi) * Math.sin(theta);
    const tz = r * Math.cos(phi);

    setVec3(targetPositions, i, tx, ty, tz);

    // --- 2. Color: Volumetric Tai Chi Logic ---
    // We define the Tai Chi shape within the 3D volume.
    // Main separation is projected along Z (cylindrical-ish feel for the swirl),
    // but the "Eyes" are true internal 3D spheres.
    
    let color = COLOR_BLACK; // Default fallback

    // Configuration
    const eyeRadius = SPHERE_RADIUS * 0.22; // Radius of the inner particle spheres
    const swirlRadius = SPHERE_RADIUS * 0.5; // Radius of the main top/bottom circles for the swirl curve

    // Distance to the centers of the "Eyes"
    // Top Eye (Black sphere inside White area) -> Center (0, R/2, 0)
    const distToTopEye = Math.sqrt(tx * tx + (ty - SPHERE_RADIUS / 2) ** 2 + tz * tz);
    
    // Bottom Eye (White sphere inside Black area) -> Center (0, -R/2, 0)
    const distToBottomEye = Math.sqrt(tx * tx + (ty + SPHERE_RADIUS / 2) ** 2 + tz * tz);

    if (distToTopEye < eyeRadius) {
      // Inside the top eye sphere -> Black
      color = COLOR_BLACK;
    } else if (distToBottomEye < eyeRadius) {
      // Inside the bottom eye sphere -> White
      color = COLOR_WHITE;
    } else {
      // Not in an eye, determine Yin/Yang body color
      // We use a projection logic on the XY plane to define the swirl,
      // extending it through the volume (Z-axis).
      
      // Base split: Right side (x > 0) is generally White
      let isWhite = tx > 0;

      // Top Circle (White) invades the Left (Black) side
      // Center (0, R/2) on XY plane
      const distToTopSwirl = Math.sqrt(tx * tx + (ty - SPHERE_RADIUS / 2) ** 2);
      if (distToTopSwirl < swirlRadius) {
        isWhite = true;
      }

      // Bottom Circle (Black) invades the Right (White) side
      // Center (0, -R/2) on XY plane
      const distToBottomSwirl = Math.sqrt(tx * tx + (ty + SPHERE_RADIUS / 2) ** 2);
      if (distToBottomSwirl < swirlRadius) {
        isWhite = false;
      }

      color = isWhite ? COLOR_WHITE : COLOR_BLACK;
    }

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    // --- 3. Initial: Random scatter in a larger cloud ---
    // Random position in a large sphere for the 'chaos' mode
    const ir = scatterRadius * Math.cbrt(Math.random());
    const itheta = Math.random() * 2 * Math.PI;
    const iphi = Math.acos(2 * Math.random() - 1);
    
    const ix = ir * Math.sin(iphi) * Math.cos(itheta);
    const iy = ir * Math.sin(iphi) * Math.sin(itheta);
    const iz = ir * Math.cos(iphi);

    setVec3(initialPositions, i, ix, iy, iz);
  }

  return { initialPositions, targetPositions, colors };
};