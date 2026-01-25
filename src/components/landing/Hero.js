'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import * as THREE from 'three';
import { 
    RiArrowRightLine, 
    RiCpuLine, 
    RiShieldCheckLine, 
    RiFocus3Line,
    RiGlobalLine 
} from 'react-icons/ri';

// --- 1. THREE.JS BACKGROUND (Optimized & Parallax) ---
const NeuralCore = ({ mouseX, mouseY }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.003); // Deeper fog for depth

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 18;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // --- PARTICLES (Premium: Fewer, Smaller, Shinier) ---
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 450; // Reduced for premium minimalism
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 35; // Spread out more
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Custom Shader Material for "Shiny" Gold look
        const material = new THREE.PointsMaterial({
            size: 0.04, // Very fine size
            color: 0xFFD700, // Pure Gold
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        // --- CONNECTING LINES (Subtle Structure) ---
        const geometryWire = new THREE.IcosahedronGeometry(12, 1);
        const materialWire = new THREE.MeshBasicMaterial({ 
            color: 0x444444, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.03 // Barely visible structure
        });
        const wireSphere = new THREE.Mesh(geometryWire, materialWire);
        scene.add(wireSphere);

        // Animation Loop
        let targetX = 0;
        let targetY = 0;

        const animate = () => {
            requestAnimationFrame(animate);

            // Constant gentle rotation
            particlesMesh.rotation.y += 0.0008;
            wireSphere.rotation.y -= 0.0005;

            // Parallax Smoothing (Lerp)
            targetX = mouseX.get() * 0.001;
            targetY = mouseY.get() * 0.001;

            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (-targetY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            particlesGeometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [mouseX, mouseY]);

    return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

// --- 2. MAIN HERO COMPONENT ---

export default function HeroSection() {
    // Mouse Motion State for Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Smooth Spring for Image Parallax
    const springConfig = { damping: 25, stiffness: 150 };
    const imgX = useSpring(useTransform(mouseX, [-1000, 1000], [-15, 15]), springConfig);
    const imgY = useSpring(useTransform(mouseY, [-1000, 1000], [-15, 15]), springConfig);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        mouseX.set(clientX - centerX);
        mouseY.set(clientY - centerY);
    };

    return (
        <section 
            className="relative w-full h-screen min-h-[800px] bg-[#050505] overflow-hidden flex flex-col justify-center"
            onMouseMove={handleMouseMove}
        >
            
            {/* A. CINEMATIC NOISE FILTER (Fine Grain) */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-[1]" 
                 style={{ 
                     backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` 
                 }} 
            />

            {/* B. THREE.JS BACKGROUND */}
            <NeuralCore mouseX={mouseX} mouseY={mouseY} />

            {/* C. "COMMAND DECK" HUD OVERLAY (The Cockpit) */}
            <div className="absolute inset-0 pointer-events-none z-[2]">
                <svg className="w-full h-full" preserveAspectRatio="none">
                    {/* --- Top HUD --- */}
                    {/* Center Notch */}
                    <path d="M400,0 L420,20 L500,20 L580,20 L600,0" fill="#0a0a0a" stroke="#FFC21A" strokeWidth="1" />
                    {/* Top Lines */}
                    <path d="M0,40 L350,40 L380,10 L1000,10" stroke="white" strokeWidth="1" strokeOpacity="0.1" fill="none" />
                    <rect x="45%" y="25" width="10%" height="2" fill="#FFC21A" opacity="0.5" />

                    {/* --- Bottom HUD --- */}
                    <path d="M0,1000 L200,1000 L250,960 L800,960 L850,1000 L1200,1000" stroke="#FFC21A" strokeWidth="1" strokeOpacity="0.3" fill="none" />
                    {/* Bottom Ticks */}
                    <path d="M100,960 L100,970" stroke="white" strokeOpacity="0.2" />
                    <path d="M120,960 L120,970" stroke="white" strokeOpacity="0.2" />
                    <path d="M140,960 L140,970" stroke="white" strokeOpacity="0.2" />

                    {/* --- Left Side Bracket --- */}
                    <path d="M40,200 L20,220 L20,780 L40,800" stroke="#FFC21A" strokeWidth="1" strokeOpacity="0.4" fill="none" />
                    <rect x="15" y="48%" width="2" height="4%" fill="#FFC21A" />

                    {/* --- Right Side Bracket --- */}
                    <path d="M1000,200 L1000,780" transform="translate(-40, 0)" stroke="#FFC21A" strokeWidth="1" strokeOpacity="0.4" fill="none" />
                    {/* Right Data Readout Decoration */}
                    <path d="M960,300 L940,300" stroke="white" strokeOpacity="0.2" />
                    <path d="M960,310 L940,310" stroke="white" strokeOpacity="0.2" />
                    <path d="M960,320 L940,320" stroke="white" strokeOpacity="0.2" />
                </svg>
                
                {/* Vertical Scanning Line (Cockpit Scan) */}
                <div className="absolute left-[5%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-yellow-neo/20 to-transparent overflow-hidden">
                    <div className="absolute top-0 w-full h-40 bg-yellow-neo/40 blur-sm animate-scan-slow" />
                </div>
            </div>

            {/* D. CONTENT CONTAINER */}
            <div className="relative z-10 container mx-auto px-8 md:px-16 h-full flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    
                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-7 space-y-8">
                        
                        {/* Status Line */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex items-center gap-4"
                        >
                            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-neo/10 border border-yellow-neo/30 rounded text-[10px] font-bold text-yellow-neo uppercase tracking-widest">
                                <RiGlobalLine /> System Online
                            </div>
                            <div className="h-px w-20 bg-gradient-to-r from-yellow-neo/50 to-transparent" />
                        </motion.div>

                        {/* Title */}
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tighter"
                        >
                            THE BRAIN <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-neo via-[#FFD700] to-white opacity-90">
                                OF BLOCKCHAIN
                            </span>
                        </motion.h1>

                        {/* Description (Creative & Simple) */}
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg text-gray-400 font-light max-w-xl leading-relaxed border-l-2 border-white/10 pl-6"
                        >
                            We don't just build chatbots. We build <strong>autonomous agents</strong> that 
                            understand money. They analyze markets, execute trades, and prove their 
                            economic intent on-chain.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap gap-5 pt-4"
                        >
                            <Link href="/dashboard">
                                <button className="relative px-8 py-4 bg-yellow-neo text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-white transition-all shadow-[0_0_30px_rgba(255,194,26,0.3)] flex items-center gap-3 overflow-hidden group">
                                    <span className="relative z-10">Access Terminal</span>
                                    <RiArrowRightLine className="relative z-10 transition-transform group-hover:translate-x-1" />
                                    {/* Button Glint */}
                                    <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                                </button>
                            </Link>
                            
                            <Link href="/whitepaper">
                                <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-white/5 hover:border-white/50 transition-all flex items-center gap-2">
                                    System Specs
                                </button>
                            </Link>
                        </motion.div>

                        {/* Metrics Bar */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="flex items-center gap-8 pt-8 border-t border-white/5"
                        >
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Agents Active</span>
                                <span className="text-xl font-mono text-white">12,402</span>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Verified Volume</span>
                                <span className="text-xl font-mono text-intent-green">$42.8M</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT VISUAL: Token & Parallax */}
                    <div className="lg:col-span-5 relative h-full flex items-center justify-center">
                        <motion.div 
                            style={{ x: imgX, y: imgY }}
                            className="relative z-20"
                        >
                            {/* The Floating Token */}
                            <div className="relative w-[350px] md:w-[500px] aspect-square animate-float-premium">
                                <Image 
                                    src="/token.png" 
                                    alt="NEOS Token" 
                                    fill
                                    className="object-contain drop-shadow-[0_30px_80px_rgba(255,194,26,0.25)]"
                                    priority
                                />
                                
                                {/* Orbital Tech Rings (CSS) */}
                                <div className="absolute inset-[-10%] border border-white/5 rounded-full animate-[spin_30s_linear_infinite]" />
                                <div className="absolute inset-[5%] border border-yellow-neo/20 rounded-full border-dashed animate-[spin_20s_linear_infinite_reverse]" />
                            </div>

                            {/* Floating Glass Data Card */}
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-12 -right-8 p-5 bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-neo/30 rounded-lg shadow-2xl flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded bg-yellow-neo/10 flex items-center justify-center text-yellow-neo border border-yellow-neo/20">
                                    <RiCpuLine size={20} />
                                </div>
                                <div>
                                    <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Current Efficiency</div>
                                    <div className="text-sm font-mono font-bold text-white">99.8% <span className="text-intent-green ml-1">OPTIMAL</span></div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* CSS Global Animations */}
            <style jsx global>{`
                @keyframes scan-slow {
                    0% { top: -20%; opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { top: 120%; opacity: 0; }
                }
                .animate-scan-slow {
                    animation: scan-slow 8s linear infinite;
                }
                .animate-float-premium {
                    animation: floatPremium 8s ease-in-out infinite;
                }
                @keyframes floatPremium {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-25px) rotate(1deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
            `}</style>
        </section>
    );
}