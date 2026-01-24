'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaWallet, FaSpinner, FaCheckCircle,
  FaExternalLinkAlt, FaRetweet, FaComment, FaThumbsUp, FaCopy, 
  FaInfoCircle, FaGift, FaChartLine, 
  FaFire,  FaShare, FaCheckDouble,
} from 'react-icons/fa';
import { 
    RiTwitterXFill, 
    RiTelegram2Line, 
    RiCpuLine, 
    RiDatabase2Line, 
    RiShieldCheckLine, 
    RiGlobalLine, 
    RiExchangeFundsLine,
    RiGovernmentLine,
    RiLinksLine
} from "react-icons/ri";
import Image from 'next/image';

// --- CONFIGURATION ---
const STORAGE_KEY = 'neos-task-center';
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || '0x...';
const TOKEN_TICKER = "$NEOS";

// --- ANIMATIONS (Fixed: Added these back) ---
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

// --- STYLED COMPONENTS ---
const TechCard = ({ children, className = "", noPadding = false }) => (
    <div className={`relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10 ${className}`}>
        {/* Soft Glow */}
        <div className="absolute -top-20 -right-20 w-32 h-32 bg-yellow-neo/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className={noPadding ? "" : "p-6"}>
            {children}
        </div>
    </div>
);

const SectionHeader = ({ title, subtitle }) => (
    <div className="relative mb-8 pl-4  border-yellow-neo">
        <h2 className="text-2xl font-bold text-white  tracking-tight">{title}</h2>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
);

// --- LOGIC HELPERS ---
const getStorage = () => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const initStorage = () => {
  const defaults = {
    wallet: {
      address: '',
      isConnected: false,
      balance: '0',
      receivedWelcomeBonus: false,
      lastConnected: null
    },
    tasks: {},
    stats: {
      totalEarned: 0,
      tasksCompleted: 0,
      currentStreak: 0,
      lastCompletedDate: null
    },
    achievements: [],
    notifications: []
  };

  const existing = getStorage();
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return existing;
};

const updateStorage = (updates) => {
  const current = getStorage() || initStorage();
  const newData = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  return newData;
};

