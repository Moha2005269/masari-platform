import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, ArrowRight, Sparkles, Send, Bot, 
  Calculator, DollarSign, BrainCircuit, Compass, 
  Award, Briefcase, GraduationCap, Globe, Activity,
  Menu, X, Moon, Sun, TrendingUp, UserPlus, LogIn, CheckCircle2,
  Download, Copy, RefreshCw, CreditCard, 
  ExternalLink, Search, Mail, Phone, AlertCircle, Coins, BookOpen, Layers, LogOut, Save, FileText, FileArchive,
  Trophy, Star, Building2, ChevronDown, ChevronUp, MapPin
} from 'lucide-react';

// Import Firebase Web modules
import { initializeApp } from "firebase/app";
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "./context/AuthContext";

// ================== LM Studio AI Configuration ==================
const LM_STUDIO_CONFIG = {
  baseUrl: 'http://localhost:1234/v1',
  model: 'auto',
  temperature: 0.7,
  maxTokens: 2048,
};

/**
 * Calls LM Studio's local API.
 * If useSearchPlugins is true, appends the requested internet integrations.
 */
const callLMStudio = async (systemPrompt, userPrompt, fallbackText, useSearchPlugins = false) => {
  try {
    const payload = {
      model: LM_STUDIO_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: LM_STUDIO_CONFIG.temperature,
      max_tokens: LM_STUDIO_CONFIG.maxTokens,
    };

    if (useSearchPlugins) {
      payload.integrations = [
      { type: "plugin", id: "mcp/duckduckgo-search" },
        { type: "plugin", id: "mcp/playwright" }
      ];
    }

    const response = await fetch(`${LM_STUDIO_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`LM Studio responded with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from LM Studio');
    return content;
  } catch (err) {
    console.warn('LM Studio call failed, using fallback:', err.message);
    return fallbackText;
  }
};

// ================== Custom Styles ==================
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Space+Grotesk:wght@300;400;600;700&display=swap');

  :root {
    --bg-primary: #F4F0EA;
    --bg-secondary: #FFFFFF;
    --text-primary: #111111;
    --text-secondary: rgba(17, 17, 17, 0.7);
    --border-color: #111111;
    --shadow-color: #111111;
    
    --accent-lilac: #C8B6FF;
    --accent-mint: #B8E0D2;
    --accent-peach: #FFD6A5;
    --accent-coral: #FF9B85;
    --accent-yellow: #FDFFB6;
    
    --transition-smooth: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .dark-mode {
    --bg-primary: #121212;
    --bg-secondary: #1E1E1E;
    --text-primary: #F4F0EA;
    --text-secondary: rgba(244, 240, 234, 0.7);
    --border-color: #F4F0EA;
    --shadow-color: #C8B6FF;
  }

  body, html {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    overflow-x: hidden;
    scroll-behavior: smooth;
    transition: background-color 0.5s ease, color 0.5s ease;
    @media (pointer: fine) { cursor: none; }
  }

  ::-webkit-scrollbar { width: 14px; }
  ::-webkit-scrollbar-track { background: var(--bg-primary); border-left: 3px solid var(--border-color); }
  ::-webkit-scrollbar-thumb { background: var(--accent-coral); border: 3px solid var(--border-color); border-radius: 0px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--accent-lilac); }

  .bg-theme-primary { background-color: var(--bg-primary); }
  .bg-theme-secondary { background-color: var(--bg-secondary); }
  .text-theme-primary { color: var(--text-primary); }
  .border-theme { border-color: var(--border-color); }
  
  .shadow-brutal { box-shadow: 6px 6px 0px 0px var(--shadow-color); }
  .shadow-brutal-lg { box-shadow: 12px 12px 0px 0px var(--shadow-color); }
  .shadow-brutal-hover:hover { transform: translateY(-4px) translateX(-4px); box-shadow: 10px 10px 0px 0px var(--shadow-color); }

  .lang-ar { font-family: 'Alexandria', sans-serif; line-height: 1.8; }
  .lang-en { font-family: 'Space Grotesk', sans-serif; line-height: 1.6; }
  .font-display-en { font-family: 'Playfair Display', serif; }
  .font-display-ar { font-family: 'Alexandria', sans-serif; font-weight: 900; }

  .text-giant { font-size: clamp(3rem, 8vw + 1rem, 11rem); line-height: 0.9; letter-spacing: -0.02em; }
  .lang-ar .text-giant { line-height: 1.2; letter-spacing: 0; }

  .custom-cursor {
    position: fixed; top: 0; left: 0; width: 20px; height: 20px;
    background-color: var(--text-primary); border-radius: 50%; pointer-events: none; z-index: 99999;
    transform: translate(-50%, -50%); transition: width 0.3s, height 0.3s, background-color 0.3s;
    mix-blend-mode: difference; display: none;
  }
  @media (pointer: fine) { .custom-cursor { display: block; } }
  .custom-cursor.hovering { width: 60px; height: 60px; background-color: #fff; }

  @keyframes float-complex {
    0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
    33% { transform: translateY(-20px) rotate(3deg) scale(1.05); }
    66% { transform: translateY(10px) rotate(-3deg) scale(0.95); }
  }
  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  
  @keyframes langCrossfadeEnter {
    0% { opacity: 0; transform: scale(0.98) translateY(10px); filter: blur(8px); }
    100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
  }
  @keyframes langCrossfadeExit {
    0% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
    100% { opacity: 0; transform: scale(1.02) translateY(-10px); filter: blur(8px); }
  }
  
  .page-enter { animation: langCrossfadeEnter 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .page-exit { animation: langCrossfadeExit 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

  .menu-panel { transform: translateY(-100%); transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
  .menu-panel.menu-open { transform: translateY(0); }

  .likert-radio {
    appearance: none; width: 3.5rem; height: 3.5rem; border: 4px solid var(--border-color); border-radius: 50%; cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); background: var(--bg-primary); position: relative;
  }
  @media (max-width: 768px) { .likert-radio { width: 2.5rem; height: 2.5rem; border-width: 3px; } }
  .likert-radio:checked { background: var(--accent-coral); transform: scale(1.15); box-shadow: 4px 4px 0px 0px var(--shadow-color); }
  .likert-radio:hover:not(:checked) { background: var(--bg-secondary); transform: scale(1.1); }

  /* Bento Grid with spanning */
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1.5rem;
  }
  @media (min-width: 768px) { .bento-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (min-width: 1024px) { 
    .bento-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } 
    .span-2 { grid-column: span 2; }
    .span-3 { grid-column: span 3; }
  }

  .bento-card {
    background: var(--bg-secondary); border-radius: 2.5rem; padding: 2.5rem;
    border: 4px solid var(--border-color); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;
    box-shadow: 6px 6px 0px 0px var(--shadow-color); cursor: pointer; z-index: 1;
  }
  .bento-card:hover { transform: translateY(-6px) translateX(-6px); box-shadow: 12px 12px 0px 0px var(--shadow-color); }
  
  .bento-bg-icon {
    position: absolute; right: -10%; bottom: -10%; opacity: 0.1; width: 60%; height: auto;
    z-index: -1; transition: transform 0.5s ease;
  }
  .dir-rtl .bento-bg-icon { right: auto; left: -10%; }
  .bento-card:hover .bento-bg-icon { transform: scale(1.2) rotate(-10deg); opacity: 0.15; }

  /* Free Shine Animation */
  @keyframes shineSweep {
    0% { transform: translateX(-100%) skewX(-15deg); }
    100% { transform: translateX(200%) skewX(-15deg); }
  }
  .free-badge { position: relative; overflow: hidden; }
  .free-badge::after {
    content: ''; position: absolute; top: 0; left: 0; width: 50%; height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%);
    animation: shineSweep 2.5s infinite;
  }

  input[type=range] { -webkit-appearance: none; background: transparent; width: 100%; }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; height: 28px; width: 28px; border-radius: 50%; background: var(--bg-primary);
    border: 4px solid var(--border-color); cursor: pointer; margin-top: -10px;
    box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 5px var(--border-color); transition: transform 0.2s;
  }
  input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); }
  input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 8px; cursor: pointer; background: var(--border-color); border-radius: 4px; }

  .toast-container { position: fixed; bottom: 2rem; right: 2rem; z-index: 100; pointer-events: none; }
  .toast-element { pointer-events: auto; animation: langCrossfadeEnter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

  .graph-bar-anim { animation: barGrow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; transform-origin: bottom; }
  @keyframes barGrow { 0% { transform: scaleY(0); } 100% { transform: scaleY(1); } }
`;

// ================== Shared UI Components ==================

const NeoMarkdown = ({ text }) => {
  return (
    <div className="space-y-4 text-left rtl:text-right font-medium text-lg leading-relaxed text-black page-enter">
      {text.split('\n').map((line, i) => {
        // Headers
        if (line.startsWith('#### ')) return <h4 key={i} className="text-xl font-bold text-[var(--accent-coral)] mt-4 mb-2">{line.replace('#### ', '')}</h4>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-2xl font-black bg-[var(--accent-mint)] inline-block px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0_#000] mt-6 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-black text-[var(--accent-coral)] mt-8 mb-4 border-b-4 border-black inline-block pb-1">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-black mt-8 mb-4">{line.replace('# ', '')}</h1>;
        
        // Lists
        if (line.startsWith('- ') || line.startsWith('* ')) {
          const content = line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong class="font-black border-b-4 border-[var(--accent-peach)]">$1</strong>');
          return (
            <div key={i} className="flex items-start gap-3 ml-2 rtl:mr-2 rtl:ml-0 mt-2 bg-white/50 p-3 rounded-2xl border-2 border-black">
              <div className="w-3 h-3 mt-1.5 rounded-sm bg-black shrink-0 rotate-45"></div>
              <span dangerouslySetInnerHTML={{__html: content}} />
            </div>
          );
        }
        if (line.match(/^\d+\.\s/)) {
          const num = line.match(/^\d+\./)[0];
          const content = line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-black bg-[var(--accent-yellow)] px-2 py-0.5 rounded-md border-2 border-black shadow-[2px_2px_0_#000] mx-1 inline-block">$1</strong>');
          return (
            <div key={i} className="flex items-start gap-3 ml-2 rtl:mr-2 rtl:ml-0 mt-3 p-3 bg-[var(--bg-primary)] rounded-2xl border-2 border-black">
              <div className="font-black text-xl text-[var(--accent-lilac)] shrink-0 bg-black text-white w-8 h-8 flex items-center justify-center rounded-full border-2 border-black shadow-[2px_2px_0_#000]">{num.replace('.', '')}</div>
              <span className="mt-0.5" dangerouslySetInnerHTML={{__html: content}} />
            </div>
          );
        }
        
        // Tables (Basic parsing for AI outputs)
        if (line.startsWith('|') && !line.includes('---')) {
          const cells = line.split('|').filter(c => c.trim() !== '');
          return (
            <div key={i} className="flex flex-wrap gap-2 mb-2">
              {cells.map((cell, idx) => (
                 <span key={idx} className="bg-white border-2 border-black px-3 py-1 rounded-lg font-bold shadow-[2px_2px_0_#000]">{cell.trim()}</span>
              ))}
            </div>
          )
        }
        if (line.includes('---') && line.startsWith('|')) return null; // Skip table separators
        
        // Empty lines
        if (line.trim() === '') return <div key={i} className="h-2"></div>;
        
        // Standard paragraph with bold parsing
        return (
          <p key={i} className="mb-2" dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black bg-gray-200 px-1 rounded">$1</strong>')
          }} />
        );
      })}
    </div>
  );
};

const CUTE_AVATARS = [
  { id: 'avatar_blobby', name: 'Blobby', svg: (color = '#B8E0D2') => (<svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill={color} stroke="black" strokeWidth="4" /><ellipse cx="50" cy="55" rx="30" ry="25" fill="#FFFFFF" stroke="black" strokeWidth="4" /><circle cx="40" cy="50" r="6" fill="black" /><circle cx="60" cy="50" r="6" fill="black" /><circle cx="37" cy="46" r="2" fill="white" /><circle cx="57" cy="46" r="2" fill="white" /><path d="M45 65C45 65 48 68 50 68C52 68 55 65 55 65" stroke="black" strokeWidth="4" strokeLinecap="round" /><circle cx="30" cy="58" r="4" fill="#FF9B85" opacity="0.6" /><circle cx="70" cy="58" r="4" fill="#FF9B85" opacity="0.6" /><path d="M25 25C30 18 45 18 50 25" stroke="black" strokeWidth="4" strokeLinecap="round" /></svg>) },
  { id: 'avatar_astro', name: 'Astro', svg: (color = '#C8B6FF') => (<svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill={color} stroke="black" strokeWidth="4" /><circle cx="50" cy="50" r="28" fill="#111" stroke="black" strokeWidth="4" /><rect x="30" y="38" width="40" height="24" rx="12" fill="#fff" stroke="black" strokeWidth="3" /><circle cx="42" cy="50" r="4" fill="black" /><circle cx="58" cy="50" r="4" fill="black" /><path d="M47 56C47 56 49 58 50 58C51 58 53 56 53 56" stroke="black" strokeWidth="2" strokeLinecap="round" /><rect x="42" y="74" width="16" height="8" fill="#FF9B85" stroke="black" strokeWidth="3" /><circle cx="50" cy="18" r="5" fill="#FFD6A5" stroke="black" strokeWidth="3" /></svg>) },
  { id: 'avatar_starlet', name: 'Starlet', svg: (color = '#FFD6A5') => (<svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill={color} stroke="black" strokeWidth="4" /><path d="M50 15 L59 38 L84 38 L64 53 L72 76 L50 62 L28 76 L36 53 L16 38 L41 38 Z" fill="#FFFFFF" stroke="black" strokeWidth="4" strokeLinejoin="round" /><circle cx="43" cy="46" r="4" fill="black" /><circle cx="57" cy="46" r="4" fill="black" /><path d="M46 54 Q50 58 54 54" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" /></svg>) },
  { id: 'avatar_techno', name: 'Techno', svg: (color = '#FF9B85') => (<svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill={color} stroke="black" strokeWidth="4" /><path d="M25 45 L35 25 L45 40 Z" fill="#111" stroke="black" strokeWidth="3" /><path d="M75 45 L65 25 L55 40 Z" fill="#111" stroke="black" strokeWidth="3" /><circle cx="50" cy="55" r="25" fill="#FFFFFF" stroke="black" strokeWidth="4" /><rect x="32" y="44" width="36" height="10" fill="black" rx="3" /><rect x="36" y="47" width="10" height="4" fill="#B8E0D2" /><rect x="54" y="47" width="10" height="4" fill="#B8E0D2" /><path d="M50 58 L48 61 L52 61 Z" fill="black" /><path d="M46 65 Q50 68 54 65" stroke="black" strokeWidth="2" fill="none" /></svg>) },
  { id: 'avatar_sprout', name: 'Sprout', svg: (color = '#FDFFB6') => (<svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill={color} stroke="black" strokeWidth="4" /><circle cx="50" cy="58" r="24" fill="#FFFFFF" stroke="black" strokeWidth="4" /><circle cx="42" cy="54" r="4" fill="black" /><circle cx="58" cy="54" r="4" fill="black" /><path d="M46 62 Q50 66 54 62" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" /><path d="M50 34 V18" stroke="black" strokeWidth="4" /><path d="M50 18 Q58 14 62 20 Q56 24 50 18" fill="#B8E0D2" stroke="black" strokeWidth="3" /><path d="M50 22 Q42 18 38 24 Q44 28 50 22" fill="#B8E0D2" stroke="black" strokeWidth="3" /></svg>) }
];

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, .clickable-card, input, select, .magnetic-target, .bento-card')) setIsHovering(true);
      else setIsHovering(false);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return { ...position, isHovering };
};

const Magnetic = ({ children, className = "", strength = 0.3 }) => {
  const magneticRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!magneticRef.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = magneticRef.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };
  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <div
      ref={magneticRef} onMouseMove={handleMouse} onMouseLeave={reset}
      className={`inline-block magnetic-target ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.1s linear',
      }}
    >
      {children}
    </div>
  );
};

