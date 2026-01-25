'use client';

import { useEffect, useRef, useState } from 'react';
import { 
    motion, 
    useTransform, 
    useSpring, 
    useMotionValue, 
    useVelocity,
    useAnimationFrame 
} from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';
import { 
    RiArrowRightLine, 
    RiCpuLine, 
    RiShieldCheckLine, 
    RiAlertLine,
    RiFocus3Line
} from 'react-icons/ri';

// --- 1. THE COCKPIT ENGINE (Three.js + Dust + Grid) ---
const CockpitScene = ({ mouseX, mouseY }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.003); // Deep Black Fog

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 20);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // A. THE GRID (Speed Reference)
        const gridBottom = new THREE.GridHelper(200, 50, 0xFFD700, 0x111111);
        gridBottom.position.y = -5;
        scene.add(gridBottom);

        // B. THE DUST (Velocity Particles)
        const dustGeometry = new THREE.BufferGeometry();
        const dustCount = 800;
        const posArray = new Float32Array(dustCount * 3);
        
        for(let i = 0; i < dustCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 150; // Wide spread
        }
        
        dustGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const dustMaterial = new THREE.PointsMaterial({
            size: 0.15,
            color: 0xFFD700, // Intelligence Yellow
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
        scene.add(dustParticles);

        // Animation Loop
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);

            // 1. Grid Speed
            gridBottom.position.z += 0.15;
            if (gridBottom.position.z > 20) gridBottom.position.z = 0;

            // 2. Dust Warp Speed
            const positions = dustParticles.geometry.attributes.position.array;
            for(let i = 2; i < dustCount * 3; i += 3) {
                positions[i] += 0.4; // Move towards camera
                if (positions[i] > 20) {
                    positions[i] = -100; // Reset far back
                }
            }
            dustParticles.geometry.attributes.position.needsUpdate = true;

            // 3. Smooth Camera Banking (Buttery Lerp)
            // We use a small fraction (0.05) to ease the camera towards the mouse position
            const targetRotX = -0.05 + (mouseY.get() * 0.0001);
            const targetRotY = mouseX.get() * 0.0001;
            
            camera.rotation.x += (targetRotX - camera.rotation.x) * 0.05;
            camera.rotation.y += (targetRotY - camera.rotation.y) * 0.05;

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
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
            if(mountRef.current) mountRef.current.innerHTML = '';
            dustGeometry.dispose();
            dustMaterial.dispose();
        };
    }, [mouseX, mouseY]);

    return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none mix-blend-screen" />;
};

// --- 2. ADVANCED HUD WIDGETS ---

// A. Compass Tape (Top)
const CompassTape = ({ smoothX }) => {
    const x = useTransform(smoothX, [-1000, 1000], [-50, 50]);
    return (
        <div className="absolute top-0 left-0 right-0 h-20 flex justify-center z-[10] overflow-hidden mask-gradient-x">
            <div className="relative w-[600px] h-full border-b border-white/10">
                {/* Center Reticle */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-[#FFD700] z-20 shadow-[0_0_10px_#FFD700]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-px bg-[#FFD700]/50" />
                
                {/* Moving Numbers */}
                <motion.div style={{ x }} className="absolute bottom-2 left-0 right-0 flex justify-center gap-16 text-[10px] font-mono text-white/30">
                    <span>240</span><span>270</span><span>300</span><span>330</span>
                    <span className="text-white font-bold">N</span>
                    <span>030</span><span>060</span><span>090</span><span>120</span>
                </motion.div>
            </div>
        </div>
    );
};

// B. G-Force Meter (Right) - Reacts to velocity
const GForceMeter = ({ mouseX }) => {
    const velocity = useVelocity(mouseX);
    const [gForce, setGForce] = useState(0);

    useAnimationFrame(() => {
        // Calculate "G-Force" based on how fast mouse is moving
        const currentVel = Math.abs(velocity.get());
        // Dampen the value for smooth display
        setGForce(prev => prev + (currentVel - prev) * 0.1);
    });

    // Map velocity to height percentage (0 to 100)
    const height = Math.min((gForce / 2000) * 100, 100); 

    return (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-16 hidden md:flex flex-col items-end gap-2 z-[10]">
            <div className="text-[9px] text-[#FFD700] font-mono tracking-widest uppercase text-right">
                G-Force<br/><span className="text-white/50">Accelerometer</span>
            </div>
            <div className="h-40 w-1 bg-white/10 relative overflow-hidden">
                {/* The Active Bar */}
                <motion.div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-transparent via-[#FFD700] to-red-500"
                    style={{ height: `${height}%` }}
                />
                {/* Ticks */}
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="absolute w-2 h-px bg-black right-0" style={{ bottom: `${i * 10}%` }} />
                ))}
            </div>
            <div className="text-xs font-mono text-white/80">
                {(height / 10).toFixed(1)} <span className="text-[#FFD700] text-[9px]">G</span>
            </div>
        </div>
    );
};

