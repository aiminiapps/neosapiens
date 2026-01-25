'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';
import { RiArrowRightLine, RiFocus3Line, RiGlobalLine, RiCpuLine } from 'react-icons/ri';

// --- 1. THREE.JS: INFINITE VELOCITY GRID (The Flight Feel) ---
const AvionicsBackground = ({ mouseX, mouseY }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.0015); // Deep luxury fog

        const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 3, 30); // Pilot's eye view
        camera.lookAt(0, 0, -50);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // --- GRID TERRAIN ---
        // We create two grids to simulate infinite movement by looping them
        const gridHelper = new THREE.GridHelper(200, 80, 0x333333, 0x111111);
        gridHelper.position.y = -5;
        gridHelper.scale.z = 2; // Stretch for speed illusion
        scene.add(gridHelper);

        const gridHelper2 = new THREE.GridHelper(200, 80, 0x333333, 0x111111);
        gridHelper2.position.y = -5;
        gridHelper2.position.z = -200; // Place behind the first
        gridHelper2.scale.z = 2;
        scene.add(gridHelper2);

        // --- CEILING LIGHTS (Runway Lights) ---
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 40; i++) {
            vertices.push((Math.random() - 0.5) * 100, (Math.random()) * 20 + 10, (Math.random()) * -100);
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.6 });
        const stars = new THREE.Points(geometry, material);
        scene.add(stars);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Infinite Floor Logic
            const speed = 0.4;
            gridHelper.position.z += speed;
            gridHelper2.position.z += speed;
            stars.position.z += speed;

            if (gridHelper.position.z >= 200) gridHelper.position.z = -200;
            if (gridHelper2.position.z >= 200) gridHelper2.position.z = -200;
            if (stars.position.z >= 50) stars.position.z = -100;

            // Pilot Head Movement (Parallax)
            const rotX = mouseY.get() * 0.0002;
            const rotY = mouseX.get() * 0.0002;
            
            camera.rotation.x = -0.1 + rotX; // Slight tilt down
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

    return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

// --- 2. HUD COMPONENTS (Animated Vectors) ---

const Reticle = () => (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow-reverse">
            <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="0.1" fill="none" strokeDasharray="1 2" />
            <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.1" fill="none" />
            <path d="M50,2 L50,10 M50,90 L50,98 M2,50 L10,50 M90,50 L98,50" stroke="white" strokeWidth="0.5" />
        </svg>
    </div>
);

const CompassTape = ({ mouseX }) => {
    const x = useTransform(mouseX, [-1000, 1000], [-50, 50]);
    return (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-96 h-12 overflow-hidden border-b border-white/20 mask-linear-fade">
            <motion.div style={{ x }} className="flex gap-8 justify-center items-end h-full pb-1 text-xs text-white/50 font-mono">
                <span>330</span><span>|</span><span>340</span><span>|</span>
                <span className="text-white font-bold text-sm">N</span>
                <span>|</span><span>010</span><span>|</span><span>020</span>
                <span>|</span><span>030</span><span>|</span><span>040</span>
            </motion.div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white" />
        </div>
    );
};

const Altimeter = () => (
    <div className="absolute right-8 top-1/3 bottom-1/3 w-16 border-l border-white/20 flex flex-col justify-between items-start pl-2 py-4 mask-vertical-fade">
        {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 w-full opacity-50">
                <div className="w-2 h-px bg-white" />
                <span className="text-[10px] font-mono text-white/70">{(2000 + (i * 100))}</span>
            </div>
        ))}
        {/* Active Indicator */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-[5px] flex items-center gap-2">
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-white" />
            <div className="px-2 py-1 bg-white/10 backdrop-blur text-xs font-bold font-mono text-white border border-white/20">2,500</div>
        </div>
    </div>
);

const Speedometer = () => (
    <div className="absolute left-8 top-1/3 bottom-1/3 w-16 border-r border-white/20 flex flex-col justify-between items-end pr-2 py-4 mask-vertical-fade">
        {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 w-full justify-end opacity-50">
                <span className="text-[10px] font-mono text-white/70">{(400 + (i * 10))}</span>
                <div className="w-2 h-px bg-white" />
            </div>
        ))}
        {/* Active Indicator */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-[5px] flex flex-row-reverse items-center gap-2">
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[8px] border-r-white" />
            <div className="px-2 py-1 bg-white/10 backdrop-blur text-xs font-bold font-mono text-white border border-white/20">450</div>
        </div>
    </div>
);