const TrackingEye = ({ mouseX, mouseY, isOpen = true, className = "" }) => {
  const eyeRef = useRef(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(blinkInterval);
  }, [isOpen]);

  useEffect(() => {
    if (!eyeRef.current || !isOpen || isBlinking) return;
    const rect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    const dx = mouseX - eyeCenterX;
    const dy = mouseY - eyeCenterY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(rect.width / 4, Math.hypot(dx, dy) / 8); 
    setPupilPos({ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance });
  }, [mouseX, mouseY, isOpen, isBlinking]);

  return (
    <div ref={eyeRef} className={`relative w-20 h-20 bg-white rounded-full border-4 border-theme flex items-center justify-center overflow-hidden transition-all duration-300 shadow-brutal ${className}`}>
      {isOpen && !isBlinking ? (
        <div 
          className="w-8 h-8 bg-black rounded-full transition-transform duration-75 ease-out flex items-center justify-center"
          style={{ transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` }}
        >
          <div className="w-3 h-3 bg-white rounded-full absolute top-1.5 left-1.5"></div>
        </div>
      ) : (
        <div className="w-full h-1.5 bg-black rounded-full absolute"></div>
      )}
    </div>
  );
};

const AbstractShape1 = ({ className }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="currentColor" stroke="var(--border-color)" strokeWidth="4" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.6,-46.3C91.4,-33.5,98,-18,97.7,-2.4C97.4,13.2,90.2,28.7,80.3,41.9C70.4,55.1,57.8,66,43.5,73.4C29.2,80.8,13.2,84.7,-2.3,88.7C-17.8,92.7,-35.6,96.8,-49.6,89.5C-63.6,82.2,-73.8,63.5,-81.9,46C-90,28.5,-96,12.2,-95.4,-3.8C-94.8,-19.8,-87.6,-35.5,-77.3,-48.6C-67,-61.7,-53.6,-72.2,-39.3,-79.1C-25,-86,-9.8,-89.3,3.3,-84C16.4,-78.7,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
  </svg>
);
const AbstractShape2 = ({ className }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="currentColor" stroke="var(--border-color)" strokeWidth="4" d="M39.9,-65.7C52.4,-57.4,63.6,-47.5,72.2,-35.3C80.8,-23.1,86.8,-8.6,84.9,5.2C83,19,73.2,32.1,62.8,43.7C52.4,55.3,41.4,65.4,28.5,72.2C15.6,79,0.8,82.5,-13.4,79.9C-27.6,77.3,-41.2,68.6,-52.3,57.4C-63.4,46.2,-72,32.5,-77.7,17.4C-83.4,2.3,-86.2,-14.2,-81,-28.7C-75.8,-43.2,-62.6,-55.7,-48.3,-63.5C-34,-71.3,-18.6,-74.4,-2.8,-69.6C13,-64.8,27.4,-74,39.9,-65.7Z" transform="translate(100 100)" />
  </svg>
);
const DecorativeStar = ({ className }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="currentColor" stroke="var(--border-color)" strokeWidth="3" d="M50 0 C50 40, 60 50, 100 50 C60 50, 50 60, 50 100 C50 60, 40 50, 0 50 C40 50, 50 40, 50 0 Z" />
  </svg>
);

// --- Custom Hook to Save Reports ---
const useSaveReport = (userProfile, setUserProfile, onSaveProfile, showToast, isAr) => {
  const saveReport = async (title, content) => {
    if (!userProfile.isLoggedIn) {
      showToast(isAr ? '┘è╪¼╪¿ ╪¬╪│╪¼┘è┘ä ╪º┘ä╪»╪«┘ê┘ä ┘ä╪¡┘ü╪╕ ╪º┘ä╪¬┘é╪º╪▒┘è╪▒!' : 'You must be logged in to save reports!');
      return;
    }
    
    try {
      const appId = 'masari-academic-decoder';
      const firestore = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No user object");

      const docData = {
        title,
        content,
        date: new Date().toISOString(),
      };
      
      const reportsRef = collection(firestore, 'artifacts', appId, 'users', user.uid, 'saved_reports');
      await addDoc(reportsRef, docData);
      
      showToast(isAr ? 'Report saved to your artifacts successfully!' : 'Report saved to your artifacts successfully!');
    } catch(e) {
      console.error(e);
      showToast(isAr ? 'Error saving report.' : 'Error saving report.');
    }
  };
  return saveReport;
};

// ================== Overlays and Menus ==================

const PointsExhaustedModal = ({ isAr, isOpen, onClose, onGoToSubscriptions }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm flex items-center justify-center p-6 page-enter">
      <div className="bg-white text-black border-4 border-black p-8 rounded-[2.5rem] shadow-brutal-lg max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full border-2 border-black transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-peach)] border-4 border-black flex items-center justify-center text-2xl font-bold animate-bounce shadow-[3px_3px_0_#000]">≡ƒ¬Ö</div>
          <h3 className="text-3xl font-black">{isAr ? 'Insufficient Credits!' : 'Insufficient Credits!'}</h3>
          <p className="font-semibold text-gray-700">
            {isAr ? 'You have depleted your available credits. Purchase standalone points or upgrade to the Bro Plan.' : 'You have depleted your available credits. Purchase standalone points or upgrade to the Bro Plan.'}
          </p>
          <div className="flex gap-4 w-full mt-4">
            <button 
              onClick={() => { onClose(); onGoToSubscriptions(); }}
              className="flex-1 py-4 bg-[var(--accent-lilac)] text-black border-4 border-black rounded-xl font-bold hover:translate-y-[-2px] transition-transform shadow-brutal"
            >
              {isAr ? 'Upgrade Now' : 'Upgrade Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FullscreenMenu = ({ isAr, isOpen, onClose, setPage, userProfile, logout }) => {
  return (
    <div className={`fixed inset-0 z-[60] bg-theme-secondary flex flex-col items-center justify-center overflow-hidden menu-panel ${isOpen ? 'menu-open' : ''}`}>
      <AbstractShape1 className="absolute top-10 left-10 w-64 h-64 text-[var(--accent-lilac)] opacity-20 animate-spin-slow" />
      <AbstractShape2 className="absolute bottom-10 right-10 w-80 h-80 text-[var(--accent-mint)] opacity-20 animate-spin-slow" style={{animationDirection: 'reverse'}} />

      <button onClick={onClose} className="absolute top-8 right-8 rtl:left-8 rtl:right-auto p-4 bg-theme-primary rounded-full border-4 border-theme shadow-brutal-hover transition-all z-20">
        <X className="w-8 h-8 text-theme-primary" />
      </button>

      <div className="flex flex-col items-center gap-6 text-theme-primary relative z-10 text-center w-full max-w-sm">
        <h2 className={`text-5xl md:text-7xl mb-8 ${isAr ? 'font-display-en italic' : 'font-display-en italic'}`}>
          {isAr ? 'Menu' : 'Menu'}
        </h2>

        <div className="flex flex-col gap-4 w-full px-6">
          {!userProfile.isLoggedIn ? (
            <>
              <Magnetic strength={0.2}>
                <button onClick={() => { setPage('auth_signin'); onClose(); }} className="w-full py-4 px-8 bg-black dark:bg-white dark:text-black text-white rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group">
                  <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? 'Sign In' : 'Sign In'}
                </button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <button onClick={() => { setPage('auth_signup'); onClose(); }} className="w-full py-4 px-8 bg-transparent bg-theme-primary border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all hover:bg-[var(--accent-mint)] hover:text-black group">
                  <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? 'Sign Up' : 'Sign Up'}
                </button>
              </Magnetic>
            </>
          ) : (
            <>
              <div className="bg-theme-primary border-4 border-theme p-4 rounded-3xl mb-4 text-center">
                <p className="font-bold opacity-60 text-sm mb-1">{isAr ? 'Welcome,' : 'Welcome,'}</p>
                <p className="font-black text-2xl">{userProfile.name}</p>
                <div className="mt-3 inline-flex items-center gap-2 bg-[var(--accent-peach)] text-black px-4 py-1.5 rounded-full border-2 border-black text-sm font-bold shadow-[2px_2px_0_#000]">
                  <Coins className="w-4 h-4"/> {userProfile.points} {isAr ? 'Credits' : 'Credits'}
                </div>
              </div>
              <Magnetic strength={0.2}>
                <button onClick={() => { setPage('persona_card'); onClose(); }} className="w-full py-4 px-8 bg-[var(--accent-yellow)] text-black border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group">
                  <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? 'My Career Persona' : 'My Career Persona'}
                </button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <button onClick={() => { setPage('saved_reports'); onClose(); }} className="w-full py-4 px-8 bg-white text-black border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group mt-2">
                  <FileArchive className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? 'Saved Artifacts' : 'Saved Artifacts'}
                </button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <button onClick={() => { logout(); onClose(); }} className="w-full py-4 px-8 bg-[var(--accent-coral)] text-black border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group mt-2">
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? 'Sign Out' : 'Sign Out'}
                </button>
              </Magnetic>
            </>
          )}

          <Magnetic strength={0.2}>
            <button onClick={() => { setPage('subscriptions'); onClose(); }} className="w-full py-4 px-8 bg-[var(--accent-lilac)] text-black border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group mt-4">
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {isAr ? 'Plans & Credits' : 'Plans & Credits'}
            </button>
          </Magnetic>
        </div>
      </div>
    </div>
  );
};

// ================== Data Generation Generators ==================
// ... existing code ...

const generate50Questions = () => {
  const baseQuestions = [
    { cat: 'R', ar: '╪ú╪│╪¬┘à╪¬╪╣ ╪¿╪º┘ä╪╣┘à┘ä ╪¿┘è╪»┘è ┘ä╪¿┘å╪º╪í ╪ú┘ê ╪Ñ╪╡┘ä╪º╪¡ ╪º┘ä╪ú╪┤┘è╪º╪í.', en: 'I enjoy working with my hands to build or repair things.' },
    { cat: 'R', ar: '╪ú┘ü╪╢┘ä ╪º┘ä╪ú┘å╪┤╪╖╪⌐ ╪º┘ä╪╣┘à┘ä┘è╪⌐ ┘ê╪º┘ä╪¿╪»┘å┘è╪⌐ ┘ü┘è ╪º┘ä┘ç┘ê╪º╪í ╪º┘ä╪╖┘ä┘é.', en: 'I prefer hands-on, outdoor physical activities.' },
    { cat: 'R', ar: '╪ú╪¡╪¿ ╪º╪│╪¬╪«╪»╪º┘à ╪º┘ä╪ú╪»┘ê╪º╪¬ ┘ê╪º┘ä╪ó┘ä╪º╪¬ ╪º┘ä┘à╪╣┘é╪»╪⌐.', en: 'I like using complex tools and machinery.' },
    { cat: 'R', ar: '╪ú╪┤╪╣╪▒ ╪¿╪º┘ä╪▒╪º╪¡╪⌐ ╪╣┘å╪» ╪º┘ä╪¬╪╣╪º┘à┘ä ┘à╪╣ ╪º┘ä╪ú╪┤┘è╪º╪í ╪º┘ä┘à┘ä┘à┘ê╪│╪⌐ ╪ú┘â╪½╪▒ ┘à┘å ╪º┘ä╪ú┘ü┘â╪º╪▒ ╪º┘ä┘à╪¼╪▒╪»╪⌐.', en: 'I am more comfortable with tangible objects than abstract concepts.' },
    { cat: 'R', ar: '╪ú╪│╪¬┘à╪¬╪╣ ╪¿╪Ñ╪╡┘ä╪º╪¡ ╪º┘ä╪ú╪╣╪╖╪º┘ä ╪º┘ä┘à┘è┘â╪º┘å┘è┘â┘è╪⌐ ╪ú┘ê ╪º┘ä╪Ñ┘ä┘â╪¬╪▒┘ê┘å┘è╪⌐.', en: 'I enjoy fixing mechanical or electronic faults.' },
    { cat: 'R', ar: '╪ú╪¡╪¿ ╪º┘ä╪╣┘à┘ä ┘ü┘è ╪¿┘è╪ª╪º╪¬ ╪¬╪¬╪╖┘ä╪¿ ┘à╪¼┘ç┘ê╪»╪º┘ï ╪¡╪▒┘â┘è╪º┘ï.', en: 'I prefer working in environments that require physical effort.' },
    { cat: 'R', ar: '┘è╪│╪¬┘ç┘ê┘è┘å┘è ╪¿┘å╪º╪í ╪º┘ä┘à╪¼╪│┘à╪º╪¬ ┘ê╪¬╪¼┘à┘è╪╣ ╪º┘ä╪ú╪¼┘ç╪▓╪⌐.', en: 'I am fascinated by building models and assembling devices.' },
    { cat: 'R', ar: '╪ú╪¬╪╣┘ä┘à ╪¿╪┤┘â┘ä ╪ú┘ü╪╢┘ä ┘à┘å ╪«┘ä╪º┘ä ╪º┘ä╪¬╪¼╪▒╪¿╪⌐ ╪º┘ä╪╣┘à┘ä┘è╪⌐.', en: 'I learn best through practical, hands-on experience.' },
    { cat: 'I', ar: '╪ú╪¡╪¿ ╪¡┘ä ╪º┘ä╪ú┘ä╪║╪º╪▓ ╪º┘ä┘à╪╣┘é╪»╪⌐ ┘ê╪¬╪¡┘ä┘è┘ä ╪º┘ä╪¿┘è╪º┘å╪º╪¬.', en: 'I love solving complex puzzles and analyzing data.' },
    { cat: 'I', ar: '╪ú╪┤╪╣╪▒ ╪¿╪º┘ä┘ü╪╢┘ê┘ä ╪¬╪¼╪º┘ç ╪º┘ä┘å╪╕╪▒┘è╪º╪¬ ╪º┘ä╪╣┘ä┘à┘è╪⌐.', en: 'I am highly curious about scientific theories.' },
    { cat: 'I', ar: '╪ú╪│╪¬┘à╪¬╪╣ ╪¿╪Ñ╪¼╪▒╪º╪í ╪º┘ä╪¬╪¼╪º╪▒╪¿ ┘ê╪º┘â╪¬╪┤╪º┘ü ╪¡┘é╪º╪ª┘é ╪¼╪»┘è╪»╪⌐.', en: 'I enjoy conducting experiments to discover new facts.' },
    { cat: 'I', ar: '╪ú┘ü╪╢┘ä ╪º┘ä╪¬┘ü┘â┘è╪▒ ╪º┘ä╪╣┘à┘è┘é ┘ê╪º┘ä┘à╪│╪¬┘é┘ä ┘ä╪¡┘ä ╪º┘ä┘à╪┤┘â┘ä╪º╪¬ ╪º┘ä┘à╪╣┘é╪»╪⌐.', en: 'I prefer deep, independent thought to solve complex problems.' },
    { cat: 'I', ar: '╪ú╪¡╪¿ ┘é╪▒╪º╪í╪⌐ ╪º┘ä┘à┘é╪º┘ä╪º╪¬ ┘ê╪º┘ä╪ú╪¿╪¡╪º╪½ ╪º┘ä╪╣┘ä┘à┘è╪⌐ ┘ê╪º┘ä╪¬┘é┘å┘è╪⌐.', en: 'I love reading scientific and technical research articles.' },
    { cat: 'I', ar: '╪ú┘à┘è┘ä ╪Ñ┘ä┘ë ╪º╪│╪¬╪«╪»╪º┘à ╪º┘ä┘à┘å╪╖┘é ╪¿╪»┘ä╪º┘ï ┘à┘å ╪º┘ä╪╣╪º╪╖┘ü╪⌐ ┘ü┘è ┘é╪▒╪º╪▒╪º╪¬┘è.', en: 'I lean towards logic rather than emotion in my decisions.' },
    { cat: 'I', ar: '╪¬╪│╪¬┘ç┘ê┘è┘å┘è ╪º┘ä╪▒┘è╪º╪╢┘è╪º╪¬ ┘ê╪¿╪▒┘à╪¼╪⌐ ╪º┘ä╪«┘ê╪º╪▒╪▓┘à┘è╪º╪¬.', en: 'I am drawn to mathematics and algorithm programming.' },
    { cat: 'I', ar: '╪ú╪¿╪¡╪½ ╪»╪º╪ª┘à┘ï╪º ╪╣┘å ╪º┘ä╪ú╪│╪¿╪º╪¿ ╪º┘ä╪¼╪░╪▒┘è╪⌐ ┘ä╪ú┘è ╪╕╪º┘ç╪▒╪⌐.', en: 'I always look for the root causes of any phenomenon.' },
    { cat: 'I', ar: '╪ú╪│╪¬┘à╪¬╪╣ ╪¿╪º┘ä╪¬╪¡╪»┘è╪º╪¬ ╪º┘ä╪░┘ç┘å┘è╪⌐ ╪º┘ä╪╡╪╣╪¿╪⌐.', en: 'I enjoy difficult mental challenges.' },
    { cat: 'A', ar: '╪ú╪╣╪¿╪▒ ╪╣┘å ┘å┘ü╪│┘è ╪¿╪┤┘â┘ä ╪ú┘ü╪╢┘ä ┘à┘å ╪«┘ä╪º┘ä ╪º┘ä╪¬╪╡┘à┘è┘à ╪ú┘ê ╪º┘ä┘ü┘å.', en: 'I express myself best through design or art.' },
    { cat: 'A', ar: '╪ú╪│╪¬┘à╪¬╪╣ ╪¿╪º╪¿╪¬┘â╪º╪▒ ╪ú┘ü┘â╪º╪▒ ╪Ñ╪¿╪»╪º╪╣┘è╪⌐ ╪«╪º╪▒╪¼╪⌐ ╪╣┘å ╪º┘ä┘à╪ú┘ä┘ê┘ü.', en: 'I enjoy coming up with creative, out-of-the-box ideas.' },
    { cat: 'A', ar: '╪ú╪¡╪¿ ╪º┘ä╪╣┘à┘ä ┘ü┘è ╪¿┘è╪ª╪º╪¬ ┘à╪▒┘å╪⌐ ╪║┘è╪▒ ┘à┘é┘è╪»╪⌐ ╪¿╪▒┘ê╪¬┘è┘å ╪╡╪º╪▒┘à.', en: 'I like working in flexible environments without strict routines.' },
    { cat: 'A', ar: '╪¬┘ä┘ç┘à┘å┘è ╪º┘ä┘à┘ê╪│┘è┘é┘ë ┘ê╪º┘ä┘â╪¬╪º╪¿╪⌐ ┘ê╪º┘ä┘ü┘å┘ê┘å ╪º┘ä╪¿╪╡╪▒┘è╪⌐.', en: 'Music, writing, and visual arts inspire me.' },
    { cat: 'A', ar: '╪ú┘à┘è┘ä ╪Ñ┘ä┘ë ╪º┘ä╪º╪╣╪¬┘à╪º╪» ╪╣┘ä┘ë ╪º┘ä╪¡╪»╪│ ┘ê╪º┘ä╪«┘è╪º┘ä.', en: 'I tend to rely on intuition and imagination.' },
    { cat: 'A', ar: '╪ú╪¡╪¿ ╪¬╪▓┘è┘è┘å ┘ê╪¬┘å╪│┘è┘é ╪º┘ä╪ú┘à╪º┘â┘å ┘à┘å ╪¡┘ê┘ä┘è.', en: 'I love decorating and coordinating the spaces around me.' },
    { cat: 'A', ar: '╪ú┘ü╪╢┘ä ╪ú┘å ╪ú┘â┘ê┘å ┘à╪¿╪¬┘â╪▒┘ï╪º ╪╣┘ä┘ë ╪ú┘å ╪ú┘â┘ê┘å ┘à┘å┘ü╪░┘ï╪º ┘ä┘ä╪¬╪╣┘ä┘è┘à╪º╪¬.', en: 'I prefer being an innovator over just following instructions.' },
    { cat: 'A', ar: '╪º┘ä╪¼┘à╪º┘ä┘è╪º╪¬ ┘ê╪º┘ä╪¬╪╡┘à┘è┘à ╪¬┘ä╪╣╪¿ ╪»┘ê╪▒╪º┘ï ┘à┘ç┘à╪º┘ï ┘ü┘è ┘é╪▒╪º╪▒╪º╪¬┘è.', en: 'Aesthetics and design play a major role in my decisions.' },
    { cat: 'S', ar: '╪ú╪┤╪╣╪▒ ╪¿╪º┘ä╪▒╪╢╪º ╪º┘ä╪¬╪º┘à ╪╣┘å╪»┘à╪º ╪ú╪│╪º╪╣╪» ╪º┘ä╪ó╪«╪▒┘è┘å.', en: 'I feel deeply fulfilled when I help others.' },
    { cat: 'S', ar: '╪ú╪│╪¬┘à╪¬╪╣ ╪¿╪º┘ä╪º╪│╪¬┘à╪º╪╣ ┘ä┘à╪┤╪º┘â┘ä ╪º┘ä┘å╪º╪│ ┘ê╪¬┘é╪»┘è┘à ╪º┘ä┘å╪╡╪¡ ┘ä┘ç┘à.', en: 'I enjoy listening to peopleΓÇÖs problems and advising them.' },
    { cat: 'S', ar: '╪ú╪¡╪¿ ╪º┘ä╪╣┘à┘ä ╪╢┘à┘å ┘ü╪▒┘è┘é ┘ê╪º┘ä╪¬╪╣╪º┘ê┘å ┘ä╪¬╪¡┘é┘è┘é ┘ç╪»┘ü ┘à╪┤╪¬╪▒┘â.', en: 'I love teamwork and collaborating for a shared goal.' },
    { cat: 'S', ar: '╪ú╪¼╪» ┘à╪¬╪╣╪⌐ ┘ü┘è ╪¬╪╣┘ä┘è┘à ┘ê╪¬╪»╪▒┘è╪¿ ╪º┘ä╪ú┘ü╪▒╪º╪» ┘ê╪¬╪╖┘ê┘è╪▒ ┘à┘ç╪º╪▒╪º╪¬┘ç┘à.', en: 'I find joy in teaching, training, and developing others.' },
    { cat: 'S', ar: '╪ú┘ç╪¬┘à ┘â╪½┘è╪▒╪º┘ï ╪¿┘à╪┤╪º╪╣╪▒ ╪º┘ä╪ó╪«╪▒┘è┘å ┘ê╪▒╪º╪¡╪¬┘ç┘à ╪º┘ä┘å┘ü╪│┘è╪⌐.', en: 'I care deeply about othersΓÇÖ feelings and well-being.' },
    { cat: 'S', ar: '╪ú╪│╪¬╪╖┘è╪╣ ╪¿┘å╪º╪í ╪╣┘ä╪º┘é╪º╪¬ ╪º╪¼╪¬┘à╪º╪╣┘è╪⌐ ╪Ñ┘è╪¼╪º╪¿┘è╪⌐ ╪¿╪│┘ç┘ê┘ä╪⌐.', en: 'I can easily build positive social relationships.' },
    { cat: 'S', ar: '╪ú┘ü╪╢┘ä ╪º┘ä┘ê╪╕╪º╪ª┘ü ╪º┘ä╪¬┘è ╪¬╪¬╪╖┘ä╪¿ ╪¬┘ü╪º╪╣┘ä╪º┘ï ╪¿╪┤╪▒┘è╪º┘ï ┘à╪│╪¬┘à╪▒╪º┘ï.', en: 'I prefer jobs that require constant human interaction.' },
    { cat: 'S', ar: '╪º┘ä╪╣┘à┘ä ╪º┘ä╪¬╪╖┘ê╪╣┘è ┘ê╪«╪»┘à╪⌐ ╪º┘ä┘à╪¼╪¬┘à╪╣ ╪ú┘à╪▒ ╪ú╪│╪º╪│┘è ╪¿╪º┘ä┘å╪│╪¿╪⌐ ┘ä┘è.', en: 'Volunteering and community service are essential to me.' },
    { cat: 'E', ar: '╪ú╪│╪¬┘à╪¬╪╣ ╪¿┘é┘è╪º╪»╪⌐ ╪º┘ä┘ü╪▒┘é ┘ê╪¬╪¡┘à┘ä ╪º┘ä┘à╪│╪ñ┘ê┘ä┘è╪⌐.', en: 'I enjoy leading teams and taking responsibility.' },
    { cat: 'E', ar: '╪ú┘å╪º ╪¿╪º╪▒╪╣ ┘ü┘è ╪Ñ┘é┘å╪º╪╣ ╪º┘ä┘å╪º╪│ ╪¿╪▒╪ñ┘è╪¬┘è ┘ê╪╖╪▒┘è┘é╪⌐ ╪¬┘ü┘â┘è╪▒┘è.', en: 'I am highly effective at persuading people to see my vision.' },
    { cat: 'E', ar: '╪ú╪¡╪¿ ╪¿╪»╪í ┘à╪┤╪º╪▒┘è╪╣ ╪¼╪»┘è╪»╪⌐ ┘ê╪¬╪¡┘à┘ä ╪º┘ä┘à╪«╪º╪╖╪▒ ╪º┘ä┘à╪¡╪│┘ê╪¿╪⌐.', en: 'I love starting new projects and taking calculated risks.' },
    { cat: 'E', ar: '╪ú╪│╪¬┘à╪¬╪╣ ╪¿╪º┘ä┘à┘å╪º┘ü╪│╪⌐ ┘ê╪º┘ä╪¬╪¡╪»┘è╪º╪¬ ┘ä┘ä┘ê╪╡┘ê┘ä ╪Ñ┘ä┘ë ╪º┘ä┘é┘à╪⌐.', en: 'I thrive on competition and challenges to reach the top.' },
    { cat: 'E', ar: '╪╖┘à┘ê╪¡┘è ╪╣╪º┘ä┘è ┘ê╪ú╪│╪╣┘ë ╪¿╪º╪│╪¬┘à╪▒╪º╪▒ ┘ä┘ä╪¬╪▒┘é┘è ┘ê╪º┘ä┘à┘å╪º╪╡╪¿ ╪º┘ä┘é┘è╪º╪»┘è╪⌐.', en: 'I am highly ambitious and constantly seek leadership roles.' },
    { cat: 'E', ar: '╪ú╪¡╪¿ ╪º┘ä╪¬┘ü╪º┘ê╪╢ ┘ê╪Ñ╪¿╪▒╪º┘à ╪º┘ä╪╡┘ü┘é╪º╪¬ ╪¿┘å╪¼╪º╪¡.', en: 'I love negotiating and successfully closing deals.' },
    { cat: 'E', ar: '┘ä╪º ╪ú╪«╪┤┘ë ╪º╪¬╪«╪º╪░ ╪º┘ä┘é╪▒╪º╪▒╪º╪¬ ╪º┘ä╪¡╪º╪│┘à╪⌐ ┘ü┘è ╪º┘ä╪ú┘ê┘é╪º╪¬ ╪º┘ä╪╡╪╣╪¿╪⌐.', en: 'I am not afraid to make tough decisions in hard times.' },
    { cat: 'E', ar: '╪ú╪│╪¬┘à╪¬╪╣ ╪¿╪º┘ä╪¬╪¡╪»╪½ ╪ú┘à╪º┘à ╪º┘ä╪¼┘à┘ç┘ê╪▒ ┘ê╪╣╪▒╪╢ ╪º┘ä╪ú┘ü┘â╪º╪▒.', en: 'I enjoy public speaking and presenting ideas.' },
    { cat: 'C', ar: '╪ú╪╣╪┤┘é ╪¬┘å╪╕┘è┘à ╪º┘ä┘à╪╣┘ä┘ê┘à╪º╪¬ ┘ê╪¬╪╡┘à┘è┘à ╪º┘ä╪¼╪»╪º┘ê┘ä.', en: 'I love organizing data and designing perfect schedules.' },
    { cat: 'C', ar: '╪ú╪¿╪»┘è ╪º┘ç╪¬┘à╪º┘à╪º┘ï ┘â╪¿┘è╪▒╪º┘ï ╪¿╪ú╪»┘é ╪º┘ä╪¬┘ü╪º╪╡┘è┘ä ┘ä╪╢┘à╪º┘å ╪º┘ä╪¼┘ê╪»╪⌐.', en: 'I pay extreme attention to details to ensure quality.' },
    { cat: 'C', ar: '╪ú┘ü╪╢┘ä ╪º┘ä╪╣┘à┘ä ┘ü┘è ╪¿┘è╪ª╪º╪¬ ╪░╪º╪¬ ╪ú┘å╪╕┘à╪⌐ ┘ê┘é┘ê╪º┘å┘è┘å ┘ê╪º╪╢╪¡╪⌐.', en: 'I prefer working in environments with clear rules and systems.' },
    { cat: 'C', ar: '╪ú╪│╪¬┘à╪¬╪╣ ╪¿╪Ñ╪»╪º╪▒╪⌐ ╪º┘ä┘à┘è╪▓╪º┘å┘è╪º╪¬ ┘ê╪¬╪¬╪¿╪╣ ╪º┘ä╪ú╪▒┘é╪º┘à ╪¿╪»┘é╪⌐.', en: 'I enjoy managing budgets and tracking numbers precisely.' },
    { cat: 'C', ar: '╪º┘ä╪»┘é╪⌐ ┘ê╪º┘ä╪º┘å╪╢╪¿╪º╪╖ ┘ç┘à╪º ╪ú┘ç┘à ╪╡┘ü╪º╪¬ ╪º┘ä╪╣┘à┘ä ╪º┘ä┘å╪º╪¼╪¡ ╪¿╪º┘ä┘å╪│╪¿╪⌐ ┘ä┘è.', en: 'Accuracy and discipline are the most important traits to me.' },
    { cat: 'C', ar: '╪ú╪¡╪¿ ╪º┘ä┘à┘ç╪º┘à ╪º┘ä╪¬┘è ╪¬╪¬╪╖┘ä╪¿ ┘à╪╣╪º┘ä╪¼╪⌐ ╪º┘ä╪¿┘è╪º┘å╪º╪¬ ┘ê╪Ñ╪»╪«╪º┘ä┘ç╪º ╪¿╪»┘é╪⌐.', en: 'I like tasks that require precise data processing and entry.' },
    { cat: 'C', ar: '╪ú┘à┘è┘ä ╪Ñ┘ä┘ë ┘à╪▒╪º╪¼╪╣╪⌐ ┘ê╪¬╪»┘é┘è┘é ╪º┘ä┘à╪│╪¬┘å╪»╪º╪¬ ┘ä┘ä╪¬╪ú┘â╪» ┘à┘å ╪«┘ä┘ê┘ç╪º ┘à┘å ╪º┘ä╪ú╪«╪╖╪º╪í.', en: 'I tend to review and audit documents to ensure zero errors.' },
    { cat: 'C', ar: '╪º┘ä╪¬╪«╪╖┘è╪╖ ╪º┘ä┘à╪│╪¿┘é ┘ä┘â┘ä ╪«╪╖┘ê╪⌐ ┘è╪┤╪╣╪▒┘å┘è ╪¿╪º┘ä╪▒╪º╪¡╪⌐ ┘ê╪º┘ä╪ú┘à╪º┘å.', en: 'Pre-planning every step gives me comfort and security.' },
    { cat: 'C', ar: '╪ú╪¡╪¿ ╪º┘ä╪º╪¡╪¬┘ü╪º╪╕ ╪¿╪│╪¼┘ä╪º╪¬ ┘à┘å╪╕┘à╪⌐ ┘ê┘à┘ê╪½┘é╪⌐ ┘ä┘â┘ä ╪┤┘è╪í.', en: 'I like keeping organized, documented records for everything.' }
  ];
  return baseQuestions;
};

const generate100Majors = () => {
  const rawData = [
    "CS|Computer Science|╪╣┘ä┘ê┘à ╪º┘ä╪¡╪º╪│╪¿|2,5,3,1,2,4", "SE|Software Engineering|┘ç┘å╪»╪│╪⌐ ╪º┘ä╪¿╪▒┘à╪¼┘è╪º╪¬|2,5,2,1,3,4",
    "AI|Artificial Intelligence|╪º┘ä╪░┘â╪º╪í ╪º┘ä╪º╪╡╪╖┘å╪º╪╣┘è|1,5,3,1,2,4", "CY|Cybersecurity|╪º┘ä╪ú┘à┘å ╪º┘ä╪│┘è╪¿╪▒╪º┘å┘è|2,5,1,1,3,5",
    "DS|Data Science|╪╣┘ä┘ê┘à ╪º┘ä╪¿┘è╪º┘å╪º╪¬|1,5,2,1,2,5", "IS|Information Systems|┘å╪╕┘à ╪º┘ä┘à╪╣┘ä┘ê┘à╪º╪¬|1,4,1,2,4,5",
    "MED|Medicine & Surgery|╪º┘ä╪╖╪¿ ┘ê╪º┘ä╪¼╪▒╪º╪¡╪⌐|4,5,1,5,2,3", "DEN|Dentistry|╪╖╪¿ ╪º┘ä╪ú╪│┘å╪º┘å|4,4,3,4,2,3",
    "PHA|Pharmacy|╪º┘ä╪╡┘è╪»┘ä╪⌐|3,5,1,3,2,5", "NUR|Nursing|╪º┘ä╪¬┘à╪▒┘è╪╢|3,2,1,5,1,3",
    "PT|Physical Therapy|╪º┘ä╪╣┘ä╪º╪¼ ╪º┘ä╪╖╪¿┘è╪╣┘è|3,3,1,5,1,2", "NUT|Clinical Nutrition|╪º┘ä╪¬╪║╪░┘è╪⌐ ╪º┘ä╪│╪▒┘è╪▒┘è╪⌐|2,4,1,4,2,3",
    "ARC|Architecture|╪º┘ä┘ç┘å╪»╪│╪⌐ ╪º┘ä┘à╪╣┘à╪º╪▒┘è╪⌐|3,4,5,2,3,2", "CE|Civil Engineering|╪º┘ä┘ç┘å╪»╪│╪⌐ ╪º┘ä┘à╪»┘å┘è╪⌐|4,4,2,1,3,3",
    "ME|Mechanical Engineering|╪º┘ä┘ç┘å╪»╪│╪⌐ ╪º┘ä┘à┘è┘â╪º┘å┘è┘â┘è╪⌐|5,4,1,1,2,3", "EE|Electrical Engineering|╪º┘ä┘ç┘å╪»╪│╪⌐ ╪º┘ä┘â┘ç╪▒╪¿╪º╪ª┘è╪⌐|4,5,1,1,2,3",
    "CHE|Chemical Engineering|╪º┘ä┘ç┘å╪»╪│╪⌐ ╪º┘ä┘â┘è┘à┘è╪º╪ª┘è╪⌐|3,5,1,1,2,3", "AER|Aerospace Engineering|┘ç┘å╪»╪│╪⌐ ╪º┘ä╪╖┘è╪▒╪º┘å|4,5,2,1,2,3",
    "BME|Biomedical Engineering|╪º┘ä┘ç┘å╪»╪│╪⌐ ╪º┘ä╪╖╪¿┘è╪⌐ ╪º┘ä╪¡┘è┘ê┘è╪⌐|3,5,2,2,2,3", "BUS|Business Administration|╪Ñ╪»╪º╪▒╪⌐ ╪º┘ä╪ú╪╣┘à╪º┘ä|1,2,2,3,5,4",
    "FIN|Finance|╪º┘ä┘à╪º┘ä┘è╪⌐|1,4,1,1,4,5", "ACC|Accounting|╪º┘ä┘à╪¡╪º╪│╪¿╪⌐|1,3,1,1,3,5",
    "MKT|Marketing|╪º┘ä╪¬╪│┘ê┘è┘é|1,2,4,3,5,2", "HR|Human Resources|╪º┘ä┘à┘ê╪º╪▒╪» ╪º┘ä╪¿╪┤╪▒┘è╪⌐|1,2,2,5,4,3",
    "ECO|Economics|╪º┘ä╪º┘é╪¬╪╡╪º╪»|1,5,1,1,3,4", "LAW|Law & Jurisprudence|╪º┘ä┘é╪º┘å┘ê┘å ┘ê╪º┘ä╪ú┘å╪╕┘à╪⌐|1,4,3,4,5,3",
    "PSY|Psychology|╪╣┘ä┘à ╪º┘ä┘å┘ü╪│|1,4,2,5,2,2", "SOC|Sociology|╪╣┘ä┘à ╪º┘ä╪º╪¼╪¬┘à╪º╪╣|1,4,2,4,2,2",
    "EDU|Education & Teaching|╪º┘ä╪¬╪╣┘ä┘è┘à ┘ê╪º┘ä╪¬╪▒╪¿┘è╪⌐|2,2,3,5,3,3", "ART|Fine Arts|╪º┘ä┘ü┘å┘ê┘å ╪º┘ä╪¼┘à┘è┘ä╪⌐|2,2,5,1,1,1",
    "DES|Graphic Design|╪º┘ä╪¬╪╡┘à┘è┘à ╪º┘ä╪¼╪▒╪º┘ü┘è┘â┘è|2,3,5,1,2,2", "ID|Interior Design|╪º┘ä╪¬╪╡┘à┘è┘à ╪º┘ä╪»╪º╪«┘ä┘è|3,3,5,2,3,2",
    "JOU|Journalism|╪º┘ä╪╡╪¡╪º┘ü╪⌐ ┘ê╪º┘ä╪Ñ╪╣┘ä╪º┘à|1,3,4,3,4,2", "PR|Public Relations|╪º┘ä╪╣┘ä╪º┘é╪º╪¬ ╪º┘ä╪╣╪º┘à╪⌐|1,2,3,4,5,2",
    "LIN|Linguistics|╪º┘ä┘ä╪║┘ê┘è╪º╪¬ ┘ê╪º┘ä┘ä╪║╪º╪¬|1,4,3,3,2,3", "ENG|English Literature|╪º┘ä╪ú╪»╪¿ ╪º┘ä╪Ñ┘å╪¼┘ä┘è╪▓┘è|1,3,5,2,1,2",
    "HIS|History|╪º┘ä╪¬╪º╪▒┘è╪«|1,4,2,2,1,3", "GEO|Geography|╪º┘ä╪¼╪║╪▒╪º┘ü┘è╪º|2,4,1,1,1,3",
    "POL|Political Science|╪º┘ä╪╣┘ä┘ê┘à ╪º┘ä╪│┘è╪º╪│┘è╪⌐|1,4,2,3,5,2", "PHY|Physics|╪º┘ä┘ü┘è╪▓┘è╪º╪í|2,5,1,1,1,3",
    "CHM|Chemistry|╪º┘ä┘â┘è┘à┘è╪º╪í|3,5,1,1,1,3", "BIO|Biology|╪º┘ä╪ú╪¡┘è╪º╪í|3,5,1,1,1,3",
    "MAT|Mathematics|╪º┘ä╪▒┘è╪º╪╢┘è╪º╪¬|1,5,1,1,1,4", "STA|Statistics|╪º┘ä╪Ñ╪¡╪╡╪º╪í|1,5,1,1,2,5",
    "AST|Astronomy|╪╣┘ä┘à ╪º┘ä┘ü┘ä┘â|1,5,2,1,1,3", "VET|Veterinary Medicine|╪º┘ä╪╖╪¿ ╪º┘ä╪¿┘è╪╖╪▒┘è|4,4,1,3,1,3",
    "AGR|Agriculture|╪º┘ä╪▓╪▒╪º╪╣╪⌐|4,3,1,1,2,2", "ENV|Environmental Science|╪º┘ä╪╣┘ä┘ê┘à ╪º┘ä╪¿┘è╪ª┘è╪⌐|3,4,1,2,2,2",
    "MAR|Marine Biology|╪╣┘ä┘à ╪º┘ä╪ú╪¡┘è╪º╪í ╪º┘ä╪¿╪¡╪▒┘è╪⌐|3,4,1,1,1,2", "FOR|Forestry|╪º┘ä╪║╪º╪¿╪º╪¬|4,3,1,1,2,2",
    "HOS|Hospitality Management|╪Ñ╪»╪º╪▒╪⌐ ╪º┘ä╪╢┘è╪º┘ü╪⌐|2,1,2,4,4,3", "CUL|Culinary Arts|┘ü┘å┘ê┘å ╪º┘ä╪╖┘ç┘è|4,2,4,2,3,2",
    "SPO|Sports Management|╪º┘ä╪Ñ╪»╪º╪▒╪⌐ ╪º┘ä╪▒┘è╪º╪╢┘è╪⌐|3,1,1,3,5,3", "KIN|Kinesiology|╪╣┘ä┘à ╪º┘ä╪¡╪▒┘â╪⌐|4,3,1,4,2,2",
    "AVI|Aviation/Aeronautics|╪º┘ä╪╖┘è╪▒╪º┘å|4,3,1,2,3,4", "LOG|Logistics & Supply Chain|╪│┘ä╪º╪│┘ä ╪º┘ä╪Ñ┘à╪»╪º╪» ╪º┘ä┘ä┘ê╪¼╪│╪¬┘è╪⌐|2,3,1,2,4,5",
    "RE|Real Estate|╪º┘ä╪╣┘é╪º╪▒╪º╪¬|1,2,1,3,5,3", "INS|Insurance & Risk Management|╪º┘ä╪¬╪ú┘à┘è┘å ┘ê╪Ñ╪»╪º╪▒╪⌐ ╪º┘ä┘à╪«╪º╪╖╪▒|1,4,1,2,4,5",
    "ACT|Actuarial Science|╪º┘ä╪╣┘ä┘ê┘à ╪º┘ä╪º┘â╪¬┘ê╪º╪▒┘è╪⌐|1,5,1,1,3,5", "PUB|Public Administration|╪º┘ä╪Ñ╪»╪º╪▒╪⌐ ╪º┘ä╪╣╪º┘à╪⌐|1,3,1,4,4,4",
    "SW|Social Work|╪º┘ä╪«╪»┘à╪⌐ ╪º┘ä╪º╪¼╪¬┘à╪º╪╣┘è╪⌐|1,2,1,5,2,3", "CRI|Criminology|╪╣┘ä┘à ╪º┘ä╪¼╪▒┘è┘à╪⌐|2,4,1,3,3,4",
    "ANT|Anthropology|╪º┘ä╪ú┘å╪½╪▒┘ê╪¿┘ê┘ä┘ê╪¼┘è╪º|2,4,2,3,1,2", "ARC2|Archaeology|╪º┘ä╪ó╪½╪º╪▒|3,4,2,1,1,3",
    "PHI|Philosophy|╪º┘ä┘ü┘ä╪│┘ü╪⌐|1,5,3,1,1,2", "THE|Theology/Islamic Studies|╪º┘ä╪»╪▒╪º╪│╪º╪¬ ╪º┘ä╪Ñ╪│┘ä╪º┘à┘è╪⌐ ┘ê╪º┘ä╪┤╪▒┘è╪╣╪⌐|1,4,2,4,3,3",
    "MUS|Music|╪º┘ä┘à┘ê╪│┘è┘é┘ë|2,2,5,1,2,1", "THT|Theater & Drama|╪º┘ä┘à╪│╪▒╪¡ ┘ê╪º┘ä╪»╪▒╪º┘à╪º|2,2,5,3,3,1",
    "FIL|Film & Television|╪º┘ä╪│┘è┘å┘à╪º ┘ê╪º┘ä╪¬┘ä┘ü╪▓┘è┘ê┘å|3,3,5,2,4,2", "ANI|Animation|╪º┘ä╪▒╪│┘ê┘à ╪º┘ä┘à╪¬╪¡╪▒┘â╪⌐|2,3,5,1,2,3",
    "PHO|Photography|╪º┘ä╪¬╪╡┘ê┘è╪▒ ╪º┘ä┘ü┘ê╪¬┘ê╪║╪▒╪º┘ü┘è|3,2,5,1,2,2", "FAS|Fashion Design|╪¬╪╡┘à┘è┘à ╪º┘ä╪ú╪▓┘è╪º╪í|3,2,5,2,3,2",
    "IND|Industrial Design|╪º┘ä╪¬╪╡┘à┘è┘à ╪º┘ä╪╡┘å╪º╪╣┘è|4,3,5,1,3,2", "URB|Urban Planning|╪º┘ä╪¬╪«╪╖┘è╪╖ ╪º┘ä╪╣┘à╪▒╪º┘å┘è|2,4,3,2,4,3",
    "SUP|Supply Chain Management|╪Ñ╪»╪º╪▒╪⌐ ╪│┘ä╪º╪│┘ä ╪º┘ä╪¬┘ê╪▒┘è╪»|1,4,1,2,4,5", "MIS|Management Information Systems|┘å╪╕┘à ╪º┘ä┘à╪╣┘ä┘ê┘à╪º╪¬ ╪º┘ä╪Ñ╪»╪º╪▒┘è╪⌐|1,4,1,2,4,5",
    "ECOM|E-Commerce|╪º┘ä╪¬╪¼╪º╪▒╪⌐ ╪º┘ä╪Ñ┘ä┘â╪¬╪▒┘ê┘å┘è╪⌐|1,3,2,2,5,4", "ENT|Entrepreneurship|╪▒┘è╪º╪»╪⌐ ╪º┘ä╪ú╪╣┘à╪º┘ä|1,3,4,3,5,3",
    "INT|International Business|╪º┘ä╪ú╪╣┘à╪º┘ä ╪º┘ä╪»┘ê┘ä┘è╪⌐|1,3,2,3,5,3", "PUBH|Public Health|╪º┘ä╪╡╪¡╪⌐ ╪º┘ä╪╣╪º┘à╪⌐|1,4,1,4,3,3",
    "HCA|Health Care Administration|╪Ñ╪»╪º╪▒╪⌐ ╪º┘ä╪▒╪╣╪º┘è╪⌐ ╪º┘ä╪╡╪¡┘è╪⌐|1,3,1,4,4,4", "RAD|Radiologic Technology|╪¬┘é┘å┘è╪⌐ ╪º┘ä╪ú╪┤╪╣╪⌐|4,3,1,3,1,4",
    "RES|Respiratory Therapy|╪º┘ä╪╣┘ä╪º╪¼ ╪º┘ä╪¬┘å┘ü╪│┘è|3,3,1,4,1,3", "OPT|Optometry|╪º┘ä╪¿╪╡╪▒┘è╪º╪¬|3,4,1,4,2,3",
    "AUD|Audiology|╪º┘ä╪│┘à╪╣┘è╪º╪¬|2,4,1,4,1,3", "SLP|Speech-Language Pathology|╪ú┘à╪▒╪º╪╢ ╪º┘ä╪¬╪«╪º╪╖╪¿|1,3,1,5,1,3",
    "GEN|Genetics|╪╣┘ä┘à ╪º┘ä┘ê╪▒╪º╪½╪⌐|2,5,1,1,1,4", "NEU|Neuroscience|╪╣┘ä┘à ╪º┘ä╪ú╪╣╪╡╪º╪¿|2,5,1,1,1,3",
    "BCH|Biochemistry|╪º┘ä┘â┘è┘à┘è╪º╪í ╪º┘ä╪¡┘è┘ê┘è╪⌐|3,5,1,1,1,4", "ZOO|Zoology|╪╣┘ä┘à ╪º┘ä╪¡┘è┘ê╪º┘å|3,4,1,1,1,2",
    "BOT|Botany|╪╣┘ä┘à ╪º┘ä┘å╪¿╪º╪¬|3,4,1,1,1,3", "MBI|Microbiology|╪╣┘ä┘à ╪º┘ä╪ú╪¡┘è╪º╪í ╪º┘ä╪»┘é┘è┘é╪⌐|3,5,1,1,1,4",
    "IMM|Immunology|╪╣┘ä┘à ╪º┘ä┘à┘å╪º╪╣╪⌐|2,5,1,1,1,3", "PHA2|Pharmacology|╪╣┘ä┘à ╪º┘ä╪ú╪»┘ê┘è╪⌐|2,5,1,1,1,4",
    "TOX|Toxicology|╪╣┘ä┘à ╪º┘ä╪│┘à┘ê┘à|2,5,1,1,1,4", "GEO2|Geology|╪º┘ä╪¼┘è┘ê┘ä┘ê╪¼┘è╪º|4,4,1,1,2,2",
    "MET|Meteorology|╪º┘ä╪ú╪▒╪╡╪º╪» ╪º┘ä╪¼┘ê┘è╪⌐|2,4,1,1,1,3", "OCE|Oceanography|╪╣┘ä┘à ╪º┘ä┘à╪¡┘è╪╖╪º╪¬|3,4,1,1,2,2",
    "MSE|Materials Science & Engineering|┘ç┘å╪»╪│╪⌐ ╪º┘ä┘à┘ê╪º╪»|3,5,1,1,2,3", "NUC|Nuclear Engineering|╪º┘ä┘ç┘å╪»╪│╪⌐ ╪º┘ä┘å┘ê┘ê┘è╪⌐|3,5,1,1,2,4"
  ];
  return rawData.map(line => {
    const [id, en, ar, scores] = line.split('|');
    const [R, I, A, S, E, C] = scores.split(',').map(Number);
    return { id, en, ar, p: { R, I, A, S, E, C } };
  });
};

const SAUDI_UNIVERSITIES = [
  { 
    id: 'ksu', ar: '╪¼╪º┘à╪╣╪⌐ ╪º┘ä┘à┘ä┘â ╪│╪╣┘ê╪» (KSU)', en: 'King Saud University', 
    cityAr: 'Riyadh', cityEn: 'Riyadh', typeAr: 'Public', typeEn: 'Public', 
    qs: 143, the: 251, req: '╪º┘ä╪½╪º┘å┘ê┘è╪⌐ 30% | ╪º┘ä┘é╪»╪▒╪º╪¬ 30% | ╪º┘ä╪¬╪¡╪╡┘è┘ä┘è 40%', score: 88, 
    descAr: 'High competition, leading in Health & Engineering.', descEn: 'High competition, leading in Health & Engineering.', 
    color: 'var(--accent-mint)', icon: '≡ƒÅ¢∩╕Å', tracks: { ar: '╪╡╪¡┘è╪î ╪╣┘ä┘à┘è╪î ╪Ñ┘å╪│╪º┘å┘è', en: 'Health, Science, Humanities' } 
  },
  { 
    id: 'kfupm', ar: '╪¼╪º┘à╪╣╪⌐ ╪º┘ä┘à┘ä┘â ┘ü┘ç╪» ┘ä┘ä╪¿╪¬╪▒┘ê┘ä (KFUPM)', en: 'KFUPM', 
    cityAr: 'Dhahran', cityEn: 'Dhahran', typeAr: 'Public', typeEn: 'Public', 
    qs: 160, the: 201, req: '╪º┘ä╪½╪º┘å┘ê┘è╪⌐ 20% | ╪º┘ä┘é╪»╪▒╪º╪¬ 30% | ╪º┘ä╪¬╪¡╪╡┘è┘ä┘è 50%', score: 91, 
    descAr: 'Top ranked globally for Petroleum, Engineering & Tech.', descEn: 'Top ranked globally for Petroleum, Engineering & Tech.', 
    color: 'var(--accent-peach)', icon: '≡ƒö¼', tracks: { ar: '┘ç┘å╪»╪│┘è╪î ╪¡╪º╪│╪¿╪î ╪ú╪╣┘à╪º┘ä', en: 'Engineering, Computer Science, Business' } 
  },
  { 
    id: 'kau', ar: '╪¼╪º┘à╪╣╪⌐ ╪º┘ä┘à┘ä┘â ╪╣╪¿╪»╪º┘ä╪╣╪▓┘è╪▓ (KAU)', en: 'King Abdulaziz University', 
    cityAr: 'Jeddah', cityEn: 'Jeddah', typeAr: 'Public', typeEn: 'Public', 
    qs: 143, the: 251, req: '╪º┘ä╪½╪º┘å┘ê┘è╪⌐ 40% | ╪º┘ä┘é╪»╪▒╪º╪¬ 30% | ╪º┘ä╪¬╪¡╪╡┘è┘ä┘è 30%', score: 85, 
    descAr: 'Renowned for Business Administration and Applied Sciences.', descEn: 'Renowned for Business Administration and Applied Sciences.', 
    color: 'var(--accent-lilac)', icon: '≡ƒîè', tracks: { ar: '╪╣┘ä┘à┘è╪î ╪Ñ╪»╪º╪▒┘è╪î ╪╡╪¡┘è', en: 'Science, Admin, Health' } 
  },
  { 
    id: 'iau', ar: '╪¼╪º┘à╪╣╪⌐ ╪º┘ä╪Ñ┘à╪º┘à ╪╣╪¿╪»╪º┘ä╪▒╪¡┘à┘å ╪¿┘å ┘ü┘è╪╡┘ä', en: 'Imam Abdulrahman Bin Faisal Univ', 
    cityAr: 'Dammam', cityEn: 'Dammam', typeAr: 'Public', typeEn: 'Public', 
    qs: 400, the: 501, req: '╪º┘ä╪½╪º┘å┘ê┘è╪⌐ 30% | ╪º┘ä┘é╪»╪▒╪º╪¬ 30% | ╪º┘ä╪¬╪¡╪╡┘è┘ä┘è 40%', score: 86, 
    descAr: 'Highly competitive Health and Medicine tracks in the East.', descEn: 'Highly competitive Health and Medicine tracks in the East.', 
    color: 'var(--accent-yellow)', icon: '≡ƒÅÑ', tracks: { ar: '╪╡╪¡┘è╪î ┘ç┘å╪»╪│┘è╪î ╪Ñ┘å╪│╪º┘å┘è', en: 'Health, Engineering, Humanities' } 
  },
  { 
    id: 'pnu', ar: '╪¼╪º┘à╪╣╪⌐ ╪º┘ä╪ú┘à┘è╪▒╪⌐ ┘å┘ê╪▒╪⌐ (PNU)', en: 'Princess Nourah University', 
    cityAr: 'Riyadh', cityEn: 'Riyadh', typeAr: 'Public', typeEn: 'Public', 
    qs: 600, the: 601, req: '╪º┘ä╪½╪º┘å┘ê┘è╪⌐ 30% | ╪º┘ä┘é╪»╪▒╪º╪¬ 30% | ╪º┘ä╪¬╪¡╪╡┘è┘ä┘è 40%', score: 83, 
    descAr: 'Leading global womens university with Tech and Health focus.', descEn: 'Leading global womens university with Tech and Health focus.', 
    color: 'var(--accent-coral)', icon: '≡ƒæ⌐ΓÇì≡ƒÄô', tracks: { ar: '╪╡╪¡┘è╪î ╪╣┘ä┘à┘è╪î ╪Ñ┘å╪│╪º┘å┘è', en: 'Health, Science, Humanities' } 
  },
  { 
    id: 'psu', ar: '╪¼╪º┘à╪╣╪⌐ ╪º┘ä╪ú┘à┘è╪▒ ╪│┘ä╪╖╪º┘å (PSU)', en: 'Prince Sultan University', 
    cityAr: 'Riyadh', cityEn: 'Riyadh', typeAr: 'Private', typeEn: 'Private', 
    qs: 500, the: 601, req: '┘è╪╣╪¬┘à╪» ╪╣┘ä┘ë ╪º┘ä┘à┘é╪º╪¿┘ä╪⌐ ┘ê╪º┘ä┘à╪╣╪»┘ä ╪º┘ä╪¬╪▒╪º┘â┘à┘è ╪º┘ä╪╣╪º┘ä┘è', score: 80, 
    descAr: 'Leading private university for Business and Law in KSA.', descEn: 'Leading private university for Business and Law in KSA.', 
    color: 'var(--bg-secondary)', icon: '≡ƒÆ╝', tracks: { ar: '╪Ñ╪»╪º╪▒╪⌐╪î ┘é╪º┘å┘ê┘å╪î ╪¡╪º╪│╪¿', en: 'Business, Law, Computer Science' } 
  },
  { 
    id: 'alfaisal', ar: '╪¼╪º┘à╪╣╪⌐ ╪º┘ä┘ü┘è╪╡┘ä', en: 'Alfaisal University', 
    cityAr: 'Riyadh', cityEn: 'Riyadh', typeAr: 'Private', typeEn: 'Private', 
    qs: 800, the: 301, req: '╪º┘ä┘à╪╣╪»┘ä ╪º┘ä╪¬╪▒╪º┘â┘à┘è + ╪º╪«╪¬╪¿╪º╪▒╪º╪¬ ╪º┘ä┘é╪¿┘ê┘ä ╪º┘ä╪»┘ê┘ä┘è╪⌐', score: 82, 
    descAr: 'Highly ranked medical and business programs with global ties.', descEn: 'Highly ranked medical and business programs with global ties.', 
    color: 'var(--accent-mint)', icon: '≡ƒº¼', tracks: { ar: '╪╖╪¿╪î ╪ú╪╣┘à╪º┘ä╪î ┘ç┘å╪»╪│╪⌐', en: 'Medicine, Business, Engineering' } 
  },
  { 
    id: 'uqu', ar: '╪¼╪º┘à╪╣╪⌐ ╪ú┘à ╪º┘ä┘é╪▒┘ë (UQU)', en: 'Umm Al-Qura University', 
    cityAr: 'Makkah', cityEn: 'Makkah', typeAr: 'Public', typeEn: 'Public', 
    qs: 500, the: 601, req: '╪º┘ä╪½╪º┘å┘ê┘è╪⌐ 30% | ╪º┘ä┘é╪»╪▒╪º╪¬ 30% | ╪º┘ä╪¬╪¡╪╡┘è┘ä┘è 40%', score: 84, 
    descAr: 'Deep history, leading in Islamic studies, Medicine and Tech.', descEn: 'Deep history, leading in Islamic studies, Medicine and Tech.', 
    color: 'var(--accent-peach)', icon: '≡ƒòî', tracks: { ar: '╪┤╪▒╪╣┘è╪î ╪╡╪¡┘è╪î ┘ç┘å╪»╪│┘è', en: 'Islamic Studies, Health, Engineering' } 
  },
  { 
    id: 'kku', ar: '╪¼╪º┘à╪╣╪⌐ ╪º┘ä┘à┘ä┘â ╪«╪º┘ä╪» (KKU)', en: 'King Khalid University', 
    cityAr: 'Abha', cityEn: 'Abha', typeAr: 'Public', typeEn: 'Public', 
    qs: 700, the: 501, req: '╪º┘ä╪½╪º┘å┘ê┘è╪⌐ 30% | ╪º┘ä┘é╪»╪▒╪º╪¬ 30% | ╪º┘ä╪¬╪¡╪╡┘è┘ä┘è 40%', score: 81, 
    descAr: 'Largest university in the south with strong Tech/Eng tracks.', descEn: 'Largest university in the south with strong Tech/Eng tracks.', 
    color: 'var(--accent-lilac)', icon: 'Γ¢░∩╕Å', tracks: { ar: '╪╡╪¡┘è╪î ╪╣┘ä┘à┘è╪î ┘å╪╕╪▒┘è', en: 'Health, Science, Theoretical' } 
  },
  { 
    id: 'qassim', ar: '╪¼╪º┘à╪╣╪⌐ ╪º┘ä┘é╪╡┘è┘à', en: 'Qassim University', 
    cityAr: 'Qassim', cityEn: 'Qassim', typeAr: 'Public', typeEn: 'Public', 
    qs: 800, the: 801, req: '╪º┘ä╪½╪º┘å┘ê┘è╪⌐ 30% | ╪º┘ä┘é╪»╪▒╪º╪¬ 30% | ╪º┘ä╪¬╪¡╪╡┘è┘ä┘è 40%', score: 81, 
    descAr: 'Massive campus leading in Agriculture, Medicine, and Engineering.', descEn: 'Massive campus leading in Agriculture, Medicine, and Engineering.', 
    color: 'var(--accent-yellow)', icon: '≡ƒî┤', tracks: { ar: '╪╡╪¡┘è╪î ╪▓╪▒╪º╪╣┘è╪î ╪╣┘ä┘à┘è', en: 'Health, Agriculture, Science' } 
  },
  { 
    id: 'taibah', ar: '╪¼╪º┘à╪╣╪⌐ ╪╖┘è╪¿╪⌐', en: 'Taibah University', 
    cityAr: 'Madinah', cityEn: 'Madinah', typeAr: 'Public', typeEn: 'Public', 
    qs: 1000, the: 1001, req: '╪º┘ä╪½╪º┘å┘ê┘è╪⌐ 30% | ╪º┘ä┘é╪»╪▒╪º╪¬ 30% | ╪º┘ä╪¬╪¡╪╡┘è┘ä┘è 40%', score: 82, 
    descAr: 'Rapid growth in Health, Business, and IT sectors.', descEn: 'Rapid growth in Health, Business, and IT sectors.', 
    color: 'var(--accent-coral)', icon: '≡ƒòè∩╕Å', tracks: { ar: '╪╡╪¡┘è╪î ╪Ñ╪»╪º╪▒┘è╪î ╪╣┘ä┘à┘è', en: 'Health, Admin, Science' } 
  },
  { 
    id: 'kaust', ar: '╪¼╪º┘à╪╣╪⌐ ╪º┘ä┘à┘ä┘â ╪╣╪¿╪»╪º┘ä┘ä┘ç (KAUST)', en: 'KAUST', 
    cityAr: 'Thuwal', cityEn: 'Thuwal', typeAr: 'Public', typeEn: 'Public', 
    qs: 113, the: 201, req: '╪┤╪▒┘ê╪╖ ╪╣┘ä┘è╪º ┘ê╪¿╪▒╪º┘à╪¼ ┘à┘ê┘ç╪¿╪⌐ ┘ê╪º┘ä┘à╪╣╪»┘ä ╪º┘ä┘à╪▒╪¬┘ü╪╣', score: 95, 
    descAr: 'Elite research institution opening highly selective undergrad programs.', descEn: 'Elite research institution opening highly selective undergrad programs.', 
    color: 'var(--bg-secondary)', icon: '≡ƒº¬', tracks: { ar: '╪ú╪¿╪¡╪º╪½ ╪╣┘ä┘à┘è╪⌐╪î ┘ç┘å╪»╪│╪⌐ ┘à╪¬┘é╪»┘à╪⌐', en: 'Advanced Science & Engineering' } 
  }
];


// ================== Pages and Features ==================

const Footer = ({ isAr }) => {
  return (
    <footer className="w-full bg-[#111111] text-white border-t-8 border-black p-12 md:p-20 relative overflow-hidden mt-20">
      <div className="absolute top-10 right-10 opacity-10">
        <DecorativeStar className="w-48 h-48 text-[var(--accent-coral)]" />
      </div>
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        <div className="md:col-span-5 space-y-6">
          <h3 className={`text-4xl font-black italic ${isAr ? 'font-display-en' : 'font-display-en'}`}>
            {isAr ? 'MASARI' : 'MASARI'}
          </h3>
          <p className="text-gray-400 font-medium max-w-sm">
            {isAr ? 'A pioneer neobrutalist approach to shaping career personas for the next generation using deep AI and empirical research.' : 'A pioneer neobrutalist approach to shaping career personas for the next generation using deep AI and empirical research.'}
          </p>
        </div>

        <div className="md:col-span-3 space-y-4">
          <h4 className="font-bold text-xl uppercase tracking-widest text-[var(--accent-lilac)]">
            {isAr ? 'Contact' : 'Contact'}
          </h4>
          <ul className="space-y-3 font-semibold text-gray-300">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[var(--accent-peach)]" /> hello@masari.io</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[var(--accent-peach)]" /> +966 50 000 1234</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

const AuthPage = ({ isAr, setPage, mode, mouseX, mouseY, userProfile, setUserProfile, onSaveProfile, showToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar_blobby');
  const [slogan, setSlogan] = useState('');
  
  const isSignIn = mode === 'auth_signin';

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomId = `MSR-${Math.floor(1000 + Math.random() * 9000)}-2026`;
    const finalProfile = {
      ...userProfile,
      id: randomId,
      name: isSignIn ? (userProfile.name || 'Masari Pioneer') : (name || 'Masari Pioneer'),
      email: email,
      avatarId: selectedAvatar,
      slogan: slogan || (isAr ? 'Decoding academic milestones & professional trajectories' : 'Decoding academic milestones & professional trajectories'),
      isLoggedIn: true,
      points: userProfile.points > 0 ? userProfile.points : 50, 
      subscriptionTier: userProfile.subscriptionTier || 'free'
    };

    setUserProfile(finalProfile);
    onSaveProfile(finalProfile);

    showToast(isAr ? `Verified identity recorded on secure server: ${randomId}` : `Verified identity recorded on secure server: ${randomId}`);
    setPage('dashboard_student');
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 flex flex-col items-center justify-center relative overflow-hidden">
      <AbstractShape2 className="absolute top-[20%] right-[10%] w-[30vw] text-[var(--accent-peach)] opacity-40 animate-float" />
      <DecorativeStar className="absolute bottom-[20%] left-[10%] w-32 h-32 text-[var(--accent-mint)] animate-spin-slow" />
      
      <div className="w-full max-w-xl bg-theme-secondary p-8 md:p-10 rounded-[3rem] border-4 border-theme shadow-brutal relative z-10">
        <button onClick={() => setPage('home')} className="clickable-card mb-6 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors text-theme-primary">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'Back to Home' : 'Back to Home'}
        </button>

        <div className="flex justify-between items-end mb-6 text-theme-primary">
           <h2 className={`text-3xl md:text-4xl ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
             {isSignIn ? (isAr ? 'Verified Sign In' : 'Verified Sign In') : (isAr ? 'Register Custom ID' : 'Register Custom ID')}
           </h2>
           <TrackingEye mouseX={mouseX} mouseY={mouseY} className="w-14 h-14" />
        </div>

        <form className="flex flex-col gap-5 text-theme-primary" onSubmit={handleSubmit}>
          {!isSignIn && (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-lg">{isAr ? 'Choose your PFP Persona' : 'Choose your PFP Persona'}</label>
                <div className="grid grid-cols-5 gap-3 p-3 bg-theme-primary rounded-2xl border-4 border-theme">
                  {CUTE_AVATARS.map((avatar) => (
                    <button
                      key={avatar.id} type="button" onClick={() => setSelectedAvatar(avatar.id)}
                      className={`relative aspect-square rounded-xl border-4 transition-transform p-1 overflow-hidden ${selectedAvatar === avatar.id ? 'border-[var(--accent-coral)] scale-110 shadow-brutal bg-white' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}
                    >
                      {avatar.svg()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-lg">{isAr ? 'Display Full Name' : 'Display Full Name'}</label>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)} placeholder={isAr ? 'Your name' : 'Your name'}
                  className="w-full bg-theme-primary border-4 border-theme p-3 rounded-2xl font-bold focus:outline-none focus:bg-[var(--accent-mint)] focus:text-black transition-colors" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-lg">{isAr ? 'Inspirational Slogan' : 'Inspirational Slogan'}</label>
                <input 
                  type="text" value={slogan} onChange={e => setSlogan(e.target.value)} placeholder={isAr ? 'e.g. Code wizard & Design thinker' : 'e.g. Code wizard & Design thinker'}
                  className="w-full bg-theme-primary border-4 border-theme p-3 rounded-2xl font-bold focus:outline-none focus:bg-[var(--accent-yellow)] focus:text-black transition-colors" 
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-bold text-lg">{isAr ? 'Email Address' : 'Email Address'}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-theme-primary border-4 border-theme p-3 rounded-2xl font-bold focus:outline-none focus:bg-[var(--accent-lilac)] focus:text-black transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-lg">{isAr ? 'Password' : 'Password'}</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-theme-primary border-4 border-theme p-3 rounded-2xl font-bold focus:outline-none focus:bg-[var(--accent-peach)] focus:text-black transition-colors" />
          </div>

          <Magnetic strength={0.1} className="w-full mt-2">
            <button type="submit" className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xl border-4 border-transparent shadow-brutal-hover hover:scale-105 transition-all flex items-center justify-center gap-3">
              {isSignIn ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isSignIn ? (isAr ? 'Sign In to ID' : 'Sign In to ID') : (isAr ? 'Register & Generate ID' : 'Register & Generate ID')}
            </button>
          </Magnetic>
        

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-1 bg-black/20 rounded"></div>
            <span className="font-bold text-sm opacity-50">{isAr ? 'OR' : 'OR'}</span>
            <div className="flex-1 h-1 bg-black/20 rounded"></div>
          </div>

          <Magnetic strength={0.1} className="w-full">
            <button type="button" onClick={async () => {
              try {
                const auth = getAuth();
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                const firestore = getFirestore();
                const appId = 'masari-academic-decoder';
                const profileRef = doc(firestore, 'artifacts', appId, 'users', user.uid, 'profile', 'user_data');
                const profileSnap = await getDoc(profileRef);
                let finalProfile;
                if (profileSnap.exists()) {
                  finalProfile = { ...profileSnap.data(), isLoggedIn: true };
                } else {
                  const randomId = 'MSR-' + Math.floor(1000 + Math.random() * 9000) + '-2026';
                  finalProfile = {
                    id: randomId,
                    name: user.displayName || 'Masari Pioneer',
                    email: user.email,
                    avatarId: 'avatar_blobby',
                    slogan: isAr ? 'Decoding academic milestones' : 'Decoding academic milestones',
                    isLoggedIn: true,
                    points: 50,
                    subscriptionTier: 'free',
                    careerPersona: ''
                  };
                  await setDoc(profileRef, finalProfile);
                }
                setUserProfile(finalProfile);
                showToast(isAr ? 'Signed in with Google successfully!' : 'Signed in with Google successfully!');
                setPage('dashboard_student');
              } catch (err) {
                console.error('Google sign-in error:', err);
                showToast(isAr ? '┘ü╪┤┘ä ╪¬╪│╪¼┘è┘ä ╪º┘ä╪»╪«┘ê┘ä ╪¿╪¼┘ê╪¼┘ä: ' + err.message : 'Google sign-in failed: ' + err.message);
              }
            }} className="w-full py-4 bg-white text-black rounded-full font-bold text-xl border-4 border-black shadow-brutal-hover hover:scale-105 transition-all flex items-center justify-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {isAr ? 'Continue with Google' : 'Continue with Google'}
            </button>
          </Magnetic>
        </form>

        <div className="mt-6 text-center font-bold opacity-70 text-theme-primary">
          {isSignIn ? (
             <p>{isAr ? 'New here?' : 'New here?'} <span onClick={() => setPage('auth_signup')} className="text-[var(--accent-coral)] cursor-pointer hover:underline">{isAr ? 'Create an Account' : 'Create an Account'}</span></p>
          ) : (
             <p>{isAr ? 'Already registered?' : 'Already registered?'} <span onClick={() => setPage('auth_signin')} className="text-[var(--accent-lilac)] cursor-pointer hover:underline">{isAr ? 'Sign In' : 'Sign In'}</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

const SavedReportsPage = ({ isAr, setPage, userContext }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const appId = 'masari-academic-decoder';
        const firestore = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        
        const reportsRef = collection(firestore, 'artifacts', appId, 'users', user.uid, 'saved_reports');
        // Adhere to complex query constraints - fetch all and sort in memory
        const querySnapshot = await getDocs(reportsRef);
        
        const fetched = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        
        fetched.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReports(fetched);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDownloadReport = (report) => {
    const element = document.createElement("a");
    const file = new Blob([`${report.title}\n\n${report.content}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${report.title.replace(/\s+/g, '_')}_Masari.txt`;
    document.body.appendChild(element); 
    element.click();
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 max-w-[1200px] mx-auto text-theme-primary">
      <button onClick={() => setPage('home')} className="clickable-card mb-8 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors px-4 py-2 border-2 border-transparent hover:border-theme rounded-full">
        {isAr ? <ArrowRight className="w-6 h-6"/> : <ArrowLeft className="w-6 h-6"/>} 
        {isAr ? 'Back to Home' : 'Back to Home'}
      </button>

      <div className="mb-12">
        <h2 className={`text-5xl md:text-7xl font-black mb-4 ${isAr ? 'font-display-en' : 'font-display-en'}`}>
          {isAr ? 'Saved Artifacts' : 'Saved Artifacts'}
        </h2>
        <p className="text-xl opacity-70">
          {isAr ? 'All the cognitive reports you generated and securely saved on Masari.' : 'All the cognitive reports you generated and securely saved on Masari.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><BrainCircuit className="w-16 h-16 animate-pulse" /></div>
      ) : reports.length === 0 ? (
        <div className="bg-theme-secondary border-4 border-theme p-12 rounded-[2.5rem] shadow-brutal text-center">
           <FileText className="w-24 h-24 mx-auto mb-6 opacity-20" />
           <h3 className="text-2xl font-black">{isAr ? 'No Saved Artifacts' : 'No Saved Artifacts'}</h3>
           <p className="mt-2 opacity-70">{isAr ? 'Use AI tools and hit the Save button to store reports here.' : 'Use AI tools and hit the Save button to store reports here.'}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-theme-secondary border-4 border-theme p-6 rounded-3xl shadow-brutal flex flex-col justify-between text-black">
              <div>
                <h4 className="font-black text-xl mb-2">{r.title}</h4>
                <p className="text-xs font-bold opacity-50 mb-4">{new Date(r.date).toLocaleDateString()}</p>
                <div className="line-clamp-4 text-sm font-medium opacity-80 mb-6 bg-gray-100 p-3 rounded-xl border-2 border-black">
                  {r.content.substring(0, 150)}...
                </div>
              </div>
              <button 
                onClick={() => handleDownloadReport(r)}
                className="w-full py-3 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--accent-mint)] hover:text-black border-2 border-transparent hover:border-black transition-colors"
              >
                <Download className="w-4 h-4" />
                {isAr ? '╪¬┘å╪▓┘è┘ä ┘à┘ä┘ü ┘å╪╡┘è' : 'Download Txt'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const SubscriptionPage = ({ isAr, setPage, userProfile, setUserProfile, onSaveProfile, showToast }) => {
  const [selectedPackPoints, setSelectedPackPoints] = useState(100);

  const pointPacks = {
    10: { price: 1.99 }, 25: { price: 3.99 }, 50: { price: 6.99 }, 100: { price: 11.99 },
    150: { price: 16.99 }, 200: { price: 21.99 }, 250: { price: 25.99 }, 300: { price: 29.99 },
    400: { price: 37.99 }, 500: { price: 44.99 }
  };

  const handleUpgradeToBro = () => {
    const updated = {
      ...userProfile,
      subscriptionTier: 'bro',
      points: (userProfile.points || 0) + 100
    };
    setUserProfile(updated);
    onSaveProfile(updated);
    showToast(isAr ? 'Upgraded to Bro Plan! +100 Credits ≡ƒÜÇ' : 'Upgraded to Bro Plan! +100 Credits ≡ƒÜÇ');
  };
  
  const handleSelectFree = () => {
    const updated = {
      ...userProfile,
      subscriptionTier: 'free'
    };
    setUserProfile(updated);
    onSaveProfile(updated);
    showToast(isAr ? 'You are currently on the Free Basic Plan.' : 'You are currently on the Free Basic Plan.');
  };

  const handleBuyPoints = () => {
    const amount = Number(selectedPackPoints);
    const updated = {
      ...userProfile,
      points: (userProfile.points || 0) + amount
    };
    setUserProfile(updated);
    onSaveProfile(updated);
    showToast(isAr ? `Successfully fueled profile with ${amount} points!` : `Successfully fueled profile with ${amount} points!`);
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 max-w-[1200px] mx-auto text-theme-primary">
      <button onClick={() => setPage('home')} className="clickable-card mb-8 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors px-4 py-2 border-2 border-transparent hover:border-theme rounded-full">
        {isAr ? <ArrowRight className="w-6 h-6"/> : <ArrowLeft className="w-6 h-6"/>} 
        {isAr ? 'Back to Home' : 'Back to Home'}
      </button>

      <div className="text-center mb-16 space-y-4">
        <h2 className={`text-5xl md:text-7xl font-black ${isAr ? 'font-display-en' : 'font-display-en'}`}>
          {isAr ? 'Fuel Your Future' : 'Fuel Your Future'}
        </h2>
        <p className="text-xl opacity-70 max-w-2xl mx-auto">
          {isAr ? 'Choose your tier or acquire micro-credits below to trigger real-time grounded research engines.' : 'Choose your tier or acquire micro-credits below to trigger real-time grounded research engines.'}
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-peach)] text-black rounded-full border-4 border-black font-black text-lg shadow-[4px_4px_0_#000]">
          <Coins className="w-6 h-6 text-yellow-600 animate-spin-slow" />
          <span>
            {isAr ? `Balance: ${userProfile.points || 0} Credits | Tier: ${userProfile.subscriptionTier === \'bro\' ? \'Bro\' : \'Free\'}` : `Balance: ${userProfile.points || 0} Credits | Tier: ${userProfile.subscriptionTier === 'bro' ? 'Bro' : 'Free'}`}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-12">
        
        <div className="bg-theme-secondary border-4 border-black p-8 rounded-[2.5rem] shadow-brutal flex flex-col justify-between relative text-theme-primary">
          <div>
            <span className="text-xs uppercase font-black px-4 py-1.5 bg-gray-200 text-black rounded-full border-2 border-black inline-block">
              {isAr ? 'BASIC' : 'BASIC'}
            </span>
            <h3 className="text-3xl font-black mt-6 mb-2">{isAr ? 'Free Plan' : 'Free Plan'}</h3>
            <div className="text-4xl font-black mb-6">$0 <span className="text-sm opacity-80">/ {isAr ? 'forever' : 'forever'}</span></div>
            <ul className="space-y-4 font-bold border-t-4 border-black/20 pt-6 text-base opacity-80">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" /> {isAr ? 'Access to free diagnostics (Readiness)' : 'Access to free diagnostics (Readiness)'}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" /> {isAr ? 'Pay-per-use credits for premium tools' : 'Pay-per-use credits for premium tools'}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" /> {isAr ? 'Save standard persona card' : 'Save standard persona card'}</li>
            </ul>
          </div>
          <button 
            onClick={handleSelectFree}
            disabled={userProfile.subscriptionTier === 'free'}
            className="mt-8 w-full py-4 bg-gray-200 text-black font-black text-lg rounded-full border-4 border-black hover:bg-gray-300 transition-colors shadow-brutal disabled:opacity-50"
          >
            {userProfile.subscriptionTier === 'free' ? (isAr ? 'Current Plan' : 'Current Plan') : (isAr ? 'Select' : 'Select')}
          </button>
        </div>

        <div className="bg-[var(--accent-lilac)] border-4 border-black p-8 rounded-[2.5rem] shadow-brutal-lg flex flex-col justify-between relative text-black transform lg:-translate-y-4 z-10">
          <div className="absolute -top-4 right-6 bg-[var(--accent-coral)] text-black border-4 border-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest animate-pulse shadow-[2px_2px_0_#000]">
            {isAr ? 'Most Popular' : 'Most Popular'}
          </div>
          <div>
            <span className="text-xs uppercase font-black px-4 py-1.5 bg-white text-black rounded-full border-2 border-black inline-block">
              {isAr ? 'PREMIUM LITE' : 'PREMIUM LITE'}
            </span>
            <h3 className="text-4xl font-black mt-6 mb-2">{isAr ? 'Bro Plan' : 'Bro Plan'}</h3>
            <div className="text-5xl font-black mb-6">$5 <span className="text-sm opacity-80">/ {isAr ? 'month' : 'month'}</span></div>
            <ul className="space-y-4 font-bold border-t-4 border-black/20 pt-6 text-base">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" /> {isAr ? '100 Monthly Credits' : '100 Monthly Credits'}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" /> {isAr ? 'Priority AI Engine Processing' : 'Priority AI Engine Processing'}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" /> {isAr ? 'Live Internet Search Plugins' : 'Live Internet Search Plugins'}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" /> {isAr ? 'Premium UI Persona Export' : 'Premium UI Persona Export'}</li>
            </ul>
          </div>
          <button 
            onClick={handleUpgradeToBro}
            className="mt-8 w-full py-4 bg-black text-white font-black text-lg rounded-full border-4 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors shadow-brutal"
          >
            {isAr ? 'Upgrade for $5/mo ≡ƒÜÇ' : 'Upgrade for $5/mo ≡ƒÜÇ'}
          </button>
        </div>

        <div className="bg-[var(--accent-mint)] border-4 border-black p-8 rounded-[2.5rem] shadow-brutal flex flex-col justify-between text-black">
          <div>
            <span className="text-xs uppercase font-black px-4 py-1.5 bg-white text-black rounded-full border-2 border-black inline-block">
              {isAr ? 'TOP-UP' : 'TOP-UP'}
            </span>
            <h3 className="text-3xl font-black mt-6 mb-2">{isAr ? 'Credit Packs' : 'Credit Packs'}</h3>
            <p className="font-semibold text-sm opacity-80 mb-6">
              {isAr ? 'Need more juice? Top up your credits anytime.' : 'Need more juice? Top up your credits anytime.'}
            </p>

            <div className="space-y-4 bg-white/50 border-4 border-black p-4 rounded-2xl mb-4">
              <label className="block text-sm font-black">{isAr ? 'Volume:' : 'Volume:'}</label>
              <div className="flex flex-wrap gap-2">
                {[10, 50, 100, 200, 500].map((num) => (
                  <button
                    key={num} onClick={() => setSelectedPackPoints(num)}
                    className={`flex-1 py-2 px-1 rounded-xl border-2 font-bold text-center text-sm transition-all ${selectedPackPoints === num ? 'bg-black text-white border-black scale-105' : 'bg-white text-black border-black hover:bg-gray-100'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between items-center border-t-2 border-black/20 pt-3 font-black text-lg">
                <span>{isAr ? 'Total:' : 'Total:'}</span>
                <span className="text-[var(--accent-coral)] text-2xl drop-shadow-[1px_1px_0_#000]">${pointPacks[selectedPackPoints]?.price}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleBuyPoints}
            className="mt-2 w-full py-4 bg-white text-black font-black text-lg rounded-full border-4 border-black hover:bg-black hover:text-white transition-colors shadow-brutal"
          >
            {isAr ? `Buy ${selectedPackPoints} Credits` : `Buy ${selectedPackPoints} Credits`}
          </button>
        </div>

      </div>
    </div>
  );
};

const Navbar = ({ isAr, toggleLang, setPage, theme, toggleTheme, toggleMenu, userProfile }) => (
  <nav className="fixed top-0 w-full p-6 z-50 pointer-events-none">
    <div className="flex items-center justify-between max-w-[1600px] mx-auto pointer-events-auto">
      <Magnetic strength={0.1}>
        <div 
          onClick={() => setPage('home')} 
          className={`clickable-card text-4xl cursor-pointer flex items-center gap-2 text-theme-primary ${isAr ? 'font-display-en italic font-black' : 'font-display-en italic font-black'}`}
        >
          <DecorativeStar className="w-8 h-8 text-[var(--accent-coral)] animate-spin-slow" />
          {isAr ? 'Masari' : 'Masari'}
        </div>
      </Magnetic>
      
      <div className="flex items-center gap-2 md:gap-4 bg-theme-primary/90 backdrop-blur-md px-4 py-2 rounded-full border-4 border-theme shadow-brutal text-theme-primary transition-colors">
        
        <Magnetic strength={0.3}>
          <button onClick={toggleLang} className="clickable-card flex items-center gap-2 font-black text-sm uppercase hover:text-[var(--accent-coral)] transition-colors py-2 px-2">
            <Globe className="w-4 h-4" />
            <span>{isAr ? '╪╣╪▒╪¿┘è' : '╪╣╪▒╪¿┘è'}</span>
          </button>
        </Magnetic>
        
        <div className="w-px h-6 bg-theme-primary border-r-2 border-theme opacity-30"></div>

        <Magnetic strength={0.3}>
          <button onClick={toggleTheme} className="clickable-card flex items-center gap-2 font-black text-sm hover:text-[var(--accent-peach)] transition-colors py-2 px-2">
            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            <span className="hidden md:inline">{theme === 'dark' ? (isAr ? 'Light' : 'Light') : (isAr ? 'Dark' : 'Dark')}</span>
          </button>
        </Magnetic>

        <div className="w-px h-6 bg-theme-primary border-r-2 border-theme opacity-30"></div>
        
        {userProfile.isLoggedIn && (
          <>
            <Magnetic strength={0.3}>
              <button onClick={() => setPage('persona_card')} className="clickable-card flex items-center gap-2 font-black text-sm hover:text-[var(--accent-mint)] transition-colors py-2 px-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden md:inline">{isAr ? 'My ID' : 'My ID'}</span>
              </button>
            </Magnetic>
            <div className="w-px h-6 bg-theme-primary border-r-2 border-theme opacity-30"></div>
          </>
        )}

        <Magnetic strength={0.3}>
          <button onClick={toggleMenu} className="clickable-card font-black text-sm hover:text-[var(--accent-lilac)] transition-colors py-2 px-2 flex items-center gap-2">
            <Menu className="w-5 h-5" />
            <span className="hidden md:inline">{isAr ? 'Menu' : 'Menu'}</span>
          </button>
        </Magnetic>
      </div>
    </div>
  </nav>
);

const HeroPage = ({ isAr, setPage, setUserContext, mouseX, mouseY, userProfile }) => {
  const handleProtectedAction = (context, pageTarget) => {
    setUserContext(context);
    if (!userProfile.isLoggedIn) {
      setPage('auth_signup');
    } else {
      setPage(pageTarget);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" style={{ transform: `translate(${(mouseX - window.innerWidth/2) * -0.02}px, ${(mouseY - window.innerHeight/2) * -0.02}px)` }}>
        <AbstractShape1 className="absolute top-[15%] right-[10%] w-64 h-64 text-[var(--accent-lilac)] animate-float opacity-90 drop-shadow-[8px_8px_0_var(--shadow-color)]" />
        <AbstractShape2 className="absolute bottom-[10%] left-[5%] w-80 h-80 text-[var(--accent-mint)] animate-float opacity-90 drop-shadow-[8px_8px_0_var(--shadow-color)]" style={{ animationDelay: '1s' }} />
        <DecorativeStar className="absolute top-[30%] left-[20%] w-16 h-16 text-[var(--accent-peach)] animate-spin-slow drop-shadow-[4px_4px_0_var(--shadow-color)]" />
      </div>

      <div className="relative z-10 text-center max-w-[1400px] mx-auto flex flex-col items-center">
        <h1 className={`text-giant text-theme-primary mb-4 ${isAr ? 'font-display-en italic' : 'font-display-en italic'}`}>
          {isAr ? 'Masari.' : 'Masari.'}
        </h1>
        
        <div className="flex items-center gap-6 md:gap-12 flex-wrap justify-center">
           <TrackingEye mouseX={mouseX} mouseY={mouseY} />
           <h1 className={`text-giant text-theme-primary ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
             {isAr ? 'Decoded' : 'Decoded'}
           </h1>
        </div>
        
        <p className="mt-12 text-xl md:text-2xl font-semibold max-w-2xl mx-auto text-theme-primary opacity-80 leading-relaxed">
          {isAr ? 'A premium, neobrutalist career decoder. Map high-paying targets, expected 2026 salaries, and structure printable credentials.' : 'A premium, neobrutalist career decoder. Map high-paying targets, expected 2026 salaries, and structure printable credentials.'}
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Magnetic strength={0.4}>
            <button 
              onClick={() => handleProtectedAction('student', 'dashboard_student')}
              className="clickable-card group relative bg-theme-primary border-4 border-theme text-theme-primary px-8 py-4 rounded-[2rem] font-black text-xl overflow-hidden shadow-brutal-hover flex flex-col items-center justify-center min-w-[280px]"
            >
              <div className="relative z-10 flex flex-col items-center gap-2 w-full transition-transform duration-500">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-[var(--accent-lilac)]" />
                  <span>{isAr ? 'Academic Planner (Student)' : 'Academic Planner (Student)'}</span>
                </div>
              </div>
            </button>
          </Magnetic>

          <Magnetic strength={0.4}>
            <button 
              onClick={() => handleProtectedAction('pro', 'dashboard_pro')}
              className="clickable-card group relative bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-[2rem] font-black text-xl overflow-hidden shadow-brutal-hover min-w-[280px] flex items-center justify-center border-4 border-transparent"
            >
               <div className="relative z-10 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-[var(--accent-mint)]" />
                <span>{isAr ? 'Professional Suite (Pro)' : 'Professional Suite (Pro)'}</span>
              </div>
            </button>
          </Magnetic>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ isAr, type, setPage, mouseX, mouseY, userProfile, onTriggerTool }) => {
  const isStudent = type === 'student';
  
  const studentFeatures = [
    { id: 'tool_career_test', num: '01', titleAr: 'Career Blueprint (50 Qs)', titleEn: 'Career Blueprint (50 Qs)', descAr: 'Robust 50-Question matching test mapping 100 majors.', descEn: 'Robust 50-Question matching test mapping 100 majors.', points: 0, color: 'bg-[var(--accent-peach)]', span: 'span-2', icon: <BrainCircuit className="bento-bg-icon" /> },
    { id: 'tool_ready_test', num: '02', titleAr: '╪º╪«╪¬╪¿╪º╪▒ ╪º┘ä╪¼╪º┘ç╪▓┘è╪⌐ (10 ╪ú╪│╪ª┘ä╪⌐)', titleEn: 'Readiness Check (10 Qs)', descAr: '╪¬┘é┘è┘è┘à ╪│╪▒┘è╪╣ ┘ä┘à╪»┘ë ╪¼╪º┘ç╪▓┘è╪¬┘â ┘à┘å 10 ╪ú╪│╪ª┘ä╪⌐.', descEn: 'A fast 10-question evaluation of your readiness.', points: 0, color: 'bg-[var(--accent-mint)]', span: 'span-2', icon: <Activity className="bento-bg-icon" /> },
    { id: 'tool_calculator', num: '03', titleAr: '┘à╪¡╪▒┘â ╪º┘ä┘é╪¿┘ê┘ä ╪º┘ä┘à┘ê╪▓┘ê┘å', titleEn: 'Weighted Admission Engine', descAr: '╪¡╪│╪º╪¿ ┘ê┘à╪╖╪º╪¿┘é╪⌐ ┘é╪¿┘ê┘ä┘â ╪º┘ä┘à┘ê╪▓┘ê┘å ┘ü┘è ╪º┘ä╪│╪╣┘ê╪»┘è╪⌐.', descEn: 'Calculate and match your weighted placement in KSA.', points: 0, color: 'bg-[var(--accent-lilac)]', span: 'span-2', icon: <Calculator className="bento-bg-icon" /> },
    { id: 'tool_curriculum', num: '04', titleAr: '┘à╪«╪╖╪╖ ╪º┘ä┘à┘å┘ç╪¼ ╪º┘ä╪»╪▒╪º╪│┘è', titleEn: 'Curriculum Blueprint', descAr: '╪¬╪¡┘ä┘è┘ä ╪º┘ä┘à┘å┘ç╪¼ ╪º┘ä╪»╪▒╪º╪│┘è ┘ä╪¬╪«╪╡╪╡┘â ╪¿╪º┘ä╪░┘â╪º╪í ╪º┘ä╪º╪╡╪╖┘å╪º╪╣┘è.', descEn: 'AI-generated curriculum breakdown for your degree.', points: 20, color: 'bg-[var(--accent-yellow)]', icon: <BookOpen className="bento-bg-icon" /> },
    { id: 'tool_job_titles', num: '05', titleAr: '╪º┘ä┘à╪│┘à┘è╪º╪¬ ╪º┘ä┘ê╪╕┘è┘ü┘è╪⌐', titleEn: 'Career Titles', descAr: '╪º┘ä┘à╪│┘à┘è╪º╪¬ ╪º┘ä┘ê╪╕┘è┘ü┘è╪⌐ ╪º┘ä╪»┘é┘è┘é╪⌐ ╪º┘ä┘à╪¬┘ê╪º┘ü┘é╪⌐ ┘à╪╣ ╪¬╪«╪╡╪╡┘â.', descEn: 'Exact titles eligible for your target major.', points: 10, color: 'bg-[var(--accent-coral)]', icon: <Briefcase className="bento-bg-icon" /> },
    { id: 'tool_university_directory', num: '06', titleAr: '╪»┘ä┘è┘ä ╪º┘ä╪¼╪º┘à╪╣╪º╪¬ ╪¿╪º┘ä╪░┘â╪º╪í ╪º┘ä╪º╪╡╪╖┘å╪º╪╣┘è', titleEn: 'AI University Directory', descAr: '╪»┘ä┘è┘ä ╪º┘ä╪¼╪º┘à╪╣╪º╪¬ ╪º┘ä╪│╪╣┘ê╪»┘è╪⌐ ┘ê╪º┘ä╪¿╪¡╪½ ╪º┘ä╪╣╪º┘ä┘à┘è ╪¿╪º┘ä╪░┘â╪º╪í ╪º┘ä╪º╪╡╪╖┘å╪º╪╣┘è.', descEn: 'KSA Universities & Global AI Search.', points: 10, color: 'bg-[var(--accent-peach)]', span: 'span-2', icon: <Globe className="bento-bg-icon" /> },
    { id: 'tool_important_courses', num: '07', titleAr: '╪º┘ä╪┤┘ç╪º╪»╪º╪¬ ╪º┘ä╪ú╪│╪º╪│┘è╪⌐', titleEn: 'Core Certifications', descAr: '╪ú┘ç┘à ╪º┘ä╪┤┘ç╪º╪»╪º╪¬ ╪º┘ä┘à╪╡╪║╪▒╪⌐ ┘ä╪»╪╣┘à ┘à╪│╪º╪▒┘â ╪º┘ä╪ú┘â╪º╪»┘è┘à┘è.', descEn: 'Top micro-degrees to support your academic path.', points: 5, color: 'bg-white', icon: <Award className="bento-bg-icon" /> },
    { id: 'tool_graduation_ideas', num: '08', titleAr: '╪ú┘ü┘â╪º╪▒ ┘à╪┤╪º╪▒┘è╪╣ ╪¬╪«╪▒╪¼', titleEn: 'Capstone Ideas', descAr: '╪╣╪╡┘ü ╪░┘ç┘å┘è ┘ä┘à╪┤╪º╪▒┘è╪╣ ╪¬╪«╪▒╪¼ ┘é╪º╪¿┘ä╪⌐ ┘ä┘ä╪¬┘ê╪│╪╣.', descEn: 'Brainstorm scalable capstone projects.', points: 5, color: 'bg-[var(--accent-yellow)]', icon: <Compass className="bento-bg-icon" /> },
    { id: 'tool_ai_jobs_salary', num: '09', titleAr: '╪º┘ä╪¿╪¡╪½ ╪º┘ä┘à╪¿╪º╪┤╪▒ ╪╣┘å ╪º┘ä╪▒┘ê╪º╪¬╪¿', titleEn: 'Live Salary Search', descAr: '┘è╪│╪¬╪«╪▒╪¼ ╪º┘ä╪▒┘ê╪º╪¬╪¿ ╪º┘ä╪¡┘è╪⌐ ╪¿╪º╪│╪¬╪«╪»╪º┘à ╪º┘ä╪¿╪¡╪½ ╪º┘ä┘à╪¿╪º╪┤╪▒ ╪╣╪¿╪▒ ╪º┘ä┘ê┘è╪¿.', descEn: 'Scrapes live salaries using grounded Web Search.', points: 15, color: 'bg-[var(--accent-mint)]', span: 'span-2', icon: <Search className="bento-bg-icon" /> },
    { id: 'tool_roi', num: '10', titleAr: '╪º┘ä╪╣╪º╪ª╪» ╪º┘ä┘à╪º┘ä┘è ╪¿╪╣╪» ╪º┘ä╪¬╪«╪▒╪¼', titleEn: 'Post-grad ROI', descAr: '╪¬╪¡┘ä┘è┘ä ╪º┘ä╪╣╪º╪ª╪» ╪º┘ä┘à╪º┘ä┘è ┘ê┘å┘é╪╖╪⌐ ╪º┘ä╪¬╪╣╪º╪»┘ä.', descEn: 'Analyze financial break-even.', points: 0, color: 'bg-[var(--accent-lilac)]', icon: <TrendingUp className="bento-bg-icon" /> },
    { id: 'tool_ai', num: '11', titleAr: '╪º┘ä┘à╪│╪¬╪┤╪º╪▒ ╪º┘ä┘à┘ç┘å┘è ╪¿╪º┘ä╪░┘â╪º╪í ╪º┘ä╪º╪╡╪╖┘å╪º╪╣┘è', titleEn: 'AI Career Counselor', descAr: '┘à╪│╪º╪╣╪» ┘à╪¡╪º╪»╪½╪⌐ ┘ä┘ä╪¡╪╡┘ê┘ä ╪╣┘ä┘ë ╪¬┘ê╪¼┘è┘ç ┘à┘ç┘å┘è ╪╣┘à┘è┘é.', descEn: 'Conversational assistant for deep guidance.', points: 10, color: 'bg-[var(--accent-coral)]', icon: <Bot className="bento-bg-icon" /> }
  ];

  const proFeatures = [
    { id: 'tool_job_titles', num: '01', titleAr: '╪º┘ä┘à╪│┘à┘è╪º╪¬ ╪º┘ä┘à┘ç┘å┘è╪⌐', titleEn: 'Professional Titles', descAr: '╪º┘ä╪¬╪¡┘é┘é ┘à┘å ╪º┘ä╪«╪▒╪º╪ª╪╖ ╪º┘ä╪¬┘å╪╕┘è┘à┘è╪⌐ ╪º┘ä╪»┘é┘è┘é╪⌐ ┘ä┘ä┘à╪│┘à┘è╪º╪¬.', descEn: 'Verify exact organizational mappings.', points: 10, color: 'bg-[var(--accent-peach)]', icon: <Layers className="bento-bg-icon" /> },
    { id: 'tool_salary', num: '02', titleAr: '┘à┘å╪¡┘å┘ë ╪º┘ä╪▒┘ê╪º╪¬╪¿', titleEn: 'Salary Curve', descAr: '╪¬╪╡┘ê╪▒ ╪»┘é┘è┘é ┘ä┘à┘é╪º┘è┘è╪│ ┘å┘à┘ê ╪º┘ä╪▒┘ê╪º╪¬╪¿ ╪¿┘à╪▒┘ê╪▒ ╪º┘ä┘ê┘é╪¬.', descEn: 'Visualize precise salary scaling metrics.', points: 15, color: 'bg-[var(--accent-mint)]', span: 'span-2', icon: <TrendingUp className="bento-bg-icon" /> },
    { id: 'tool_important_courses', num: '03', titleAr: 'Upskilling Certifications', titleEn: 'Upskilling Certifications', descAr: '╪¬╪¡╪»┘è╪» ╪º┘ä╪┤┘ç╪º╪»╪º╪¬ ╪º┘ä╪º╪¡╪¬╪▒╪º┘ü┘è╪⌐ ┘ä┘ä┘ê╪╡┘ê┘ä ╪Ñ┘ä┘ë ┘à╪│╪¬┘ê┘è╪º╪¬ ╪ú╪╣┘ä┘ë.', descEn: 'Identify certifications to secure higher tiers.', points: 5, color: 'bg-[var(--accent-yellow)]', icon: <Award className="bento-bg-icon" /> },
    { id: 'tool_career_pivot', num: '04', titleAr: 'Career Pivot Roadmap', titleEn: 'Career Pivot Roadmap', descAr: '┘ê╪╢╪╣ ╪«╪º╪▒╪╖╪⌐ ╪╖╪▒┘è┘é ╪«╪╖┘ê╪⌐ ╪¿╪«╪╖┘ê╪⌐ ┘ä┘ä╪º┘å╪¬┘é╪º┘ä ╪º┘ä┘à┘ç┘å┘è.', descEn: 'Establish step-by-step transition roadmaps.', points: 15, color: 'bg-[var(--accent-lilac)]', span: 'span-2', icon: <Compass className="bento-bg-icon" /> },
    { id: 'tool_ai_jobs_salary', num: '05', titleAr: '╪º┘ä╪¿╪¡╪½ ╪º┘ä┘à╪¿╪º╪┤╪▒ ╪╣┘å ╪º┘ä╪▒┘ê╪º╪¬╪¿', titleEn: 'Live Salary Search', descAr: '┘è╪│╪¬╪«╪▒╪¼ ╪º┘ä╪▒┘ê╪º╪¬╪¿ ╪º┘ä╪¡┘è╪⌐ ╪¿╪º╪│╪¬╪«╪»╪º┘à ╪º┘ä╪¿╪¡╪½ ╪º┘ä┘à╪¿╪º╪┤╪▒ ╪╣╪¿╪▒ ╪º┘ä┘ê┘è╪¿.', descEn: 'Scrapes live salaries using grounded Web Search.', points: 15, color: 'bg-[var(--accent-coral)]', span: 'span-2', icon: <Search className="bento-bg-icon" /> },
    { id: 'tool_job_hunt', num: '06', titleAr: '╪º┘ä┘ü╪▒╪╡ ╪º┘ä┘ê╪╕┘è┘ü┘è╪⌐ ╪º┘ä┘à╪¬╪º╪¡╪⌐', titleEn: 'Live Open Opportunities', descAr: '┘é╪º╪ª┘à╪⌐ ┘à╪«╪╡╪╡╪⌐ ╪¿╪º┘ä╪┤╪▒┘â╪º╪¬ ╪º┘ä┘à╪¬╪º╪¡╪⌐ ┘ä┘ä╪¬┘ê╪╕┘è┘ü ╪¡╪º┘ä┘è╪º┘ï.', descEn: 'Custom, grounded list of hiring companies.', points: 20, color: 'bg-[var(--accent-mint)]', span: 'span-2', icon: <Briefcase className="bento-bg-icon" /> },
    { id: 'tool_define_roadmap', num: '07', titleAr: '╪¬╪¡╪»┘è╪» ╪º┘ä╪ú┘ç╪»╪º┘ü ┘ê╪º┘ä┘à╪╣╪º┘ä┘à', titleEn: 'Define Custom Milestones', descAr: '╪¬╪¡╪»┘è╪» ╪«╪╖┘ê╪º╪¬ ┘ê╪º┘é╪╣┘è╪⌐ ┘ä┘ä╪¬╪▒┘é┘è╪⌐ ╪º┘ä┘à┘ç┘å┘è╪⌐.', descEn: 'Plot realistic promotional steps.', points: 20, color: 'bg-white', icon: <Activity className="bento-bg-icon" /> },
    { id: 'tool_ai', num: '08', titleAr: '╪º┘ä┘à╪│╪¬╪┤╪º╪▒ ╪º┘ä┘à┘ç┘å┘è ╪¿╪º┘ä╪░┘â╪º╪í ╪º┘ä╪º╪╡╪╖┘å╪º╪╣┘è', titleEn: 'AI Career Counselor', descAr: '┘à╪│╪º╪╣╪» ┘à╪¡╪º╪»╪½╪⌐ ┘ä┘ä╪¡╪╡┘ê┘ä ╪╣┘ä┘ë ╪¬┘ê╪¼┘è┘ç ┘à┘ç┘å┘è ╪╣┘à┘è┘é.', descEn: 'Conversational assistant for deep guidance.', points: 10, color: 'bg-[var(--accent-lilac)]', span: 'span-3', icon: <Bot className="bento-bg-icon" /> },
    { id: 'tool_roi', num: '09', titleAr: '╪º┘ä╪╣╪º╪ª╪» ╪º┘ä┘à╪º┘ä┘è ╪¿╪╣╪» ╪º┘ä╪¬╪«╪▒╪¼', titleEn: 'Post-grad ROI', descAr: '╪¬╪¡┘ä┘è┘ä ╪º┘ä╪╣╪º╪ª╪» ╪º┘ä┘à╪º┘ä┘è ┘ê┘å┘é╪╖╪⌐ ╪º┘ä╪¬╪╣╪º╪»┘ä.', descEn: 'Analyze financial break-even.', points: 0, color: 'bg-[var(--accent-peach)]', icon: <TrendingUp className="bento-bg-icon" /> }
  ];

  const activeFeatures = isStudent ? studentFeatures : proFeatures;

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 max-w-[1400px] mx-auto text-theme-primary">
      <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <Magnetic strength={0.2} className="mb-8">
            <button onClick={() => setPage('home')} className="clickable-card flex items-center gap-2 font-bold text-lg hover:text-[var(--accent-coral)] transition-colors px-4 py-2 border-2 border-transparent hover:border-theme rounded-full">
              {isAr ? <ArrowRight className="w-6 h-6"/> : <ArrowLeft className="w-6 h-6"/>} 
              {isAr ? 'Back to Home' : 'Back to Home'}
            </button>
          </Magnetic>
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <h2 className={`text-5xl md:text-7xl ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
              {isStudent ? (isAr ? 'Student & Admission' : 'Student & Admission') : (isAr ? 'Pro Suite Tools' : 'Pro Suite Tools')}
            </h2>
          </div>
          <p className="text-xl font-medium opacity-70 max-w-xl mt-4">
            {isAr ? 'Execute premium academic and career diagnostic engines using secure web grounding.' : 'Execute premium academic and career diagnostic engines using secure web grounding.'}
          </p>
        </div>
        <div className="hidden md:block">
           <TrackingEye mouseX={mouseX} mouseY={mouseY} className="bg-theme-secondary" />
        </div>
      </div>

      <div className="bento-grid">
        {activeFeatures.map((feat) => (
          <Magnetic key={feat.id} strength={0.02} className={`w-full h-full ${feat.span || ''}`}>
            <div 
              onClick={() => onTriggerTool(feat.id, feat.points)}
              className={`bento-card text-black ${feat.color} group`}
            >
              {feat.icon}
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-5xl font-black opacity-30 font-mono tracking-tighter">{feat.num}</span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-black border-2 border-black flex items-center gap-1 shadow-[2px_2px_0_#000] ${feat.points === 0 ? 'bg-[var(--accent-yellow)] free-badge' : 'bg-white/80'}`}>
                    <Coins className="w-3.5 h-3.5 text-yellow-600 relative z-10" />
                    <span className="relative z-10">{feat.points === 0 ? (isAr ? 'FREE' : 'FREE') : `${feat.points} ${isAr ? 'Pts' : 'Pts'}`}</span>
                  </span>
                </div>
                <h3 className={`text-2xl font-black mb-3 ${isAr ? 'font-display-en' : 'font-display-en'}`}>
                  {isAr ? feat.titleAr : feat.titleEn}
                </h3>
                <p className="font-semibold opacity-80 text-sm leading-relaxed">
                  {isAr ? feat.descAr : feat.descEn}
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center border-2 border-black transition-transform group-hover:scale-110">
                  {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </div>
              </div>
            </div>
          </Magnetic>
        ))}
      </div>
    </div>
  );
};

// ================== Higher Order AI Component Generator ==================
const createAIToolComponent = (toolConfig) => {
  return ({ isAr, setPage, userContext, userProfile, setUserProfile, onSaveProfile, showToast }) => {
    const [input1, setInput1] = useState(toolConfig.useProfilePersona ? userProfile.careerPersona || '' : '');
    const [input2, setInput2] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const saveReport = useSaveReport(userProfile, setUserProfile, onSaveProfile, showToast, isAr);

    const handleGenerate = async () => {
      if (!input1.trim()) return;
      setLoading(true);
      
      const langInst = isAr ? 'MUST WRITE IN ENGLISH.' : 'MUST WRITE IN ENGLISH.';
      const systemPrompt = `${toolConfig.systemRole} Use Markdown extensively (###, -, **). ${langInst}`;
      const query = toolConfig.buildQuery(input1, input2);
      
      const result = await callLMStudio(systemPrompt, query, isAr ? toolConfig.fallbackAr : toolConfig.fallbackEn, toolConfig.useSearchPlugins);
      setOutput(result);
      setLoading(false);
    };

    const handleDownload = () => {
      const element = document.createElement("a");
      const file = new Blob([output], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${(isAr ? toolConfig.titleAr : toolConfig.titleEn).replace(/\s+/g, '_')}_Report.txt`;
      document.body.appendChild(element); 
      element.click();
    };

    return (
      <div className="min-h-screen pt-32 px-6 pb-20 relative text-theme-primary">
        <div className="max-w-[1000px] mx-auto bg-theme-secondary border-4 border-black p-8 md:p-12 rounded-[2.5rem] shadow-brutal text-black">
          <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
            {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
            {isAr ? 'Back to Tools' : 'Back to Tools'}
          </button>

          <h3 className="text-4xl font-black mb-8">{isAr ? toolConfig.titleAr : toolConfig.titleEn}</h3>
          
          <div className="space-y-6">
            <input 
              type="text" value={input1} onChange={e => setInput1(e.target.value)}
              placeholder={isAr ? toolConfig.ph1Ar : toolConfig.ph1En}
              className="w-full bg-theme-primary border-4 border-black p-5 rounded-2xl font-bold text-xl"
            />
            {toolConfig.hasInput2 && (
              <input 
                type="text" value={input2} onChange={e => setInput2(e.target.value)}
                placeholder={isAr ? toolConfig.ph2Ar : toolConfig.ph2En}
                className="w-full bg-theme-primary border-4 border-black p-5 rounded-2xl font-bold text-xl"
              />
            )}
            <button 
              onClick={handleGenerate} disabled={loading}
              className={`w-full py-5 ${toolConfig.btnColor} border-4 border-black font-black text-2xl rounded-2xl shadow-brutal-hover disabled:opacity-50 transition-all flex items-center justify-center gap-3 ${toolConfig.textColor || 'text-black'}`}
            >
              {toolConfig.icon}
              {loading ? (isAr ? 'Processing Request...' : 'Processing Request...') : (isAr ? toolConfig.btnAr : toolConfig.btnEn)}
            </button>

            {output && (
              <div className="mt-8 page-enter border-t-4 border-black pt-8">
                {toolConfig.visualGraph && toolConfig.visualGraph(output)}
                <NeoMarkdown text={output} />
                
                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={handleDownload} className="py-4 px-6 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-brutal-hover">
                    <Download className="w-5 h-5" />
                    {isAr ? '╪¬┘å╪▓┘è┘ä ┘à┘ä┘ü ┘å╪╡┘è' : 'Download Txt'}
                  </button>
                  <button onClick={() => saveReport(isAr ? toolConfig.titleAr : toolConfig.titleEn, output)} className="py-4 px-6 bg-[var(--accent-mint)] border-2 border-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--accent-lilac)] transition-colors shadow-brutal-hover">
                    <Save className="w-5 h-5" />
                    {isAr ? '╪¡┘ü╪╕ ┘ü┘è ╪º┘ä╪¬┘é╪º╪▒┘è╪▒' : 'Save to Artifacts'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
};

const ToolUniversityDirectory = ({ isAr, setPage, userContext, userProfile, setUserProfile, onSaveProfile, showToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const saveReport = useSaveReport(userProfile, setUserProfile, onSaveProfile, showToast, isAr);

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;

    if (userProfile.subscriptionTier !== 'bro' && (userProfile.points || 0) < 5) {
      showToast(isAr ? 'Insufficient points for AI Search (5 Pts)' : 'Insufficient points for AI Search (5 Pts)');
      return;
    }

    if (userProfile.subscriptionTier !== 'bro') {
      const updated = { ...userProfile, points: userProfile.points - 5 };
      setUserProfile(updated);
      onSaveProfile(updated);
      showToast(isAr ? 'Deducted 5 credits for AI International Search' : 'Deducted 5 credits for AI International Search');
    }

    setLoading(true);
    const langInst = isAr ? 'MUST WRITE IN ENGLISH.' : 'MUST WRITE IN ENGLISH.';
    const systemPrompt = `You are a global academic registrar. Use web search targeting specific websites (e.g., site:topuniversities.com, site:timeshighereducation.com, site:usnews.com) to find the most up-to-date admission requirements. You MUST format the output exactly as follows: \n1. University Name\n2. QS Ranking & Times Higher Education (THE) Ranking\n3. Minimum GPA & Test Requirements\n4. Acceptance Rate Estimate\n5. Top Ranked Programs. \nUse Markdown lists and tables. ${langInst}`;
    const query = `Search specific websites (e.g., site:topuniversities.com, site:timeshighereducation.com) to provide structured admission criteria, tuition, rankings, and top programs for: ${searchQuery}. Show in Markdown.`;
    const fallback = isAr ? `### Admissions benchmarks for ${searchQuery}\n\n- Data unavailable. Please check the official university website.` : `### Admissions benchmarks for ${searchQuery}\n\n- Data unavailable. Please check the official university website.`;
    
    const response = await callLMStudio(systemPrompt, query, fallback, true);
    setResult(response);
    setLoading(false);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `University_Report.txt`;
    document.body.appendChild(element); 
    element.click();
  };

  const filteredUnis = SAUDI_UNIVERSITIES.filter(u => {
    const matchesSearch = (u.ar.includes(localSearch) || u.en.toLowerCase().includes(localSearch.toLowerCase()));
    const matchesFilter = filterType === 'All' || 
                          (filterType === 'Public' && u.typeEn === 'Public') || 
                          (filterType === 'Private' && u.typeEn === 'Private') ||
                          (filterType === 'Top 500 QS' && u.qs <= 500);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 relative text-theme-primary">
      <div className="max-w-[1200px] mx-auto bg-theme-secondary border-4 border-black p-6 md:p-12 rounded-[2.5rem] shadow-brutal text-black">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-8 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'Back to Tools' : 'Back to Tools'}
        </button>

        <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
           <div>
             <h3 className="text-4xl md:text-5xl font-black mb-4">{isAr ? 'University Directory' : 'University Directory'}</h3>
             <p className="font-bold opacity-70 max-w-xl">{isAr ? 'Explore the largest KSA university database with global QS/THE rankings, or use AI for custom international searches.' : 'Explore the largest KSA university database with global QS/THE rankings, or use AI for custom international searches.'}</p>
           </div>
           <Building2 className="w-20 h-20 text-[var(--accent-lilac)] opacity-40" />
        </div>
        
        {/* FREE Saudi Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 bg-[var(--accent-mint)] border-2 border-black font-black text-xs rounded-full shadow-[2px_2px_0_#000] free-badge">{isAr ? 'FREE' : 'FREE'}</div>
            <h4 className="text-2xl font-bold">{isAr ? 'Major Saudi Universities & Rankings:' : 'Major Saudi Universities & Rankings:'}</h4>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-4 w-5 h-5 opacity-50 rtl:right-4 rtl:left-auto" />
                <input 
                  type="text" value={localSearch} onChange={e => setLocalSearch(e.target.value)}
                  placeholder={isAr ? 'Search local university...' : 'Search local university...'}
                  className="w-full bg-theme-primary border-4 border-black p-3 pl-12 rtl:pr-12 rtl:pl-4 rounded-xl font-bold focus:bg-[var(--accent-yellow)] transition-colors"
                />
             </div>
             <div className="flex flex-wrap gap-2">
               {['All', 'Public', 'Private', 'Top 500 QS'].map(f => (
                 <button 
                   key={f} onClick={() => setFilterType(f)}
                   className={`px-4 py-3 rounded-xl border-2 border-black font-bold text-sm transition-all shadow-[2px_2px_0_#000] ${filterType === f ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                 >
                   {f === 'All' ? (isAr ? 'All' : 'All') : f === 'Public' ? (isAr ? 'Public' : 'Public') : f === 'Private' ? (isAr ? 'Private' : 'Private') : (isAr ? 'Top 500 QS' : 'Top 500 QS')}
                 </button>
               ))}
             </div>
          </div>

          {filteredUnis.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center bg-theme-primary border-4 border-black rounded-3xl border-dashed">
               <Globe className="w-16 h-16 opacity-20 mb-4 animate-spin-slow" />
               <p className="font-bold text-xl">{isAr ? 'No matching local universities found.' : 'No matching local universities found.'}</p>
               <p className="opacity-70 font-semibold">{isAr ? 'Try using the Global AI Search below.' : 'Try using the Global AI Search below.'}</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredUnis.map((uni) => (
                <div key={uni.id} className="bg-theme-primary border-4 border-black rounded-2xl flex flex-col transition-all shadow-brutal overflow-hidden">
                  
                  <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center text-2xl shadow-[2px_2px_0_#000] shrink-0" style={{backgroundColor: uni.color}}>
                           {uni.icon}
                         </div>
                         <div>
                           <h5 className="font-black text-lg md:text-xl leading-tight">{isAr ? uni.ar : uni.en}</h5>
                           <div className="flex items-center gap-2 mt-1 text-xs font-bold opacity-70">
                             <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {isAr ? uni.cityAr : uni.cityEn}</span>
                             <span>ΓÇó</span>
                             <span className={uni.typeEn === 'Public' ? 'text-green-700' : 'text-purple-700'}>{isAr ? uni.typeAr : uni.typeEn}</span>
                           </div>
                         </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                       <div className="bg-[#FFD6A5] border-2 border-black px-2 py-1 rounded-md flex items-center gap-1 text-xs font-black shadow-[2px_2px_0_#000]">
                         <Trophy className="w-3 h-3" /> QS: #{uni.qs}
                       </div>
                       <div className="bg-[#B8E0D2] border-2 border-black px-2 py-1 rounded-md flex items-center gap-1 text-xs font-black shadow-[2px_2px_0_#000]">
                         <Star className="w-3 h-3" /> THE: #{uni.the}
                       </div>
                    </div>

                    <p className="text-sm font-bold opacity-80 mb-4 h-10 line-clamp-2">{isAr ? uni.descAr : uni.descEn}</p>

                    <div className="mt-auto">
                      <div className="flex justify-between text-xs font-black mb-1">
                        <span>{isAr ? 'Acceptance Difficulty' : 'Acceptance Difficulty'}</span>
                        <span>{uni.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden border border-black">
                         <div className="h-full bg-black transition-all" style={{width: `${uni.score}%`}}></div>
                      </div>
                    </div>
                  </div>

                  {/* Accordion Toggle */}
                  <div className="border-t-4 border-black">
                     <button 
                       onClick={() => setExpandedId(expandedId === uni.id ? null : uni.id)}
                       className="w-full p-3 bg-gray-100 hover:bg-[var(--accent-mint)] flex justify-center items-center gap-2 font-black text-sm transition-colors"
                     >
                       {expandedId === uni.id ? (isAr ? 'Hide Details' : 'Hide Details') : (isAr ? 'View Admission Requirements' : 'View Admission Requirements')}
                       {expandedId === uni.id ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                     </button>
                     
                     {expandedId === uni.id && (
                       <div className="p-5 bg-white border-t-2 border-dashed border-black page-enter space-y-4">
                         <div>
                           <span className="text-xs font-black opacity-50 uppercase tracking-widest block mb-1">{isAr ? 'Weighted Criteria:' : 'Weighted Criteria:'}</span>
                           <div className="font-mono text-sm font-bold bg-[var(--bg-primary)] p-2 rounded border-2 border-black inline-block">{uni.req}</div>
                         </div>
                         <div>
                           <span className="text-xs font-black opacity-50 uppercase tracking-widest block mb-1">{isAr ? 'Prominent Academic Tracks:' : 'Prominent Academic Tracks:'}</span>
                           <div className="font-bold text-sm text-[var(--accent-coral)]">{isAr ? uni.tracks.ar : uni.tracks.en}</div>
                         </div>
                       </div>
                     )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full h-2 bg-black rounded-full mb-16 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1/3 h-full bg-[var(--accent-coral)] animate-shineSweep"></div>
        </div>

        {/* PAID AI International Search */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-[var(--accent-yellow)] border-2 border-black font-black text-xs rounded-full shadow-[2px_2px_0_#000]">5 Pts</div>
            <h4 className="text-2xl font-bold">{isAr ? 'AI Global/Custom University Search:' : 'AI Global/Custom University Search:'}</h4>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'e.g. Harvard University or MIT' : 'e.g. Harvard University or MIT'}
              className="flex-1 bg-white border-4 border-black p-5 rounded-2xl font-bold text-xl"
            />
            <button 
              onClick={handleAISearch} disabled={loading}
              className="py-5 px-8 bg-black text-white border-4 border-transparent font-black text-xl rounded-2xl shadow-brutal-hover disabled:opacity-50 transition-all flex items-center justify-center gap-3"
            >
              <Globe className="w-6 h-6" />
              {loading ? (isAr ? 'Searching Global...' : 'Searching Global...') : (isAr ? 'DeepSearch Global' : 'DeepSearch Global')}
            </button>
          </div>

          {result && (
            <div className="mt-8 page-enter border-t-4 border-black pt-8">
              <NeoMarkdown text={result} />
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleDownload} className="py-4 px-6 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-brutal-hover">
                  <Download className="w-5 h-5" />
                  {isAr ? '╪¬┘å╪▓┘è┘ä ┘à┘ä┘ü ┘å╪╡┘è' : 'Download Txt'}
                </button>
                <button onClick={() => saveReport(isAr ? `Directory: ${searchQuery}` : `Directory: ${searchQuery}`, result)} className="py-4 px-6 bg-[var(--accent-mint)] border-2 border-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--accent-lilac)] transition-colors shadow-brutal-hover">
                  <Save className="w-5 h-5" />
                  {isAr ? '╪¡┘ü╪╕ ┘ü┘è ╪º┘ä╪¬┘é╪º╪▒┘è╪▒' : 'Save to Artifacts'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ... existing code ...
const ToolCurriculumPath = createAIToolComponent({
  titleAr: '┘à╪«╪╖╪╖ ╪º┘ä┘à╪│╪º╪▒ ╪º┘ä╪¬╪╣┘ä┘è┘à┘è ╪º┘ä┘à╪│╪¬┘é╪¿┘ä┘è', titleEn: 'Future Educational Path Blueprint',
  useProfilePersona: true, hasInput2: false,
  ph1Ar: '╪ú╪»╪«┘ä ╪º┘ä╪¬╪«╪╡╪╡ ╪º┘ä┘à╪│╪¬┘ç╪»┘ü (┘à╪½┘ä: ┘ç┘å╪»╪│╪⌐ ╪º┘ä╪¿╪▒┘à╪¼┘è╪º╪¬)', ph1En: 'Enter target major (e.g. Software Engineering)',
  btnAr: '╪¬┘ê┘ä┘è╪» ╪º┘ä┘à╪«╪╖╪╖', btnEn: 'Generate Blueprint',
  btnColor: 'bg-[var(--accent-lilac)]', icon: <Sparkles className="w-6 h-6" />,
  systemRole: "You are a senior academic director at Masari. Provide a comprehensive 4-year curriculum path and major skill roadmap.",
  buildQuery: (i1) => `Create a 4-year master curriculum map with important courses and milestone certifications for a major in ${i1}. Format with clear Markdown.`,
  fallbackAr: "### Curriculum Roadmap\n\n- **Year 1:** Basics\n- **Year 2:** Intermediates", fallbackEn: "### Curriculum Roadmap\n\n- **Year 1:** Basics\n- **Year 2:** Intermediates",
  visualGraph: () => (
    <div className="flex justify-between items-center mb-10 overflow-hidden">
      {[1, 2, 3, 4].map(y => (
        <div key={y} className="flex-1 flex flex-col items-center relative z-10">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black text-xl border-4 border-theme shadow-[4px_4px_0_var(--accent-peach)] z-20">Y{y}</div>
          {y < 4 && <div className="absolute top-6 left-[50%] w-full h-2 bg-black -z-10 rtl:right-[50%] rtl:left-auto"></div>}
        </div>
      ))}
    </div>
  )
});

const ToolJobTitles = createAIToolComponent({
  titleAr: '╪º┘ä┘à╪│┘à┘è╪º╪¬ ╪º┘ä┘ê╪╕┘è┘ü┘è╪⌐ ┘ê╪«╪▒┘è╪╖╪⌐ ╪│┘ê┘é ╪º┘ä╪╣┘à┘ä', titleEn: 'Career Titles Mapping',
  useProfilePersona: true, hasInput2: false,
  ph1Ar: '╪ú╪»╪«┘ä ╪º┘ä╪¬╪«╪╡╪╡ ╪ú┘ê ╪º┘ä┘à╪¼╪º┘ä', ph1En: 'Enter major or industry domain',
  btnAr: '╪º╪│╪¬╪«╪▒╪º╪¼ ╪º┘ä┘à╪│┘à┘è╪º╪¬', btnEn: 'Generate Job Titles',
  btnColor: 'bg-[var(--accent-yellow)]', icon: <Layers className="w-6 h-6" />,
  systemRole: "You are an elite talent recruiter. Provide an detailed list of eligible jobs/titles and standard starting salaries.",
  buildQuery: (i1) => `Provide a comprehensive list of corporate job titles, operational responsibilities, and key metrics for anyone studying ${i1}.`,
  fallbackAr: "### Standard Job Titles\n\n1. Cloud Infrastructure Architect", fallbackEn: "### Standard Job Titles\n\n1. Cloud Infrastructure Architect"
});

const ToolImportantCourses = createAIToolComponent({
  titleAr: '╪¬╪╖┘ê┘è╪▒ ╪º┘ä┘à┘ç╪º╪▒╪º╪¬ ┘ê╪º┘ä╪┤┘ç╪º╪»╪º╪¬ ╪º┘ä╪ú╪│╪º╪│┘è╪⌐', titleEn: 'Upskilling & Core Certifications',
  useProfilePersona: true, hasInput2: false,
  ph1Ar: '╪ú╪»╪«┘ä ╪¬╪«╪╡╪╡┘â ╪ú┘ê ┘à╪¼╪º┘ä┘â ╪º┘ä┘à╪│╪¬┘ç╪»┘ü', ph1En: 'Enter your major or target domain',
  btnAr: '╪º╪│╪¬┘â╪┤╪º┘ü ╪º┘ä╪┤┘ç╪º╪»╪º╪¬', btnEn: 'Unlock Industry Certifications',
  btnColor: 'bg-[var(--accent-coral)]', textColor: 'text-white', icon: <Award className="w-6 h-6" />,
  systemRole: "You are a senior technical training manager. Suggest the top professional industry certificates and micro-degrees.",
  buildQuery: (i1) => `Provide 5 specific industry-standard certifications and upskilling courses for a professional in ${i1}. Format with description.`,
  fallbackAr: "### Highly Recommended\n\n1. **AWS Certified**", fallbackEn: "### Highly Recommended\n\n1. **AWS Certified**"
});

const ToolCareerPivot = createAIToolComponent({
  titleAr: '╪«╪╖╪⌐ ╪º┘ä╪º┘å╪¬┘é╪º┘ä ╪º┘ä┘à┘ç┘å┘è', titleEn: 'Career Transition Blueprint',
  useProfilePersona: false, hasInput2: true,
  ph1Ar: '╪»┘ê╪▒┘â ╪º┘ä╪¡╪º┘ä┘è ╪ú┘ê ┘à╪¼╪º┘ä┘â (┘à╪½┘ä: ╪»╪╣┘à ╪º┘ä╪╣┘à┘ä╪º╪í)', ph1En: 'Your current role or domain (e.g. Customer Support)',
  ph2Ar: '╪º┘ä╪»┘ê╪▒ ╪ú┘ê ╪º┘ä┘à╪¼╪º┘ä ╪º┘ä┘à╪│╪¬┘ç╪»┘ü (┘à╪½┘ä: ┘à╪¡┘ä┘ä ╪¿┘è╪º┘å╪º╪¬)', ph2En: 'Your target role or domain (e.g. Data Analyst)',
  btnAr: '╪¬┘ê┘ä┘è╪» ╪«╪╖╪⌐ ╪º┘ä╪º┘å╪¬┘é╪º┘ä', btnEn: 'Generate Transition Roadmap',
  btnColor: 'bg-[var(--accent-lilac)]', icon: <Compass className="w-6 h-6" />,
  systemRole: "You are a career change counselor. Map out transferrable skills and professional transitioning steps.",
  buildQuery: (i1, i2) => `Create a specific 6-month career transition blueprint moving from ${i1} to ${i2}. Format in Markdown with bullet items.`,
  fallbackAr: "### 6-Month Pivot Roadmap\n\n- **Month 1:** Identify transferrable assets.", fallbackEn: "### 6-Month Pivot Roadmap\n\n- **Month 1:** Identify transferrable assets."
});

const ToolDefineRoadmap = createAIToolComponent({
  titleAr: '╪¬╪¡╪»┘è╪» ┘à╪╣╪º┘ä┘à ╪º┘ä╪¬╪▒┘é┘è╪⌐', titleEn: 'Plot Promotional Milestones',
  useProfilePersona: false, hasInput2: false,
  ph1Ar: '┘à╪º ┘ç┘ê ┘ç╪»┘ü┘â ╪º┘ä┘à┘ç┘å┘è ╪º┘ä┘å┘ç╪º╪ª┘è╪ƒ (┘à╪½┘ä: ╪º┘ä╪▒╪ª┘è╪│ ╪º┘ä╪¬┘å┘ü┘è╪░┘è ┘ä┘ä╪¬┘â┘å┘ê┘ä┘ê╪¼┘è╪º)', ph1En: 'What is your ultimate career goal? (e.g. Chief Technology Officer)',
  btnAr: '╪¬╪¡╪»┘è╪» ╪º┘ä┘à╪╣╪º┘ä┘à', btnEn: 'Generate Milestones',
  btnColor: 'bg-[var(--accent-mint)]', icon: <Activity className="w-6 h-6" />,
  systemRole: "You are a world-class executive career architect. Define clear executive promotion levels and years required.",
  buildQuery: (i1) => `Create a granular 5-year promotional roadmap to achieve: ${i1}. Highlight operational KPIs.`,
  fallbackAr: "### Promotional Roadmap\n\n- **Year 1:** High-impact output", fallbackEn: "### Promotional Roadmap\n\n- **Year 1:** High-impact output"
});

const ToolGraduationIdeas = createAIToolComponent({
  titleAr: '╪ú┘ü┘â╪º╪▒ ┘à╪┤╪º╪▒┘è╪╣ ╪¬╪«╪▒╪¼ ┘é╪º╪¿┘ä╪⌐ ┘ä┘ä╪¬╪│┘ê┘è┘é', titleEn: 'Marketable Capstone Project Ideas',
  useProfilePersona: true, hasInput2: false,
  ph1Ar: '╪ú╪»╪«┘ä ╪¬╪«╪╡╪╡┘â ╪º┘ä╪»╪▒╪º╪│┘è', ph1En: 'Enter your study major',
  btnAr: '╪º┘é╪¬╪▒╪º╪¡ ┘à╪┤╪º╪▒┘è╪╣', btnEn: 'Generate Project Proposals',
  btnColor: 'bg-[var(--accent-yellow)]', icon: <BrainCircuit className="w-6 h-6" />,
  systemRole: "You are a technical director of corporate incubation programs. Provide innovative, highly marketable graduation project proposals.",
  buildQuery: (i1) => `Provide 3 unique capstone or graduation projects ideas for a major in ${i1} that have high startup/commercial value.`,
  fallbackAr: "### Capstone Proposals\n\n1. AI-Driven Engine", fallbackEn: "### Capstone Proposals\n\n1. AI-Driven Engine"
});

const ToolJobHunt = createAIToolComponent({
  titleAr: '╪º┘ä┘ê╪╕╪º╪ª┘ü ╪º┘ä╪┤╪º╪║╪▒╪⌐ ┘ê╪º┘ä┘ü╪▒╪╡ ╪º┘ä┘à╪¬╪º╪¡╪⌐', titleEn: 'Open Vacancies & Corporate Placements',
  useProfilePersona: true, hasInput2: true,
  ph1Ar: '╪º┘ä╪¬╪«╪╡╪╡ ╪ú┘ê ╪º┘ä┘à╪│┘à┘ë ╪º┘ä┘à╪│╪¬┘ç╪»┘ü', ph1En: 'Target Major or Title',
  ph2Ar: '┘à┘ç╪º╪▒╪º╪¬┘â ╪º┘ä╪ú╪│╪º╪│┘è╪⌐', ph2En: 'Your key skills',
  btnAr: '╪º╪│╪¬┘â╪┤╪º┘ü ╪º┘ä┘ü╪▒╪╡', btnEn: 'Unlock Opportunities',
  btnColor: 'bg-[var(--accent-mint)]', icon: <Briefcase className="w-6 h-6" />,
  systemRole: "You are a professional corporate placement assistant. Search specific websites (e.g., site:linkedin.com, site:glassdoor.com, site:indeed.com) for current live active jobs and recommend major companies actively hiring this role.",
  buildQuery: (i1, i2) => `Search specific websites (e.g., site:linkedin.com, site:indeed.com) and provide a list of 5 leading corporate institutions currently recruiting individuals with a degree in ${i1} and skills in ${i2}.`,
  fallbackAr: "### Hiring Entities\n\n- Saudi Aramco\n- Elm", fallbackEn: "### Hiring Entities\n\n- Saudi Aramco\n- Elm",
  useSearchPlugins: true
});

// ================== Highly Custom Diagnostic Tools ==================
// ... existing code ...

const ToolCareerTest = ({ isAr, setPage, userContext, userProfile, setUserProfile, onSaveProfile, showToast, onDeductPoints }) => {
  const QUESTIONS = generate50Questions();
  const MAJORS = generate100Majors();

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [scores, setScores] = useState({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [aiPerspective, setAiPerspective] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAIPerspective = async () => {
    if (!onDeductPoints || !onDeductPoints(10)) return;
    setAiLoading(true);
    const topMajors = results.map(r => isAr ? r.ar : r.en).join(', ');
    const prompt = `Based on a RIASEC score of Realistic:${scores.R}, Investigative:${scores.I}, Artistic:${scores.A}, Social:${scores.S}, Enterprising:${scores.E}, Conventional:${scores.C}, and top recommended majors: ${topMajors}, provide a concise, insightful career perspective for this user. Speak directly to them in the second person. Do not use more than 2 paragraphs.`;
    
    try {
      const res = await callLMStudio([
        { role: 'system', content: 'You are an expert AI Career Counselor.' },
        { role: 'user', content: prompt }
      ]);
      setAiPerspective(res);
    } catch (e) {
      console.error(e);
      setAiPerspective(isAr ? '╪¬╪╣╪░╪▒ ╪¼┘ä╪¿ ╪º┘ä╪¬╪¡┘ä┘è┘ä ┘ü┘è ╪º┘ä┘ê┘é╪¬ ╪º┘ä╪¡╪º┘ä┘è. ╪¡╪º┘ê┘ä ┘à╪¼╪»╪»╪º┘ï.' : 'Failed to fetch analysis at this time. Try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAnswer = (val) => {
    const newAnswers = { ...answers, [currentQ]: val };
    setAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 150);
    } else {
      setTimeout(() => calculateResults(newAnswers), 300);
    }
  };

  const calculateResults = (finalAnswers) => {
    let rawScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    Object.entries(finalAnswers).forEach(([qIdx, val]) => {
      const cat = QUESTIONS[qIdx].cat;
      rawScores[cat] += val;
    });
    setScores(rawScores);

    const numCatQs = QUESTIONS.length / 6;
    
    const scoredMajors = MAJORS.map(m => {
      let diffSum = 0;
      let maxPossibleDiff = 0;
      ['R', 'I', 'A', 'S', 'E', 'C'].forEach(cat => {
        const userScore = rawScores[cat] || 0;
        const userNormalized = (userScore / (numCatQs * 5)) * 5; 
        const majorReq = m.p[cat] || 0;
        diffSum += Math.abs(userNormalized - majorReq);
        maxPossibleDiff += 4; 
      });
      const matchPercent = Math.max(0, Math.round((1 - (diffSum / maxPossibleDiff)) * 100));
      return { ...m, match: matchPercent };
    }).sort((a, b) => b.match - a.match).slice(0, 5);

    if (scoredMajors.length > 0) {
      const topMajor = scoredMajors[0];
      const maxCat = Object.keys(rawScores).reduce((a, b) => rawScores[a] > rawScores[b] ? a : b);
      
      const titleMap = {
        R: { en: 'Realistic Craftsman', ar: '╪º┘ä╪¡╪▒┘ü┘è ╪º┘ä┘ê╪º┘é╪╣┘è ╪º┘ä╪¿╪º╪▒╪╣' },
        I: { en: 'Quantum Investigator', ar: '╪º┘ä┘à╪¡┘é┘é ╪º┘ä┘â┘à┘è ┘ê╪º┘ä┘à╪¡┘ä┘ä ╪º┘ä┘ü╪░' },
        A: { en: 'Avant-Garde Alchemist', ar: '╪º┘ä╪«┘è┘à┘è╪º╪ª┘è ╪º┘ä┘ü┘å┘è ╪º┘ä┘à╪¿╪¬┘â╪▒' },
        S: { en: 'Empathetic Catalyst', ar: '╪º┘ä┘à╪¡┘ü╪▓ ╪º┘ä╪Ñ┘å╪│╪º┘å┘è ╪º┘ä┘à╪¬╪╣╪º╪╖┘ü' },
        E: { en: 'Unstoppable Visionary', ar: '╪º┘ä╪▒┘è╪º╪»┘è ╪º┘ä╪╖┘à┘ê╪¡ ╪º┘ä┘à┘ä┘ç┘à' },
        C: { en: 'Systems Architect', ar: '┘à┘ç┘å╪»╪│ ╪º┘ä╪ú┘å╪╕┘à╪⌐ ╪º┘ä╪»┘é┘è┘é╪⌐' }
      };

      const updated = {
        ...userProfile,
        careerPersona: isAr ? topMajor.ar : topMajor.en,
        riasecTitle: isAr ? titleMap[maxCat].ar : titleMap[maxCat].en,
        testMatchScore: `${topMajor.match}%`,
        hasTakenTest: true
      };
      setUserProfile(updated);
      onSaveProfile(updated);
    }
    setResults(scoredMajors);
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 relative text-theme-primary">
      <div className="max-w-[1000px] mx-auto">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'Back to Tools' : 'Back to Tools'}
        </button>
        
        <div className="mb-12">
          <h2 className={`text-5xl md:text-7xl mb-4 ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
            {isAr ? 'Comprehensive Blueprint (50 Qs)' : 'Comprehensive Blueprint (50 Qs)'}
          </h2>
          <p className="text-xl font-bold opacity-70">
            {isAr ? 'Your traits are mapped against 100 precise academic majors.' : 'Your traits are mapped against 100 precise academic majors.'}
          </p>
        </div>

        {!results ? (
          <div className="bg-theme-secondary p-8 md:p-12 rounded-[3rem] border-4 border-theme shadow-brutal relative page-enter text-black">
            <div className="flex justify-between font-bold mb-2">
               <span>{isAr ? 'Progress' : 'Progress'}</span>
               <span>{currentQ + 1} / {QUESTIONS.length}</span>
            </div>
            <div className="w-full bg-theme-primary h-4 rounded-full border-2 border-theme mb-12 overflow-hidden relative">
               <div 
                 className="absolute top-0 left-0 rtl:right-0 h-full bg-[var(--accent-mint)] transition-all duration-300"
                 style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
               ></div>
            </div>

            <div className="min-h-[250px] flex flex-col justify-between">
              <h3 className="text-2xl md:text-4xl font-black leading-relaxed mb-12 flex">
                <span className="text-[var(--accent-coral)] mr-4 rtl:ml-4 rtl:mr-0">{currentQ + 1}.</span>
                {isAr ? QUESTIONS[currentQ].ar : QUESTIONS[currentQ].en}
              </h3>

              <div className="flex justify-between items-center px-2 md:px-10 gap-2 md:gap-4">
                <span className="font-bold opacity-60 text-sm md:text-base hidden md:block">{isAr ? 'Strongly Disagree' : 'Strongly Disagree'}</span>
                {[1, 2, 3, 4, 5].map((val) => (
                  <div key={val} className="flex flex-col items-center gap-2">
                    <input 
                      type="radio" name="likert" className="likert-radio"
                      checked={answers[currentQ] === val}
                      onChange={() => handleAnswer(val)}
                    />
                  </div>
                ))}
                <span className="font-bold opacity-60 text-sm md:text-base hidden md:block">{isAr ? 'Strongly Agree' : 'Strongly Agree'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="page-enter">
            
            {/* Visual RIASEC Bar Graph */}
            <div className="bg-theme-secondary p-8 rounded-[2.5rem] border-4 border-theme shadow-brutal mb-12 text-black">
              <h3 className="text-2xl font-black mb-6">{isAr ? 'Your Personality Distribution' : 'Your Personality Distribution'}</h3>
              <div className="flex items-end gap-2 md:gap-4 h-48 border-b-4 border-black pb-2">
                {[
                  { k: 'R', c: 'bg-[var(--accent-peach)]', l: isAr ? 'Realistic' : 'Realistic' },
                  { k: 'I', c: 'bg-[var(--accent-mint)]', l: isAr ? 'Investigative' : 'Investigative' },
                  { k: 'A', c: 'bg-[var(--accent-yellow)]', l: isAr ? 'Artistic' : 'Artistic' },
                  { k: 'S', c: 'bg-[var(--accent-lilac)]', l: isAr ? 'Social' : 'Social' },
                  { k: 'E', c: 'bg-[var(--accent-coral)]', l: isAr ? 'Enterprising' : 'Enterprising' },
                  { k: 'C', c: 'bg-black', l: isAr ? 'Conventional' : 'Conventional', t: 'text-white' }
                ].map(trait => {
                  const maxPossible = (QUESTIONS.length / 6) * 5;
                  const hPct = Math.max(5, (scores[trait.k] / maxPossible) * 100);
                  return (
                    <div key={trait.k} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className={`w-full ${trait.c} border-4 border-black border-b-0 rounded-t-xl graph-bar-anim flex items-end justify-center pb-2`} style={{ height: `${hPct}%` }}>
                        <span className={`font-black text-xs md:text-sm ${trait.t || 'text-black'} opacity-80`}>{scores[trait.k]}</span>
                      </div>
                      <span className="text-xs md:text-sm font-bold mt-2 truncate w-full text-center">{trait.l}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <h3 className="text-3xl font-black mb-8">{isAr ? 'Top 5 Precision Matching Majors:' : 'Top 5 Precision Matching Majors:'}</h3>
            <div className="grid gap-6">
              {results.map((r, i) => (
                <div key={i} className="bg-theme-secondary p-6 md:p-8 rounded-[2.5rem] border-4 border-theme shadow-brutal flex flex-col md:flex-row justify-between md:items-center gap-6 transform transition-transform hover:-translate-y-2 hover:shadow-brutal-lg text-black">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 shrink-0 bg-theme-primary border-4 border-theme rounded-full flex items-center justify-center text-2xl font-black shadow-[4px_4px_0px_0px_var(--accent-lilac)]">#{i+1}</div>
                    <div>
                      <h4 className="text-2xl md:text-3xl font-bold">{isAr ? r.ar : r.en}</h4>
                      <p className="text-sm font-bold opacity-60 mt-1">ID: {r.id}</p>
                    </div>
                  </div>
                  <div className="text-right rtl:text-left flex flex-col items-end rtl:items-start self-end md:self-center">
                    <div className={`text-5xl font-black text-[var(--accent-peach)] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] ${isAr ? 'font-display-en' : 'font-display-en'}`}>{r.match}%</div>
                    <span className="opacity-70 font-bold uppercase text-sm tracking-wider">{isAr ? 'Match' : 'Match'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
              <button 
                onClick={() => setPage('persona_card')} 
                className="w-full md:w-auto py-5 px-10 bg-[var(--accent-yellow)] text-black rounded-full font-black text-xl border-4 border-theme shadow-brutal-hover flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-colors"
              >
                <CreditCard className="w-6 h-6" />
                {isAr ? 'View & Share Career ID Card' : 'View & Share Career ID Card'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ToolReadyTest = ({ isAr, setPage, userContext, showToast }) => {
  const READINESS_QUESTIONS = [
    { ar: '┘ä┘é╪» ┘é╪▒╪ú╪¬ ╪╣┘å ┘à╪¬╪╖┘ä╪¿╪º╪¬ ╪º┘ä╪¬╪«╪╡╪╡╪º╪¬ ╪º┘ä╪¬┘è ╪ú┘ü┘â╪▒ ╪¿┘ç╪º ╪¿╪º╪│╪¬┘ü╪º╪╢╪⌐.', en: 'I have extensively researched the curriculum of my target majors.' },
    { ar: '╪ú╪╣┘ä┘à ╪¬┘à╪º┘à╪º┘ï ┘à╪º ┘ç┘è ╪╖╪¿┘è╪╣╪⌐ ╪º┘ä┘ê╪╕╪º╪ª┘ü ╪º┘ä╪¬┘è ╪│╪ú╪╣┘à┘ä ╪¿┘ç╪º ╪¿╪╣╪» ╪º┘ä╪¬╪«╪▒╪¼.', en: 'I know exactly what daily job tasks I will perform post-graduation.' },
    { ar: '╪ú┘å╪º ╪╣┘ä┘ë ╪»╪▒╪º┘è╪⌐ ╪¿┘à╪¬┘ê╪│╪╖ ╪º┘ä╪▒┘ê╪º╪¬╪¿ ┘ü┘è ╪│┘ê┘é ╪º┘ä╪╣┘à┘ä ┘ä┘à╪¼╪º┘ä┘è.', en: 'I am aware of the median salaries in the job market for my field.' },
    { ar: '┘ä╪»┘è ╪«╪╖╪⌐ ┘ê╪º╪╢╪¡╪⌐ ┘ä╪¬╪╖┘ê┘è╪▒ ┘à┘ç╪º╪▒╪º╪¬┘è ╪º┘ä╪¬┘é┘å┘è╪⌐ ┘ê╪º┘ä┘ä╪║┘ê┘è╪⌐ ╪ú╪½┘å╪º╪í ╪º┘ä╪¼╪º┘à╪╣╪⌐.', en: 'I have a clear plan to develop my technical/language skills during college.' },
    { ar: '╪ú╪╣╪▒┘ü ╪º┘ä┘ü╪▒┘ê┘é╪º╪¬ ╪º┘ä╪»┘é┘è┘é╪⌐ ╪¿┘è┘å ╪¬╪«╪╡╪╡┘è ┘ê╪º┘ä╪¬╪«╪╡╪╡╪º╪¬ ╪º┘ä┘à╪┤╪º╪¿┘ç╪⌐.', en: 'I know the nuanced differences between my major and similar ones.' },
    { ar: '┘é┘à╪¬ ╪¿╪º┘ä╪¬╪¡╪»╪½ ┘à╪╣ ╪ú╪┤╪«╪º╪╡ ┘è╪╣┘à┘ä┘ê┘å ╪¡╪º┘ä┘è╪º┘ï ┘ü┘è ╪º┘ä┘à╪¼╪º┘ä ╪º┘ä╪░┘è ╪ú╪╖┘à╪¡ ╪Ñ┘ä┘è┘ç.', en: 'I have spoken with professionals currently working in my target field.' },
    { ar: '╪ú╪╣╪▒┘ü ╪¬┘à╪º┘à╪º┘ï ┘â┘è┘ü ╪│╪ú┘ê╪º╪▓┘å ╪¿┘è┘å ╪º┘ä╪»╪▒╪º╪│╪⌐ ┘ê╪º┘ä╪¡┘è╪º╪⌐ ╪º┘ä╪┤╪«╪╡┘è╪⌐.', en: 'I know exactly how I will balance studies and personal life.' },
    { ar: '┘ä┘é╪» ╪º╪│╪¬┘â╪┤┘ü╪¬ ╪º┘ä╪┤┘ç╪º╪»╪º╪¬ ╪º┘ä┘à┘ç┘å┘è╪⌐ ╪º┘ä┘à╪╖┘ä┘ê╪¿╪⌐ ╪º┘ä╪¬┘è ╪¬╪»╪╣┘à ╪┤┘ç╪º╪»╪¬┘è ╪º┘ä╪¼╪º┘à╪╣┘è╪⌐.', en: 'I explored the professional certificates needed to support my degree.' },
    { ar: '┘ä╪º ╪ú╪┤╪╣╪▒ ╪¿╪º┘ä╪╢╪║╪╖ ┘à┘å ╪º┘ä╪╣╪º╪ª┘ä╪⌐ ╪ú┘ê ╪º┘ä┘à╪¼╪¬┘à╪╣ ┘ä╪º╪«╪¬┘è╪º╪▒ ┘à╪│╪º╪▒ ┘à╪¡╪»╪».', en: 'I do not feel pressured by family/society to pick a specific path.' },
    { ar: '┘ä╪»┘è ╪┤╪║┘ü ╪¡┘é┘è┘é┘è ╪│┘è╪»┘ü╪╣┘å┘è ┘ä┘ä╪º╪│╪¬┘à╪▒╪º╪▒ ╪╣┘å╪» ┘à┘ê╪º╪¼┘ç╪⌐ ╪╡╪╣┘ê╪¿╪º╪¬ ╪ú┘â╪º╪»┘è┘à┘è╪⌐.', en: 'I have genuine passion that will push me through academic hardships.' }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (points) => {
    setScore(s => s + points);
    if (currentQ < READINESS_QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      setFinished(true);
      showToast(isAr ? 'Readiness evaluation complete!' : 'Readiness evaluation complete!');
    }
  };

  const readinessPercent = Math.round((score / (READINESS_QUESTIONS.length * 10)) * 100);

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 relative text-theme-primary">
      <div className="max-w-[800px] mx-auto bg-theme-secondary border-4 border-black p-8 md:p-12 rounded-[2.5rem] shadow-brutal text-black">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'Back to Tools' : 'Back to Tools'}
        </button>

        <h3 className="text-4xl font-black mb-8">{isAr ? 'Academic Readiness Assessment' : 'Academic Readiness Assessment'}</h3>
        
        {!finished ? (
          <div className="space-y-8 page-enter">
            <div className="flex justify-between font-bold text-sm opacity-60">
               <span>{isAr ? 'Progress' : 'Progress'}</span>
               <span>{currentQ + 1} / {READINESS_QUESTIONS.length}</span>
            </div>
            <div className="w-full bg-theme-primary h-3 rounded-full border-2 border-black overflow-hidden relative">
               <div 
                 className="absolute top-0 left-0 rtl:right-0 h-full bg-[var(--accent-lilac)] transition-all duration-300"
                 style={{ width: `${((currentQ + 1) / READINESS_QUESTIONS.length) * 100}%` }}
               ></div>
            </div>

            <p className="font-bold text-2xl md:text-3xl leading-relaxed py-6 min-h-[120px]">
              {isAr ? READINESS_QUESTIONS[currentQ].ar : READINESS_QUESTIONS[currentQ].en}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleAnswer(10)} className="py-4 bg-[var(--accent-mint)] border-4 border-black font-black text-lg rounded-xl shadow-brutal-hover">{isAr ? 'Yes, absolutely' : 'Yes, absolutely'}</button>
              <button onClick={() => handleAnswer(5)} className="py-4 bg-[var(--accent-peach)] border-4 border-black font-black text-lg rounded-xl shadow-brutal-hover">{isAr ? 'Somewhat' : 'Somewhat'}</button>
              <button onClick={() => handleAnswer(2)} className="py-4 bg-[var(--accent-yellow)] border-4 border-black font-black text-lg rounded-xl shadow-brutal-hover">{isAr ? 'Rarely' : 'Rarely'}</button>
              <button onClick={() => handleAnswer(0)} className="py-4 bg-gray-200 border-4 border-black font-black text-lg rounded-xl shadow-brutal-hover">{isAr ? 'Not at all' : 'Not at all'}</button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8 page-enter">
            <h4 className="text-3xl font-bold">{isAr ? 'Your Vision & Readiness Score:' : 'Your Vision & Readiness Score:'}</h4>
            <div className="text-8xl font-black text-[var(--accent-coral)] drop-shadow-[4px_4px_0_#000]">{readinessPercent}%</div>
            <p className="font-bold text-xl bg-theme-primary p-6 rounded-2xl border-4 border-black">
              {readinessPercent >= 80 
                ? (isAr ? 'Excellent! You have a highly concrete vision.' : 'Excellent! You have a highly concrete vision.')
                : readinessPercent >= 50
                ? (isAr ? 'Good, but research deeper to avoid academic surprises.' : 'Good, but research deeper to avoid academic surprises.')
                : (isAr ? 'Warning: Do not pick blindly. Do massive research first!' : 'Warning: Do not pick blindly. Do massive research first!')}
            </p>
            <button onClick={() => setPage(`dashboard_${userContext}`)} className="mt-4 py-4 px-10 bg-black text-white rounded-full font-black text-xl hover:scale-105 transition-transform">
               {isAr ? 'Return' : 'Return'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ToolCalculator = ({ isAr, setPage, userContext, userProfile, setUserProfile, onSaveProfile, showToast }) => {
  const [gpa, setGpa] = useState(90);
  const [qudrat, setQudrat] = useState(80);
  const [tahsili, setTahsili] = useState(85);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [matchingUnis, setMatchingUnis] = useState([]);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const score = ((gpa * 0.3) + (qudrat * 0.3) + (tahsili * 0.4)).toFixed(2);
      setResult(score);
      
      const numScore = Number(score);
      const matches = SAUDI_UNIVERSITIES.filter(u => numScore >= u.score - 5).map(u => ({
        ...u, 
        chance: numScore >= u.score ? (isAr ? 'Very High' : 'Very High') : (isAr ? 'Medium' : 'Medium')
      }));
      setMatchingUnis(matches.slice(0, 3));

      setAnalyzing(false);
      const updated = { ...userProfile, weightedScore: `${score}%` };
      setUserProfile(updated);
      onSaveProfile(updated);
      showToast(isAr ? 'Calculated and securely backed up weighted index!' : 'Calculated and securely backed up weighted index!');
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-theme-primary relative">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'Back to Tools' : 'Back to Tools'}
        </button>
        
        <h2 className={`text-5xl md:text-7xl mb-12 ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
          {isAr ? 'Weighted Admission Sorting' : 'Weighted Admission Sorting'}
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12 text-black">
          <div className="bg-theme-secondary p-10 rounded-[2.5rem] border-4 border-theme shadow-brutal">
            {[
              { label: isAr ? 'High School GPA' : 'High School GPA', val: gpa, set: setGpa, color: 'text-[var(--accent-lilac)]' },
              { label: isAr ? 'Qudrat Score' : 'Qudrat Score', val: qudrat, set: setQudrat, color: 'text-[var(--accent-mint)]' },
              { label: isAr ? 'Tahsili Score' : 'Tahsili Score', val: tahsili, set: setTahsili, color: 'text-[var(--accent-peach)]' },
            ].map((item, idx) => (
              <div key={idx} className="mb-10">
                <div className="flex justify-between font-bold mb-6 text-2xl">
                  <label>{item.label}</label>
                  <span className={item.color}>{item.val}%</span>
                </div>
                <input 
                  type="range" min="50" max="100" value={item.val} onChange={(e) => item.set(Number(e.target.value))}
                  className="clickable-card"
                />
              </div>
            ))}
            
            <Magnetic strength={0.1} className="w-full mt-8">
              <button 
                onClick={handleAnalyze} disabled={analyzing}
                className="clickable-card w-full bg-[var(--accent-lilac)] border-4 border-theme text-black py-5 rounded-full font-bold text-2xl hover:bg-black hover:text-white transition-colors disabled:opacity-70 disabled:cursor-wait shadow-brutal-hover"
              >
                {analyzing ? (isAr ? 'Analyzing Metrics...' : 'Analyzing Metrics...') : (isAr ? 'Calculate Official Match' : 'Calculate Official Match')}
              </button>
            </Magnetic>
          </div>

          <div className="flex flex-col justify-center items-center">
            {result ? (
              <div className="w-full page-enter">
                <div className="text-center mb-10 text-theme-primary">
                  <p className="text-2xl font-bold mb-4">{isAr ? 'Official Weighted Score (30-30-40)' : 'Official Weighted Score (30-30-40)'}</p>
                  <div className={`text-8xl md:text-9xl text-[var(--accent-coral)] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
                    {result}<span className="text-4xl text-theme-primary">%</span>
                  </div>
                </div>
                
                <div className="bg-theme-secondary border-4 border-theme p-8 rounded-3xl shadow-brutal relative overflow-hidden mb-6">
                   <DecorativeStar className="absolute -top-10 -right-10 w-32 h-32 text-[var(--accent-mint)] opacity-30 animate-spin-slow" />
                   <h4 className="font-bold text-2xl mb-6 flex items-center gap-3 relative z-10 text-theme-primary">
                     <Sparkles className="w-8 h-8 text-[var(--accent-lilac)]"/> 
                     {isAr ? 'Realistic Universities Matches:' : 'Realistic Universities Matches:'}
                   </h4>
                   <ul className="space-y-4 font-bold text-xl relative z-10 text-black">
                     {matchingUnis.map((u, i) => (
                       <li key={i} className={`p-5 rounded-2xl border-4 border-theme flex flex-col md:flex-row justify-between shadow-[4px_4px_0_rgba(0,0,0,1)] bg-white`} style={{backgroundColor: `var(--accent-${['mint', 'peach', 'yellow'][i]})`}}>
                         <span>{isAr ? u.ar : u.en}</span> 
                         <span className="bg-white/80 px-2 py-1 rounded text-sm mt-2 md:mt-0 self-start">{isAr ? 'Chance:' : 'Chance:'} {u.chance}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-30">
                <Calculator className="w-40 h-40 mx-auto mb-8 text-theme-primary" />
                <p className={`text-3xl ${isAr ? 'font-display-en' : 'font-display-en'}`}>
                  {isAr ? 'Enter standard scores to see real university matches' : 'Enter standard scores to see real university matches'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolAISalaryPredictor = ({ isAr, setPage, userContext, userProfile, setUserProfile, onSaveProfile, showToast }) => {
  const [major, setMajor] = useState(userProfile.careerPersona || '');
  const [skills, setSkills] = useState('');
  const [region, setRegion] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [aiReport, setAiReport] = useState('');
  const saveReport = useSaveReport(userProfile, setUserProfile, onSaveProfile, showToast, isAr);

  const executeLiveSearch = async () => {
    if (!major.trim() || !region.trim()) {
      showToast(isAr ? 'Please input the major and target region' : 'Please input the major and target region');
      return;
    }

    setIsSearching(true);
    setThinkingSteps([]);
    setAiReport('');

    const steps = isAr ? [
      "╪¬╪¡╪»┘è╪» ╪º┘ä┘â┘è╪º┘å╪º╪¬ ╪º┘ä╪▒╪ª┘è╪│┘è╪⌐ ┘ê╪ú┘é╪╖╪º╪¿ ╪º┘ä╪¬╪«╪╡╪╡...",
      "╪¿╪»╪í ┘ê┘â┘è┘ä ╪¿╪¡╪½ ╪º┘ä┘ê┘è╪¿ ╪╣╪¿╪▒ ╪º┘ä╪Ñ╪╢╪º┘ü╪º╪¬...",
      "╪¬╪¼┘à┘è╪╣ ╪º┘ä╪Ñ╪¡╪╡╪º╪ª┘è╪º╪¬ ╪º┘ä┘ü┘ê╪▒┘è╪⌐ ┘ê╪º┘ä╪¬╪¡┘é┘é ┘à┘å ╪º┘ä┘ê╪╕╪º╪ª┘ü ╪º┘ä╪¡╪º┘ä┘è╪⌐...",
      "╪╡┘è╪º╪║╪⌐ ╪º┘ä╪¬┘é╪▒┘è╪▒ ╪º┘ä┘à╪º┘ä┘è ┘ê╪º┘ä┘à┘ç┘å┘è ╪º┘ä┘à╪»┘à╪¼..."
    ] : [
      "Formulating semantic entities from Major & Target Region...",
      "Activating online web plugins to verify live salary curves...",
      "Extracting current live job opportunities...",
      "Structuring professional report with citations..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setThinkingSteps(prev => [...prev, steps[i]]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const langInst = isAr ? 'MUST WRITE IN ENGLISH.' : 'MUST WRITE IN ENGLISH.';
    const systemInstruction = `You are an elite career intelligence expert at Masari. Search specific websites (e.g., site:glassdoor.com, site:payscale.com, site:salary.com) to look up current job openings and salary data. Provide an informative analysis about salaries and available positions in the target area. Use Markdown extensively. ${langInst}`;
    
    const userPrompt = `Search specific websites (e.g., site:glassdoor.com, site:payscale.com) to provide realistic salary ranges (in local currency) and a list of typical hiring institutions for someone who studied "${major}" with these skills: "${skills}" in "${region}". Use Markdown format.`;
    const fallback = isAr ? `### Estimation Report for ${major} in ${region}\n\n* **Expected Salary Range:** $4,500 - $7,000 per month.\n* **Typical Hiring Industries:** Local tech companies, major authorities.` : `### Estimation Report for ${major} in ${region}\n\n* **Expected Salary Range:** $4,500 - $7,000 per month.\n* **Typical Hiring Industries:** Local tech companies, major authorities.`;

    const content = await callLMStudio(systemInstruction, userPrompt, fallback, true); // useSearchPlugins = true
    setAiReport(content);
    showToast(isAr ? "Report generated by Web Grounded AI!" : "Report generated by Web Grounded AI!");
    setIsSearching(false);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([aiReport], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Salary_Report.txt`;
    document.body.appendChild(element); 
    element.click();
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-theme-primary">
      <div className="max-w-[1200px] mx-auto text-black bg-white border-4 border-black p-8 md:p-12 rounded-[2.5rem] shadow-brutal">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'Back to Tools' : 'Back to Tools'}
        </button>

        <div className="mb-12">
          <h2 className={`text-5xl md:text-6xl mb-4 ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
            {isAr ? 'DeepSearch Expected Salary & Jobs' : 'DeepSearch Expected Salary & Jobs'}
          </h2>
          <p className="text-xl opacity-70">
            {isAr ? 'Execute real-time semantic queries targeting exact salary trends and current job openings via web plugins.' : 'Execute real-time semantic queries targeting exact salary trends and current job openings via web plugins.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 text-black">
          
          <div className="lg:col-span-5 bg-theme-primary p-8 rounded-[2rem] border-4 border-black shadow-brutal space-y-6">
            <div>
              <label className="font-bold block mb-2">{isAr ? 'Major Studied / Domain' : 'Major Studied / Domain'}</label>
              <input 
                type="text" value={major} onChange={e => setMajor(e.target.value)}
                placeholder={isAr ? 'e.g. Computer Science' : 'e.g. Computer Science'}
                className="w-full bg-white border-4 border-black p-4 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold block mb-2">{isAr ? 'Core Skills (Comma separated)' : 'Core Skills (Comma separated)'}</label>
              <input 
                type="text" value={skills} onChange={e => setSkills(e.target.value)}
                placeholder={isAr ? 'e.g. Python, SQL, Project Management' : 'e.g. Python, SQL, Project Management'}
                className="w-full bg-white border-4 border-black p-4 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold block mb-2">{isAr ? 'Target Region / Country' : 'Target Region / Country'}</label>
              <input 
                type="text" value={region} onChange={e => setRegion(e.target.value)}
                placeholder={isAr ? 'e.g. Riyadh, Saudi Arabia' : 'e.g. Riyadh, Saudi Arabia'}
                className="w-full bg-white border-4 border-black p-4 rounded-xl font-bold"
              />
            </div>

            <Magnetic strength={0.2} className="w-full">
              <button 
                onClick={executeLiveSearch} disabled={isSearching}
                className="w-full py-5 bg-[var(--accent-yellow)] text-black border-4 border-black rounded-xl font-black text-xl flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
              >
                <Search className="w-6 h-6 animate-pulse" />
                {isSearching ? (isAr ? 'AI Searching Markets...' : 'AI Searching Markets...') : (isAr ? 'DeepSearch Jobs & Salary' : 'DeepSearch Jobs & Salary')}
              </button>
            </Magnetic>
          </div>

          <div className="lg:col-span-7 bg-theme-primary p-8 rounded-[2rem] border-4 border-black shadow-brutal flex flex-col justify-start min-h-[400px]">
            {isSearching && (
              <div className="space-y-6">
                <h4 className="font-black text-xl text-[var(--accent-coral)] flex items-center gap-2">
                  <Bot className="w-6 h-6 animate-bounce" />
                  {isAr ? 'Agent Processing Web Search:' : 'Agent Processing Web Search:'}
                </h4>
                <div className="space-y-3">
                  {thinkingSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 font-bold text-lg bg-white border-2 border-black p-4 rounded-xl animate-pulse">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isSearching && !aiReport && (
              <div className="flex flex-col items-center justify-center text-center py-20 opacity-40">
                <BrainCircuit className="w-32 h-32 text-black mb-6 animate-pulse" />
                <h3 className="text-2xl font-black">{isAr ? 'Awaiting Input to Trigger Grounded Scrapes' : 'Awaiting Input to Trigger Grounded Scrapes'}</h3>
              </div>
            )}

            {aiReport && (
              <div className="page-enter text-black space-y-6">
                <div className="p-4 bg-[var(--accent-mint)] border-2 border-black rounded-2xl font-black flex items-center gap-2 text-sm justify-between shadow-[2px_2px_0_#000]">
                  <span>≡ƒÜÇ {isAr ? 'Report validated with live web data' : 'Report validated with live web data'}</span>
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
                </div>
                
                <NeoMarkdown text={aiReport} />

                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center border-t-4 border-black pt-8">
                  <button onClick={handleDownload} className="py-4 px-6 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-brutal-hover">
                    <Download className="w-5 h-5" />
                    {isAr ? '╪¬┘å╪▓┘è┘ä ┘à┘ä┘ü ┘å╪╡┘è' : 'Download Txt'}
                  </button>
                  <button onClick={() => saveReport(isAr ? `Salary: ${major}` : `Salary: ${major}`, aiReport)} className="py-4 px-6 bg-[var(--accent-mint)] border-2 border-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--accent-lilac)] transition-colors shadow-brutal-hover">
                    <Save className="w-5 h-5" />
                    {isAr ? '╪¡┘ü╪╕ ┘ü┘è ╪º┘ä╪¬┘é╪º╪▒┘è╪▒' : 'Save to Artifacts'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolSalary = ({ isAr, setPage, userContext }) => {
  const [experience, setExperience] = useState(2);
  const [selectedMajor, setSelectedMajor] = useState('cs');

  const majors = {
    cs: { name: isAr ? 'Computer Science' : 'Computer Science', base: 12000, growth: 1.15 },
    med: { name: isAr ? 'Medicine' : 'Medicine', base: 18000, growth: 1.08 },
    bus: { name: isAr ? 'Business Admin' : 'Business Admin', base: 9000, growth: 1.12 },
    eng: { name: isAr ? 'Engineering' : 'Engineering', base: 11000, growth: 1.10 },
  };

  const calculateSalary = (base, growth, years) => Math.round(base * Math.pow(growth, years));

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-theme-primary">
      <div className="max-w-[1200px] mx-auto text-black">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'Back to Tools' : 'Back to Tools'}
        </button>

        <h2 className={`text-5xl md:text-7xl mb-4 text-theme-primary ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
          {isAr ? 'Salary Growth Curve' : 'Salary Growth Curve'}
        </h2>
        <p className="text-xl opacity-70 mb-12 max-w-2xl text-theme-primary">
          {isAr ? 'Forecast your salary growth trajectory based on experience.' : 'Forecast your salary growth trajectory based on experience.'}
        </p>

        <div className="grid lg:grid-cols-12 gap-8 text-black">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-theme-secondary border-4 border-black p-8 rounded-3xl shadow-brutal text-theme-primary">
              <h3 className="font-bold text-2xl mb-6">{isAr ? 'Select Major' : 'Select Major'}</h3>
              <div className="flex flex-col gap-4">
                {Object.entries(majors).map(([key, data]) => (
                  <button
                    key={key} onClick={() => setSelectedMajor(key)}
                    className={`p-4 rounded-xl border-4 font-bold text-lg transition-all text-left rtl:text-right flex justify-between items-center ${selectedMajor === key ? 'border-black bg-[var(--accent-mint)] text-black shadow-[4px_4px_0_#000]' : 'border-transparent bg-theme-primary text-theme-primary hover:border-black'}`}
                  >
                    {data.name}
                    {selectedMajor === key && <CheckCircle2 className="w-6 h-6" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-theme-secondary border-4 border-black p-8 rounded-3xl shadow-brutal text-theme-primary">
               <h3 className="font-bold text-2xl mb-6 flex justify-between">
                 <span>{isAr ? 'Experience' : 'Experience'}</span>
                 <span className="text-[var(--accent-coral)]">{experience} {isAr ? 'Yrs' : 'Yrs'}</span>
               </h3>
               <input 
                  type="range" min="0" max="15" value={experience} onChange={(e) => setExperience(Number(e.target.value))}
                  className="clickable-card"
               />
            </div>
          </div>

          <div className="lg:col-span-8 bg-theme-secondary border-4 border-black p-8 md:p-12 rounded-[2.5rem] shadow-brutal flex flex-col justify-between text-theme-primary">
            <div>
              <div className="inline-block p-3 bg-[var(--accent-lilac)] text-black rounded-2xl border-4 border-black font-bold mb-8 shadow-[4px_4px_0_#000]">
                {majors[selectedMajor].name}
              </div>
              <p className="text-xl font-bold opacity-70 mb-2">{isAr ? 'Expected Monthly Salary' : 'Expected Monthly Salary'}</p>
              <div className={`text-6xl md:text-8xl text-[var(--accent-peach)] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
                {calculateSalary(majors[selectedMajor].base, majors[selectedMajor].growth, experience).toLocaleString()}
                <span className="text-3xl text-theme-primary ml-2">{isAr ? 'SAR' : 'SAR'}</span>
              </div>
            </div>

            <div className="mt-16 h-64 flex items-end gap-2 md:gap-4 w-full">
              {[0, 3, 5, 10, 15].map((year) => {
                const sal = calculateSalary(majors[selectedMajor].base, majors[selectedMajor].growth, year);
                const maxSal = calculateSalary(majors[selectedMajor].base, majors[selectedMajor].growth, 15);
                const heightPct = (sal / maxSal) * 100;

                return (
                  <div key={year} className="flex-1 flex flex-col items-center gap-4 group text-theme-primary">
                    <div className="opacity-0 group-hover:opacity-100 font-bold text-sm bg-theme-secondary px-2 py-1 rounded border-2 border-black transition-opacity">
                      {sal / 1000}k
                    </div>
                    <div 
                      className={`w-full rounded-t-xl border-4 border-b-0 border-black transition-all duration-700 ease-out flex items-end justify-center pb-4 ${year <= experience ? 'bg-[var(--accent-mint)]' : 'bg-theme-secondary opacity-50'}`}
                      style={{ height: `${Math.max(10, heightPct)}%` }}
                    ></div>
                    <div className="font-bold">{year}y</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolROI = ({ isAr, setPage, userContext }) => {
  const [cost, setCost] = useState(150000);
  const [salaryBump, setSalaryBump] = useState(4000);

  const monthsToBreakeven = Math.ceil(cost / salaryBump);
  const yearsToBreakeven = (monthsToBreakeven / 12).toFixed(1);

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-theme-primary">
      <div className="max-w-[1000px] mx-auto text-center">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors mx-auto">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'Back to Tools' : 'Back to Tools'}
        </button>

        <h2 className={`text-5xl md:text-7xl mb-6 ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
          {isAr ? '╪º┘ä╪╣╪º╪ª╪» ╪º┘ä┘à╪º┘ä┘è ╪¿╪╣╪» ╪º┘ä╪¬╪«╪▒╪¼' : 'Post-grad ROI'}
        </h2>
        <p className="text-xl opacity-70 mb-16 max-w-2xl mx-auto">
          {isAr ? 'Calculate your career milestones break-even trajectory.' : 'Calculate your career milestones break-even trajectory.'}
        </p>

        <div className="bg-theme-secondary p-8 md:p-16 rounded-[3rem] border-4 border-theme shadow-brutal flex flex-col md:flex-row gap-12 items-center text-left rtl:text-right text-black">
          
          <div className="flex-1 w-full space-y-12">
            <div>
              <div className="flex justify-between font-bold mb-4 text-2xl">
                <label>{isAr ? 'Program Cost' : 'Program Cost'}</label>
                <span className="text-[var(--accent-coral)]">{cost.toLocaleString()}</span>
              </div>
              <input type="range" min="50000" max="400000" step="10000" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-4 text-2xl">
                <label>{isAr ? 'Expected Salary Bump' : 'Expected Salary Bump'}</label>
                <span className="text-[var(--accent-mint)]">+{salaryBump.toLocaleString()} / mo</span>
              </div>
              <input type="range" min="1000" max="15000" step="500" value={salaryBump} onChange={(e) => setSalaryBump(Number(e.target.value))} />
            </div>
          </div>

          <div className="w-px h-64 bg-theme-primary border-r-4 border-theme hidden md:block"></div>

          <div className="flex-1 text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[var(--accent-lilac)] border-4 border-theme shadow-[6px_6px_0_rgba(0,0,0,1)] mb-8">
               <TrendingUp className="w-16 h-16 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{isAr ? 'Break-even Point' : 'Break-even Point'}</h3>
            <div className={`text-7xl text-[var(--accent-peach)] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
              {yearsToBreakeven} <span className="text-3xl text-theme-primary">{isAr ? 'Years' : 'Years'}</span>
            </div>
            <p className="mt-4 font-bold opacity-70">
              ({monthsToBreakeven} {isAr ? 'months' : 'months'})
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

const ToolAIChat = ({ isAr, setPage, userContext }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if(!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    const langInst = isAr ? 'MUST WRITE IN ENGLISH.' : 'MUST WRITE IN ENGLISH.';
    const systemPrompt = `You are a creative career counselor at Masari. Provide specific, helpful career guidance. Use Markdown. ${langInst}`;
    
    const conversationContext = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const userPrompt = `Previous conversation:\n${conversationContext}\n\nUser: ${input}\n\nProvide a helpful response.`;
    const fallback = isAr ? "Thanks for your question. As a Masari career counselor, I recommend focusing on developing your core skills and building a strong professional network." : "Thanks for your question. As a Masari career counselor, I recommend focusing on developing your core skills and building a strong professional network.";

    const response = await callLMStudio(systemPrompt, userPrompt, fallback);
    setMessages(p => [...p, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-12 flex flex-col items-center">
      <div className="w-full max-w-[1000px] bg-theme-secondary rounded-[3rem] border-4 border-theme shadow-brutal-lg flex flex-col h-[75vh] overflow-hidden relative">
        <div className="bg-[var(--accent-mint)] border-b-4 border-theme p-6 md:p-8 flex items-center justify-between z-10 text-black">
          <div className="flex items-center gap-6">
            <Magnetic strength={0.2}>
              <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card w-14 h-14 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_#000]">
                {isAr ? <ArrowRight className="w-6 h-6"/> : <ArrowLeft className="w-6 h-6"/>}
              </button>
            </Magnetic>
            <div>
              <h2 className={`text-2xl md:text-3xl ${isAr ? 'font-display-en font-bold' : 'font-display-en font-bold'}`}>
                {isAr ? 'AI Counselor' : 'AI Counselor'}
              </h2>
            </div>
          </div>
          <Bot className="w-12 h-12 opacity-80" />
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-theme-primary relative text-black">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <AbstractShape1 className="w-32 h-32 mb-6 text-[var(--accent-lilac)] animate-spin-slow" />
              <h3 className={`text-4xl mb-4 ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
                {isAr ? 'How can I guide you?' : 'How can I guide you?'}
              </h3>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`mb-8 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-6 rounded-3xl border-4 border-theme max-w-[85%] font-medium text-lg leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                m.role === 'user' ? 'bg-[var(--accent-peach)] text-black' : 'bg-theme-secondary'
              }`}>
                {m.role === 'user' ? m.content : <NeoMarkdown text={m.content} />}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start mb-8">
              <div className="p-6 bg-theme-secondary border-4 border-theme rounded-3xl flex gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-4 h-4 bg-theme-primary rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-[var(--accent-lilac)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-4 h-4 bg-[var(--accent-coral)] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="p-6 bg-theme-secondary border-t-4 border-theme z-10">
          <div className="flex gap-4">
            <input 
              type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isAr ? '╪º╪│╪ú┘ä ╪│╪ñ╪º┘ä┘â ╪º┘ä┘à┘ç┘å┘è...' : 'Ask your career question...'}
              className="clickable-card flex-1 bg-theme-primary text-theme-primary border-4 border-theme rounded-full px-8 py-5 text-xl font-bold outline-none focus:bg-theme-secondary transition-colors"
            />
            <Magnetic strength={0.3}>
              <button 
                onClick={handleSend} disabled={loading}
                className="clickable-card bg-theme-primary text-theme-primary w-20 h-20 rounded-full flex items-center justify-center hover:bg-[var(--accent-lilac)] hover:text-black border-4 border-theme shadow-[4px_4px_0_rgba(0,0,0,1)] transition-colors shrink-0"
              >
                <Send className={`w-8 h-8 ${isAr ? '' : ''}`} />
              </button>
            </Magnetic>
          </div>
        </div>

      </div>
    </div>
  );
};

const PersonaCardPage = ({ isAr, setPage, userProfile }) => {
  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-theme-primary">
      <div className="max-w-[800px] mx-auto">
        <button onClick={() => setPage('home')} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'Back' : 'Back'}
        </button>

        <h2 className={`text-4xl md:text-5xl mb-8 ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
          {isAr ? 'My Career ID' : 'My Career ID'}
        </h2>

        <div className="bg-theme-secondary border-4 border-black p-8 rounded-[2.5rem] shadow-brutal text-black">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-black flex items-center justify-center text-4xl shadow-[4px_4px_0_#000] shrink-0">
              ∩┐╜?∩┐╜x∩┐╜?∩┐╜
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left rtl:md:text-right w-full">
              <div>
                <h3 className="text-3xl font-black">{userProfile.name || 'Masari Pioneer'}</h3>
                <p className="font-bold opacity-70">{userProfile.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-[var(--accent-peach)] p-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                  <p className="text-sm font-bold opacity-80 mb-1">{isAr ? 'Career Path' : 'Career Path'}</p>
                  <p className="font-black">{userProfile.careerPersona || (isAr ? 'Not set' : 'Not set')}</p>
                </div>
                <div className="bg-[var(--accent-mint)] p-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                  <p className="text-sm font-bold opacity-80 mb-1">{isAr ? 'Professional Title' : 'Professional Title'}</p>
                  <p className="font-black">{userProfile.riasecTitle || (isAr ? 'Not set' : 'Not set')}</p>
                </div>
                <div className="bg-[var(--accent-lilac)] p-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                  <p className="text-sm font-bold opacity-80 mb-1">{isAr ? 'Match Score' : 'Match Score'}</p>
                  <p className="font-black">{userProfile.testMatchScore || '--'}</p>
                </div>
                <div className="bg-[var(--accent-yellow)] p-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                  <p className="text-sm font-bold opacity-80 mb-1">{isAr ? 'Weighted Score' : 'Weighted Score'}</p>
                  <p className="font-black">{userProfile.weightedScore || '--'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanelPage = ({ isAr, setPage, showToast, db }) => {
  const [newUrl, setNewUrl] = useState(LM_STUDIO_CONFIG.baseUrl);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!db) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'config', 'global'), { aiBaseUrl: newUrl }, { merge: true });
      LM_STUDIO_CONFIG.baseUrl = newUrl;
      showToast(isAr ? 'AI Server URL updated successfully!' : 'AI Server URL updated successfully!');
    } catch (err) {
      console.error(err);
      showToast(isAr ? 'Error saving config' : 'Error saving config');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 relative text-theme-primary">
      <div className="max-w-[800px] mx-auto page-enter">
        <button onClick={() => setPage('home')} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)]">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'Back' : 'Back'}
        </button>
        
        <h2 className={`text-4xl md:text-5xl mb-8 ${isAr ? 'font-display-en font-black' : 'font-display-en font-black'}`}>
          {isAr ? 'Admin Control Panel' : 'Admin Control Panel'}
        </h2>

        <div className="bg-theme-secondary p-8 rounded-[2rem] border-4 border-theme shadow-brutal text-black">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-[var(--accent-coral)]" />
            {isAr ? 'AI Server Config' : 'AI Server Config'}
          </h3>
          <p className="font-bold opacity-70 mb-6">
            {isAr ? 'Enter the live Ngrok or LocalTunnel URL to route all public AI requests to your local computer.' : 'Enter the live Ngrok or LocalTunnel URL to route all public AI requests to your local computer.'}
          </p>
          
          <input 
            type="text" 
            value={newUrl} 
            onChange={(e) => setNewUrl(e.target.value)} 
            className="w-full bg-white border-4 border-black p-4 rounded-xl text-lg mb-6 font-bold"
            placeholder="https://xyz.ngrok-free.app/v1"
          />
          
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full py-4 bg-[var(--accent-mint)] border-2 border-black font-bold rounded-xl hover:bg-[var(--accent-lilac)] transition-colors shadow-brutal-hover disabled:opacity-50"
          >
            {saving ? (isAr ? 'Saving...' : 'Saving...') : (isAr ? 'Update & Activate URL' : 'Update & Activate URL')}
          </button>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  const [lang, setLang] = useState('ar');
  const [page, setPage] = useState('home');
  const [userContext, setUserContext] = useState('student');
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transitionState, setTransitionState] = useState('idle');
  
    const [toastMessage, setToastMessage] = useState(null);
    const [isInsufficientPointsOpen, setIsInsufficientPointsOpen] = useState(false);

    const { x, y } = useMousePosition();
    const [isHovering, setIsHovering] = useState(false);


  
  const { user, userProfile: ctxProfile, saveProfile: ctxSaveProfile, logout, loading } = useAuth();
  
  const userProfile = ctxProfile || {
    id: 'UNAUTHENTICATED', name: 'Masari Pioneer', email: 'pioneer@masari.io',
    avatarId: 'avatar_blobby', slogan: 'Decoding academic milestones & professional trajectories',
    weightedScore: '', testMatchScore: '', riasecTitle: '', careerPersona: '',
    isLoggedIn: false, hasTakenTest: false, points: 50, subscriptionTier: 'free'
  };

  const handleSaveProfileToServer = async (profileObject) => {
    if (ctxSaveProfile) {
      await ctxSaveProfile(profileObject);
    }
  };

  const setUserProfile = (newProfile) => {
    handleSaveProfileToServer(newProfile);
  };

  

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    setPage('home');
    showToast(lang === 'ar' ? '╪¬┘à ╪¬╪│╪¼┘è┘ä ╪º┘ä╪«╪▒┘ê╪¼ ╪¿┘å╪¼╪º╪¡.' : 'Signed out successfully.');
  }
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [theme]);

  // Load html2canvas for profile ID export
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleTransition = useCallback((action) => {
    setTransitionState('exiting');
    setTimeout(() => {
      action();
      setTransitionState('entering');
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => setTransitionState('idle'), 500);
    }, 300);
  }, []);

  const toggleLang = () => {
    handleTransition(() => {
      setLang(prev => prev === 'ar' ? 'en' : 'ar');
    });
  };


  const handleDeductPoints = (pointsCost) => {
    const isBro = userProfile.subscriptionTier === 'bro';
    const currentPoints = userProfile.points || 0;

    if (!isBro && pointsCost > 0 && currentPoints < pointsCost) {
      setIsInsufficientPointsOpen(true);
      return false;
    }

    if (!isBro && pointsCost > 0) {
      const updatedProfile = {
        ...userProfile,
        points: currentPoints - pointsCost
      };
      setUserProfile(updatedProfile);
    }
    return true;
  };

  const triggerToolWithCredits = (targetTool, pointsCost) => {
    const isBro = userProfile.subscriptionTier === 'bro';
    const currentPoints = userProfile.points || 0;

    if (!isBro && pointsCost > 0 && currentPoints < pointsCost) {
      setIsInsufficientPointsOpen(true);
      return;
    }

    if (!isBro && pointsCost > 0) {
      const updatedProfile = {
        ...userProfile,
        points: currentPoints - pointsCost
      };
      setUserProfile(updatedProfile);
      handleSaveProfileToServer(updatedProfile);
      showToast(lang === 'ar' ? `╪¬┘à ╪«╪╡┘à ${pointsCost} ┘å┘é╪╖╪⌐ ┘ä╪¿╪»╪í ╪º┘ä╪ú╪»╪º╪⌐.` : `Deducted ${pointsCost} credits to run diagnostic.`);
    }

    handleTransition(() => {
      setPage(targetTool);
    });
  };
  
  const handleSetPage = (newPage) => {
    const bypassPages = ['home', 'auth_signin', 'auth_signup', 'subscriptions'];
    if (!userProfile.isLoggedIn && !bypassPages.includes(newPage)) {
      showToast(lang === 'ar' ? '┘è╪¼╪¿ ╪¬╪│╪¼┘è┘ä ╪¡╪│╪º╪¿┘â ╪º┘ä┘à┘ê╪½┘é ╪ú┘ê┘ä╪º┘ï ┘ä┘ä┘ê╪╡┘ê┘ä ╪Ñ┘ä┘ë ╪ú╪»┘ê╪º╪¬ ╪º┘ä╪░┘â╪º╪í ╪º┘ä╪º╪╡╪╖┘å╪º╪╣┘è!' : 'Please sign up or log in first to access premium modules!');
      handleTransition(() => {
        setPage('auth_signup');
        setIsMenuOpen(false);
      });
      return;
    }

    if (page === newPage) return;
    handleTransition(() => {
      setPage(newPage);
      setIsMenuOpen(false);
    });
  };

  const isAr = lang === 'ar';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-primary">
        <div className="w-16 h-16 border-8 border-theme border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <div 
        className={`min-h-screen ${isAr ? 'lang-en dir-ltr' : 'lang-en dir-ltr'} ${theme === 'dark' ? 'dark' : ''}`} 
        style={{ direction: isAr ? 'ltr' : 'ltr' }}
      >
        <div className={`custom-cursor ${isHovering ? 'hovering' : ''}`} style={{ left: x, top: y }}></div>
        
        <Navbar 
          isAr={isAr} toggleLang={toggleLang} setPage={handleSetPage} 
          theme={theme} toggleTheme={toggleTheme} toggleMenu={toggleMenu}
          userProfile={userProfile}
        />

        <FullscreenMenu 
          isAr={isAr} isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} 
          setPage={handleSetPage} userProfile={userProfile} logout={handleLogout}
        />

        <PointsExhaustedModal 
          isAr={isAr} isOpen={isInsufficientPointsOpen} onClose={() => setIsInsufficientPointsOpen(false)} 
          onGoToSubscriptions={() => handleSetPage('subscriptions')}
        />

        {toastMessage && (
          <div className="toast-container">
            <div className="toast-element bg-theme-secondary text-theme-primary px-6 py-4 rounded-2xl border-4 border-theme shadow-brutal flex items-center gap-3 font-bold">
              <Sparkles className="w-5 h-5 text-[var(--accent-coral)] animate-pulse" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        <main className={`
          ${transitionState === 'exiting' ? 'page-exit' : ''}
          ${transitionState === 'entering' ? 'page-enter' : ''}
        `}>
          {page === 'home' && <HeroPage isAr={isAr} setPage={handleSetPage} setUserContext={setUserContext} mouseX={x} mouseY={y} userProfile={userProfile} />}
          {page === 'auth_signin' && <AuthPage isAr={isAr} setPage={handleSetPage} mode="auth_signin" mouseX={x} mouseY={y} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast} />}
          {page === 'auth_signup' && <AuthPage isAr={isAr} setPage={handleSetPage} mode="auth_signup" mouseX={x} mouseY={y} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast} />}
          {page === 'dashboard_student' && <Dashboard isAr={isAr} type="student" setPage={handleSetPage} mouseX={x} mouseY={y} userProfile={userProfile} onTriggerTool={triggerToolWithCredits} />}
          {page === 'dashboard_pro' && <Dashboard isAr={isAr} type="pro" setPage={handleSetPage} mouseX={x} mouseY={y} userProfile={userProfile} onTriggerTool={triggerToolWithCredits} />}
          {page === 'subscriptions' && <SubscriptionPage isAr={isAr} setPage={handleSetPage} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast} />}
          
          {page === 'persona_card' && <PersonaCardPage isAr={isAr} setPage={handleSetPage} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast} />}
          {page === 'saved_reports' && <SavedReportsPage isAr={isAr} setPage={handleSetPage} userContext={userContext} />}
          
          {/* Diagnostic Sub-Tools */}
          {page === 'tool_career_test' && <ToolCareerTest isAr={isAr} setPage={handleSetPage} userContext={userContext} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_calculator' && <ToolCalculator isAr={isAr} setPage={handleSetPage} userContext={userContext} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_ai' && <ToolAIChat isAr={isAr} setPage={handleSetPage} userContext={userContext}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_ai_jobs_salary' && <ToolAISalaryPredictor isAr={isAr} setPage={handleSetPage} userContext={userContext} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_salary' && <ToolSalary isAr={isAr} setPage={handleSetPage} userContext={userContext}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_roi' && <ToolROI isAr={isAr} setPage={handleSetPage} userContext={userContext}  onDeductPoints={handleDeductPoints} />}

          {/* Generator Sub-Tools */}
          {page === 'tool_ready_test' && <ToolReadyTest isAr={isAr} setPage={handleSetPage} userContext={userContext} showToast={showToast}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_curriculum' && <ToolCurriculumPath isAr={isAr} setPage={handleSetPage} userContext={userContext} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_job_titles' && <ToolJobTitles isAr={isAr} setPage={handleSetPage} userContext={userContext} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_important_courses' && <ToolImportantCourses isAr={isAr} setPage={handleSetPage} userContext={userContext} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_career_pivot' && <ToolCareerPivot isAr={isAr} setPage={handleSetPage} userContext={userContext} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_define_roadmap' && <ToolDefineRoadmap isAr={isAr} setPage={handleSetPage} userContext={userContext} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_graduation_ideas' && <ToolGraduationIdeas isAr={isAr} setPage={handleSetPage} userContext={userContext} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_university_directory' && <ToolUniversityDirectory isAr={isAr} setPage={handleSetPage} userContext={userContext} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast}  onDeductPoints={handleDeductPoints} />}
          {page === 'tool_job_hunt' && <ToolJobHunt isAr={isAr} setPage={handleSetPage} userContext={userContext} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast}  onDeductPoints={handleDeductPoints} />}
        </main>

        {page === 'home' && <Footer isAr={isAr} />}
      </div>
    </>
  );
}