'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        // Fog to blend the object into the dark background seamlessly
        scene.fog = new THREE.FogExp2(0x050505, 0.002);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high DPI
        mountRef.current.appendChild(renderer.domElement);

        // --- GEOMETRY: THE "NEURAL CORE" ---
        // Using an Icosahedron with detail level 1 for a tech-geometric look
        const geometry = new THREE.IcosahedronGeometry(2.5, 1);
        
        // Material: Sharp Yellow Wireframe
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xFFC21A, // Project Yellow
            wireframe: true,
            transparent: true,
            opacity: 0.15 
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Inner Core (Solid, Darker)
        const coreGeo = new THREE.IcosahedronGeometry(1.5, 0);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        // --- PARTICLES ---
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            // Spread particles across the screen
            posArray[i] = (Math.random() - 0.5) * 15; 
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x444444, // Subtle grey dust
            transparent: true,
            opacity: 0.8
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // --- ANIMATION LOOP ---
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);

            // Rotate Main Sphere
            sphere.rotation.x += 0.001;
            sphere.rotation.y += 0.002;

            // Rotate Core (Counter-rotation)
            core.rotation.x -= 0.002;
            core.rotation.y -= 0.001;

            // Subtle "Breathing" scale effect
            const time = Date.now() * 0.001;
            const scale = 1 + Math.sin(time) * 0.05;
            sphere.scale.set(scale, scale, scale);

            // Rotate Particles
            particlesMesh.rotation.y = -time * 0.05;

            renderer.render(scene, camera);
        };

        animate();

        // --- RESIZE HANDLER ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            // Dispose Three.js resources to prevent memory leaks
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div 
            ref={mountRef} 
            className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen"
        />
    );
}