// Wallet Hook
const useWallet = () => {
  const [wallet, setWallet] = useState({
    address: null,
    provider: null,
    signer: null,
    isConnecting: false,
    isConnected: false,
    balance: '0',
    tokenBalance: '0',
    error: null,
    isInitialized: false
  });

  const [welcomeBonusStatus, setWelcomeBonusStatus] = useState({
    sending: false,
    sent: false,
    txHash: null
  });

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = `https://metamask.app.link/dapp/${window.location.host}`;
        return;
      }
      alert(`🔥 Please install MetaMask extension to start earning ${TOKEN_TICKER}!`);
      return;
    }

    setWallet(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const ethersModule = await import('ethers');
      const ethers = ethersModule.default || ethersModule;

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Switch to BSC
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x38',
              chainName: 'BNB Smart Chain',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18
              },
              rpcUrls: ['https://bsc-dataseed1.binance.org/'],
              blockExplorerUrls: ['https://bscscan.com/'],
            }],
          });
        }
      }

      let provider, signer, balance = '0';
      if (ethers.BrowserProvider) {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        try {
          const rawBalance = await provider.getBalance(accounts[0]);
          balance = ethers.formatEther(rawBalance);
        } catch (err) {
          console.warn('Balance fetch failed:', err);
        }
      } else if (ethers.providers) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        try {
          const rawBalance = await provider.getBalance(accounts[0]);
          balance = ethers.utils.formatEther(rawBalance);
        } catch (err) {
          console.warn('Balance fetch failed:', err);
        }
      } else {
        throw new Error('Ethers library not properly loaded');
      }

      setWallet({
        address: accounts[0],
        provider,
        signer,
        isConnecting: false,
        isConnected: true,
        balance,
        tokenBalance: '0',
        error: null,
        isInitialized: true
      });

      // Check welcome bonus
      const savedData = getStorage();
      const receivedBonus = savedData?.wallet?.receivedWelcomeBonus || false;

      updateStorage({
        wallet: {
          address: accounts[0],
          isConnected: true,
          balance,
          receivedWelcomeBonus: receivedBonus,
          lastConnected: Date.now()
        }
      });

      // Send welcome bonus if first time
      if (!receivedBonus) {
        await sendWelcomeBonus(accounts[0], signer);
      }

    } catch (error) {
      console.error('Connection failed:', error);
      setWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message,
        isInitialized: true
      }));
    }
  }, []);

  const sendWelcomeBonus = async (address, signer) => {
    setWelcomeBonusStatus({ sending: true, sent: false, txHash: null });

    try {
      const nonce = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      const message = `Welcome to NEO-SAPIENS!\nAddress: ${address}\nNonce: ${nonce}\nExpiry: ${expiry}`;

      const signature = await signer.signMessage(message);

      const response = await fetch('/api/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          message,
          signature,
          nonce,
          expiry,
          reward: 10,
          isWelcomeBonus: true
        })
      });

      const data = await response.json();

      if (data.success) {
        setWelcomeBonusStatus({
          sending: false,
          sent: true,
          txHash: data.txHash
        });

        updateStorage({
          wallet: {
            ...getStorage().wallet,
            receivedWelcomeBonus: true
          },
          stats: {
            totalEarned: 10,
            tasksCompleted: 0,
            currentStreak: 0,
            lastCompletedDate: null
          }
        });
      }
    } catch (error) {
      console.error('Welcome bonus error:', error);
      setWelcomeBonusStatus({ sending: false, sent: false, txHash: null });
    }
  };

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      provider: null,
      signer: null,
      isConnecting: false,
      isConnected: false,
      balance: '0',
      tokenBalance: '0',
      error: null,
      isInitialized: true
    });

    const current = getStorage();
    updateStorage({
      wallet: {
        ...current.wallet,
        isConnected: false,
        address: ''
      }
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    const reconnect = async () => {
      try {
        const saved = getStorage();
        if (saved?.wallet?.isConnected && saved.wallet.address && window.ethereum) {
          const isRecent = saved.wallet.lastConnected && (Date.now() - saved.wallet.lastConnected) < 24 * 60 * 60 * 1000;
          if (isRecent) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0 && accounts[0].toLowerCase() === saved.wallet.address.toLowerCase()) {
              const ethersModule = await import('ethers');
              const ethers = ethersModule.default || ethersModule;
              const provider = new ethers.BrowserProvider(window.ethereum);
              const signer = await provider.getSigner();
              let balance = '0';
              try {
                const rawBalance = await provider.getBalance(accounts[0]);
                balance = ethers.formatEther(rawBalance);
              } catch (err) { console.warn('Balance fetch failed:', err); }

              if (isMounted) {
                setWallet(prev => ({ ...prev, address: accounts[0], provider, signer, isConnected: true, balance, isInitialized: true }));
              }
              return;
            }
          }
        }
        if (isMounted) setWallet(prev => ({ ...prev, isInitialized: true }));
      } catch (error) {
        console.error("Auto-connect failed:", error);
        if (isMounted) setWallet(prev => ({ ...prev, isInitialized: true }));
      }
    };
    reconnect();
    return () => { isMounted = false; };
  }, []);

  return { ...wallet, connectWallet, disconnect, welcomeBonusStatus };
};

