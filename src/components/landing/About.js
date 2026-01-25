'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { 
    RiMoneyDollarCircleLine, 
    RiLinksLine, 
    RiPulseLine, 
    RiWallet3Line, 
    RiBarChartBoxLine, 
    RiCpuLine 
} from 'react-icons/ri';

// --- 1. ADVANCED SHADER BEAM (Liquid Plasma) ---
// This uses noise to create a "flowing river" of light rather than static particles.

const flowVertexShader = `
varying vec2 vUv;
varying vec3 vPos;
uniform float uTime;

void main() {
    vUv = uv;
    vPos = position;
    
    // Add a sine wave ripple to the geometry itself for depth
    vec3 pos = position;
    pos.z += sin(pos.x * 0.5 + uTime) * 2.0; 
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const flowFragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;

// Simplex Noise function for organic "smoke" look
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    return 130.0 * dot(m, vec3( dot(x0,p.x), dot(x12.xy,p.y), dot(x12.zw,p.z) ));
}

void main() {
    // 1. Create the main beam shape (Horizontal Fade)
    float beamWidth = 1.0 - abs(vUv.y - 0.5) * 2.0;
    beamWidth = pow(beamWidth, 3.0); // Sharpen the edge

    // 2. Add Flowing Noise
    float noise1 = snoise(vec2(vUv.x * 4.0 - uTime * 0.5, vUv.y * 2.0));
    float noise2 = snoise(vec2(vUv.x * 8.0 - uTime * 0.2, vUv.y * 10.0));
    
    // Combine noise layers
    float turbulence = noise1 * 0.5 + noise2 * 0.2;
    
    // 3. Color Mixing
    // Mix between Gold and Hot White based on noise intensity
    vec3 color = mix(uColor, vec3(1.0, 1.0, 0.8), turbulence + 0.2);
    
    // 4. Alpha Masking
    float alpha = beamWidth * (0.5 + turbulence); // Modulate alpha by noise
    
    // Fade edges horizontally
    alpha *= smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);

    gl_FragColor = vec4(color, alpha * 0.8);
}
`;

const FlowBeam = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 800, 0.1, 100);
        camera.position.z = 12;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, 800);
        mountRef.current.appendChild(renderer.domElement);

        // Create a long, wavy plane
        const geometry = new THREE.PlaneGeometry(50, 8, 100, 20);
        const material = new THREE.ShaderMaterial({
            vertexShader: flowVertexShader,
            fragmentShader: flowFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0xFFD700) }
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        // Tilt it slightly for dynamic angle
        mesh.rotation.z = -0.05;
        scene.add(mesh);

        // --- SECONDARY PARTICLES (Floating Dust) ---
        const pGeo = new THREE.BufferGeometry();
        const pCount = 200;
        const pPos = new Float32Array(pCount * 3);
        for(let i=0; i<pCount*3; i++) pPos[i] = (Math.random()-0.5) * 40;
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({ color: 0xFFD700, size: 0.1, transparent: true, opacity: 0.4 });
        const particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        const animate = () => {
            requestAnimationFrame(animate);
            const time = performance.now() * 0.001;
            
            material.uniforms.uTime.value = time;
            
            // Gently drift particles
            particles.rotation.x = time * 0.05;
            particles.position.x = Math.sin(time * 0.2) * 2;

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / 800;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, 800);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if(mountRef.current) mountRef.current.innerHTML = '';
        };
    }, []);

    return <div ref={mountRef} className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-[800px] z-0 pointer-events-none opacity-80 mix-blend-screen" />;
};

