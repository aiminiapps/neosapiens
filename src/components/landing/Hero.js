'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useTransform, useSpring, useMotionValue, useTime } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';
import { 
    RiArrowRightLine, 
    RiCpuLine, 
    RiShieldCheckLine, 
    RiAlertLine,
    RiGlobeLine
} from 'react-icons/ri';

// --- 1. THE RADAR GRID (Three.js) ---
const RadarTerrain = ({ mouseX, mouseY }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        // 1. Black Fog for "Control/Authority" and depth
        scene.fog = new THREE.FogExp2(0x000000, 0.0025); 

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 25);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // --- GRID: "Intelligence Yellow" ---
        // Top grid (Ceiling) - faint
        const gridTop = new THREE.GridHelper(200, 40, 0x333333, 0x111111);
        gridTop.position.y = 10;
        scene.add(gridTop);

        // Bottom grid (Floor) - Active
        const gridBottom = new THREE.GridHelper(200, 50, 0xFFD700, 0x1a1a1a); // Yellow Center line
        gridBottom.position.y = -5;
        scene.add(gridBottom);

        // --- FLOATING "INTEL" NODES ---
        // These represent data points (Yellow = Intelligence, Green = Trust)
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const materialYellow = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        const materialGreen = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
        
        const cubes = [];
        for (let i = 0; i < 50; i++) {
            const isIntel = Math.random() > 0.5;
            const mesh = new THREE.Mesh(geometry, isIntel ? materialYellow : materialGreen);
            
            mesh.position.x = (Math.random() - 0.5) * 100;
            mesh.position.y = (Math.random() - 0.5) * 20;
            mesh.position.z = (Math.random() - 0.5) * 100;
            
            scene.add(mesh);
            cubes.push(mesh);
        }

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Move Grids to simulate speed
            gridTop.position.z += 0.1;
            gridBottom.position.z += 0.2;
            if (gridTop.position.z > 50) gridTop.position.z = 0;
            if (gridBottom.position.z > 50) gridBottom.position.z = 0;

            // Move Cubes
            cubes.forEach((cube, i) => {
                cube.position.z += 0.3;
                if (cube.position.z > 30) cube.position.z = -100; // Reset far back
            });

            // Smooth Camera Banking (Cockpit feel)
            const rotX = mouseY.get() * 0.0001;
            const rotY = mouseX.get() * 0.0001;
            camera.rotation.x = -0.05 + rotX;
            camera.rotation.y = rotY;

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if(mountRef.current) mountRef.current.innerHTML = '';
        };
    }, [mouseX, mouseY]);

    return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none mix-blend-screen" />;
};

// --- 2. MICRO-DETAILS (The HUD) ---

const ScanLine = () => (
    <div className="absolute inset-0 pointer-events-none z-[20] opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%]" />
);

const CompassBar = ({ mouseX }) => {
    // Sliding tape animation based on mouse X
    const x = useTransform(mouseX, [-1000, 1000], [-100, 100]);
    
    return (
        <div className="absolute top-0 left-0 right-0 h-16 flex justify-center overflow-hidden z-[5]">
            <div className="w-[600px] h-full relative mask-sides">
                {/* Center Marker (Yellow = Intent) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#FFD700] z-10 shadow-[0_0_10px_#FFD700]" />
                
                <motion.div style={{ x }} className="absolute top-2 left-0 right-0 flex justify-center gap-12 text-[10px] font-mono text-white/40">
                    <span>280</span><span>290</span><span>300</span><span>310</span><span>320</span><span>330</span>
                    <span className="text-white font-bold">N</span>
                    <span>010</span><span>020</span><span>030</span><span>040</span><span>050</span><span>060</span>
                </motion.div>
                
                {/* Bottom Border with Ticks */}
                <div className="absolute bottom-4 left-0 right-0 h-px bg-white/10" />
            </div>
        </div>
    )
}