// Main Component
export default function TaskCenter() {
  const wallet = useWallet();
  const [tasks, setTasks] = useState({});
  const [processingTask, setProcessingTask] = useState(null);
  const [notification, setNotification] = useState(null);

  // Updated Tasks content to match NEO-SAPIENS theme
  const taskDefinitions = useMemo(() => ({
    followX: {
      id: 'followX',
      title: 'Link with NEO-SAPIENS',
      description: 'Follow @NeoSapiensAI for governance updates & protocols',
      reward: 100,
      icon: RiTwitterXFill,
      action: 'https://twitter.com/intent/follow?screen_name=NeoSapiensAI',
      type: 'protocol',
      difficulty: 'low'
    },
    likeX: {
      id: 'likeX',
      title: 'Acknowledge Transmission',
      description: 'Like the latest system update on X',
      reward: 50,
      icon: FaThumbsUp,
      action: 'https://x.com/NeoSapiensAI',
      type: 'social',
      difficulty: 'low'
    },
    commentX: {
      id: 'commentX',
      title: 'Economic Input',
      description: 'Comment on our latest thread about AI Accountability',
      reward: 75,
      icon: FaComment,
      action: 'https://x.com/NeoSapiensAI',
      type: 'social',
      difficulty: 'med'
    },
    retweetX: {
      id: 'retweetX',
      title: 'Amplify Signal',
      description: 'Retweet the pinned operational directive',
      reward: 60,
      icon: FaRetweet,
      action: 'https://x.com/NeoSapiensAI',
      type: 'social',
      difficulty: 'low'
    },
    joinTelegram: {
      id: 'joinTelegram',
      title: 'Enter Neural Network',
      description: 'Join the NEO-SAPIENS Governance Channel',
      reward: 80,
      icon: RiTelegram2Line,
      action: 'https://t.me/NeoSapiensAI',
      type: 'protocol',
      difficulty: 'low'
    },
    shareX: {
      id: 'shareX',
      title: 'Recruit Operatives',
      description: 'Share your PoEI Score on X',
      reward: 90,
      icon: FaShare,
      action: 'https://twitter.com/intent/tweet?text=I%20am%20aligned%20with%20@NeoSapiensAI.%20My%20Economic%20Intent%20Verified.',
      type: 'social',
      difficulty: 'med'
    }
  }), []);

  useEffect(() => {
    const saved = getStorage();
    if (saved?.tasks) setTasks(saved.tasks);
  }, []);

  const stats = useMemo(() => {
    const saved = getStorage();
    const completed = Object.values(tasks).filter(t => t.completed).length;
    const total = Object.keys(taskDefinitions).length;
    const earned = saved?.stats?.totalEarned || 0;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, earned, progress };
  }, [tasks, taskDefinitions]);

  const completeTask = useCallback(async (taskId) => {
    if (!wallet.isConnected) {
      setNotification({ type: 'error', message: `Connect wallet to earn ${TOKEN_TICKER}` });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const task = taskDefinitions[taskId];
    if (!task || tasks[taskId]?.completed) return;

    if (task.action) window.open(task.action, '_blank', 'noopener,noreferrer');

    setProcessingTask(taskId);

    try {
      const nonce = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      const message = `Complete task: ${taskId}\nAddress: ${wallet.address}\nReward: ${task.reward} ${TOKEN_TICKER}\nNonce: ${nonce}\nExpiry: ${expiry}`;

      const signature = await wallet.signer.signMessage(message);

      const response = await fetch('/api/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, address: wallet.address, message, signature, nonce, expiry, reward: task.reward })
      });

      const data = await response.json();

      if (data.success) {
        const newTasks = {
          ...tasks,
          [taskId]: { completed: true, reward: task.reward, txHash: data.txHash, timestamp: Date.now() }
        };
        setTasks(newTasks);
        
        const saved = getStorage();
        updateStorage({
          tasks: newTasks,
          stats: {
            totalEarned: saved.stats.totalEarned + task.reward,
            tasksCompleted: saved.stats.tasksCompleted + 1,
            currentStreak: saved.stats.currentStreak + 1,
            lastCompletedDate: Date.now()
          }
        });

        setNotification({ type: 'success', message: `🎉 +${task.reward} ${TOKEN_TICKER} earned!`, txHash: data.txHash });
        setTimeout(() => setNotification(null), 5000);
      } else {
        throw new Error(data.error || 'Transaction failed');
      }
    } catch (error) {
      setNotification({ type: 'error', message: `Failed: ${error.message}` });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setProcessingTask(null);
    }
  }, [wallet, tasks, taskDefinitions]);

  const addTokenToMetaMask = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: TOKEN_CONTRACT,
            symbol: 'NEOS',
            decimals: 18,
            image: 'https://www.neosapiens.world/token.png' 
          }
        }
      });
      setNotification({ type: 'success', message: `${TOKEN_TICKER} added to MetaMask!` });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setNotification({ type: 'success', message: '📋 Copied!' });
    setTimeout(() => setNotification(null), 2000);
  };

  if (!wallet.isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
         <div className="w-16 h-16 rounded-full bg-yellow-neo/20 flex items-center justify-center animate-pulse mb-6">
            <RiCpuLine className="text-yellow-neo w-8 h-8" />
         </div>
         <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Initializing Neural Uplink...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] py-10">
      
      {/* Background & SVG Lines */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <svg className="absolute top-0 left-0 w-full h-full opacity-20" preserveAspectRatio="none">
              <path d="M 60 0 L 60 150 L 100 180 L 100 1000" fill="none" stroke="#FFC21A" strokeWidth="1" />
          </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">

        {/* --- NOTIFICATIONS --- */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed top-24 right-6 z-50 max-w-sm w-full"
            >
              <div className={`backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-3 ${
                notification.type === 'success' ? 'bg-intent-green/10' : 'bg-critical-red/10'
              }`}>
                <div className={`p-1.5 rounded-full ${notification.type === 'success' ? 'text-intent-green' : 'text-critical-red'}`}>
                  {notification.type === 'success' ? <FaCheckCircle /> : <FaInfoCircle />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{notification.message}</p>
                  {notification.txHash && (
                    <a href={`https://bscscan.com/tx/${notification.txHash}`} target="_blank" rel="noreferrer" className="text-[10px] text-yellow-neo hover:underline flex items-center gap-1 mt-1 font-mono uppercase">
                      View TX <FaExternalLinkAlt size={8} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- WELCOME BONUS MODAL --- */}
        <AnimatePresence>
          {wallet.welcomeBonusStatus.sending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
              <div className="bg-[#121214] border border-yellow-neo/30 rounded-2xl p-8 max-w-sm w-full text-center relative">
                {/* <RiCpuLine className="w-12 h-12 text-yellow-neo mx-auto mb-4 animate-spin" /> */}
                <h3 className="text-xl font-bold text-white mb-2 uppercase">Syncing...</h3>
                <p className="text-gray-500 font-mono text-xs">Allocating initial {TOKEN_TICKER} grant.</p>
              </div>
            </motion.div>
          )}
          {wallet.welcomeBonusStatus.sent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
              <div className="bg-[#121214] border border-intent-green/30 rounded-2xl p-8 max-w-sm w-full text-center">
                <div className="w-16 h-16 bg-intent-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGift className="w-8 h-8 text-intent-green" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase">Access Granted</h3>
                <p className="text-intent-green font-mono mb-6">+10 {TOKEN_TICKER} Received</p>
                <button onClick={() => window.location.reload()} className="w-full py-3 rounded-xl bg-yellow-neo text-black font-bold uppercase tracking-wider hover:bg-white transition-all">
                  Enter System
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- PAGE HEADER & WALLET --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-white/5">
            <div>
                <h1 className="sm:text-4xl text-2xl font-bold text-white mb-2 tracking-tighter">
                    Task <span className="text-yellow-neo">Center</span>
                </h1>
                <p className="text-gray-500 text-sm max-w-md">
                    Complete missions to earn NEOS tokens.
                </p>
            </div>
            
            {!wallet.isConnected ? (
                <button
                onClick={wallet.connectWallet}
                disabled={wallet.isConnecting}
                className="px-6 py-3 rounded-lg bg-yellow-neo hover:bg-white text-black font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,194,26,0.3)]"
                >
                {wallet.isConnecting ? <FaSpinner className="animate-spin" /> : <FaWallet />}
                Link Wallet
                </button>
            ) : (
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Balance</p>
                            <p className="text-sm font-bold text-white font-mono">{parseFloat(wallet.balance).toFixed(4)} BNB</p>
                        </div>
                    </div>
                    <button onClick={wallet.disconnect} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-critical-red hover:text-critical-red transition-all">
                        <FaExternalLinkAlt className="rotate-180" />
                    </button>
                </div>
            )}
        </div>

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: TOKENOMICS INTEL */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* Token Info Card */}
                <TechCard>
                    <div className="flex items-center gap-2 mb-4">
                        <RiDatabase2Line className="text-yellow-neo" size={20} />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Asset Data</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Ticker</div>
                            <div className="text-2xl font-bold text-white tracking-tight">{TOKEN_TICKER}</div>
                            <div className="text-xs text-intent-green font-mono mt-1">BEP-20 / BSC</div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                                <span className="text-gray-500">Total Supply</span>
                                <span className="text-white font-mono">10,000,000,000</span>
                            </div>
                            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                                <span className="text-gray-500">TGE Circulation</span>
                                <span className="text-white font-mono">12.6%</span>
                            </div>
                            <div className="flex justify-between text-xs pb-1">
                                <span className="text-gray-500">Minting</span>
                                <span className="text-critical-red font-mono uppercase">Disabled</span>
                            </div>
                        </div>
                    </div>

                    {/* Import Button */}
                    {wallet.isConnected && (
                        <button 
                            onClick={addTokenToMetaMask}
                            className="w-full mt-4 py-2 border border-white/10 hover:border-yellow-neo/50 text-gray-400 hover:text-yellow-neo rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2"
                        >
                            <FaWallet /> Add to Wallet
                        </button>
                    )}
                </TechCard>

                {/* Economic Constraints Info */}
                <TechCard>
                    <div className="flex items-center gap-2 mb-4">
                        <RiGovernmentLine className="text-blue-500" size={20} />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Utility</h3>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-xs text-gray-400 leading-relaxed">
                            <RiCpuLine className="text-yellow-neo flex-shrink-0 mt-0.5" />
                            <span><strong className="text-white">Agent Budget:</strong> Funding operational costs for NEO Units based on performance.</span>
                        </li>
                        <li className="flex gap-3 text-xs text-gray-400 leading-relaxed">
                            <RiExchangeFundsLine className="text-intent-green flex-shrink-0 mt-0.5" />
                            <span><strong className="text-white">PoEI Rewards:</strong> Distributed based on measurable economic behavior verification.</span>
                        </li>
                        <li className="flex gap-3 text-xs text-gray-400 leading-relaxed">
                            <RiShieldCheckLine className="text-purple-500 flex-shrink-0 mt-0.5" />
                            <span><strong className="text-white">Governance:</strong> Voting on risk limits and system parameters.</span>
                        </li>
                    </ul>
                </TechCard>

            </div>

            {/* RIGHT COLUMN: TASKS & STATS */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Stats Row */}
                {wallet.isConnected && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Directives', val: `${stats.completed}/${stats.total}`, icon: FaCheckCircle, color: 'text-intent-green', bg: 'bg-intent-green/10' },
                            { label: 'NEOS Earned', val: stats.earned, icon: RiExchangeFundsLine, color: 'text-yellow-neo', bg: 'bg-yellow-neo/10' },
                            { label: 'Progress', val: `${Math.round(stats.progress)}%`, icon: FaChartLine, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { label: 'Streak', val: `${getStorage()?.stats?.currentStreak || 0} Days`, icon: FaFire, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                        ].map((s, i) => (
                            <motion.div key={i} {...fadeIn} transition={{ delay: i * 0.1 }} className={`p-4 rounded-xl border border-white/5 bg-[#121214]/60 backdrop-blur-sm ${s.bg}`}>
                                <div className={`w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center mb-2 ${s.color}`}>
                                    <s.icon />
                                </div>
                                <div className="text-2xl font-bold text-white font-mono">{s.val}</div>
                                <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Tasks List */}
                <SectionHeader title="Active Directives" subtitle="Complete to increase allocation" />
                
                <div className="space-y-4">
                    {wallet.isConnected ? (
                        Object.values(taskDefinitions).map((task, index) => {
                            const isCompleted = tasks[task.id]?.completed;
                            const isProcessing = processingTask === task.id;
                            
                            return (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`relative group overflow-hidden p-5 rounded-xl border transition-all duration-300 ${
                                        isCompleted 
                                            ? 'bg-black/40 border-white/5 opacity-60' 
                                            : 'bg-[#0f0f0f] border-white/10 hover:border-yellow-neo/50 hover:bg-[#151515]'
                                    }`}
                                >
                                    {/* Task Status Indicator Line */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${isCompleted ? 'bg-intent-green' : 'bg-yellow-neo'}`} />

                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex gap-4 items-center">
                                            <div className={`w-12 h-12 rounded-lg sm:flex hidden items-center justify-center text-xl shadow-lg ${
                                                isCompleted ? 'bg-intent-green/10 text-intent-green' : 'bg-white/5 text-gray-300'
                                            }`}>
                                                <task.icon />
                                            </div>
                                            <div>
                                                <h3 className={`font-semibold text-sm ${isCompleted ? 'text-gray-400' : 'text-white'}`}>
                                                    {task.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 border border-white/5 uppercase font-bold">{task.type}</span>
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 border border-white/5 uppercase font-bold">{task.difficulty}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right flex flex-col items-end gap-2">
                                            <div>
                                                <span className="text-lg font-bold text-yellow-neo font-mono">+{task.reward}</span>
                                                <span className="text-[10px] text-gray-500 ml-1 font-bold">{TOKEN_TICKER}</span>
                                            </div>
                                            
                                            {isCompleted ? (
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-intent-green bg-intent-green/10 px-2 py-1 rounded uppercase tracking-wider">
                                                    <FaCheckDouble /> Verified
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => completeTask(task.id)}
                                                    disabled={isProcessing}
                                                    className="px-4 py-1.5 rounded bg-white/10 hover:bg-yellow-neo hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 group-hover:shadow-[0_0_15px_rgba(255,194,26,0.3)]"
                                                >
                                                    {isProcessing ? <FaSpinner className="animate-spin" /> : 'Execute'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="p-8 rounded-xl border border-dashed border-white/10 text-center bg-white/[0.02]">
                            <RiLinksLine className="mx-auto text-gray-600 mb-3" size={32} />
                            <p className="text-gray-500 text-sm font-mono">Uplink required to view directives.</p>
                            <p className="text-gray-600 text-xs mt-1">Connect wallet to initialize.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}