// --- 2. COCKPIT SCREEN CARD (SVG Borders + Dash Interface) ---
const CockpitCard = ({ title, desc, icon: Icon, delay }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: delay }}
            className="group relative h-full"
        >
            {/* Main Container */}
            <div className="relative h-full bg-black/40 backdrop-blur-xl flex flex-col p-6 transition-all duration-300">
                
                {/* --- A. SVG COCKPIT FRAME --- */}
                <div className="absolute inset-0 pointer-events-none w-full h-full">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id={`grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FFD700" stopOpacity="0" />
                                <stop offset="50%" stopColor="#FFD700" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        
                        {/* Top Border Line (Faint) */}
                        <line x1="10%" y1="0" x2="90%" y2="0" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
                        
                        {/* Bottom Border Line (Faint) */}
                        <line x1="10%" y1="100%" x2="90%" y2="100%" stroke="white" strokeOpacity="0.1" strokeWidth="1" />

                        {/* Top Left Bracket (Thick) */}
                        <path d="M 0 30 V 0 H 30" fill="none" stroke="#FFD700" strokeWidth="1.5" strokeOpacity="0.6" className="transition-all duration-300 group-hover:strokeOpacity-100 group-hover:shadow-[0_0_10px_#FFD700]" />
                        
                        {/* Bottom Right Bracket (Thick) */}
                        <path d="M 100% 100% H calc(100% - 30px) V 100%" transform="translate(0, -30)" fill="none" /> 
                        {/* Note: SVG calc support is tricky in path d, using CSS positioning for corners is safer, see below */}
                    </svg>
                    
                    {/* CSS Absolute Positioning for reliable corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-[#FFD700]/40 group-hover:border-[#FFD700] transition-colors" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-[#FFD700]/40 group-hover:border-[#FFD700] transition-colors" />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-white/5 group-hover:bg-[#FFD700] transition-colors" />
                </div>

                {/* --- B. DASHBOARD INTERFACE LINES (Decorations) --- */}
                {/* Header Line */}
                {/* <div className="flex items-center gap-2 mb-6">
                    <div className="h-px w-4 bg-[#FFD700]" />
                    <div className="flex-1 h-px bg-white/5" />
                    <div className={`w-1.5 h-1.5 rounded-full ${delay % 0.2 === 0 ? 'bg-green-500' : 'bg-[#FFD700]'} animate-pulse`} />
                </div> */}

                {/* --- C. CONTENT --- */}
                <div className="flex-1 flex flex-col z-10">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-300 tracking-wide group-hover:text-[#FFD700] transition-colors">
                            {title}
                        </h3>
                        <div className="p-2 hidden rounded bg-white/5 border border-white/10 text-gray-300 group-hover:text-black group-hover:bg-[#FFD700] group-hover:border-[#FFD700] transition-all duration-300">
                            <Icon size={20} />
                        </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 font-sans leading-relaxed flex-1 border-l border-white/10 pl-4 group-hover:border-[#FFD700]/30 transition-colors">
                        {desc}
                    </p>
                </div>
                {/* Background Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
        </motion.div>
    );
};

// --- 3. MAIN SECTION ---
const features = [
    {
        title: "AI Agents",
        desc: "Each NEO Agent behaves like an independent economic participant. It observes the chain, forms opinions, and produces intent signals based on real market behavior.",
        icon: RiMoneyDollarCircleLine,
    },
    {
        title: "On-Chain Data",
        desc: "All insights are generated from live blockchain data. No simulations, no placeholders, and no artificial signals—only verifiable on-chain activity.",
        icon: RiLinksLine,
    },
    {
        title: "Economic Signals",
        desc: "Signals are presented as AI interpretations such as risk, opportunity, or action candidates, helping users understand intent instead of raw transactions.",
        icon: RiPulseLine,
    },
    {
        title: "Transparent AI Wallets",
        desc: "Every AI agent operates with a visible wallet. Users can track balances, historical actions, and performance to evaluate agent behavior over time.",
        icon: RiWallet3Line,
    },
    {
        title: "Tracking",
        desc: "Each signal includes an Intent Score based on participation, volume, and follow-up activity, allowing users to compare and assess AI decisions.",
        icon: RiBarChartBoxLine,
    },
    {
        title: "Future Autonomy",
        desc: "While no automatic execution occurs in the MVP, the system is designed to evolve into autonomous economic participation as AI capabilities mature.",
        icon: RiCpuLine,
    }
];

export default function AboutSection() {
    return (
        <section className="relative w-full py-32 bg-black overflow-hidden">
            
            {/* A. 3D FLOW BEAM (Background) */}
            <FlowBeam />

            {/* B. VIGNETTE & GRID OVERLAY */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] pointer-events-none z-[1]" />
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-[0]" 
                 style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />

            <div className="relative z-10 container mx-auto px-6 md:px-12">
                
                {/* 1. HEADER */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight"
                    >
                        Everything You Need, <br />
                        <span className="text-transparent pt-2 bg-clip-text bg-gradient-to-r from-[#FFD700] via-yellow-100 to-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.3)]">
                            All in One System
                        </span>
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-balance text-sm sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto font-sans"
                    >
                        We've combined the best of crypto into a single, intuitive platform so you can trade, invest, and grow with confidence.
                    </motion.p>
                </div>

                {/* 2. COCKPIT CARD GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <CockpitCard 
                            key={index}
                            title={feature.title}
                            desc={feature.desc}
                            icon={feature.icon}
                            delay={index * 0.1}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}