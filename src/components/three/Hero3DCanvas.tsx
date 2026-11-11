import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Hero3DCanvasProps {
  className?: string;
  intensity?: number;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({
  className = "w-full h-full",
  intensity = 1.0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // LIGHTS: Luxury Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5f8, 1.8 * intensity);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5 * intensity);
    mainLight.position.set(4, 5, 5);
    scene.add(mainLight);

    // Rose-Gold Point Light (follows mouse)
    const roseLight = new THREE.PointLight(0xb76e79, 3.5 * intensity, 15);
    roseLight.position.set(-3, 2, 4);
    scene.add(roseLight);

    // Soft Blush Rim Light
    const blushLight = new THREE.PointLight(0xefa6c8, 2.5 * intensity, 12);
    blushLight.position.set(3, -2, 2);
    scene.add(blushLight);

    // 1. FLOATING 3D NAIL POLISH BOTTLE GROUP
    const bottleGroup = new THREE.Group();

    // Bottle Glass Body (Cube / Squoval)
    const bottleGeo = new THREE.BoxGeometry(0.9, 1.1, 0.9);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
      thickness: 0.6,
      reflectivity: 0.9,
    });
    const bottleMesh = new THREE.Mesh(bottleGeo, glassMat);
    bottleGroup.add(bottleMesh);

    // Pink Lacquer Inner Fluid
    const fluidGeo = new THREE.BoxGeometry(0.75, 0.85, 0.75);
    const fluidMat = new THREE.MeshStandardMaterial({
      color: 0xefa6c8,
      roughness: 0.15,
      metalness: 0.1,
    });
    const fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
    fluidMesh.position.y = -0.08;
    bottleGroup.add(fluidMesh);

    // Rose-Gold Metallic Bottle Neck & Cap
    const capGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.75, 32);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xb76e79,
      metalness: 0.85,
      roughness: 0.2,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 0.9;
    bottleGroup.add(capMesh);

    // Position bottle in 3D space
    bottleGroup.position.set(2.2, -1.2, 0.8);
    bottleGroup.scale.set(0.85, 0.85, 0.85);
    scene.add(bottleGroup);

    // 2. 3D FLOATING PEARLS
    const pearlGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const pearlMat = new THREE.MeshStandardMaterial({
      color: 0xfff9fc,
      metalness: 0.35,
      roughness: 0.1,
    });

    const pearls: THREE.Mesh[] = [];
    const pearlConfigs = [
      { pos: [-2.4, 1.6, 0.5], scale: 1.1, speed: 0.8 },
      { pos: [2.5, 1.8, -0.5], scale: 0.8, speed: 1.1 },
      { pos: [-2.1, -1.8, 1.2], scale: 0.95, speed: 0.9 },
      { pos: [1.8, -2.1, 0.2], scale: 0.7, speed: 1.3 },
    ];

    pearlConfigs.forEach((cfg) => {
      const p = new THREE.Mesh(pearlGeo, pearlMat);
      p.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      p.scale.setScalar(cfg.scale);
      scene.add(p);
      pearls.push(p);
    });

    // 3. 3D FLOATING SPARKLE STARS / CRYSTALS
    const starGeo = new THREE.OctahedronGeometry(0.12, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xb76e79,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x57243b,
      emissiveIntensity: 0.2,
    });

    const stars: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3
      );
      star.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(star);
      stars.push(star);
    }

    // 4. ROSE GOLD & BLUSH GLOWING PARTICLES
    const particleCount = prefersReducedMotion ? 20 : 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 7;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      color: 0xefa6c8,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // MOUSE PARALLAX
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.5;
      targetY = -y * 1.5;
    };

    window.addEventListener("mousemove", onMouseMove);

    // RESIZE LISTENER
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    // ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera lerp with mouse
      if (!prefersReducedMotion) {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;
        camera.position.x = currentX;
        camera.position.y = currentY;
        camera.lookAt(0, 0, 0);

        roseLight.position.x = currentX * 2 - 2;
        roseLight.position.y = currentY * 2 + 1;
      }

      // Bottle floating & subtle rotation
      bottleGroup.position.y = -1.2 + Math.sin(elapsed * 1.2) * 0.12;
      bottleGroup.rotation.y = elapsed * 0.4;
      bottleGroup.rotation.x = Math.sin(elapsed * 0.8) * 0.08;

      // Pearls bobbing
      pearls.forEach((p, idx) => {
        const cfg = pearlConfigs[idx];
        p.position.y = cfg.pos[1] + Math.sin(elapsed * cfg.speed + idx) * 0.14;
        p.rotation.y = elapsed * 0.3;
      });

      // Stars rotating
      stars.forEach((s, idx) => {
        s.rotation.x += 0.01;
        s.rotation.y += 0.015;
        s.position.y += Math.sin(elapsed * 1.5 + idx) * 0.002;
      });

      // Gentle particles drift
      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bottleGeo.dispose();
      glassMat.dispose();
      fluidGeo.dispose();
      fluidMat.dispose();
      capGeo.dispose();
      capMat.dispose();
      pearlGeo.dispose();
      pearlMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={`relative pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};