const SideWidgets = () => {
    // Simulated random data fluctuation
    const time = useTime();
    const cpuHeight = useTransform(time, [0, 2000], ["20%", "60%"]);
    
    return (
        <>
            {/* LEFT: System Health (Green = Trust) */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 hidden md:flex flex-col gap-6 z-[5]">
                <div className="flex flex-col gap-1 items-start">
                    <span className="text-[9px] text-green-500 uppercase tracking-widest font-mono">Sys_Ok</span>
                    <div className="w-full h-32 border-l border-green-500/30 relative">
                        {/* Animated Bar */}
                        <motion.div 
                            style={{ height: cpuHeight }} 
                            className="absolute bottom-0 left-0 w-1 bg-green-500/50" 
                        />
                        {/* Ticks */}
                        <div className="absolute left-0 top-0 w-2 h-px bg-green-500" />
                        <div className="absolute left-0 bottom-0 w-2 h-px bg-green-500" />
                    </div>
                </div>
            </div>

            {/* RIGHT: Threat/Output Level (Red/Yellow) */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-12 hidden md:flex flex-col gap-6 items-end z-[5]">
                <div className="flex flex-col gap-1 items-end">
                    <span className="text-[9px] text-[#FFD700] uppercase tracking-widest font-mono">Output</span>
                    <div className="w-full h-32 border-r border-[#FFD700]/30 relative">
                        {/* Static High Level */}
                        <div className="absolute bottom-0 right-0 w-1 h-[80%] bg-[#FFD700]/50" />
                        {/* Danger Zone Marker (Red) */}
                        <div className="absolute top-0 right-0 w-3 h-px bg-red-500 shadow-[0_0_5px_red]" />
                    </div>
                </div>
            </div>
        </>
    )
}

// --- 3. THE "INTENT" SWITCH (CTA) ---
const OverrideButton = () => {
    return (
        <Link href="/dashboard" className="group relative inline-block mt-8">
            {/* Button Container */}
            <div className="relative z-10 flex items-center bg-black/80 border border-white/20 pl-6 pr-2 py-2 overflow-hidden hover:border-[#FFD700] transition-colors duration-300">
                
                {/* Micro Details: Corner screws */}
                <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-white/50" />
                <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-white/50" />

                {/* Left Status Light */}
                <div className="mr-6 flex flex-col gap-0.5">
                    <div className="w-8 h-1 bg-[#FFD700]/20 group-hover:bg-[#FFD700] transition-colors" />
                    <div className="w-5 h-1 bg-[#FFD700]/20 group-hover:bg-[#FFD700] transition-colors delay-75" />
                    <div className="w-3 h-1 bg-[#FFD700]/20 group-hover:bg-[#FFD700] transition-colors delay-100" />
                </div>

                {/* Text */}
                <div className="flex flex-col mr-8">
                    <span className="text-[8px] uppercase tracking-widest text-gray-500 font-mono group-hover:text-[#FFD700]">Manual Override</span>
                    <span className="text-sm font-bold text-white tracking-[0.2em] uppercase">Initialize</span>
                </div>

                {/* The "Switch" Block */}
                <div className="h-10 w-12 bg-[#FFD700] flex items-center justify-center text-black font-bold group-hover:scale-105 transition-transform">
                    <RiArrowRightLine size={18} />
                </div>
            </div>
        </Link>
    )
}

// --- 4. MAIN COMPONENT ---
export default function CommanderHero() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        mouseX.set(clientX - window.innerWidth / 2);
        mouseY.set(clientY - window.innerHeight / 2);
    };

    return (
        <section 
            className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center"
            onMouseMove={handleMouseMove}
        >
            {/* 1. BACKGROUND LAYERS */}
            {/* Three.js Radar */}
            <RadarTerrain mouseX={mouseX} mouseY={mouseY} />
            
            {/* Cinematic Noise (Fine grain) */}
            <div className="absolute inset-0 pointer-events-none z-[2] opacity-[0.07]" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} 
            />
            {/* Vignette (Focus attention to center) */}
            <div className="absolute inset-0 pointer-events-none z-[3] bg-[radial-gradient(circle_at_center,transparent_10%,#000000_100%)]" />
            
            {/* Scanlines */}
            <ScanLine />

            {/* 2. HUD INTERFACE */}
            <div className="absolute inset-0 pointer-events-none z-[10] select-none">
                <CompassBar mouseX={mouseX} />
                <SideWidgets />
                {/* Center Reticle (Subtle) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 border border-white/20 rounded-full border-dashed animate-[spin_120s_linear_infinite]" />
            </div>

            {/* 3. MAIN CONTENT */}
            <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center">
                
                {/* Status Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse shadow-[0_0_8px_#FFD700]" />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/70">Awaiting Command</span>
                </motion.div>

                {/* Title */}
                <div className="relative">
                    {/* Decorative Brackets */}
                    <span className="absolute -left-8 -top-4 text-4xl text-white/10 font-thin hidden md:block">{'['}</span>
                    <span className="absolute -right-8 -top-4 text-4xl text-white/10 font-thin hidden md:block">{']'}</span>

                    <motion.h1 
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl"
                    >
                        The Autonomous <br />
                        <span className="text-[#FFD700]/90">
                            Intelligence Engine
                        </span>
                    </motion.h1>
                </div>

                {/* Description */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-6 max-w-xl text-lg text-gray-400 font-light leading-relaxed"
                >
                    Deploy agents that understand <span className="text-white font-medium">risk</span> and <span className="text-white font-medium">reward</span>.
                    <br className="hidden md:block"/> Full control over your decentralized economy.
                </motion.p>

                {/* CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <OverrideButton />
                </motion.div>
            </div>

            <style jsx global>{`
                .mask-sides {
                    mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
                }
            `}</style>
        </section>
    );
}