// --- 3. THE "ARM & LAUNCH" BUTTON ---
const LaunchButton = () => {
    return (
        <Link href="/dashboard" className="group relative inline-flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Main Chassis */}
            <div className="relative z-10 h-14 pl-8 pr-2 bg-black/40 backdrop-blur-md border border-white/20 flex items-center gap-6 overflow-hidden transition-all duration-300 group-hover:border-cyan-400/50">
                
                {/* Diagonal Stripe (Hazard Style) */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50" />
                
                {/* Text Block */}
                <div className="flex flex-col items-start">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400 group-hover:text-white transition-colors">
                        Ready to engage
                    </span>
                    <span className="text-base font-bold text-white tracking-widest uppercase">
                        Initialize System
                    </span>
                </div>

                {/* The "Switch" */}
                <div className="relative h-10 w-12 bg-white/5 border-l border-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                    <RiArrowRightLine className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
            </div>

            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </Link>
    );
};

// --- 4. MAIN HERO COMPONENT ---
export default function LuxuryCockpitHero() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        // Normalize coordinates for camera rotation
        mouseX.set(clientX - window.innerWidth / 2);
        mouseY.set(clientY - window.innerHeight / 2);
    };

    return (
        <section 
            className="relative w-full h-screen bg-[#000000] overflow-hidden flex flex-col items-center justify-center text-center selection:bg-cyan-500/30"
            onMouseMove={handleMouseMove}
        >
            {/* A. THREE.JS ENVIRONMENT */}
            <AvionicsBackground mouseX={mouseX} mouseY={mouseY} />

            {/* B. VIGNETTE & SCANLINES (The "Screen" Feel) */}
            <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)]" />
            <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            {/* C. HUD UI LAYER */}
            <div className="absolute inset-0 z-[10] pointer-events-none hidden md:block">
                <CompassTape mouseX={mouseX} />
                <Altimeter />
                <Speedometer />
                <Reticle />
                
                {/* Corner Status Data */}
                <div className="absolute top-8 left-8 flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">Sys_Online</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/30 tracking-widest">G4-99X PROTOCOL</span>
                </div>

                <div className="absolute bottom-8 right-8 text-right">
                    <div className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase mb-1">Target Lock</div>
                    <div className="text-xl font-mono text-white tracking-widest">100%</div>
                </div>
            </div>

            {/* D. MAIN CONTENT (Center Stage) */}
            <div className="relative z-20 max-w-4xl px-6 flex flex-col items-center gap-10">
                
                {/* Top Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-3 px-4 py-2 border border-white/10 bg-white/5 backdrop-blur-md rounded-full"
                >
                    <RiGlobalLine className="text-cyan-400" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/80">Autonomous Network V.2.0</span>
                </motion.div>

                {/* Hero Title */}
                <div className="relative">
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight leading-[1.1]"
                    >
                        Command the <br />
                        <span className="font-light text-white/50">digital future.</span>
                    </motion.h1>
                    
                    {/* Decorative Title Scanline */}
                    <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" 
                    />
                </div>

                {/* Description */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="max-w-xl text-lg text-white/60 font-light leading-relaxed"
                >
                    Deploy intelligent agents that navigate the blockchain economy with pilot-like precision. <span className="text-white">Full autonomy. Zero latency.</span>
                </motion.p>

                {/* CTA System */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="pt-4"
                >
                    <LaunchButton />
                </motion.div>

                {/* Footer Data Grid (Mobile Only - simplified) */}
                <div className="md:hidden pt-12 grid grid-cols-2 gap-8 w-full border-t border-white/10 mt-8">
                    <div className="text-center">
                        <div className="text-xs text-white/40 mb-1">VELOCITY</div>
                        <div className="text-lg text-white font-mono">12.4k</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-white/40 mb-1">ALTITUDE</div>
                        <div className="text-lg text-white font-mono">45.2M</div>
                    </div>
                </div>

            </div>

            {/* GLOBAL ANIMATION STYLES */}
            <style jsx global>{`
                .mask-linear-fade {
                    mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
                }
                .mask-vertical-fade {
                    mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
                }
                @keyframes spin-slow-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-spin-slow-reverse {
                    animation: spin-slow-reverse 60s linear infinite;
                }
            `}</style>
        </section>
    );
}