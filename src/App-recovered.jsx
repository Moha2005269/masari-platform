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
      showToast(isAr ? 'J,( *3,JD 'D/.HD D-A8 'D*B'1J1!' : 'You must be logged in to save reports!');
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
      
      showToast(isAr ? '*E -A8 'D*B1J1 (F,'-! *,/G AJ B'&E) *B'1J1C.' : 'Report saved to your artifacts successfully!');
    } catch(e) {
      console.error(e);
      showToast(isAr ? '-/+ .7# #+F'! 'D-A8.' : 'Error saving report.');
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
          <div className="w-16 h-16 rounded-full bg-[var(--accent-peach)] border-4 border-black flex items-center justify-center text-2xl font-bold animate-bounce shadow-[3px_3px_0_#000]">>ï¿½</div>
          <h3 className="text-3xl font-black">{isAr ? 'FB'7C :J1 C'AJ)!' : 'Insufficient Credits!'}</h3>
          <p className="font-semibold text-gray-700">
            {isAr 
              ? 'D' *H,/ D/JC FB'7 C'AJ) DA*- G0G 'D#/'). J1,I 4-F FB'7C #H 'D*1BJ) D('B) 'D(1H.'
              : 'You have depleted your available credits. Purchase standalone points or upgrade to the Bro Plan.'}
          </p>
          <div className="flex gap-4 w-full mt-4">
            <button 
              onClick={() => { onClose(); onGoToSubscriptions(); }}
              className="flex-1 py-4 bg-[var(--accent-lilac)] text-black border-4 border-black rounded-xl font-bold hover:translate-y-[-2px] transition-transform shadow-brutal"
            >
              {isAr ? ''D*1BJ) 'D"F' : 'Upgrade Now'}
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
        <h2 className={`text-5xl md:text-7xl mb-8 ${isAr ? 'font-display-ar' : 'font-display-en italic'}`}>
          {isAr ? ''DB'&E) 'D1&J3J)' : 'Menu'}
        </h2>

        <div className="flex flex-col gap-4 w-full px-6">
          {!userProfile.isLoggedIn ? (
            <>
              <Magnetic strength={0.2}>
                <button onClick={() => { setPage('auth_signin'); onClose(); }} className="w-full py-4 px-8 bg-black dark:bg-white dark:text-black text-white rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group">
                  <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? '*3,JD 'D/.HD 'DEH+B' : 'Sign In'}
                </button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <button onClick={() => { setPage('auth_signup'); onClose(); }} className="w-full py-4 px-8 bg-transparent bg-theme-primary border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all hover:bg-[var(--accent-mint)] hover:text-black group">
                  <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? '%F4'! -3'( ,/J/' : 'Sign Up'}
                </button>
              </Magnetic>
            </>
          ) : (
            <>
              <div className="bg-theme-primary border-4 border-theme p-4 rounded-3xl mb-4 text-center">
                <p className="font-bold opacity-60 text-sm mb-1">{isAr ? 'E1-('K' : 'Welcome,'}</p>
                <p className="font-black text-2xl">{userProfile.name}</p>
                <div className="mt-3 inline-flex items-center gap-2 bg-[var(--accent-peach)] text-black px-4 py-1.5 rounded-full border-2 border-black text-sm font-bold shadow-[2px_2px_0_#000]">
                  <Coins className="w-4 h-4"/> {userProfile.points} {isAr ? '15J/' : 'Credits'}
                </div>
              </div>
              <Magnetic strength={0.2}>
                <button onClick={() => { setPage('persona_card'); onClose(); }} className="w-full py-4 px-8 bg-[var(--accent-yellow)] text-black border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group">
                  <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? '(7'B*J 'DEGFJ)' : 'My Career Persona'}
                </button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <button onClick={() => { setPage('saved_reports'); onClose(); }} className="w-full py-4 px-8 bg-white text-black border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group mt-2">
                  <FileArchive className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? ''D*B'1J1 'DE-AH8)' : 'Saved Artifacts'}
                </button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <button onClick={() => { logout(); onClose(); }} className="w-full py-4 px-8 bg-[var(--accent-coral)] text-black border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group mt-2">
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? '*3,JD 'D.1H,' : 'Sign Out'}
                </button>
              </Magnetic>
            </>
          )}

          <Magnetic strength={0.2}>
            <button onClick={() => { setPage('subscriptions'); onClose(); }} className="w-full py-4 px-8 bg-[var(--accent-lilac)] text-black border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group mt-4">
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {isAr ? ''D('B'* H'D4-F' : 'Plans & Credits'}
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
    { cat: 'R', ar: '#3*E*9 ('D9ED (J/J D(F'! #H %5D'- 'D#4J'!.', en: 'I enjoy working with my hands to build or repair things.' },
    { cat: 'R', ar: '#A6D 'D#F47) 'D9EDJ) H'D(/FJ) AJ 'DGH'! 'D7DB.', en: 'I prefer hands-on, outdoor physical activities.' },
    { cat: 'R', ar: '#-( '3*./'E 'D#/H'* H'D"D'* 'DE9B/).', en: 'I like using complex tools and machinery.' },
    { cat: 'R', ar: '#491 ('D1'-) 9F/ 'D*9'ED E9 'D#4J'! 'DEDEH3) #C+1 EF 'D#AC'1 'DE,1/).', en: 'I am more comfortable with tangible objects than abstract concepts.' },
    { cat: 'R', ar: '#3*E*9 (%5D'- 'D#97'D 'DEJC'FJCJ) #H 'D%DC*1HFJ).', en: 'I enjoy fixing mechanical or electronic faults.' },
    { cat: 'R', ar: '#-( 'D9ED AJ (J&'* **7D( E,GH/'K -1CJ'K.', en: 'I prefer working in environments that require physical effort.' },
    { cat: 'R', ar: 'J3*GHJFJ (F'! 'DE,3E'* H*,EJ9 'D#,G2).', en: 'I am fascinated by building models and assembling devices.' },
    { cat: 'R', ar: '#*9DE (4CD #A6D EF .D'D 'D*,1() 'D9EDJ).', en: 'I learn best through practical, hands-on experience.' },
    { cat: 'I', ar: '#-( -D 'D#D:'2 'DE9B/) H*-DJD 'D(J'F'*.', en: 'I love solving complex puzzles and analyzing data.' },
    { cat: 'I', ar: '#491 ('DA6HD *,'G 'DF81J'* 'D9DEJ).', en: 'I am highly curious about scientific theories.' },
    { cat: 'I', ar: '#3*E*9 (%,1'! 'D*,'1( H'C*4'A -B'&B ,/J/).', en: 'I enjoy conducting experiments to discover new facts.' },
    { cat: 'I', ar: '#A6D 'D*ACJ1 'D9EJB H'DE3*BD D-D 'DE4CD'* 'DE9B/).', en: 'I prefer deep, independent thought to solve complex problems.' },
    { cat: 'I', ar: '#-( B1'!) 'DEB'D'* H'D#(-'+ 'D9DEJ) H'D*BFJ).', en: 'I love reading scientific and technical research articles.' },
    { cat: 'I', ar: '#EJD %DI '3*./'E 'DEF7B (/D'K EF 'D9'7A) AJ B1'1'*J.', en: 'I lean towards logic rather than emotion in my decisions.' },
    { cat: 'I', ar: '*3*GHJFJ 'D1J'6J'* H(1E,) 'D.H'12EJ'*.', en: 'I am drawn to mathematics and algorithm programming.' },
    { cat: 'I', ar: '#(-+ /'&EK' 9F 'D#3('( 'D,01J) D#J 8'G1).', en: 'I always look for the root causes of any phenomenon.' },
    { cat: 'I', ar: '#3*E*9 ('D*-/J'* 'D0GFJ) 'D59().', en: 'I enjoy difficult mental challenges.' },
    { cat: 'A', ar: '#9(1 9F FA3J (4CD #A6D EF .D'D 'D*5EJE #H 'DAF.', en: 'I express myself best through design or art.' },
    { cat: 'A', ar: '#3*E*9 ('(*C'1 #AC'1 %(/'9J) .'1,) 9F 'DE#DHA.', en: 'I enjoy coming up with creative, out-of-the-box ideas.' },
    { cat: 'A', ar: '#-( 'D9ED AJ (J&'* E1F) :J1 EBJ/) (1H*JF 5'1E.', en: 'I like working in flexible environments without strict routines.' },
    { cat: 'A', ar: '*DGEFJ 'DEH3JBI H'DC*'() H'DAFHF 'D(51J).', en: 'Music, writing, and visual arts inspire me.' },
    { cat: 'A', ar: '#EJD %DI 'D'9*E'/ 9DI 'D-/3 H'D.J'D.', en: 'I tend to rely on intuition and imagination.' },
    { cat: 'A', ar: '#-( *2JJF H*F3JB 'D#E'CF EF -HDJ.', en: 'I love decorating and coordinating the spaces around me.' },
    { cat: 'A', ar: '#A6D #F #CHF E(*C1K' 9DI #F #CHF EFA0K' DD*9DJE'*.', en: 'I prefer being an innovator over just following instructions.' },
    { cat: 'A', ar: ''D,E'DJ'* H'D*5EJE *D9( /H1'K EGE'K AJ B1'1'*J.', en: 'Aesthetics and design play a major role in my decisions.' },
    { cat: 'S', ar: '#491 ('D16' 'D*'E 9F/E' #3'9/ 'D".1JF.', en: 'I feel deeply fulfilled when I help others.' },
    { cat: 'S', ar: '#3*E*9 ('D'3*E'9 DE4'CD 'DF'3 H*B/JE 'DF5- DGE.', en: 'I enjoy listening to peoples problems and advising them.' },
    { cat: 'S', ar: '#-( 'D9ED 6EF A1JB H'D*9'HF D*-BJB G/A E4*1C.', en: 'I love teamwork and collaborating for a shared goal.' },
    { cat: 'S', ar: '#,/ E*9) AJ *9DJE H*/1J( 'D#A1'/ H*7HJ1 EG'1'*GE.', en: 'I find joy in teaching, training, and developing others.' },
    { cat: 'S', ar: '#G*E C+J1'K (E4'91 'D".1JF H1'-*GE 'DFA3J).', en: 'I care deeply about others feelings and well-being.' },
    { cat: 'S', ar: '#3*7J9 (F'! 9D'B'* ',*E'9J) %J,'(J) (3GHD).', en: 'I can easily build positive social relationships.' },
    { cat: 'S', ar: '#A6D 'DH8'&A 'D*J **7D( *A'9D'K (41J'K E3*E1'K.', en: 'I prefer jobs that require constant human interaction.' },
    { cat: 'S', ar: ''D9ED 'D*7H9J H./E) 'DE,*E9 #E1 #3'3J ('DF3() DJ.', en: 'Volunteering and community service are essential to me.' },
    { cat: 'E', ar: '#3*E*9 (BJ'/) 'DA1B H*-ED 'DE3$HDJ).', en: 'I enjoy leading teams and taking responsibility.' },
    { cat: 'E', ar: '#F' ('19 AJ %BF'9 'DF'3 (1$J*J H71JB) *ACJ1J.', en: 'I am highly effective at persuading people to see my vision.' },
    { cat: 'E', ar: '#-( (/! E4'1J9 ,/J/) H*-ED 'DE.'71 'DE-3H().', en: 'I love starting new projects and taking calculated risks.' },
    { cat: 'E', ar: '#3*E*9 ('DEF'A3) H'D*-/J'* DDH5HD %DI 'DBE).', en: 'I thrive on competition and challenges to reach the top.' },
    { cat: 'E', ar: '7EH-J 9'DJ H#39I ('3*E1'1 DD*1BJ H'DEF'5( 'DBJ'/J).', en: 'I am highly ambitious and constantly seek leadership roles.' },
    { cat: 'E', ar: '#-( 'D*A'H6 H%(1'E 'D5AB'* (F,'-.', en: 'I love negotiating and successfully closing deals.' },
    { cat: 'E', ar: 'D' #.4I '*.'0 'DB1'1'* 'D-'3E) AJ 'D#HB'* 'D59().', en: 'I am not afraid to make tough decisions in hard times.' },
    { cat: 'E', ar: '#3*E*9 ('D*-/+ #E'E 'D,EGH1 H916 'D#AC'1.', en: 'I enjoy public speaking and presenting ideas.' },
    { cat: 'C', ar: '#94B *F8JE 'DE9DHE'* H*5EJE 'D,/'HD.', en: 'I love organizing data and designing perfect schedules.' },
    { cat: 'C', ar: '#(/J 'G*E'E'K C(J1'K (#/B 'D*A'5JD D6E'F 'D,H/).', en: 'I pay extreme attention to details to ensure quality.' },
    { cat: 'C', ar: '#A6D 'D9ED AJ (J&'* 0'* #F8E) HBH'FJF H'6-).', en: 'I prefer working in environments with clear rules and systems.' },
    { cat: 'C', ar: '#3*E*9 (%/'1) 'DEJ2'FJ'* H**(9 'D#1B'E (/B).', en: 'I enjoy managing budgets and tracking numbers precisely.' },
    { cat: 'C', ar: ''D/B) H'D'F6('7 GE' #GE 5A'* 'D9ED 'DF',- ('DF3() DJ.', en: 'Accuracy and discipline are the most important traits to me.' },
    { cat: 'C', ar: '#-( 'DEG'E 'D*J **7D( E9'D,) 'D(J'F'* H%/.'DG' (/B).', en: 'I like tasks that require precise data processing and entry.' },
    { cat: 'C', ar: '#EJD %DI E1',9) H*/BJB 'DE3*F/'* DD*#C/ EF .DHG' EF 'D#.7'!.', en: 'I tend to review and audit documents to ensure zero errors.' },
    { cat: 'C', ar: ''D*.7J7 'DE3(B DCD .7H) J491FJ ('D1'-) H'D#E'F.', en: 'Pre-planning every step gives me comfort and security.' },
    { cat: 'C', ar: '#-( 'D'-*A'8 (3,D'* EF8E) HEH+B) DCD 4J!.', en: 'I like keeping organized, documented records for everything.' }
  ];
  return baseQuestions;
};

const generate100Majors = () => {
  const rawData = [
    "CS|Computer Science|9DHE 'D-'3(|2,5,3,1,2,4", "SE|Software Engineering|GF/3) 'D(1E,J'*|2,5,2,1,3,4",
    "AI|Artificial Intelligence|'D0C'! 'D'57F'9J|1,5,3,1,2,4", "CY|Cybersecurity|'D#EF 'D3J(1'FJ|2,5,1,1,3,5",
    "DS|Data Science|9DHE 'D(J'F'*|1,5,2,1,2,5", "IS|Information Systems|F8E 'DE9DHE'*|1,4,1,2,4,5",
    "MED|Medicine & Surgery|'D7( H'D,1'-)|4,5,1,5,2,3", "DEN|Dentistry|7( 'D#3F'F|4,4,3,4,2,3",
    "PHA|Pharmacy|'D5J/D)|3,5,1,3,2,5", "NUR|Nursing|'D*E1J6|3,2,1,5,1,3",
    "PT|Physical Therapy|'D9D', 'D7(J9J|3,3,1,5,1,2", "NUT|Clinical Nutrition|'D*:0J) 'D31J1J)|2,4,1,4,2,3",
    "ARC|Architecture|'DGF/3) 'DE9E'1J)|3,4,5,2,3,2", "CE|Civil Engineering|'DGF/3) 'DE/FJ)|4,4,2,1,3,3",
    "ME|Mechanical Engineering|'DGF/3) 'DEJC'FJCJ)|5,4,1,1,2,3", "EE|Electrical Engineering|'DGF/3) 'DCG1('&J)|4,5,1,1,2,3",
    "CHE|Chemical Engineering|'DGF/3) 'DCJEJ'&J)|3,5,1,1,2,3", "AER|Aerospace Engineering|GF/3) 'D7J1'F|4,5,2,1,2,3",
    "BME|Biomedical Engineering|'DGF/3) 'D7(J) 'D-JHJ)|3,5,2,2,2,3", "BUS|Business Administration|%/'1) 'D#9E'D|1,2,2,3,5,4",
    "FIN|Finance|'DE'DJ)|1,4,1,1,4,5", "ACC|Accounting|'DE-'3()|1,3,1,1,3,5",
    "MKT|Marketing|'D*3HJB|1,2,4,3,5,2", "HR|Human Resources|'DEH'1/ 'D(41J)|1,2,2,5,4,3",
    "ECO|Economics|'D'B*5'/|1,5,1,1,3,4", "LAW|Law & Jurisprudence|'DB'FHF H'D#F8E)|1,4,3,4,5,3",
    "PSY|Psychology|9DE 'DFA3|1,4,2,5,2,2", "SOC|Sociology|9DE 'D',*E'9|1,4,2,4,2,2",
    "EDU|Education & Teaching|'D*9DJE H'D*1(J)|2,2,3,5,3,3", "ART|Fine Arts|'DAFHF 'D,EJD)|2,2,5,1,1,1",
    "DES|Graphic Design|'D*5EJE 'D,1'AJCJ|2,3,5,1,2,2", "ID|Interior Design|'D*5EJE 'D/'.DJ|3,3,5,2,3,2",
    "JOU|Journalism|'D5-'A) H'D%9D'E|1,3,4,3,4,2", "PR|Public Relations|'D9D'B'* 'D9'E)|1,2,3,4,5,2",
    "LIN|Linguistics|'DD:HJ'* H'DD:'*|1,4,3,3,2,3", "ENG|English Literature|'D#/( 'D%F,DJ2J|1,3,5,2,1,2",
    "HIS|History|'D*'1J.|1,4,2,2,1,3", "GEO|Geography|'D,:1'AJ'|2,4,1,1,1,3",
    "POL|Political Science|'D9DHE 'D3J'3J)|1,4,2,3,5,2", "PHY|Physics|'DAJ2J'!|2,5,1,1,1,3",
    "CHM|Chemistry|'DCJEJ'!|3,5,1,1,1,3", "BIO|Biology|'D#-J'!|3,5,1,1,1,3",
    "MAT|Mathematics|'D1J'6J'*|1,5,1,1,1,4", "STA|Statistics|'D%-5'!|1,5,1,1,2,5",
    "AST|Astronomy|9DE 'DADC|1,5,2,1,1,3", "VET|Veterinary Medicine|'D7( 'D(J71J|4,4,1,3,1,3",
    "AGR|Agriculture|'D21'9)|4,3,1,1,2,2", "ENV|Environmental Science|'D9DHE 'D(J&J)|3,4,1,2,2,2",
    "MAR|Marine Biology|9DE 'D#-J'! 'D(-1J)|3,4,1,1,1,2", "FOR|Forestry|'D:'('*|4,3,1,1,2,2",
    "HOS|Hospitality Management|%/'1) 'D6J'A)|2,1,2,4,4,3", "CUL|Culinary Arts|AFHF 'D7GJ|4,2,4,2,3,2",
    "SPO|Sports Management|'D%/'1) 'D1J'6J)|3,1,1,3,5,3", "KIN|Kinesiology|9DE 'D-1C)|4,3,1,4,2,2",
    "AVI|Aviation/Aeronautics|'D7J1'F|4,3,1,2,3,4", "LOG|Logistics & Supply Chain|3D'3D 'D%E/'/ 'DDH,3*J)|2,3,1,2,4,5",
    "RE|Real Estate|'D9B'1'*|1,2,1,3,5,3", "INS|Insurance & Risk Management|'D*#EJF H%/'1) 'DE.'71|1,4,1,2,4,5",
    "ACT|Actuarial Science|'D9DHE 'D'C*H'1J)|1,5,1,1,3,5", "PUB|Public Administration|'D%/'1) 'D9'E)|1,3,1,4,4,4",
    "SW|Social Work|'D./E) 'D',*E'9J)|1,2,1,5,2,3", "CRI|Criminology|9DE 'D,1JE)|2,4,1,3,3,4",
    "ANT|Anthropology|'D#F+1H(HDH,J'|2,4,2,3,1,2", "ARC2|Archaeology|'D"+'1|3,4,2,1,1,3",
    "PHI|Philosophy|'DAD3A)|1,5,3,1,1,2", "THE|Theology/Islamic Studies|'D/1'3'* 'D%3D'EJ) H'D41J9)|1,4,2,4,3,3",
    "MUS|Music|'DEH3JBI|2,2,5,1,2,1", "THT|Theater & Drama|'DE31- H'D/1'E'|2,2,5,3,3,1",
    "FIL|Film & Television|'D3JFE' H'D*DA2JHF|3,3,5,2,4,2", "ANI|Animation|'D13HE 'DE*-1C)|2,3,5,1,2,3",
    "PHO|Photography|'D*5HJ1 'DAH*H:1'AJ|3,2,5,1,2,2", "FAS|Fashion Design|*5EJE 'D#2J'!|3,2,5,2,3,2",
    "IND|Industrial Design|'D*5EJE 'D5F'9J|4,3,5,1,3,2", "URB|Urban Planning|'D*.7J7 'D9E1'FJ|2,4,3,2,4,3",
    "SUP|Supply Chain Management|%/'1) 3D'3D 'D*H1J/|1,4,1,2,4,5", "MIS|Management Information Systems|F8E 'DE9DHE'* 'D%/'1J)|1,4,1,2,4,5",
    "ECOM|E-Commerce|'D*,'1) 'D%DC*1HFJ)|1,3,2,2,5,4", "ENT|Entrepreneurship|1J'/) 'D#9E'D|1,3,4,3,5,3",
    "INT|International Business|'D#9E'D 'D/HDJ)|1,3,2,3,5,3", "PUBH|Public Health|'D5-) 'D9'E)|1,4,1,4,3,3",
    "HCA|Health Care Administration|%/'1) 'D19'J) 'D5-J)|1,3,1,4,4,4", "RAD|Radiologic Technology|*BFJ) 'D#49)|4,3,1,3,1,4",
    "RES|Respiratory Therapy|'D9D', 'D*FA3J|3,3,1,4,1,3", "OPT|Optometry|'D(51J'*|3,4,1,4,2,3",
    "AUD|Audiology|'D3E9J'*|2,4,1,4,1,3", "SLP|Speech-Language Pathology|#E1'6 'D*.'7(|1,3,1,5,1,3",
    "GEN|Genetics|9DE 'DH1'+)|2,5,1,1,1,4", "NEU|Neuroscience|9DE 'D#95'(|2,5,1,1,1,3",
    "BCH|Biochemistry|'DCJEJ'! 'D-JHJ)|3,5,1,1,1,4", "ZOO|Zoology|9DE 'D-JH'F|3,4,1,1,1,2",
    "BOT|Botany|9DE 'DF('*|3,4,1,1,1,3", "MBI|Microbiology|9DE 'D#-J'! 'D/BJB)|3,5,1,1,1,4",
    "IMM|Immunology|9DE 'DEF'9)|2,5,1,1,1,3", "PHA2|Pharmacology|9DE 'D#/HJ)|2,5,1,1,1,4",
    "TOX|Toxicology|9DE 'D3EHE|2,5,1,1,1,4", "GEO2|Geology|'D,JHDH,J'|4,4,1,1,2,2",
    "MET|Meteorology|'D#15'/ 'D,HJ)|2,4,1,1,1,3", "OCE|Oceanography|9DE 'DE-J7'*|3,4,1,1,2,2",
    "MSE|Materials Science & Engineering|GF/3) 'DEH'/|3,5,1,1,2,3", "NUC|Nuclear Engineering|'DGF/3) 'DFHHJ)|3,5,1,1,2,4"
  ];
  return rawData.map(line => {
    const [id, en, ar, scores] = line.split('|');
    const [R, I, A, S, E, C] = scores.split(',').map(Number);
    return { id, en, ar, p: { R, I, A, S, E, C } };
  });
};

const SAUDI_UNIVERSITIES = [
  { 
    id: 'ksu', ar: ','E9) 'DEDC 39H/ (KSU)', en: 'King Saud University', 
    cityAr: ''D1J'6', cityEn: 'Riyadh', typeAr: '-CHEJ)', typeEn: 'Public', 
    qs: 143, the: 251, req: ''D+'FHJ) 30% | 'DB/1'* 30% | 'D*-5JDJ 40%', score: 88, 
    descAr: 'EF'A3) 9'DJ) 1'&/) AJ 'D*.55'* 'D5-J) H'DGF/3J).', descEn: 'High competition, leading in Health & Engineering.', 
    color: 'var(--accent-mint)', icon: '<ï¿½', tracks: { ar: '5-J 9DEJ %F3'FJ', en: 'Health, Science, Humanities' } 
  },
  { 
    id: 'kfupm', ar: ','E9) 'DEDC AG/ DD(*1HD (KFUPM)', en: 'KFUPM', 
    cityAr: ''D8G1'F', cityEn: 'Dhahran', typeAr: '-CHEJ)', typeEn: 'Public', 
    qs: 160, the: 201, req: ''D+'FHJ) 20% | 'DB/1'* 30% | 'D*-5JDJ 50%', score: 91, 
    descAr: ''D#HDI AJ 'DGF/3) H'D9DHE 'D*BFJ) H'D7'B).', descEn: 'Top ranked globally for Petroleum, Engineering & Tech.', 
    color: 'var(--accent-peach)', icon: '=,', tracks: { ar: 'GF/3J -'3( #9E'D', en: 'Engineering, Computer Science, Business' } 
  },
  { 
    id: 'kau', ar: ','E9) 'DEDC 9(/'D92J2 (KAU)', en: 'King Abdulaziz University', 
    cityAr: ',/)', cityEn: 'Jeddah', typeAr: '-CHEJ)', typeEn: 'Public', 
    qs: 143, the: 251, req: ''D+'FHJ) 40% | 'DB/1'* 30% | 'D*-5JDJ 30%', score: 85, 
    descAr: '**EJ2 ((1'E, 'D%/'1) H'D9DHE 'D*7(JBJ).', descEn: 'Renowned for Business Administration and Applied Sciences.', 
    color: 'var(--accent-lilac)', icon: '<
', tracks: { ar: '9DEJ %/'1J 5-J', en: 'Science, Admin, Health' } 
  },
  { 
    id: 'iau', ar: ','E9) 'D%E'E 9(/'D1-EF (F AJ5D', en: 'Imam Abdulrahman Bin Faisal Univ', 
    cityAr: ''D/E'E', cityEn: 'Dammam', typeAr: '-CHEJ)', typeEn: 'Public', 
    qs: 400, the: 501, req: ''D+'FHJ) 30% | 'DB/1'* 30% | 'D*-5JDJ 40%', score: 86, 
    descAr: 'BHJ) ,/'K AJ 'DE3'1'* 'D5-J) ('DEF7B) 'D41BJ).', descEn: 'Highly competitive Health and Medicine tracks in the East.', 
    color: 'var(--accent-yellow)', icon: '<ï¿½', tracks: { ar: '5-J GF/3J %F3'FJ', en: 'Health, Engineering, Humanities' } 
  },
  { 
    id: 'pnu', ar: ','E9) 'D#EJ1) FH1) (PNU)', en: 'Princess Nourah University', 
    cityAr: ''D1J'6', cityEn: 'Riyadh', typeAr: '-CHEJ)', typeEn: 'Public', 
    qs: 600, the: 601, req: ''D+'FHJ) 30% | 'DB/1'* 30% | 'D*-5JDJ 40%', score: 83, 
    descAr: ','E9) F3'&J) 1'&/) 9'DEJ'K (*.55'* *BFJ) H5-J).', descEn: 'Leading global womens university with Tech and Health focus.', 
    color: 'var(--accent-coral)', icon: '=i<ï¿½', tracks: { ar: '5-J 9DEJ %F3'FJ', en: 'Health, Science, Humanities' } 
  },
  { 
    id: 'psu', ar: ','E9) 'D#EJ1 3D7'F (PSU)', en: 'Prince Sultan University', 
    cityAr: ''D1J'6', cityEn: 'Riyadh', typeAr: '#GDJ)', typeEn: 'Private', 
    qs: 500, the: 601, req: 'J9*E/ 9DI 'DEB'(D) H'DE9/D 'D*1'CEJ 'D9'DJ', score: 80, 
    descAr: '1'&/) 'D,'E9'* 'D#GDJ) AJ %/'1) 'D#9E'D H'DB'FHF.', descEn: 'Leading private university for Business and Law in KSA.', 
    color: 'var(--bg-secondary)', icon: '=ï¿½', tracks: { ar: '%/'1) B'FHF -'3(', en: 'Business, Law, Computer Science' } 
  },
  { 
    id: 'alfaisal', ar: ','E9) 'DAJ5D', en: 'Alfaisal University', 
    cityAr: ''D1J'6', cityEn: 'Riyadh', typeAr: '#GDJ)', typeEn: 'Private', 
    qs: 800, the: 301, req: ''DE9/D 'D*1'CEJ + '.*('1'* 'DB(HD 'D/HDJ)', score: 82, 
    descAr: '**EJ2 ((1'E, 'D7( 'D(41J H%/'1) 'D#9E'D (41'C'* /HDJ).', descEn: 'Highly ranked medical and business programs with global ties.', 
    color: 'var(--accent-mint)', icon: '>ï¿½', tracks: { ar: '7( #9E'D GF/3)', en: 'Medicine, Business, Engineering' } 
  },
  { 
    id: 'uqu', ar: ','E9) #E 'DB1I (UQU)', en: 'Umm Al-Qura University', 
    cityAr: 'EC) 'DEC1E)', cityEn: 'Makkah', typeAr: '-CHEJ)', typeEn: 'Public', 
    qs: 500, the: 601, req: ''D+'FHJ) 30% | 'DB/1'* 30% | 'D*-5JDJ 40%', score: 84, 
    descAr: '*'1J. 91JB HBH) AJ 'D/1'3'* 'D%3D'EJ) H'D7(.', descEn: 'Deep history, leading in Islamic studies, Medicine and Tech.', 
    color: 'var(--accent-peach)', icon: '=L', tracks: { ar: '419J 5-J GF/3J', en: 'Islamic Studies, Health, Engineering' } 
  },
  { 
    id: 'kku', ar: ','E9) 'DEDC .'D/ (KKU)', en: 'King Khalid University', 
    cityAr: '#(G'', cityEn: 'Abha', typeAr: '-CHEJ)', typeEn: 'Public', 
    qs: 700, the: 501, req: ''D+'FHJ) 30% | 'DB/1'* 30% | 'D*-5JDJ 40%', score: 81, 
    descAr: '#C(1 ,'E9'* 'D,FH( (*.55'* (1E,J) HGF/3J) BHJ).', descEn: 'Largest university in the south with strong Tech/Eng tracks.', 
    color: 'var(--accent-lilac)', icon: 'ï¿½', tracks: { ar: '5-J 9DEJ F81J', en: 'Health, Science, Theoretical' } 
  },
  { 
    id: 'qassim', ar: ','E9) 'DB5JE', en: 'Qassim University', 
    cityAr: '(1J/)', cityEn: 'Qassim', typeAr: '-CHEJ)', typeEn: 'Public', 
    qs: 800, the: 801, req: ''D+'FHJ) 30% | 'DB/1'* 30% | 'D*-5JDJ 40%', score: 81, 
    descAr: 'E/JF) ,'E9J) 6.E) 1'&/) AJ 'D21'9) 'D7( H'DGF/3).', descEn: 'Massive campus leading in Agriculture, Medicine, and Engineering.', 
    color: 'var(--accent-yellow)', icon: '<4', tracks: { ar: '5-J 21'9J 9DEJ', en: 'Health, Agriculture, Science' } 
  },
  { 
    id: 'taibah', ar: ','E9) 7J()', en: 'Taibah University', 
    cityAr: ''DE/JF) 'DEFH1)', cityEn: 'Madinah', typeAr: '-CHEJ)', typeEn: 'Public', 
    qs: 1000, the: 1001, req: ''D+'FHJ) 30% | 'DB/1'* 30% | 'D*-5JDJ 40%', score: 82, 
    descAr: '*7H1 31J9 AJ B7'9'* 'D5-) H'D#9E'D H*CFHDH,J' 'DE9DHE'*.', descEn: 'Rapid growth in Health, Business, and IT sectors.', 
    color: 'var(--accent-coral)', icon: '=J', tracks: { ar: '5-J %/'1J 9DEJ', en: 'Health, Admin, Science' } 
  },
  { 
    id: 'kaust', ar: ','E9) 'DEDC 9(/'DDG (KAUST)', en: 'KAUST', 
    cityAr: '+HD', cityEn: 'Thuwal', typeAr: '-CHEJ)', typeEn: 'Public', 
    qs: 113, the: 201, req: '41H7 9DJ' H(1'E, EHG() H'DE9/D 'DE1*A9', score: 95, 
    descAr: '#(-'+ H/1'3'* 9DJ' H(C'DH1JH3 9'DEJ DD7D() 'DEHGH(JF.', descEn: 'Elite research institution opening highly selective undergrad programs.', 
    color: 'var(--bg-secondary)', icon: '>ï¿½', tracks: { ar: '#(-'+ 9DEJ) GF/3) E*B/E)', en: 'Advanced Science & Engineering' } 
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
          <h3 className={`text-4xl font-black italic ${isAr ? 'font-display-ar' : 'font-display-en'}`}>
            {isAr ? 'E3'1J' : 'MASARI'}
          </h3>
          <p className="text-gray-400 font-medium max-w-sm">
            {isAr 
              ? 'FG, FJH(1H*'DJ 1'&/ AJ *4CJD 'DGHJ'* 'DEGFJ) DD,JD 'DB'/E EF .D'D 'D0C'! 'D'57F'9J H'D#(-'+ 'DFA3J) 'D/BJB).'
              : 'A pioneer neobrutalist approach to shaping career personas for the next generation using deep AI and empirical research.'}
          </p>
        </div>

        <div className="md:col-span-3 space-y-4">
          <h4 className="font-bold text-xl uppercase tracking-widest text-[var(--accent-lilac)]">
            {isAr ? ''*5D (F'' : 'Contact'}
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
      slogan: slogan || (isAr ? '#5F9 E3*B(DJ (0C'!' : 'Decoding academic milestones & professional trajectories'),
      isLoggedIn: true,
      points: userProfile.points > 0 ? userProfile.points : 50, 
      subscriptionTier: userProfile.subscriptionTier || 'free'
    };

    setUserProfile(finalProfile);
    onSaveProfile(finalProfile);

    showToast(isAr ? `#GD'K (C! *E 'D*3,JD H-A8 (J'F'*C 3-'(J'K: ${randomId}` : `Verified identity recorded on secure server: ${randomId}`);
    setPage('dashboard_student');
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 flex flex-col items-center justify-center relative overflow-hidden">
      <AbstractShape2 className="absolute top-[20%] right-[10%] w-[30vw] text-[var(--accent-peach)] opacity-40 animate-float" />
      <DecorativeStar className="absolute bottom-[20%] left-[10%] w-32 h-32 text-[var(--accent-mint)] animate-spin-slow" />
      
      <div className="w-full max-w-xl bg-theme-secondary p-8 md:p-10 rounded-[3rem] border-4 border-theme shadow-brutal relative z-10">
        <button onClick={() => setPage('home')} className="clickable-card mb-6 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors text-theme-primary">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? ''D9H/) DD1&J3J)' : 'Back to Home'}
        </button>

        <div className="flex justify-between items-end mb-6 text-theme-primary">
           <h2 className={`text-3xl md:text-4xl ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
             {isSignIn ? (isAr ? '*3,JD 'D/.HD 'DEH+B' : 'Verified Sign In') : (isAr ? '%F4'! -3'( EGFJ A1J/' : 'Register Custom ID')}
           </h2>
           <TrackingEye mouseX={mouseX} mouseY={mouseY} className="w-14 h-14" />
        </div>

        <form className="flex flex-col gap-5 text-theme-primary" onSubmit={handleSubmit}>
          {!isSignIn && (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-lg">{isAr ? ''.*1 1E2C 'DEGFJ (Avatar)' : 'Choose your PFP Persona'}</label>
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
                <label className="font-bold text-lg">{isAr ? ''D'3E 'DE91H6 ('D(7'B)' : 'Display Full Name'}</label>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)} placeholder={isAr ? '#/.D '3EC GF'' : 'Your name'}
                  className="w-full bg-theme-primary border-4 border-theme p-3 rounded-2xl font-bold focus:outline-none focus:bg-[var(--accent-mint)] focus:text-black transition-colors" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-lg">{isAr ? '49'1C 'DEDGE' : 'Inspirational Slogan'}</label>
                <input 
                  type="text" value={slogan} onChange={e => setSlogan(e.target.value)} placeholder={isAr ? 'E+'D: E-( DD(J'F'* H'D*ACJ1 'D.H'12EJ' : 'e.g. Code wizard & Design thinker'}
                  className="w-full bg-theme-primary border-4 border-theme p-3 rounded-2xl font-bold focus:outline-none focus:bg-[var(--accent-yellow)] focus:text-black transition-colors" 
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-bold text-lg">{isAr ? ''D(1J/ 'D%DC*1HFJ' : 'Email Address'}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-theme-primary border-4 border-theme p-3 rounded-2xl font-bold focus:outline-none focus:bg-[var(--accent-lilac)] focus:text-black transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-lg">{isAr ? 'CDE) 'DE1H1' : 'Password'}</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-theme-primary border-4 border-theme p-3 rounded-2xl font-bold focus:outline-none focus:bg-[var(--accent-peach)] focus:text-black transition-colors" />
          </div>

          <Magnetic strength={0.1} className="w-full mt-2">
            <button type="submit" className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xl border-4 border-transparent shadow-brutal-hover hover:scale-105 transition-all flex items-center justify-center gap-3">
              {isSignIn ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isSignIn ? (isAr ? '*3,JD /.HD EH+B' : 'Sign In to ID') : (isAr ? '3,D H'-5D 9DI GHJ*C 'DA1J/)' : 'Register & Generate ID')}
            </button>
          </Magnetic>
        

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-1 bg-black/20 rounded"></div>
            <span className="font-bold text-sm opacity-50">{isAr ? '#H' : 'OR'}</span>
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
                    slogan: isAr ? '#5F9 E3*B(DJ (0C'!' : 'Decoding academic milestones',
                    isLoggedIn: true,
                    points: 50,
                    subscriptionTier: 'free',
                    careerPersona: ''
                  };
                  await setDoc(profileRef, finalProfile);
                }
                setUserProfile(finalProfile);
                showToast(isAr ? '*E *3,JD 'D/.HD (F,'- 9(1 Google!' : 'Signed in with Google successfully!');
                setPage('dashboard_student');
              } catch (err) {
                console.error('Google sign-in error:', err);
                showToast(isAr ? 'A4D *3,JD 'D/.HD (,H,D: ' + err.message : 'Google sign-in failed: ' + err.message);
              }
            }} className="w-full py-4 bg-white text-black rounded-full font-bold text-xl border-4 border-black shadow-brutal-hover hover:scale-105 transition-all flex items-center justify-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {isAr ? '*3,JD (H'37) Google' : 'Continue with Google'}
            </button>
          </Magnetic>
        </form>

        <div className="mt-6 text-center font-bold opacity-70 text-theme-primary">
          {isSignIn ? (
             <p>{isAr ? 'DJ3 D/JC -3'( EGFJ' : 'New here?'} <span onClick={() => setPage('auth_signup')} className="text-[var(--accent-coral)] cursor-pointer hover:underline">{isAr ? '#F4& -3'('K AH1J'K' : 'Create an Account'}</span></p>
          ) : (
             <p>{isAr ? 'D/JC -3'( EGFJ E3(B' : 'Already registered?'} <span onClick={() => setPage('auth_signin')} className="text-[var(--accent-lilac)] cursor-pointer hover:underline">{isAr ? '3,D /.HDC' : 'Sign In'}</span></p>
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
        {isAr ? ''D9H/) DD1&J3J)' : 'Back to Home'}
      </button>

      <div className="mb-12">
        <h2 className={`text-5xl md:text-7xl font-black mb-4 ${isAr ? 'font-display-ar' : 'font-display-en'}`}>
          {isAr ? ''D*B'1J1 'DE-AH8)' : 'Saved Artifacts'}
        </h2>
        <p className="text-xl opacity-70">
          {isAr ? ',EJ9 'D*B'1J1 'DE91AJ) 'D*J BE* (*HDJ/G' H-A8G' 9(1 EF5) E3'1J.' : 'All the cognitive reports you generated and securely saved on Masari.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><BrainCircuit className="w-16 h-16 animate-pulse" /></div>
      ) : reports.length === 0 ? (
        <div className="bg-theme-secondary border-4 border-theme p-12 rounded-[2.5rem] shadow-brutal text-center">
           <FileText className="w-24 h-24 mx-auto mb-6 opacity-20" />
           <h3 className="text-2xl font-black">{isAr ? 'D' *H,/ *B'1J1 E-AH8)' : 'No Saved Artifacts'}</h3>
           <p className="mt-2 opacity-70">{isAr ? ''3*./E #/H'* 'D0C'! 'D'57F'9J H'6:7 9DI 21 'D-A8 D*,/G' GF'.' : 'Use AI tools and hit the Save button to store reports here.'}</p>
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
                {isAr ? '*-EJD CEDA F5J' : 'Download Txt'}
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
    showToast(isAr ? '*E *A9JD ('B) 'D(1H! #6AF' DC 100 FB7) =ï¿½' : 'Upgraded to Bro Plan! +100 Credits =ï¿½');
  };
  
  const handleSelectFree = () => {
    const updated = {
      ...userProfile,
      subscriptionTier: 'free'
    };
    setUserProfile(updated);
    onSaveProfile(updated);
    showToast(isAr ? '#F* 'D"F 9DI 'D('B) 'DE,'FJ) 'D#3'3J).' : 'You are currently on the Free Basic Plan.');
  };

  const handleBuyPoints = () => {
    const amount = Number(selectedPackPoints);
    const updated = {
      ...userProfile,
      points: (userProfile.points || 0) + amount
    };
    setUserProfile(updated);
    onSaveProfile(updated);
    showToast(isAr ? `*E 4-F ${amount} FB7) (F,'-!` : `Successfully fueled profile with ${amount} points!`);
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 max-w-[1200px] mx-auto text-theme-primary">
      <button onClick={() => setPage('home')} className="clickable-card mb-8 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors px-4 py-2 border-2 border-transparent hover:border-theme rounded-full">
        {isAr ? <ArrowRight className="w-6 h-6"/> : <ArrowLeft className="w-6 h-6"/>} 
        {isAr ? ''D9H/) DD1&J3J)' : 'Back to Home'}
      </button>

      <div className="text-center mb-16 space-y-4">
        <h2 className={`text-5xl md:text-7xl font-black ${isAr ? 'font-display-ar' : 'font-display-en'}`}>
          {isAr ? ''D'4*1'C'* H'DHBH/ 'D0CJ' : 'Fuel Your Future'}
        </h2>
        <p className="text-xl opacity-70 max-w-2xl mx-auto">
          {isAr 
            ? ''.*1 ('B*C 'DEA6D) #H '4-F 15J/ FB'7C D'3*./'E HCD'! 'D(-+ 'DE('41 HEB'JJ3 'DB(HD 'D0CJ.'
            : 'Choose your tier or acquire micro-credits below to trigger real-time grounded research engines.'}
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-peach)] text-black rounded-full border-4 border-black font-black text-lg shadow-[4px_4px_0_#000]">
          <Coins className="w-6 h-6 text-yellow-600 animate-spin-slow" />
          <span>
            {isAr 
              ? `15J/C 'D-'DJ: ${userProfile.points || 0} FB7) | ('B*C: ${userProfile.subscriptionTier === 'bro' ? '(1H' : 'E,'FJ)'}` 
              : `Balance: ${userProfile.points || 0} Credits | Tier: ${userProfile.subscriptionTier === 'bro' ? 'Bro' : 'Free'}`}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-12">
        
        <div className="bg-theme-secondary border-4 border-black p-8 rounded-[2.5rem] shadow-brutal flex flex-col justify-between relative text-theme-primary">
          <div>
            <span className="text-xs uppercase font-black px-4 py-1.5 bg-gray-200 text-black rounded-full border-2 border-black inline-block">
              {isAr ? '#3'3J' : 'BASIC'}
            </span>
            <h3 className="text-3xl font-black mt-6 mb-2">{isAr ? ''D('B) 'DE,'FJ)' : 'Free Plan'}</h3>
            <div className="text-4xl font-black mb-6">$0 <span className="text-sm opacity-80">/ {isAr ? 'E,'FJ DD#(/' : 'forever'}</span></div>
            <ul className="space-y-4 font-bold border-t-4 border-black/20 pt-6 text-base opacity-80">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" /> {isAr ? ''DH5HD DD#/H'* 'DE,'FJ) (,'G2J))' : 'Access to free diagnostics (Readiness)'}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" /> {isAr ? '/A9 FB'7 DD#/H'* 'DE*B/E)' : 'Pay-per-use credits for premium tools'}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" /> {isAr ? '-A8 (7'B) 'DGHJ)' : 'Save standard persona card'}</li>
            </ul>
          </div>
          <button 
            onClick={handleSelectFree}
            disabled={userProfile.subscriptionTier === 'free'}
            className="mt-8 w-full py-4 bg-gray-200 text-black font-black text-lg rounded-full border-4 border-black hover:bg-gray-300 transition-colors shadow-brutal disabled:opacity-50"
          >
            {userProfile.subscriptionTier === 'free' ? (isAr ? '('B*C 'D-'DJ)' : 'Current Plan') : (isAr ? ''.*J'1' : 'Select')}
          </button>
        </div>

        <div className="bg-[var(--accent-lilac)] border-4 border-black p-8 rounded-[2.5rem] shadow-brutal-lg flex flex-col justify-between relative text-black transform lg:-translate-y-4 z-10">
          <div className="absolute -top-4 right-6 bg-[var(--accent-coral)] text-black border-4 border-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest animate-pulse shadow-[2px_2px_0_#000]">
            {isAr ? ''D#C+1 '.*J'1'K' : 'Most Popular'}
          </div>
          <div>
            <span className="text-xs uppercase font-black px-4 py-1.5 bg-white text-black rounded-full border-2 border-black inline-block">
              {isAr ? '*1BJ) 31J9)' : 'PREMIUM LITE'}
            </span>
            <h3 className="text-4xl font-black mt-6 mb-2">{isAr ? '('B) 'D(1H' : 'Bro Plan'}</h3>
            <div className="text-5xl font-black mb-6">$5 <span className="text-sm opacity-80">/ {isAr ? '4G1J'K' : 'month'}</span></div>
            <ul className="space-y-4 font-bold border-t-4 border-black/20 pt-6 text-base">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" /> {isAr ? 'a`` FB7) **,// 4G1J'K' : '100 Monthly Credits'}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" /> {isAr ? '#HDHJ) DE9'D,) 'D0C'! 'D'57F'9J' : 'Priority AI Engine Processing'}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" /> {isAr ? '(-+ %F*1F* -J 9(1 'D%6'A'*' : 'Live Internet Search Plugins'}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" /> {isAr ? '(7'B) GHJ) FJH(1H*'DJ) A'&B)' : 'Premium UI Persona Export'}</li>
            </ul>
          </div>
          <button 
            onClick={handleUpgradeToBro}
            className="mt-8 w-full py-4 bg-black text-white font-black text-lg rounded-full border-4 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors shadow-brutal"
          >
            {isAr ? ''4*1C (@ $5 4G1J'K =ï¿½' : 'Upgrade for $5/mo =ï¿½'}
          </button>
        </div>

        <div className="bg-[var(--accent-mint)] border-4 border-black p-8 rounded-[2.5rem] shadow-brutal flex flex-col justify-between text-black">
          <div>
            <span className="text-xs uppercase font-black px-4 py-1.5 bg-white text-black rounded-full border-2 border-black inline-block">
              {isAr ? '4-F AH1J' : 'TOP-UP'}
            </span>
            <h3 className="text-3xl font-black mt-6 mb-2">{isAr ? '('B'* 'DFB'7' : 'Credit Packs'}</h3>
            <p className="font-semibold text-sm opacity-80 mb-6">
              {isAr 
                ? '*-*', 'DE2J/ EF 'D#(-'+ '4*1P FB'7'K E*I #1/*.'
                : 'Need more juice? Top up your credits anytime.'}
            </p>

            <div className="space-y-4 bg-white/50 border-4 border-black p-4 rounded-2xl mb-4">
              <label className="block text-sm font-black">{isAr ? ''.*1 'DCEJ):' : 'Volume:'}</label>
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
                <span>{isAr ? ''D391:' : 'Total:'}</span>
                <span className="text-[var(--accent-coral)] text-2xl drop-shadow-[1px_1px_0_#000]">${pointPacks[selectedPackPoints]?.price}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleBuyPoints}
            className="mt-2 w-full py-4 bg-white text-black font-black text-lg rounded-full border-4 border-black hover:bg-black hover:text-white transition-colors shadow-brutal"
          >
            {isAr ? `41'! ${selectedPackPoints} FB7)` : `Buy ${selectedPackPoints} Credits`}
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
          className={`clickable-card text-4xl cursor-pointer flex items-center gap-2 text-theme-primary ${isAr ? 'font-display-ar' : 'font-display-en italic font-black'}`}
        >
          <DecorativeStar className="w-8 h-8 text-[var(--accent-coral)] animate-spin-slow" />
          {isAr ? 'E3'1J' : 'Masari'}
        </div>
      </Magnetic>
      
      <div className="flex items-center gap-2 md:gap-4 bg-theme-primary/90 backdrop-blur-md px-4 py-2 rounded-full border-4 border-theme shadow-brutal text-theme-primary transition-colors">
        
        <Magnetic strength={0.3}>
          <button onClick={toggleLang} className="clickable-card flex items-center gap-2 font-black text-sm uppercase hover:text-[var(--accent-coral)] transition-colors py-2 px-2">
            <Globe className="w-4 h-4" />
            <span>{isAr ? 'EN' : '91(J'}</span>
          </button>
        </Magnetic>
        
        <div className="w-px h-6 bg-theme-primary border-r-2 border-theme opacity-30"></div>

        <Magnetic strength={0.3}>
          <button onClick={toggleTheme} className="clickable-card flex items-center gap-2 font-black text-sm hover:text-[var(--accent-peach)] transition-colors py-2 px-2">
            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            <span className="hidden md:inline">{theme === 'dark' ? (isAr ? 'E6J!' : 'Light') : (isAr ? 'E8DE' : 'Dark')}</span>
          </button>
        </Magnetic>

        <div className="w-px h-6 bg-theme-primary border-r-2 border-theme opacity-30"></div>
        
        {userProfile.isLoggedIn && (
          <>
            <Magnetic strength={0.3}>
              <button onClick={() => setPage('persona_card')} className="clickable-card flex items-center gap-2 font-black text-sm hover:text-[var(--accent-mint)] transition-colors py-2 px-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden md:inline">{isAr ? '(7'B*J' : 'My ID'}</span>
              </button>
            </Magnetic>
            <div className="w-px h-6 bg-theme-primary border-r-2 border-theme opacity-30"></div>
          </>
        )}

        <Magnetic strength={0.3}>
          <button onClick={toggleMenu} className="clickable-card font-black text-sm hover:text-[var(--accent-lilac)] transition-colors py-2 px-2 flex items-center gap-2">
            <Menu className="w-5 h-5" />
            <span className="hidden md:inline">{isAr ? ''DB'&E)' : 'Menu'}</span>
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
        <h1 className={`text-giant text-theme-primary mb-4 ${isAr ? 'font-display-ar' : 'font-display-en italic'}`}>
          {isAr ? 'E3'1J.' : 'Masari.'}
        </h1>
        
        <div className="flex items-center gap-6 md:gap-12 flex-wrap justify-center">
           <TrackingEye mouseX={mouseX} mouseY={mouseY} />
           <h1 className={`text-giant text-theme-primary ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
             {isAr ? 'EO5EE (0C'!' : 'Decoded'}
           </h1>
        </div>
        
        <p className="mt-12 text-xl md:text-2xl font-semibold max-w-2xl mx-auto text-theme-primary opacity-80 leading-relaxed">
          {isAr 
            ? 'EF5) FJH(1H*'DJ) D*5EJE E3'1C 'D,'E9J H'DEGFJ E/9HE) ((-+ 'D%F*1F* 'DE('41 HEBJ'3 'DEJHD 'DFA3J 'D*A'9DJ.' 
            : 'A premium, neobrutalist career decoder. Map high-paying targets, expected 2026 salaries, and structure printable credentials.'}
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
                  <span>{isAr ? ''D.7) 'D#C'/JEJ) (7'D()' : 'Academic Planner (Student)'}</span>
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
                <span>{isAr ? ''D.7) 'DEGFJ) (.1J,/EH8A)' : 'Professional Suite (Pro)'}</span>
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
    { id: 'tool_career_test', num: '01', titleAr: ''D'.*J'1 'D4'ED DD*.55', titleEn: 'Career Blueprint (50 Qs)', descAr: '-// 'D*.55 (/B) ('.*('1 E*B/E 50 3$'D.', descEn: 'Robust 50-Question matching test mapping 100 majors.', points: 0, color: 'bg-[var(--accent-peach)]', span: 'span-2', icon: <BrainCircuit className="bento-bg-icon" /> },
    { id: 'tool_ready_test', num: '02', titleAr: ','G2J) '.*J'1 'D*.55', titleEn: 'Readiness Check (10 Qs)', descAr: 'EBJ'3 10 #3&D) DE91A) E/I '3*9/'/C.', descEn: 'A fast 10-question evaluation of your readiness.', points: 0, color: 'bg-[var(--accent-mint)]', span: 'span-2', icon: <Activity className="bento-bg-icon" /> },
    { id: 'tool_calculator', num: '03', titleAr: '*1*J( 1:('* 'DB(HD', titleEn: 'Weighted Admission Engine', descAr: '-3'( 'DF3() 'DEH2HF) DD*.55'* 'D39H/J).', descEn: 'Calculate and match your weighted placement in KSA.', points: 0, color: 'bg-[var(--accent-lilac)]', span: 'span-2', icon: <Calculator className="bento-bg-icon" /> },
    { id: 'tool_curriculum', num: '04', titleAr: 'E3'1C 'D*9DJEJ', titleEn: 'Curriculum Blueprint', descAr: '.7) /1'3J) *A5JDJ) E/9HE) ('D0C'! 'D'57F'9J.', descEn: 'AI-generated curriculum breakdown for your degree.', points: 20, color: 'bg-[var(--accent-yellow)]', icon: <BookOpen className="bento-bg-icon" /> },
    { id: 'tool_job_titles', num: '05', titleAr: ''DE3EJ'* 'DH8JAJ)', titleEn: 'Career Titles', descAr: ''DH8'&A 'DE*'-) D*.55C (/B).', descEn: 'Exact titles eligible for your target major.', points: 10, color: 'bg-[var(--accent-coral)]', icon: <Briefcase className="bento-bg-icon" /> },
    { id: 'tool_university_directory', num: '06', titleAr: '/DJD 'D,'E9'* 'D0CJ', titleEn: 'AI University Directory', descAr: '/DJD 'D,'E9'* 'D39H/J) H'D(-+ 'D/HDJ.', descEn: 'KSA Universities & Global AI Search.', points: 10, color: 'bg-[var(--accent-peach)]', span: 'span-2', icon: <Globe className="bento-bg-icon" /> },
    { id: 'tool_important_courses', num: '07', titleAr: '/H1'* *.55C', titleEn: 'Core Certifications', descAr: '#GE 'D4G'/'* 'DE7DH() D/9E 'D*.55.', descEn: 'Top micro-degrees to support your academic path.', points: 5, color: 'bg-white', icon: <Award className="bento-bg-icon" /> },
    { id: 'tool_graduation_ideas', num: '08', titleAr: 'E4'1J9 'D*.1,', titleEn: 'Capstone Ideas', descAr: '#AC'1 E4'1J9 E(*C1) B'(D) DD*3HJB.', descEn: 'Brainstorm scalable capstone projects.', points: 5, color: 'bg-[var(--accent-yellow)]', icon: <Compass className="bento-bg-icon" /> },
    { id: 'tool_ai_jobs_salary', num: '09', titleAr: ''D1H'*( 'D-J) ('D%F*1F*)', titleEn: 'Live Salary Search', descAr: 'E2'EF) 1H'*( 'D3HB EF (-+ 'DHJ(.', descEn: 'Scrapes live salaries using grounded Web Search.', points: 15, color: 'bg-[var(--accent-mint)]', span: 'span-2', icon: <Search className="bento-bg-icon" /> },
    { id: 'tool_roi', num: '10', titleAr: ''D9'&/ 'D'3*+E'1J', titleEn: 'Post-grad ROI', descAr: '*-DJD FB7) 'D*9'/D 'DE'DJ.', descEn: 'Analyze financial break-even.', points: 0, color: 'bg-[var(--accent-lilac)]', icon: <TrendingUp className="bento-bg-icon" /> },
    { id: 'tool_ai', num: '11', titleAr: ''DE3*4'1 'D0CJ', titleEn: 'AI Career Counselor', descAr: 'E-'/+) 0CJ) D-D E4CD'*C 'DEGFJ).', descEn: 'Conversational assistant for deep guidance.', points: 10, color: 'bg-[var(--accent-coral)]', icon: <Bot className="bento-bg-icon" /> }
  ];

  const proFeatures = [
    { id: 'tool_job_titles', num: '01', titleAr: ''DE3EJ'* 'DEGFJ)', titleEn: 'Professional Titles', descAr: 'H8'&A E,'DC H3HB 'D9ED.', descEn: 'Verify exact organizational mappings.', points: 10, color: 'bg-[var(--accent-peach)]', icon: <Layers className="bento-bg-icon" /> },
    { id: 'tool_salary', num: '02', titleAr: 'FEH 'D1H'*(', titleEn: 'Salary Curve', descAr: '*-DJD */1, FEH #,1C E9 3FH'* 'D.(1).', descEn: 'Visualize precise salary scaling metrics.', points: 15, color: 'bg-[var(--accent-mint)]', span: 'span-2', icon: <TrendingUp className="bento-bg-icon" /> },
    { id: 'tool_important_courses', num: '03', titleAr: '4G'/'* 'D*1BJ', titleEn: 'Upskilling Certifications', descAr: '#GE 'D4G'/'* DD*7HJ1 'DEGFJ.', descEn: 'Identify certifications to secure higher tiers.', points: 5, color: 'bg-[var(--accent-yellow)]', icon: <Award className="bento-bg-icon" /> },
    { id: 'tool_career_pivot', num: '04', titleAr: '*:JJ1 'DE3'1', titleEn: 'Career Pivot Roadmap', descAr: '*-DJD 4'ED DD'F*B'D 'DEGFJ.', descEn: 'Establish step-by-step transition roadmaps.', points: 15, color: 'bg-[var(--accent-lilac)]', span: 'span-2', icon: <Compass className="bento-bg-icon" /> },
    { id: 'tool_ai_jobs_salary', num: '05', titleAr: '(-+ 1H'*( -J ('D%F*1F*)', titleEn: 'Live Salary Search', descAr: 'E2'EF) 1H'*( 'D3HB EF (-+ 'DHJ(.', descEn: 'Scrapes live salaries using grounded Web Search.', points: 15, color: 'bg-[var(--accent-coral)]', span: 'span-2', icon: <Search className="bento-bg-icon" /> },
    { id: 'tool_job_hunt', num: '06', titleAr: ''DA15 'D4':1) -J'K', titleEn: 'Live Open Opportunities', descAr: ''3*C4A A15 'D*H8JA 'DE*'-) 'D"F.', descEn: 'Custom, grounded list of hiring companies.', points: 20, color: 'bg-[var(--accent-mint)]', span: 'span-2', icon: <Briefcase className="bento-bg-icon" /> },
    { id: 'tool_define_roadmap', num: '07', titleAr: '*.7J7 'D#G/'A', titleEn: 'Define Custom Milestones', descAr: '*H5J'* 'D0C'! 'D'57F'9J D*,'H2 'D9B('*.', descEn: 'Plot realistic promotional steps.', points: 20, color: 'bg-white', icon: <Activity className="bento-bg-icon" /> },
    { id: 'tool_ai', num: '08', titleAr: ''DE3*4'1 'D0CJ', titleEn: 'AI Career Counselor', descAr: 'E-'/+) 0CJ) D-D E4CD'*C 'DEGFJ).', descEn: 'Conversational assistant for deep guidance.', points: 10, color: 'bg-[var(--accent-lilac)]', span: 'span-3', icon: <Bot className="bento-bg-icon" /> },
    { id: 'tool_roi', num: '09', titleAr: ''D9'&/ 'D'3*+E'1J', titleEn: 'Post-grad ROI', descAr: '*-DJD FB7) 'D*9'/D 'DE'DJ.', descEn: 'Analyze financial break-even.', points: 0, color: 'bg-[var(--accent-peach)]', icon: <TrendingUp className="bento-bg-icon" /> }
  ];

  const activeFeatures = isStudent ? studentFeatures : proFeatures;

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 max-w-[1400px] mx-auto text-theme-primary">
      <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <Magnetic strength={0.2} className="mb-8">
            <button onClick={() => setPage('home')} className="clickable-card flex items-center gap-2 font-bold text-lg hover:text-[var(--accent-coral)] transition-colors px-4 py-2 border-2 border-transparent hover:border-theme rounded-full">
              {isAr ? <ArrowRight className="w-6 h-6"/> : <ArrowLeft className="w-6 h-6"/>} 
              {isAr ? ''D9H/) DD1&J3J)' : 'Back to Home'}
            </button>
          </Magnetic>
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <h2 className={`text-5xl md:text-7xl ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
              {isStudent ? (isAr ? '#/H'* 'D7'D( H'DB(HD' : 'Student & Admission') : (isAr ? '#/H'* 'DEH8A H'DE-*1AJF' : 'Pro Suite Tools')}
            </h2>
          </div>
          <p className="text-xl font-medium opacity-70 max-w-xl mt-4">
            {isAr 
              ? 'E,EH9) E*C'ED) EF #/H'* 'D*ECJF 'DEGFJ E5EE) (GF/3) FJH(1H*'DJ) /BJB).' 
              : 'Execute premium academic and career diagnostic engines using secure web grounding.'}
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
                    <span className="relative z-10">{feat.points === 0 ? (isAr ? 'E,'FJ' : 'FREE') : `${feat.points} ${isAr ? 'FB7)' : 'Pts'}`}</span>
                  </span>
                </div>
                <h3 className={`text-2xl font-black mb-3 ${isAr ? 'font-display-ar' : 'font-display-en'}`}>
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
      
      const langInst = isAr ? 'MUST WRITE ENTIRELY IN ARABIC. DO NOT USE ENGLISH.' : 'MUST WRITE IN ENGLISH.';
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
            {isAr ? ''D9H/) DD#/H'*' : 'Back to Tools'}
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
              {loading ? (isAr ? ','1J 'D*-DJD 'DE91AJ...' : 'Processing Request...') : (isAr ? toolConfig.btnAr : toolConfig.btnEn)}
            </button>

            {output && (
              <div className="mt-8 page-enter border-t-4 border-black pt-8">
                {toolConfig.visualGraph && toolConfig.visualGraph(output)}
                <NeoMarkdown text={output} />
                
                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={handleDownload} className="py-4 px-6 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-brutal-hover">
                    <Download className="w-5 h-5" />
                    {isAr ? '*-EJD CEDA F5J' : 'Download Txt'}
                  </button>
                  <button onClick={() => saveReport(isAr ? toolConfig.titleAr : toolConfig.titleEn, output)} className="py-4 px-6 bg-[var(--accent-mint)] border-2 border-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--accent-lilac)] transition-colors shadow-brutal-hover">
                    <Save className="w-5 h-5" />
                    {isAr ? '-A8 AJ -3'(J' : 'Save to Artifacts'}
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
      showToast(isAr ? 'DJ3 D/JC FB'7 C'AJ) D(-+ 'D0C'! 'D'57F'9J (5 FB'7)' : 'Insufficient points for AI Search (5 Pts)');
      return;
    }

    if (userProfile.subscriptionTier !== 'bro') {
      const updated = { ...userProfile, points: userProfile.points - 5 };
      setUserProfile(updated);
      onSaveProfile(updated);
      showToast(isAr ? '*E .5E 5 FB'7 D(-+ 'D0C'! 'D'57F'9J 'D/HDJ' : 'Deducted 5 credits for AI International Search');
    }

    setLoading(true);
    const langInst = isAr ? 'MUST WRITE ENTIRELY IN ARABIC. DO NOT USE ENGLISH.' : 'MUST WRITE IN ENGLISH.';
    const systemPrompt = `You are a global academic registrar. Use web search plugins to find the most up-to-date admission requirements. You MUST format the output exactly as follows: \n1. University Name\n2. QS Ranking & Times Higher Education (THE) Ranking\n3. Minimum GPA & Test Requirements\n4. Acceptance Rate Estimate\n5. Top Ranked Programs. \nUse Markdown lists and tables. ${langInst}`;
    const query = `Search the internet and provide structured admission criteria, tuition, rankings, and top programs for: ${searchQuery}. Show in Markdown.`;
    const fallback = isAr ? `### /DJD 'DB(HD D@ ${searchQuery}\n\n- D' **HA1 E9DHE'* /BJB) -'DJ'K J1,I 'D*-BB EF 'DEHB9 'D13EJ.` : `### Admissions benchmarks for ${searchQuery}\n\n- Data unavailable. Please check the official university website.`;
    
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
          {isAr ? ''D9H/) DD#/H'*' : 'Back to Tools'}
        </button>

        <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
           <div>
             <h3 className="text-4xl md:text-5xl font-black mb-4">{isAr ? '/DJD 'D,'E9'* H'DB(HD' : 'University Directory'}</h3>
             <p className="font-bold opacity-70 max-w-xl">{isAr ? ''3*C4A #C(1 B'9/) (J'F'* DD,'E9'* 'D39H/J) H*5FJA'*G' 'D9'DEJ) (QS/THE) #H '(-+ 9'DEJ'K ('D0C'! 'D'57F'9J.' : 'Explore the largest KSA university database with global QS/THE rankings, or use AI for custom international searches.'}</p>
           </div>
           <Building2 className="w-20 h-20 text-[var(--accent-lilac)] opacity-40" />
        </div>
        
        {/* FREE Saudi Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 bg-[var(--accent-mint)] border-2 border-black font-black text-xs rounded-full shadow-[2px_2px_0_#000] free-badge">{isAr ? 'E,'FJ' : 'FREE'}</div>
            <h4 className="text-2xl font-bold">{isAr ? ''D,'E9'* 'D39H/J) H'D*5FJA'*:' : 'Major Saudi Universities & Rankings:'}</h4>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-4 w-5 h-5 opacity-50 rtl:right-4 rtl:left-auto" />
                <input 
                  type="text" value={localSearch} onChange={e => setLocalSearch(e.target.value)}
                  placeholder={isAr ? ''(-+ 9F ,'E9)...' : 'Search local university...'}
                  className="w-full bg-theme-primary border-4 border-black p-3 pl-12 rtl:pr-12 rtl:pl-4 rounded-xl font-bold focus:bg-[var(--accent-yellow)] transition-colors"
                />
             </div>
             <div className="flex flex-wrap gap-2">
               {['All', 'Public', 'Private', 'Top 500 QS'].map(f => (
                 <button 
                   key={f} onClick={() => setFilterType(f)}
                   className={`px-4 py-3 rounded-xl border-2 border-black font-bold text-sm transition-all shadow-[2px_2px_0_#000] ${filterType === f ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                 >
                   {f === 'All' ? (isAr ? ''DCD' : 'All') : f === 'Public' ? (isAr ? '-CHEJ' : 'Public') : f === 'Private' ? (isAr ? '#GDJ' : 'Private') : (isAr ? '#A6D 500 QS' : 'Top 500 QS')}
                 </button>
               ))}
             </div>
          </div>

          {filteredUnis.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center bg-theme-primary border-4 border-black rounded-3xl border-dashed">
               <Globe className="w-16 h-16 opacity-20 mb-4 animate-spin-slow" />
               <p className="font-bold text-xl">{isAr ? 'DE F,/ F*'&, E7'(B) D(-+C 'DE-DJ.' : 'No matching local universities found.'}</p>
               <p className="opacity-70 font-semibold">{isAr ? ',1( '3*./'E 'D(-+ 'D/HDJ ('D0C'! 'D'57F'9J ('D#3AD.' : 'Try using the Global AI Search below.'}</p>
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
                             <span>"</span>
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
                        <span>{isAr ? '59H() 'DB(HD' : 'Acceptance Difficulty'}</span>
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
                       {expandedId === uni.id ? (isAr ? '%.A'! 'D*A'5JD' : 'Hide Details') : (isAr ? '916 E*7D('* 'DB(HD' : 'View Admission Requirements')}
                       {expandedId === uni.id ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                     </button>
                     
                     {expandedId === uni.id && (
                       <div className="p-5 bg-white border-t-2 border-dashed border-black page-enter space-y-4">
                         <div>
                           <span className="text-xs font-black opacity-50 uppercase tracking-widest block mb-1">{isAr ? ''DF3() 'DEH2HF) DDA12:' : 'Weighted Criteria:'}</span>
                           <div className="font-mono text-sm font-bold bg-[var(--bg-primary)] p-2 rounded border-2 border-black inline-block">{uni.req}</div>
                         </div>
                         <div>
                           <span className="text-xs font-black opacity-50 uppercase tracking-widest block mb-1">{isAr ? ''DE3'1'* 'D#C'/JEJ) 'D('12):' : 'Prominent Academic Tracks:'}</span>
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
            <h4 className="text-2xl font-bold">{isAr ? '(-+ 'D,'E9'* 'D/HDJ) H'DE.55) ('D0C'! 'D'57F'9J:' : 'AI Global/Custom University Search:'}</h4>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'E+'D: ,'E9) G'1A'1/ #H MIT' : 'e.g. Harvard University or MIT'}
              className="flex-1 bg-white border-4 border-black p-5 rounded-2xl font-bold text-xl"
            />
            <button 
              onClick={handleAISearch} disabled={loading}
              className="py-5 px-8 bg-black text-white border-4 border-transparent font-black text-xl rounded-2xl shadow-brutal-hover disabled:opacity-50 transition-all flex items-center justify-center gap-3"
            >
              <Globe className="w-6 h-6" />
              {loading ? (isAr ? ','1J 'D(-+ 9'DEJ'K...' : 'Searching Global...') : (isAr ? '(-+ /HDJ E/9HE ('D0C'!' : 'DeepSearch Global')}
            </button>
          </div>

          {result && (
            <div className="mt-8 page-enter border-t-4 border-black pt-8">
              <NeoMarkdown text={result} />
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleDownload} className="py-4 px-6 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-brutal-hover">
                  <Download className="w-5 h-5" />
                  {isAr ? '*-EJD CEDA F5J' : 'Download Txt'}
                </button>
                <button onClick={() => saveReport(isAr ? `/DJD: ${searchQuery}` : `Directory: ${searchQuery}`, result)} className="py-4 px-6 bg-[var(--accent-mint)] border-2 border-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--accent-lilac)] transition-colors shadow-brutal-hover">
                  <Save className="w-5 h-5" />
                  {isAr ? '-A8 AJ -3'(J' : 'Save to Artifacts'}
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
  titleAr: 'E3*C4A 'DE3'1 'D*9DJEJ DE3*B(DC', titleEn: 'Future Educational Path Blueprint',
  useProfilePersona: true, hasInput2: false,
  ph1Ar: '#/.D 'D*.55 'DE3*G/A (E+'D: GF/3) (1E,J'*)', ph1En: 'Enter target major (e.g. Software Engineering)',
  btnAr: '*HDJ/ 'D.7) 'D/1'3J)', btnEn: 'Generate Blueprint',
  btnColor: 'bg-[var(--accent-lilac)]', icon: <Sparkles className="w-6 h-6" />,
  systemRole: "You are a senior academic director at Masari. Provide a comprehensive 4-year curriculum path and major skill roadmap.",
  buildQuery: (i1) => `Create a 4-year master curriculum map with important courses and milestone certifications for a major in ${i1}. Format with clear Markdown.`,
  fallbackAr: "### .7) E3'1 /1'3J\n\n- **'D3F) 'D#HDI:** #3'3J'*\n- **'D3F) 'D+'FJ):** GJ'CD 'D(J'F'*", fallbackEn: "### Curriculum Roadmap\n\n- **Year 1:** Basics\n- **Year 2:** Intermediates",
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
  titleAr: ''DE3EJ'* 'DH8JAJ) H.1J7) 3HB 'D9ED', titleEn: 'Career Titles Mapping',
  useProfilePersona: true, hasInput2: false,
  ph1Ar: '#/.D 'DE,'D #H 'D*.55 'DEA6D', ph1En: 'Enter major or industry domain',
  btnAr: ''C*4'A 'DE3EJ'* 'DH8JAJ)', btnEn: 'Generate Job Titles',
  btnColor: 'bg-[var(--accent-yellow)]', icon: <Layers className="w-6 h-6" />,
  systemRole: "You are an elite talent recruiter. Provide an detailed list of eligible jobs/titles and standard starting salaries.",
  buildQuery: (i1) => `Provide a comprehensive list of corporate job titles, operational responsibilities, and key metrics for anyone studying ${i1}.`,
  fallbackAr: "### E3EJ'* H8JAJ)\n\n1. EGF/3 F8E (1E,J'*", fallbackEn: "### Standard Job Titles\n\n1. Cloud Infrastructure Architect"
});

const ToolImportantCourses = createAIToolComponent({
  titleAr: ''D/H1'* H'D4G'/'* 'DEGFJ) 'DE9*E/)', titleEn: 'Upskilling & Core Certifications',
  useProfilePersona: true, hasInput2: false,
  ph1Ar: '#/.D *.55C #H E,'DC', ph1En: 'Enter your major or target domain',
  btnAr: '#8G1 'D4G'/'* 'DEGFJ)', btnEn: 'Unlock Industry Certifications',
  btnColor: 'bg-[var(--accent-coral)]', textColor: 'text-white', icon: <Award className="w-6 h-6" />,
  systemRole: "You are a senior technical training manager. Suggest the top professional industry certificates and micro-degrees.",
  buildQuery: (i1) => `Provide 5 specific industry-standard certifications and upskilling courses for a professional in ${i1}. Format with description.`,
  fallbackAr: "### 4G'/'* E9*E/)\n\n1. **AWS Certified**", fallbackEn: "### Highly Recommended\n\n1. **AWS Certified**"
});

const ToolCareerPivot = createAIToolComponent({
  titleAr: 'E3*4'1 *:JJ1 'DE3'1 'DEGFJ', titleEn: 'Career Transition Blueprint',
  useProfilePersona: false, hasInput2: true,
  ph1Ar: 'E,'DC 'D-'DJ (E+'D: ./E) 9ED'!)', ph1En: 'Your current role or domain (e.g. Customer Support)',
  ph2Ar: ''DE,'D 'DE3*G/A (E+'D: E-DD (J'F'*)', ph2En: 'Your target role or domain (e.g. Data Analyst)',
  btnAr: '%F4'! .'17) 'D71JB', btnEn: 'Generate Transition Roadmap',
  btnColor: 'bg-[var(--accent-lilac)]', icon: <Compass className="w-6 h-6" />,
  systemRole: "You are a career change counselor. Map out transferrable skills and professional transitioning steps.",
  buildQuery: (i1, i2) => `Create a specific 6-month career transition blueprint moving from ${i1} to ${i2}. Format in Markdown with bullet items.`,
  fallbackAr: "### .'17) 71JB D*:JJ1 'DE3'1\n\n- **'D4G1 'D#HD:** /1'3) 'DEG'1'*", fallbackEn: "### 6-Month Pivot Roadmap\n\n- **Month 1:** Identify transferrable assets."
});

const ToolDefineRoadmap = createAIToolComponent({
  titleAr: '*.7J7 'D#G/'A H'DEF'5( 'D9DJ'', titleEn: 'Plot Promotional Milestones',
  useProfilePersona: false, hasInput2: false,
  ph1Ar: 'E' GH EF5(C 'DE3*G/A (E+'D: E/J1 *BFJ CTO)', ph1En: 'What is your ultimate career goal? (e.g. Chief Technology Officer)',
  btnAr: '*.7J7 'D#G/'A 'D'3*1'*J,J)', btnEn: 'Generate Milestones',
  btnColor: 'bg-[var(--accent-mint)]', icon: <Activity className="w-6 h-6" />,
  systemRole: "You are a world-class executive career architect. Define clear executive promotion levels and years required.",
  buildQuery: (i1) => `Create a granular 5-year promotional roadmap to achieve: ${i1}. Highlight operational KPIs.`,
  fallbackAr: "### .7) 'DH5HD\n\n- **'D3F) 1:** 'D*ECF 'DAFJ", fallbackEn: "### Promotional Roadmap\n\n- **Year 1:** High-impact output"
});

const ToolGraduationIdeas = createAIToolComponent({
  titleAr: '#AC'1 E4'1J9 'D*.1, 'DE$GD) DD3HB', titleEn: 'Marketable Capstone Project Ideas',
  useProfilePersona: true, hasInput2: false,
  ph1Ar: '#/.D *.55C 'D/1'3J', ph1En: 'Enter your study major',
  btnAr: '*HDJ/ #AC'1 E4'1J9', btnEn: 'Generate Project Proposals',
  btnColor: 'bg-[var(--accent-yellow)]', icon: <BrainCircuit className="w-6 h-6" />,
  systemRole: "You are a technical director of corporate incubation programs. Provide innovative, highly marketable graduation project proposals.",
  buildQuery: (i1) => `Provide 3 unique capstone or graduation projects ideas for a major in ${i1} that have high startup/commercial value.`,
  fallbackAr: "### #AC'1 E4'1J9\n\n1. F8'E 0C'! '57F'9J", fallbackEn: "### Capstone Proposals\n\n1. AI-Driven Engine"
});

const ToolJobHunt = createAIToolComponent({
  titleAr: ''DA15 'DH8JAJ) H'D*H8JA 'D-J', titleEn: 'Open Vacancies & Corporate Placements',
  useProfilePersona: true, hasInput2: true,
  ph1Ar: ''D*.55 #H 'DE3EI 'DEA6D', ph1En: 'Target Major or Title',
  ph2Ar: 'EG'1'*C 'D#3'3J)', ph2En: 'Your key skills',
  btnAr: ''D(-+ 9F A15 *H8JA F47)', btnEn: 'Unlock Opportunities',
  btnColor: 'bg-[var(--accent-mint)]', icon: <Briefcase className="w-6 h-6" />,
  systemRole: "You are a professional corporate placement assistant. Use duckduckgo and playwright plugins to search the internet (like LinkedIn) for current live active jobs and recommend major companies actively hiring this role.",
  buildQuery: (i1, i2) => `Search the web and provide a list of 5 leading corporate institutions and platforms currently recruiting individuals with a degree in ${i1} and skills in ${i2}.`,
  fallbackAr: "### #(12 'D,G'*\n\n- #1'ECH\n- 9DE", fallbackEn: "### Hiring Entities\n\n- Saudi Aramco\n- Elm",
  useSearchPlugins: true
});

// ================== Highly Custom Diagnostic Tools ==================
// ... existing code ...

const ToolCareerTest = ({ isAr, setPage, userContext, userProfile, setUserProfile, onSaveProfile, showToast }) => {
  const QUESTIONS = generate50Questions();
  const MAJORS = generate100Majors();

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [scores, setScores] = useState({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });

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
        R: { en: 'Realistic Craftsman', ar: ''D-1AJ 'DH'B9J 'D('19' },
        I: { en: 'Quantum Investigator', ar: ''DE-BB 'DCEJ H'DE-DD 'DA0' },
        A: { en: 'Avant-Garde Alchemist', ar: ''D.JEJ'&J 'DAFJ 'DE(*C1' },
        S: { en: 'Empathetic Catalyst', ar: ''DE-A2 'D%F3'FJ 'DE*9'7A' },
        E: { en: 'Unstoppable Visionary', ar: ''D1J'/J 'D7EH- 'DEDGE' },
        C: { en: 'Systems Architect', ar: 'EGF/3 'D#F8E) 'D/BJB)' }
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
          {isAr ? ''D9H/) DD#/H'*' : 'Back to Tools'}
        </button>
        
        <div className="mb-12">
          <h2 className={`text-5xl md:text-7xl mb-4 ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
            {isAr ? 'EBJ'3 'DE3'1 'DEGFJ 'D4'ED (e` 3$'D)' : 'Comprehensive Blueprint (50 Qs)'}
          </h2>
          <p className="text-xl font-bold opacity-70">
            {isAr ? 'J*E E7'(B) F*'&,C E9 #C+1 EF a`` *.55 ,'E9J /BJB.' : 'Your traits are mapped against 100 precise academic majors.'}
          </p>
        </div>

        {!results ? (
          <div className="bg-theme-secondary p-8 md:p-12 rounded-[3rem] border-4 border-theme shadow-brutal relative page-enter text-black">
            <div className="flex justify-between font-bold mb-2">
               <span>{isAr ? ''D*B/E' : 'Progress'}</span>
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
                <span className="font-bold opacity-60 text-sm md:text-base hidden md:block">{isAr ? 'D' #H'AB (4/)' : 'Strongly Disagree'}</span>
                {[1, 2, 3, 4, 5].map((val) => (
                  <div key={val} className="flex flex-col items-center gap-2">
                    <input 
                      type="radio" name="likert" className="likert-radio"
                      checked={answers[currentQ] === val}
                      onChange={() => handleAnswer(val)}
                    />
                  </div>
                ))}
                <span className="font-bold opacity-60 text-sm md:text-base hidden md:block">{isAr ? '#H'AB (4/)' : 'Strongly Agree'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="page-enter">
            
            {/* Visual RIASEC Bar Graph */}
            <div className="bg-theme-secondary p-8 rounded-[2.5rem] border-4 border-theme shadow-brutal mb-12 text-black">
              <h3 className="text-2xl font-black mb-6">{isAr ? '*H2J9 EJHDC 'DEGFJ) (RIASEC)' : 'Your Personality Distribution'}</h3>
              <div className="flex items-end gap-2 md:gap-4 h-48 border-b-4 border-black pb-2">
                {[
                  { k: 'R', c: 'bg-[var(--accent-peach)]', l: isAr ? 'H'B9J' : 'Realistic' },
                  { k: 'I', c: 'bg-[var(--accent-mint)]', l: isAr ? 'E-DD' : 'Investigative' },
                  { k: 'A', c: 'bg-[var(--accent-yellow)]', l: isAr ? 'AFJ' : 'Artistic' },
                  { k: 'S', c: 'bg-[var(--accent-lilac)]', l: isAr ? '',*E'9J' : 'Social' },
                  { k: 'E', c: 'bg-[var(--accent-coral)]', l: isAr ? '1J'/J' : 'Enterprising' },
                  { k: 'C', c: 'bg-black', l: isAr ? 'EF8E' : 'Conventional', t: 'text-white' }
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

            <h3 className="text-3xl font-black mb-8">{isAr ? '#A6D e *.55'* /BJB) E7'(B) DC:' : 'Top 5 Precision Matching Majors:'}</h3>
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
                    <div className={`text-5xl font-black text-[var(--accent-peach)] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] ${isAr ? 'font-display-ar' : 'font-display-en'}`}>{r.match}%</div>
                    <span className="opacity-70 font-bold uppercase text-sm tracking-wider">{isAr ? '*7'(B' : 'Match'}</span>
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
                {isAr ? '916 HE4'1C) GHJ*C 'DEGFJ)' : 'View & Share Career ID Card'}
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
    { ar: 'DB/ B1#* 9F E*7D('* 'D*.55'* 'D*J #AC1 (G' ('3*A'6).', en: 'I have extensively researched the curriculum of my target majors.' },
    { ar: '#9DE *E'E'K E' GJ 7(J9) 'DH8'&A 'D*J 3#9ED (G' (9/ 'D*.1,.', en: 'I know exactly what daily job tasks I will perform post-graduation.' },
    { ar: '#F' 9DI /1'J) (E*H37 'D1H'*( AJ 3HB 'D9ED DE,'DJ.', en: 'I am aware of the median salaries in the job market for my field.' },
    { ar: 'D/J .7) H'6-) D*7HJ1 EG'1'*J 'D*BFJ) H'DD:HJ) #+F'! 'D,'E9).', en: 'I have a clear plan to develop my technical/language skills during college.' },
    { ar: '#91A 'DA1HB'* 'D/BJB) (JF *.55J H'D*.55'* 'DE4'(G).', en: 'I know the nuanced differences between my major and similar ones.' },
    { ar: 'BE* ('D*-/+ E9 #4.'5 J9EDHF -'DJ'K AJ 'DE,'D 'D0J #7E- %DJG.', en: 'I have spoken with professionals currently working in my target field.' },
    { ar: '#91A *E'E'K CJA 3#H'2F (JF 'D/1'3) H'D-J') 'D4.5J).', en: 'I know exactly how I will balance studies and personal life.' },
    { ar: 'DB/ '3*C4A* 'D4G'/'* 'DEGFJ) 'DE7DH() 'D*J */9E 4G'/*J 'D,'E9J).', en: 'I explored the professional certificates needed to support my degree.' },
    { ar: 'D' #491 ('D6:7 EF 'D9'&D) #H 'DE,*E9 D'.*J'1 E3'1 E-//.', en: 'I do not feel pressured by family/society to pick a specific path.' },
    { ar: 'D/J 4:A -BJBJ 3J/A9FJ DD'3*E1'1 9F/ EH',G) 59H('* #C'/JEJ).', en: 'I have genuine passion that will push me through academic hardships.' }
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
      showToast(isAr ? '*E *BJJE E/I ,'G2J*C!' : 'Readiness evaluation complete!');
    }
  };

  const readinessPercent = Math.round((score / (READINESS_QUESTIONS.length * 10)) * 100);

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 relative text-theme-primary">
      <div className="max-w-[800px] mx-auto bg-theme-secondary border-4 border-black p-8 md:p-12 rounded-[2.5rem] shadow-brutal text-black">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? ''D9H/) DD#/H'*' : 'Back to Tools'}
        </button>

        <h3 className="text-4xl font-black mb-8">{isAr ? 'EBJ'3 'D'3*9/'/ 'D#C'/JEJ' : 'Academic Readiness Assessment'}</h3>
        
        {!finished ? (
          <div className="space-y-8 page-enter">
            <div className="flex justify-between font-bold text-sm opacity-60">
               <span>{isAr ? ''D*B/E' : 'Progress'}</span>
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
              <button onClick={() => handleAnswer(10)} className="py-4 bg-[var(--accent-mint)] border-4 border-black font-black text-lg rounded-xl shadow-brutal-hover">{isAr ? 'F9E *E'E'K' : 'Yes, absolutely'}</button>
              <button onClick={() => handleAnswer(5)} className="py-4 bg-[var(--accent-peach)] border-4 border-black font-black text-lg rounded-xl shadow-brutal-hover">{isAr ? '%DI -/ E'' : 'Somewhat'}</button>
              <button onClick={() => handleAnswer(2)} className="py-4 bg-[var(--accent-yellow)] border-4 border-black font-black text-lg rounded-xl shadow-brutal-hover">{isAr ? 'F'/1'K' : 'Rarely'}</button>
              <button onClick={() => handleAnswer(0)} className="py-4 bg-gray-200 border-4 border-black font-black text-lg rounded-xl shadow-brutal-hover">{isAr ? 'D' #(/'K' : 'Not at all'}</button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8 page-enter">
            <h4 className="text-3xl font-bold">{isAr ? 'E9/D ,'G2J*C H1$J*C 'D#C'/JEJ) GH:' : 'Your Vision & Readiness Score:'}</h4>
            <div className="text-8xl font-black text-[var(--accent-coral)] drop-shadow-[4px_4px_0_#000]">{readinessPercent}%</div>
            <p className="font-bold text-xl bg-theme-primary p-6 rounded-2xl border-4 border-black">
              {readinessPercent >= 80 
                ? (isAr ? 'EE*'2! #F* E3*9/ *E'E'K HD/JC 1$J) +'B().' : 'Excellent! You have a highly concrete vision.')
                : readinessPercent >= 50
                ? (isAr ? ',J/ DCFC *-*', DD(-+ #C+1 AJ *A'5JD *.55C D*,F( 'DEA',"*.' : 'Good, but research deeper to avoid academic surprises.')
                : (isAr ? '*-0J1: D' *.*'1 *.55C (F'!K 9DI 'D9'7A) BE ('D(-+ 'DEC+A #HD'K!' : 'Warning: Do not pick blindly. Do massive research first!')}
            </p>
            <button onClick={() => setPage(`dashboard_${userContext}`)} className="mt-4 py-4 px-10 bg-black text-white rounded-full font-black text-xl hover:scale-105 transition-transform">
               {isAr ? ''D9H/)' : 'Return'}
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
        chance: numScore >= u.score ? (isAr ? '9'DJ ,/'K' : 'Very High') : (isAr ? 'E*H37' : 'Medium')
      }));
      setMatchingUnis(matches.slice(0, 3));

      setAnalyzing(false);
      const updated = { ...userProfile, weightedScore: `${score}%` };
      setUserProfile(updated);
      onSaveProfile(updated);
      showToast(isAr ? '*E -3'( H*.2JF 'DF3() 'DEH2HF) (F,'-!' : 'Calculated and securely backed up weighted index!');
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-theme-primary relative">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? ''D9H/) DD#/H'*' : 'Back to Tools'}
        </button>
        
        <h2 className={`text-5xl md:text-7xl mb-12 ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
          {isAr ? '*1*J( 1:('* 'DB(HD 'D0CJ' : 'Weighted Admission Sorting'}
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12 text-black">
          <div className="bg-theme-secondary p-10 rounded-[2.5rem] border-4 border-theme shadow-brutal">
            {[
              { label: isAr ? ''DE9/D 'D*1'CEJ DD+'FHJ)' : 'High School GPA', val: gpa, set: setGpa, color: 'text-[var(--accent-lilac)]' },
              { label: isAr ? ''.*('1 'DB/1'* 'DH7FJ)' : 'Qudrat Score', val: qudrat, set: setQudrat, color: 'text-[var(--accent-mint)]' },
              { label: isAr ? ''D'.*('1 'D*-5JDJ' : 'Tahsili Score', val: tahsili, set: setTahsili, color: 'text-[var(--accent-peach)]' },
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
                {analyzing ? (isAr ? ','1J 'D-3'(...' : 'Analyzing Metrics...') : (isAr ? '-3'( 'DF3() 'DEH2HF) 'D13EJ)' : 'Calculate Official Match')}
              </button>
            </Magnetic>
          </div>

          <div className="flex flex-col justify-center items-center">
            {result ? (
              <div className="w-full page-enter">
                <div className="text-center mb-10 text-theme-primary">
                  <p className="text-2xl font-bold mb-4">{isAr ? ''DF3() 'DEH2HF) 'D13EJ) (c`-c`-d`)' : 'Official Weighted Score (30-30-40)'}</p>
                  <div className={`text-8xl md:text-9xl text-[var(--accent-coral)] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
                    {result}<span className="text-4xl text-theme-primary">%</span>
                  </div>
                </div>
                
                <div className="bg-theme-secondary border-4 border-theme p-8 rounded-3xl shadow-brutal relative overflow-hidden mb-6">
                   <DecorativeStar className="absolute -top-10 -right-10 w-32 h-32 text-[var(--accent-mint)] opacity-30 animate-spin-slow" />
                   <h4 className="font-bold text-2xl mb-6 flex items-center gap-3 relative z-10 text-theme-primary">
                     <Sparkles className="w-8 h-8 text-[var(--accent-lilac)]"/> 
                     {isAr ? ''D,'E9'* 'DH'B9J) 'DE*H'AB) E9 F3(*C:' : 'Realistic Universities Matches:'}
                   </h4>
                   <ul className="space-y-4 font-bold text-xl relative z-10 text-black">
                     {matchingUnis.map((u, i) => (
                       <li key={i} className={`p-5 rounded-2xl border-4 border-theme flex flex-col md:flex-row justify-between shadow-[4px_4px_0_rgba(0,0,0,1)] bg-white`} style={{backgroundColor: `var(--accent-${['mint', 'peach', 'yellow'][i]})`}}>
                         <span>{isAr ? u.ar : u.en}</span> 
                         <span className="bg-white/80 px-2 py-1 rounded text-sm mt-2 md:mt-0 self-start">{isAr ? ''-*E'DJ) 'DB(HD:' : 'Chance:'} {u.chance}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-30">
                <Calculator className="w-40 h-40 mx-auto mb-8 text-theme-primary" />
                <p className={`text-3xl ${isAr ? 'font-display-ar' : 'font-display-en'}`}>
                  {isAr ? '#/.D /1,'*C 'DEH2HF) D1$J) 'D,'E9'* 'DE7'(B) -BJB)' : 'Enter standard scores to see real university matches'}
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
      showToast(isAr ? ''D1,'! %/.'D 'D*.55 H'DEF7B) 'DE3*G/A)' : 'Please input the major and target region');
      return;
    }

    setIsSearching(true);
    setThinkingSteps([]);
    setAiReport('');

    const steps = isAr ? [
      "*-/J/ 'DCJ'F'* 'D1&J3J) H#B7'( 'D*.55...",
      "(/! HCJD (-+ 'DHJ( 9(1 'D%6'A'*...",
      "*,EJ9 'D%-5'&J'* 'DAH1J) H'D*-BB EF 'DH8'&A 'D-'DJ)...",
      "5J':) 'D*B1J1 'DE'DJ H'DEGFJ 'DE/E,..."
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

    const langInst = isAr ? 'MUST WRITE ENTIRELY IN ARABIC. DO NOT USE ENGLISH.' : 'MUST WRITE IN ENGLISH.';
    const systemInstruction = `You are an elite career intelligence expert at Masari. Use web search plugins to look up current job openings and salary data. Provide an informative analysis about salaries and available positions in the target area. Use Markdown extensively. ${langInst}`;
    
    const userPrompt = `Search the web to provide realistic salary ranges (in local currency) and a list of typical hiring institutions for someone who studied "${major}" with these skills: "${skills}" in "${region}". Use Markdown format.`;
    const fallback = isAr 
      ? `### *B1J1 1H'*( ${major} AJ ${region}\n\n* **E*H37 'D1'*( 'DE*HB9:** 12,000 - 18,000 1J'D 4G1J'K.\n* **'D41C'* 'DEH5I ('D*B/JE %DJG':** #1'ECH *-CE 9PDE 'DGJ&'* 'D-CHEJ) 'DE*B/E).`
      : `### Estimation Report for ${major} in ${region}\n\n* **Expected Salary Range:** $4,500 - $7,000 per month.\n* **Typical Hiring Industries:** Local tech companies, major authorities.`;

    const content = await callLMStudio(systemInstruction, userPrompt, fallback, true); // useSearchPlugins = true
    setAiReport(content);
    showToast(isAr ? "*E 5J':) 'D*B1J1 (H'37) 'D0C'! 'D'57F'9J 'DE('41!" : "Report generated by Web Grounded AI!");
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
          {isAr ? ''D9H/) DD#/H'*' : 'Back to Tools'}
        </button>

        <div className="mb-12">
          <h2 className={`text-5xl md:text-6xl mb-4 ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
            {isAr ? ''D1H'*( 'D-J) HE7'(B) 'DH8'&A' : 'DeepSearch Expected Salary & Jobs'}
          </h2>
          <p className="text-xl opacity-70">
            {isAr 
              ? '*HB9 1'*(C 'DEGFJ 'D-BJBJ HE7'(B*G DDH8'&A 'D4':1) AH1J'K ('3*./'E HCD'! 'D0C'! 'D'57F'9J H%6'A'* 'D%F*1F* 'DE('41).'
              : 'Execute real-time semantic queries targeting exact salary trends and current job openings via web plugins.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 text-black">
          
          <div className="lg:col-span-5 bg-theme-primary p-8 rounded-[2rem] border-4 border-black shadow-brutal space-y-6">
            <div>
              <label className="font-bold block mb-2">{isAr ? ''D*.55 'D/1'3J / 'DE,'D' : 'Major Studied / Domain'}</label>
              <input 
                type="text" value={major} onChange={e => setMajor(e.target.value)}
                placeholder={isAr ? 'E+'D: GF/3) (1E,J'*' : 'e.g. Computer Science'}
                className="w-full bg-white border-4 border-black p-4 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold block mb-2">{isAr ? ''DEG'1'* 'D#3'3J) (EA5HD) (A'5D))' : 'Core Skills (Comma separated)'}</label>
              <input 
                type="text" value={skills} onChange={e => setSkills(e.target.value)}
                placeholder={isAr ? 'E+'D: Python, React, SQL' : 'e.g. Python, SQL, Project Management'}
                className="w-full bg-white border-4 border-black p-4 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold block mb-2">{isAr ? ''D/HD) / 'DEF7B) 'DE3*G/A)' : 'Target Region / Country'}</label>
              <input 
                type="text" value={region} onChange={e => setRegion(e.target.value)}
                placeholder={isAr ? 'E+'D: 'D1J'6 'D39H/J)' : 'e.g. Riyadh, Saudi Arabia'}
                className="w-full bg-white border-4 border-black p-4 rounded-xl font-bold"
              />
            </div>

            <Magnetic strength={0.2} className="w-full">
              <button 
                onClick={executeLiveSearch} disabled={isSearching}
                className="w-full py-5 bg-[var(--accent-yellow)] text-black border-4 border-black rounded-xl font-black text-xl flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
              >
                <Search className="w-6 h-6 animate-pulse" />
                {isSearching ? (isAr ? '#(-'+ 'D0C'! 'D'57F'9J...' : 'AI Searching Markets...') : (isAr ? '(-+ ('D%F*1F* 'DE('41' : 'DeepSearch Jobs & Salary')}
              </button>
            </Magnetic>
          </div>

          <div className="lg:col-span-7 bg-theme-primary p-8 rounded-[2rem] border-4 border-black shadow-brutal flex flex-col justify-start min-h-[400px]">
            {isSearching && (
              <div className="space-y-6">
                <h4 className="font-black text-xl text-[var(--accent-coral)] flex items-center gap-2">
                  <Bot className="w-6 h-6 animate-bounce" />
                  {isAr ? 'HCJD 'D0C'! 'D'57F'9J J(-+ AJ 'D%F*1F*...' : 'Agent Processing Web Search:'}
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
                <h3 className="text-2xl font-black">{isAr ? '('F*8'1 'D(J'F'* D(/! 'D*-DJD 'DAH1J' : 'Awaiting Input to Trigger Grounded Scrapes'}</h3>
              </div>
            )}

            {aiReport && (
              <div className="page-enter text-black space-y-6">
                <div className="p-4 bg-[var(--accent-mint)] border-2 border-black rounded-2xl font-black flex items-center gap-2 text-sm justify-between shadow-[2px_2px_0_#000]">
                  <span>=ï¿½ {isAr ? '*B1J1 E/9HE ((-+ %F*1F* -J' : 'Report validated with live web data'}</span>
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
                </div>
                
                <NeoMarkdown text={aiReport} />

                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center border-t-4 border-black pt-8">
                  <button onClick={handleDownload} className="py-4 px-6 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-brutal-hover">
                    <Download className="w-5 h-5" />
                    {isAr ? '*-EJD CEDA F5J' : 'Download Txt'}
                  </button>
                  <button onClick={() => saveReport(isAr ? `*B1J1 'D1H'*(: ${major}` : `Salary: ${major}`, aiReport)} className="py-4 px-6 bg-[var(--accent-mint)] border-2 border-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--accent-lilac)] transition-colors shadow-brutal-hover">
                    <Save className="w-5 h-5" />
                    {isAr ? '-A8 AJ -3'(J' : 'Save to Artifacts'}
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
    cs: { name: isAr ? '9DHE 'D-'3(' : 'Computer Science', base: 12000, growth: 1.15 },
    med: { name: isAr ? ''D7( 'D(41J' : 'Medicine', base: 18000, growth: 1.08 },
    bus: { name: isAr ? '%/'1) 'D#9E'D' : 'Business Admin', base: 9000, growth: 1.12 },
    eng: { name: isAr ? ''DGF/3)' : 'Engineering', base: 11000, growth: 1.10 },
  };

  const calculateSalary = (base, growth, years) => Math.round(base * Math.pow(growth, years));

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-theme-primary">
      <div className="max-w-[1200px] mx-auto text-black">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? ''D9H/) DD#/H'*' : 'Back to Tools'}
        </button>

        <h2 className={`text-5xl md:text-7xl mb-4 text-theme-primary ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
          {isAr ? 'E3*C4A FEH 'D1H'*(' : 'Salary Growth Curve'}
        </h2>
        <p className="text-xl opacity-70 mb-12 max-w-2xl text-theme-primary">
          {isAr ? '*HB9 FEH 1'*(C (F'!K 9DI 'D*.55 H3FH'* 'D.(1) AJ 'D3HB 'D-'DJ.' : 'Forecast your salary growth trajectory based on experience.'}
        </p>

        <div className="grid lg:grid-cols-12 gap-8 text-black">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-theme-secondary border-4 border-black p-8 rounded-3xl shadow-brutal text-theme-primary">
              <h3 className="font-bold text-2xl mb-6">{isAr ? ''.*1 'D*.55 'D/1'3J' : 'Select Major'}</h3>
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
                 <span>{isAr ? '3FH'* 'D.(1)' : 'Experience'}</span>
                 <span className="text-[var(--accent-coral)]">{experience} {isAr ? '3FH'*' : 'Yrs'}</span>
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
              <p className="text-xl font-bold opacity-70 mb-2">{isAr ? ''D1'*( 'D*B/J1J 4G1J'K' : 'Expected Monthly Salary'}</p>
              <div className={`text-6xl md:text-8xl text-[var(--accent-peach)] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
                {calculateSalary(majors[selectedMajor].base, majors[selectedMajor].growth, experience).toLocaleString()}
                <span className="text-3xl text-theme-primary ml-2">{isAr ? '1J'D' : 'SAR'}</span>
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
          {isAr ? ''D9H/) DD#/H'*' : 'Back to Tools'}
        </button>

        <h2 className={`text-5xl md:text-7xl mb-6 ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
          {isAr ? '-'3() 'D9'&/ 'D'3*+E'1J' : 'Post-grad ROI'}
        </h2>
        <p className="text-xl opacity-70 mb-16 max-w-2xl mx-auto">
          {isAr ? 'GD *3*-B /1,) 'D/1'3'* 'D9DJ' 'D'3*+E'1 '-3( FB7) 'D*9'/D 'DE'DJ.' : 'Calculate your career milestones break-even trajectory.'}
        </p>

        <div className="bg-theme-secondary p-8 md:p-16 rounded-[3rem] border-4 border-theme shadow-brutal flex flex-col md:flex-row gap-12 items-center text-left rtl:text-right text-black">
          
          <div className="flex-1 w-full space-y-12">
            <div>
              <div className="flex justify-between font-bold mb-4 text-2xl">
                <label>{isAr ? '*CDA) 'D(1F'E,' : 'Program Cost'}</label>
                <span className="text-[var(--accent-coral)]">{cost.toLocaleString()}</span>
              </div>
              <input type="range" min="50000" max="400000" step="10000" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-4 text-2xl">
                <label>{isAr ? ''D2J'/) 'DE*HB9) ('D1'*(' : 'Expected Salary Bump'}</label>
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
            <h3 className="text-2xl font-bold mb-2">{isAr ? 'FB7) 'D*9'/D 'DE'DJ' : 'Break-even Point'}</h3>
            <div className={`text-7xl text-[var(--accent-peach)] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
              {yearsToBreakeven} <span className="text-3xl text-theme-primary">{isAr ? '3FH'*' : 'Years'}</span>
            </div>
            <p className="mt-4 font-bold opacity-70">
              ({monthsToBreakeven} {isAr ? '4G1'K' : 'months'})
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

    const langInst = isAr ? 'MUST WRITE ENTIRELY IN ARABIC. DO NOT USE ENGLISH.' : 'MUST WRITE IN ENGLISH.';
    const systemPrompt = `You are a creative career counselor at Masari. Provide specific, helpful career guidance. Use Markdown. ${langInst}`;
    
    const conversationContext = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const userPrompt = `Previous conversation:\n${conversationContext}\n\nUser: ${input}\n\nProvide a helpful response.`;
    const fallback = isAr 
      ? "4C1'K 9DI 3$'DC. CE3*4'1 EGFJ AJ E3'1J #F5-C ('D*1CJ2 9DI *7HJ1 EG'1'*C 'D#3'3J) H(F'! 4(C) 9D'B'* EGFJ) BHJ). GD GF'C E,'D E-// *H/ EF'B4*G"
      : "Thanks for your question. As a Masari career counselor, I recommend focusing on developing your core skills and building a strong professional network.";

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
              <h2 className={`text-2xl md:text-3xl ${isAr ? 'font-display-ar' : 'font-display-en font-bold'}`}>
                {isAr ? ''DE3*4'1 'D0CJ DDE-'/+)' : 'AI Counselor'}
              </h2>
            </div>
          </div>
          <Bot className="w-12 h-12 opacity-80" />
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-theme-primary relative text-black">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <AbstractShape1 className="w-32 h-32 mb-6 text-[var(--accent-lilac)] animate-spin-slow" />
              <h3 className={`text-4xl mb-4 ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
                {isAr ? 'CJA JECFFJ E3'9/*C' : 'How can I guide you?'}
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
              placeholder={isAr ? ''71- 3$'DC GF'...' : 'Ask your career question...'}
              className="clickable-card flex-1 bg-theme-primary text-theme-primary border-4 border-theme rounded-full px-8 py-5 text-xl font-bold outline-none focus:bg-theme-secondary transition-colors"
            />
            <Magnetic strength={0.3}>
              <button 
                onClick={handleSend} disabled={loading}
                className="clickable-card bg-theme-primary text-theme-primary w-20 h-20 rounded-full flex items-center justify-center hover:bg-[var(--accent-lilac)] hover:text-black border-4 border-theme shadow-[4px_4px_0_rgba(0,0,0,1)] transition-colors shrink-0"
              >
                <Send className={`w-8 h-8 ${isAr ? 'rotate-180' : ''}`} />
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
          {isAr ? '?ï¿½ï¿½?ï¿½?ï¿½ï¿½?ï¿½ï¿½?ï¿½?ï¿½?ï¿½' : 'Back'}
        </button>

        <h2 className={`text-4xl md:text-5xl mb-8 ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
          {isAr ? '?ï¿½?ï¿½?ï¿½ï¿½?ï¿½??ï¿½?ï¿½` ?ï¿½ï¿½?ï¿½ï¿½?ï¿½&ï¿½?ï¿½!ï¿½?ï¿½ ï¿½?ï¿½`?ï¿½' : 'My Career ID'}
        </h2>

        <div className="bg-theme-secondary border-4 border-black p-8 rounded-[2.5rem] shadow-brutal text-black">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-black flex items-center justify-center text-4xl shadow-[4px_4px_0_#000] shrink-0">
              ï¿½?ï¿½xï¿½?ï¿½
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left rtl:md:text-right w-full">
              <div>
                <h3 className="text-3xl font-black">{userProfile.name || 'Masari Pioneer'}</h3>
                <p className="font-bold opacity-70">{userProfile.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-[var(--accent-peach)] p-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                  <p className="text-sm font-bold opacity-80 mb-1">{isAr ? '?ï¿½ï¿½?ï¿½ï¿½?ï¿½&?ï¿½?ï¿½?ï¿½ ?ï¿½ï¿½?ï¿½ï¿½?ï¿½&ï¿½?ï¿½!ï¿½?ï¿½ ï¿½?ï¿½`' : 'Career Path'}</p>
                  <p className="font-black">{userProfile.careerPersona || (isAr ? '??ï¿½?ï¿½`?ï¿½ ï¿½?ï¿½&?ï¿½?ï¿½?ï¿½' : 'Not set')}</p>
                </div>
                <div className="bg-[var(--accent-mint)] p-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                  <p className="text-sm font-bold opacity-80 mb-1">{isAr ? '?ï¿½ï¿½?ï¿½ï¿½?ï¿½ï¿½?ï¿½?ï¿½ ?ï¿½ï¿½?ï¿½ï¿½?ï¿½&ï¿½?ï¿½!ï¿½?ï¿½ ï¿½?ï¿½`' : 'Professional Title'}</p>
                  <p className="font-black">{userProfile.riasecTitle || (isAr ? '??ï¿½?ï¿½`?ï¿½ ï¿½?ï¿½&?ï¿½?ï¿½?ï¿½' : 'Not set')}</p>
                </div>
                <div className="bg-[var(--accent-lilac)] p-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                  <p className="text-sm font-bold opacity-80 mb-1">{isAr ? 'ï¿½?ï¿½ ?ï¿½?ï¿½?ï¿½ ?ï¿½ï¿½?ï¿½???ï¿½?ï¿½?ï¿½ï¿½?ï¿½' : 'Match Score'}</p>
                  <p className="font-black">{userProfile.testMatchScore || '--'}</p>
                </div>
                <div className="bg-[var(--accent-yellow)] p-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                  <p className="text-sm font-bold opacity-80 mb-1">{isAr ? '?ï¿½ï¿½?ï¿½ï¿½?ï¿½ ?ï¿½?ï¿½?ï¿½ ?ï¿½ï¿½?ï¿½ï¿½?ï¿½&ï¿½?ï¿½ï¿½?ï¿½?ï¿½ï¿½?ï¿½ï¿½?ï¿½ï¿½?ï¿½ ?ï¿½' : 'Weighted Score'}</p>
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
      showToast(isAr ? '??ï¿½?ï¿½& ???ï¿½?ï¿½ï¿½?ï¿½`?ï¿½ ?ï¿½?ï¿½?ï¿½?ï¿½ ?ï¿½?ï¿½?ï¿½ï¿½?ï¿½& ?ï¿½ï¿½?ï¿½?ï¿½???ï¿½?? ?ï¿½ï¿½?ï¿½?ï¿½?ï¿½?ï¿½ï¿½?ï¿½ ?ï¿½?ï¿½ï¿½?ï¿½` ?ï¿½ï¿½?ï¿½ ?ï¿½?ï¿½?ï¿½' : 'AI Server URL updated successfully!');
    } catch (err) {
      console.error(err);
      showToast(isAr ? '?ï¿½?ï¿½?ï¿½ ?ï¿½?ï¿½?ï¿½ ?ï¿½?ï¿½ï¿½?ï¿½ ?ï¿½?? ?ï¿½ï¿½?ï¿½?ï¿½???ï¿½' : 'Error saving config');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 relative text-theme-primary">
      <div className="max-w-[800px] mx-auto page-enter">
        <button onClick={() => setPage('home')} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)]">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? '?ï¿½ï¿½?ï¿½?ï¿½ï¿½?ï¿½ï¿½?ï¿½?ï¿½?ï¿½' : 'Back'}
        </button>
        
        <h2 className={`text-4xl md:text-5xl mb-8 ${isAr ? 'font-display-ar' : 'font-display-en font-black'}`}>
          {isAr ? 'ï¿½?ï¿½ï¿½?ï¿½ï¿½?ï¿½?ï¿½?ï¿½ ?ï¿½ï¿½?ï¿½???ï¿½??ï¿½?ï¿½& ï¿½?ï¿½ï¿½?ï¿½ï¿½?ï¿½&?ï¿½?ï¿½ï¿½?ï¿½ï¿½?ï¿½ï¿½?ï¿½' : 'Admin Control Panel'}
        </h2>

        <div className="bg-theme-secondary p-8 rounded-[2rem] border-4 border-theme shadow-brutal text-black">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-[var(--accent-coral)]" />
            {isAr ? '?ï¿½?ï¿½?ï¿½?ï¿½?ï¿½?ï¿½?? ?ï¿½?ï¿½?ï¿½ï¿½?ï¿½& ?ï¿½ï¿½?ï¿½?ï¿½???ï¿½?? ?ï¿½ï¿½?ï¿½?ï¿½?ï¿½?ï¿½ï¿½?ï¿½ ?ï¿½?ï¿½ï¿½?ï¿½`' : 'AI Server Config'}
          </h3>
          <p className="font-bold opacity-70 mb-6">
            {isAr ? '?ï¿½?ï¿½?ï¿½ï¿½?ï¿½ ?ï¿½?ï¿½?ï¿½?ï¿½ Ngrok ?ï¿½ï¿½?ï¿½ï¿½?ï¿½ LocalTunnel ?ï¿½ï¿½?ï¿½?ï¿½?ï¿½ï¿½?ï¿½ï¿½?ï¿½` ï¿½?ï¿½??ï¿½?ï¿½ï¿½?ï¿½?ï¿½ï¿½?ï¿½`ï¿½?ï¿½! ?ï¿½ï¿½?ï¿½&ï¿½?ï¿½`?ï¿½ ?ï¿½?ï¿½???ï¿½ï¿½?ï¿½?ï¿½ï¿½?ï¿½&?ï¿½?? ?ï¿½ï¿½?ï¿½ï¿½?ï¿½&?ï¿½???ï¿½?ï¿½ï¿½?ï¿½&ï¿½?ï¿½`ï¿½?ï¿½  ?ï¿½ï¿½?ï¿½ï¿½?ï¿½0 ?ï¿½?ï¿½?ï¿½ï¿½?ï¿½ï¿½?ï¿½?ï¿½?? ?ï¿½ï¿½?ï¿½ï¿½?ï¿½&?ï¿½ï¿½?ï¿½ï¿½?ï¿½`.' : 'Enter the live Ngrok or LocalTunnel URL to route all public AI requests to your local computer.'}
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
            {saving ? (isAr ? '?ï¿½?ï¿½?ï¿½ï¿½?ï¿½` ?ï¿½ï¿½?ï¿½?ï¿½???ï¿½...' : 'Saving...') : (isAr ? '???ï¿½?ï¿½ï¿½?ï¿½`?ï¿½ ï¿½?ï¿½ï¿½?ï¿½?????ï¿½ï¿½?ï¿½`ï¿½?ï¿½ ?ï¿½ï¿½?ï¿½?ï¿½?ï¿½?ï¿½?ï¿½' : 'Update & Activate URL')}
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
    showToast(lang === 'ar' ? '*E *3,JD 'D.1H, (F,'-.' : 'Signed out successfully.');
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
      showToast(lang === 'ar' ? `*E .5E ${pointsCost} FB7) D(/! 'D#/').` : `Deducted ${pointsCost} credits to run diagnostic.`);
    }

    handleTransition(() => {
      setPage(targetTool);
    });
  };
  
  const handleSetPage = (newPage) => {
    const bypassPages = ['home', 'auth_signin', 'auth_signup', 'subscriptions'];
    if (!userProfile.isLoggedIn && !bypassPages.includes(newPage)) {
      showToast(lang === 'ar' ? 'J,( *3,JD -3'(C 'DEH+B #HD'K DDH5HD %DI #/H'* 'D0C'! 'D'57F'9J!' : 'Please sign up or log in first to access premium modules!');
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
        className={`min-h-screen ${isAr ? 'lang-ar dir-rtl' : 'lang-en dir-ltr'} ${theme === 'dark' ? 'dark' : ''}`} 
        style={{ direction: isAr ? 'rtl' : 'ltr' }}
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