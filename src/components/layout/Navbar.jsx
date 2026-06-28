import React from 'react';
import { Sun, Moon, Globe, Menu, CreditCard } from 'lucide-react';
import { DecorativeStar } from '../ui/Shapes';
import { Magnetic } from '../ui/Magnetic';

export const Navbar = ({ isAr, toggleLang, setPage, theme, toggleTheme, toggleMenu, userProfile }) => (
  <nav className="fixed top-0 w-full p-6 z-50 pointer-events-none">
    <div className="flex items-center justify-between max-w-[1600px] mx-auto pointer-events-auto">
      <Magnetic strength={0.1}>
        <div 
          onClick={() => setPage('home')} 
          className="clickable-card text-4xl cursor-pointer flex items-center gap-2 text-theme-primary font-display-en italic font-black"
        >
          <DecorativeStar className="w-8 h-8 text-[var(--accent-coral)] animate-spin-slow" />
          {isAr ? 'مساري' : 'Masari'}
        </div>
      </Magnetic>
      
      <div className="flex items-center gap-2 md:gap-4 bg-theme-primary/90 backdrop-blur-md px-4 py-2 rounded-full border-4 border-theme shadow-brutal text-theme-primary transition-colors">
        
        <Magnetic strength={0.3}>
          <button onClick={toggleLang} className="clickable-card flex items-center gap-2 font-black text-sm uppercase hover:text-[var(--accent-coral)] transition-colors py-2 px-2">
            <Globe className="w-4 h-4" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>
        </Magnetic>
        
        <div className="w-px h-6 bg-theme-primary border-r-2 border-theme opacity-30"></div>

        <Magnetic strength={0.3}>
          <button onClick={toggleTheme} className="clickable-card flex items-center gap-2 font-black text-sm hover:text-[var(--accent-peach)] transition-colors py-2 px-2">
            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            <span className="hidden md:inline">{theme === 'dark' ? (isAr ? 'مضيء' : 'Light') : (isAr ? 'مظلم' : 'Dark')}</span>
          </button>
        </Magnetic>

        <div className="w-px h-6 bg-theme-primary border-r-2 border-theme opacity-30"></div>
        
        {userProfile.isLoggedIn && (
          <>
            <Magnetic strength={0.3}>
              <button onClick={() => setPage('persona_card')} className="clickable-card flex items-center gap-2 font-black text-sm hover:text-[var(--accent-mint)] transition-colors py-2 px-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden md:inline">{isAr ? 'هويتي' : 'My ID'}</span>
              </button>
            </Magnetic>
            <div className="w-px h-6 bg-theme-primary border-r-2 border-theme opacity-30"></div>
          </>
        )}

        <Magnetic strength={0.3}>
          <button onClick={toggleMenu} className="clickable-card font-black text-sm hover:text-[var(--accent-lilac)] transition-colors py-2 px-2 flex items-center gap-2">
            <Menu className="w-5 h-5" />
            <span className="hidden md:inline">{isAr ? 'القائمة' : 'Menu'}</span>
          </button>
        </Magnetic>
      </div>
    </div>
  </nav>
);