// --- 3. THE "ARM SYSTEM" CTA BUTTON ---
const ArmSystemButton = () => {
    return (
        <Link href="/ai" className="group relative inline-block mt-12 cursor-none-override">
            {/* 1. Outer Chassis (The Frame) */}
            <div className="relative z-10 flex items-center bg-[#050505] border border-white/10 px-1 py-1 overflow-hidden transition-all duration-500 group-hover:border-[#FFD700]/60 group-hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]">
                
                {/* 2. The Inner "Button" Surface */}
                <div className="relative px-8 py-4 bg-[#111] flex items-center gap-6 overflow-hidden">
                    
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]" />
                    
                    {/* Animated "Scan" Shine */}
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent skew-x-12 z-0" />

                    {/* Left Icon (Targeting) */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-8 h-8 rounded border border-white/10 text-white/40 group-hover:text-[#FFD700] group-hover:border-[#FFD700] transition-colors duration-300">
                        <RiFocus3Line className="animate-[spin_4s_linear_infinite]" />
                    </div>

                    {/* Text Block */}
                    <div className="relative z-10 flex flex-col">
                        <div className="h-5 overflow-hidden relative">
                            {/* Text Swap Animation */}
                            <div className="flex flex-col transition-transform duration-300 group-hover:-translate-y-5">
                                <span className="text-sm font-bold text-white tracking-[0.2em] uppercase h-5 flex items-center">
                                    AI Center
                                </span>
                                <span className="text-sm font-bold text-[#FFD700] tracking-[0.2em] uppercase h-5 flex items-center">
                                    Onboarding...
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Arrow (The Trigger) */}
                    <div className="relative z-10 w-px h-8 bg-white/10 group-hover:bg-[#FFD700]/50 transition-colors" />
                    <RiArrowRightLine className="relative z-10 text-white group-hover:translate-x-1 transition-transform duration-300 group-hover:text-[#FFD700]" />
                </div>

                {/* 3. Corner Brackets (Tech Detail) */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 group-hover:border-[#FFD700]" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 group-hover:border-[#FFD700]" />
            </div>
        </Link>
    );
};

// --- 4. MAIN HERO ---
export default function CockpitHero() {
    // 1. Raw Mouse Motion
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 2. "Buttery" Smooth Physics (Springs)
    // High damping = heavy fluid feel. Stiffness = responsiveness.
    const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

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
            {/* A. 3D BACKGROUND */}
            <CockpitScene mouseX={smoothX} mouseY={smoothY} />
            
            {/* B. TEXTURE OVERLAYS */}
            {/* Noise */}
            <div className="absolute inset-0 pointer-events-none z-[2] opacity-[0.06] mix-blend-overlay" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} 
            />
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none z-[3] bg-[radial-gradient(circle_at_center,transparent_0%,#000000_110%)]" />
            
            {/* C. HUD INTERFACE */}
            <div className="absolute inset-0 pointer-events-none z-[10] select-none">
                <CompassTape smoothX={smoothX} />
                <GForceMeter mouseX={smoothX} />
                
                {/* Left Status (Green = Trust) */}
                <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:block">
                    <div className="flex items-center gap-3 mb-2">
                        <RiShieldCheckLine className="text-green-500" />
                        <span className="text-[9px] font-mono text-green-500 tracking-widest uppercase">Systems Normal</span>
                    </div>
                    <div className="w-1 h-24 bg-green-900/30 relative">
                        <div className="absolute bottom-0 w-full h-[75%] bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                        {/* Static Grid Lines */}
                        <div className="absolute top-[25%] w-3 h-px bg-green-500" />
                        <div className="absolute top-[50%] w-3 h-px bg-green-500" />
                        <div className="absolute top-[75%] w-3 h-px bg-green-500" />
                    </div>
                </div>

                {/* Bottom Threat Monitor (Red = Danger) */}
                <div className="absolute bottom-6 w-full flex justify-center">
                    <div className="flex items-center gap-4 px-4 py-2 bg-red-950/10 border border-red-500/10 rounded-full backdrop-blur-sm">
                        <RiAlertLine className="text-red-500/50" size={14} />
                        <span className="text-[9px] font-mono text-red-500/50 tracking-widest uppercase">
                            Global Threat Level: <span className="text-white/80">Zero</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* D. HERO CONTENT */}
            <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center">
                
                {/* Animated Status Pill */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 hidden flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD700]"></span>
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-medium">
                        Pilot Access Granted
                    </span>
                </motion.div>

                {/* Main Title */}
                <div className="relative">
                    {/* Ghost Brackets */}
                    <span className="absolute -left-12 top-0 text-6xl text-white/5 font-thin hidden lg:block opacity-50">{'['}</span>
                    <span className="absolute -right-12 top-0 text-6xl text-white/5 font-thin hidden lg:block opacity-50">{']'}</span>

                    <motion.h1 
                        initial={{ opacity: 0, filter: "blur(12px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1]"
                    >
                        AI Agents That <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-yellow-100 to-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.3)]">
                            Act on the Economy
                        </span>
                    </motion.h1>
                </div>

                {/* Subtext */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-8 max-w-lg text-sm sm:text-lg text-gray-400 font-light leading-relaxed"
                >
                    Observe how autonomous <span className="text-gray-300 font-normal">AI agents interpret real on-chain activity</span>,form economic intent, and <span className="text-gray-300 font-normal">signal opportunities and risks</span>using live blockchain data, not assumptions.
                </motion.p>

                {/* THE NEW CTA */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <ArmSystemButton />
                </motion.div>

            </div>

            {/* Global Styles for masking */}
            <style jsx global>{`
                .mask-gradient-x {
                    mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
                }
            `}</style>
        </section>
    );
}