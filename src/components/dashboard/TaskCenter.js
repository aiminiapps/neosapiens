'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaWallet, FaSpinner, FaCheckCircle,
  FaExternalLinkAlt, FaRetweet, FaComment, FaThumbsUp, FaCopy, 
  FaInfoCircle, FaGift, FaCoins,  FaChartLine, 
  FaFire,  FaShare, FaCheckDouble,
} from 'react-icons/fa';
import { RiTelegram2Line, RiTwitterXFill } from "react-icons/ri";
import { BiCoin} from 'react-icons/bi';
import { FiCpu, FiLayers } from 'react-icons/fi';
import Image from 'next/image';

// Storage Configuration
const STORAGE_KEY = 'portly-task-center';
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || '0x...';

// Animations
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

// --- LOGIC HELPERS (Unchanged Logic) ---
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
      alert('🔥 Please install MetaMask extension to start earning POTL tokens!');
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

      // Switch to BSC (Keeping logic as requested)
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
      const message = `Welcome to Portly!\nAddress: ${address}\nNonce: ${nonce}\nExpiry: ${expiry}`;

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

  // Auto-reconnect
// ✅ CORRECTED AUTO-RECONNECT LOGIC
useEffect(() => {
  let isMounted = true;

  const reconnect = async () => {
    try {
      const saved = getStorage();
      
      // Check if we have a saved connection and Ethereum is available
      if (saved?.wallet?.isConnected && saved.wallet.address && window.ethereum) {
        
        // Check if the login is recent (e.g., within 24 hours)
        const isRecent = saved.wallet.lastConnected && 
          (Date.now() - saved.wallet.lastConnected) < 24 * 60 * 60 * 1000;

        if (isRecent) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0 && accounts[0].toLowerCase() === saved.wallet.address.toLowerCase()) {
            
            // 🔧 CRITICAL FIX: Re-initialize Provider & Signer here
            const ethersModule = await import('ethers');
            const ethers = ethersModule.default || ethersModule;
            
            // Re-create provider and signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            // Fetch fresh balance
            let balance = '0';
            try {
              const rawBalance = await provider.getBalance(accounts[0]);
              balance = ethers.formatEther(rawBalance);
            } catch (err) {
              console.warn('Balance fetch failed:', err);
            }

            if (isMounted) {
              setWallet(prev => ({
                ...prev,
                address: accounts[0],
                provider, // ✅ Restore Provider
                signer,   // ✅ Restore Signer (Fixes the crash)
                isConnected: true,
                balance,
                isInitialized: true
              }));
            }
            return;
          }
        }
      }
      
      // If not connected or session expired
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
  const [showTokenInfo, setShowTokenInfo] = useState(false);

  // Task Definitions - Updated for Portly Content
  const taskDefinitions = useMemo(() => ({
    followX: {
      id: 'followX',
      title: 'Follow Portly on X',
      description: 'Follow @PortlyAI for the latest insights & updates',
      reward: 100,
      icon: RiTwitterXFill,
      action: 'https://twitter.com/intent/follow?screen_name=portlyai',
      type: 'social',
      difficulty: 'easy'
    },
    likeX: {
      id: 'likeX',
      title: 'Like Latest Post',
      description: 'Engage with our latest market analysis on X',
      reward: 50,
      icon: FaThumbsUp,
      action: 'https://x.com/portlyai',
      type: 'social',
      difficulty: 'easy'
    },
    commentX: {
      id: 'commentX',
      title: 'Join the Discussion',
      description: 'Comment your thoughts on our latest AI feature',
      reward: 75,
      icon: FaComment,
      action: 'https://x.com/portlyai',
      type: 'social',
      difficulty: 'medium'
    },
    retweetX: {
      id: 'retweetX',
      title: 'Boost the Signal',
      description: 'Retweet our pinned post to support the ecosystem',
      reward: 60,
      icon: FaRetweet,
      action: 'https://x.com/portlyai',
      type: 'social',
      difficulty: 'easy'
    },
    joinTelegram: {
      id: 'joinTelegram',
      title: 'Join Community',
      description: 'Enter the Portly Traders Group on Telegram',
      reward: 80,
      icon: RiTelegram2Line,
      action: 'https://t.me/PortlyAI',
      type: 'social',
      difficulty: 'easy'
    },
    shareX: {
      id: 'shareX',
      title: 'Invite Peers',
      description: 'Share your Portfolio Score on X',
      reward: 90,
      icon: FaShare,
      action: 'https://twitter.com/intent/tweet?text=I%20just%20analyzed%20my%20portfolio%20with%20@PortlyAI!%20Check%20it%20out!',
      type: 'social',
      difficulty: 'medium'
    }
  }), []);

  // Initialize tasks
  useEffect(() => {
    const saved = getStorage();
    if (saved?.tasks) setTasks(saved.tasks);
  }, []);

  // Stats calculations
  const stats = useMemo(() => {
    const saved = getStorage();
    const completed = Object.values(tasks).filter(t => t.completed).length;
    const total = Object.keys(taskDefinitions).length;
    const earned = saved?.stats?.totalEarned || 0;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, earned, progress };
  }, [tasks, taskDefinitions]);

  // Complete Task Handler (Logic Unchanged)
  const completeTask = useCallback(async (taskId) => {
    if (!wallet.isConnected) {
      setNotification({ type: 'error', message: 'Connect wallet to start earning POTL!' });
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
      const message = `Complete task: ${taskId}\nAddress: ${wallet.address}\nReward: ${task.reward} POTL\nNonce: ${nonce}\nExpiry: ${expiry}`;

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

        setNotification({ type: 'success', message: `🎉 +${task.reward} POTL earned!`, txHash: data.txHash });
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
            symbol: 'POTL',
            decimals: 18,
            image: 'https://www.portly.world/agent.png' 
          }
        }
      });
      setNotification({ type: 'success', message: '🎉 POTL added to MetaMask!' });
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
        {/* <FiCpu className="w-12 h-12 text-[#8B5CF6] animate-spin mb-4" /> */}
        <Image src='/agent.png' alt='agent logo' width={60} height={60} className='animate-pulse mb-6'/>
        <p className="text-white/60 text-sm">Initializing Neural Link...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-white">
      
      {/* --- NOTIFICATIONS --- */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 max-w-sm w-full"
          >
            <div className={`backdrop-blur-xl border p-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
              notification.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {notification.type === 'success' ? <FaCheckCircle /> : <FaInfoCircle />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{notification.message}</p>
                {notification.txHash && (
                  <a href={`https://bscscan.com/tx/${notification.txHash}`} target="_blank" rel="noreferrer" className="text-xs text-[#8B5CF6] hover:underline flex items-center gap-1 mt-1">
                    View on Explorer <FaExternalLinkAlt size={10} />
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-[#121214] border border-[#8B5CF6]/30 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#8B5CF6]/5 animate-pulse"></div>
              <FiCpu className="w-12 h-12 text-[#8B5CF6] mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-bold text-white mb-2">Claiming Bonus...</h3>
              <p className="text-white/40 text-sm">Transferring 10 POTL to your wallet.</p>
            </div>
          </motion.div>
        )}
        {wallet.welcomeBonusStatus.sent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-[#121214] border border-emerald-500/30 rounded-3xl p-8 max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGift className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Welcome to Portly!</h3>
              <p className="text-emerald-400 font-medium mb-4">+10 POTL Received</p>
              <button onClick={() => window.location.reload()} className="w-full py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold transition-all">Start Earning</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <motion.div {...fadeIn} className="relative rounded-[2.5rem] border border-white/5 bg-[#121214]/60 backdrop-blur-xl p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <FiLayers className="text-white w-5 h-5" />
              </span>
              Task Center
            </h1>
            <p className="text-white/40 max-w-md">Complete missions to earn POTL tokens and unlock premium AI features.</p>
          </div>
          
          {!wallet.isConnected ? (
            <motion.button
              onClick={wallet.connectWallet}
              disabled={wallet.isConnecting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-2 transition-all"
            >
              {wallet.isConnecting ? <FaSpinner className="animate-spin" /> : <FaWallet />}
              Connect Wallet
            </motion.button>
          ) : (
            <div className="flex gap-4">
               <div className="bg-[#1E1E24] border border-white/10 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                     <BiCoin />
                  </div>
                  <div>
                     <p className="text-[10px] text-white/40 uppercase">Balance</p>
                     <p className="text-sm font-bold text-white">{parseFloat(wallet.balance).toFixed(4)} BNB</p>
                  </div>
               </div>
               <button onClick={wallet.disconnect} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                  <FaRetweet className="rotate-180" />
               </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* --- STATS GRID --- */}
      {wallet.isConnected && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Tasks Done', val: `${stats.completed}/${stats.total}`, icon: FaCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'POTL Earned', val: stats.earned, icon: FaCoins, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10' },
            { label: 'Completion', val: `${Math.round(stats.progress)}%`, icon: FaChartLine, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Streak', val: `${getStorage()?.stats?.currentStreak || 0} Days`, icon: FaFire, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          ].map((s, i) => (
            <motion.div key={i} {...fadeIn} transition={{ delay: i * 0.1 }} className="p-4 rounded-2xl border border-white/5 bg-[#121214]/60 backdrop-blur-xl">
               <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon />
               </div>
               <p className="text-2xl font-bold text-white">{s.val}</p>
               <p className="text-xs text-white/40 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* --- TASKS LIST --- */}
      {wallet.isConnected && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           {Object.values(taskDefinitions).map((task, index) => {
              const isCompleted = tasks[task.id]?.completed;
              const isProcessing = processingTask === task.id;
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-5 rounded-2xl border border-white/5 bg-[#1E1E24]/40 backdrop-blur-md relative overflow-hidden group ${isCompleted ? 'opacity-50' : ''}`}
                >
                   {/* Hover Glow */}
                   <div className="absolute inset-0 bg-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                   
                   <div className="flex justify-between items-start relative z-10">
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-xl bg-[#121214] border border-white/5 flex items-center justify-center text-[#8B5CF6] shadow-inner">
                            <task.icon size={18} />
                         </div>
                         <div>
                            <h3 className="font-bold text-white text-sm">{task.title}</h3>
                            <p className="text-xs text-white/40 max-w-[200px] mt-1">{task.description}</p>
                            <div className="flex gap-2 mt-3">
                               <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/30 border border-white/5 uppercase">{task.type}</span>
                               <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/30 border border-white/5 uppercase">{task.difficulty}</span>
                            </div>
                         </div>
                      </div>

                      <div className="text-right">
                         <p className="text-lg font-bold text-[#8B5CF6]">+{task.reward}</p>
                         <p className="text-[10px] text-white/20 mb-3">POTL</p>
                         
                         {isCompleted ? (
                            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                               <FaCheckDouble /> Claimed
                            </div>
                         ) : (
                            <motion.button
                               onClick={() => completeTask(task.id)}
                               disabled={isProcessing}
                               whileHover={{ scale: 1.05 }}
                               whileTap={{ scale: 0.95 }}
                               className="px-4 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/20 transition-all flex items-center gap-2"
                            >
                               {isProcessing ? <FaSpinner className="animate-spin" /> : 'Start Task'}
                            </motion.button>
                         )}
                      </div>
                   </div>
                </motion.div>
              );
           })}
        </div>
      )}

      {/* --- IMPORT TOKEN --- */}
      {wallet.isConnected && (
        <div className="p-6 rounded-[2rem] border border-white/5 bg-[#121214]/60 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                 <FaWallet size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-white">Add POTL to Wallet</h3>
                 <p className="text-xs text-white/40">View your earned tokens in MetaMask</p>
                 <div className="flex items-center gap-2 mt-2">
                    <code className="px-2 py-1 rounded bg-black/30 border border-white/5 text-[10px] text-white/30 font-mono">
                       {TOKEN_CONTRACT.slice(0, 6)}...{TOKEN_CONTRACT.slice(-4)}
                    </code>
                    <button onClick={() => copyToClipboard(TOKEN_CONTRACT)} className="text-[#8B5CF6] hover:text-white transition-colors">
                       <FaCopy size={12} />
                    </button>
                 </div>
              </div>
           </div>
           <button 
             onClick={addTokenToMetaMask}
             className="px-6 py-3 rounded-xl border border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white transition-all font-bold text-sm flex items-center gap-2"
           >
              <FaWallet /> Add to MetaMask
           </button>
        </div>
      )}

    </div>
  );
}