'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const Hero3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Initialize Scene, Camera, Renderer
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 6.5;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to 2D aesthetic.', e);
      setHasWebGL(false);
      return;
    }

    // 2. Lighting System (Approved Palette: Toffee Brown #8E592F + Chartreuse #B5E619)
    const ambientLight = new THREE.AmbientLight(0x001514, 2.5);
    scene.add(ambientLight);

    // Warm Bronze Spotlight (Left)
    const warmLight = new THREE.PointLight(0x8E592F, 18, 20);
    warmLight.position.set(-4, 3, 3);
    scene.add(warmLight);

    // Electric Chartreuse Spotlight (Right)
    const chartreuseLight = new THREE.PointLight(0xB5E619, 14, 20);
    chartreuseLight.position.set(4, -2, 4);
    scene.add(chartreuseLight);

    // Subtle Powder Blue Rim Light (Back)
    const blueRimLight = new THREE.DirectionalLight(0xAFC2D5, 2.0);
    blueRimLight.position.set(0, 5, -5);
    scene.add(blueRimLight);

    // 3. Build Cinema Lens & Neural Core 3D Geometry
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Outer Anamorphic Lens Ring
    const outerRingGeo = new THREE.TorusGeometry(1.9, 0.08, 32, 100);
    const darkMetalMat = new THREE.MeshPhysicalMaterial({
      color: 0x061A19,
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, darkMetalMat);
    masterGroup.add(outerRing);

    // Inner Gimbal Frame (Gold/Bronze)
    const innerRingGeo = new THREE.TorusGeometry(1.5, 0.05, 24, 80);
    const bronzeMat = new THREE.MeshPhysicalMaterial({
      color: 0x8E592F,
      metalness: 0.85,
      roughness: 0.3,
      emissive: 0x8E592F,
      emissiveIntensity: 0.15,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, bronzeMat);
    masterGroup.add(innerRing);

    // Aperture Blades / Optical Disc
    const cylinderGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 64, 1, true);
    const chartreuseAccMat = new THREE.MeshStandardMaterial({
      color: 0x071D1C,
      metalness: 0.8,
      roughness: 0.4,
      wireframe: true,
    });
    const apertureCylinder = new THREE.Mesh(cylinderGeo, chartreuseAccMat);
    masterGroup.add(apertureCylinder);

    // Glass Optical Element Core
    const coreGlassGeo = new THREE.IcosahedronGeometry(0.85, 4);
    const coreGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xFBFFFE,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      ior: 1.5,
      thickness: 1.2,
      emissive: 0xB5E619,
      emissiveIntensity: 0.2,
    });
    const coreElement = new THREE.Mesh(coreGlassGeo, coreGlassMat);
    masterGroup.add(coreElement);

    // Ambient floating dust particles
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xB5E619,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    setIsLoaded(true);

    // 4. Mouse Pointer Tracking with Inertial Lerp
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotationY = x * 0.85;
      targetRotationX = -y * 0.65;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // 5. Visibility Observer (Pause when off-screen)
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse tilt interpolation
      currentRotationX += (targetRotationX - currentRotationX) * 0.06;
      currentRotationY += (targetRotationY - currentRotationY) * 0.06;

      masterGroup.rotation.x = currentRotationX + Math.sin(elapsedTime * 0.5) * 0.08;
      masterGroup.rotation.y = currentRotationY + elapsedTime * 0.25;

      innerRing.rotation.x = elapsedTime * 0.4;
      innerRing.rotation.y = elapsedTime * 0.3;

      coreElement.rotation.y = -elapsedTime * 0.35;
      coreElement.rotation.z = Math.sin(elapsedTime * 0.8) * 0.2;

      particleSystem.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450px] md:h-[550px] lg:h-[620px] flex items-center justify-center pointer-events-none select-none"
    >
      {/* Background warm cinematic lighting glow */}
      <div className="absolute w-72 h-72 rounded-full bg-toffee-brown/25 filter blur-[90px] -top-10 -left-10 pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-chartreuse/15 filter blur-[100px] -bottom-10 -right-10 pointer-events-none" />

      {/* Fallback if WebGL fails */}
      {!hasWebGL && (
        <div className="w-64 h-64 rounded-full border-2 border-chartreuse/40 bg-card/60 flex items-center justify-center text-center p-6 backdrop-blur-md shadow-glow-chartreuse">
          <span className="text-chartreuse font-mono text-sm uppercase tracking-wider">
            [ Cinematic Lens Core // Active ]
          </span>
        </div>
      )}
    </div>
  );
};
