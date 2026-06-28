import React from 'react';
import { X, LogIn, UserPlus, CreditCard, FileArchive, LogOut, Sparkles, Coins } from 'lucide-react';
import { AbstractShape1, AbstractShape2 } from '../ui/Shapes';
import { Magnetic } from '../ui/Magnetic';

export const FullscreenMenu = ({ isAr, isOpen, onClose, setPage, userProfile, logout }) => {
  return (
    <div className={`fixed inset-0 z-[60] bg-theme-secondary flex flex-col items-center justify-center overflow-hidden menu-panel ${isOpen ? 'menu-open' : ''}`}>
      <AbstractShape1 className="absolute top-10 left-10 w-64 h-64 text-[var(--accent-lilac)] opacity-20 animate-spin-slow" />
      <AbstractShape2 className="absolute bottom-10 right-10 w-80 h-80 text-[var(--accent-mint)] opacity-20 animate-spin-slow" style={{animationDirection: 'reverse'}} />

      <button onClick={onClose} className="absolute top-8 right-8 rtl:left-8 rtl:right-auto p-4 bg-theme-primary rounded-full border-4 border-theme shadow-brutal-hover transition-all z-20">
        <X className="w-8 h-8 text-theme-primary" />
      </button>

      <div className="flex flex-col items-center gap-6 text-theme-primary relative z-10 text-center w-full max-w-sm">
        <h2 className="text-5xl md:text-7xl mb-8 font-display-en italic">
          {isAr ? 'القائمة' : 'Menu'}
        </h2>

        <div className="flex flex-col gap-4 w-full px-6 text-black">
          {!userProfile.isLoggedIn ? (
            <>
              <Magnetic strength={0.2} className="w-full">
                <button onClick={() => { setPage('auth_signin'); onClose(); }} className="w-full py-4 px-8 bg-black dark:bg-white dark:text-black text-white rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group">
                  <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? 'تسجيل الدخول' : 'Sign In'}
                </button>
              </Magnetic>
              <Magnetic strength={0.2} className="w-full">
                <button onClick={() => { setPage('auth_signup'); onClose(); }} className="w-full py-4 px-8 bg-transparent bg-theme-primary border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all hover:bg-[var(--accent-mint)] hover:text-black group">
                  <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? 'تسجيل جديد' : 'Sign Up'}
                </button>
              </Magnetic>
            </>
          ) : (
            <>
              <div className="bg-theme-primary border-4 border-theme p-4 rounded-3xl mb-4 text-center text-theme-primary">
                <p className="font-bold opacity-60 text-sm mb-1">{isAr ? 'مرحباً،' : 'Welcome,'}</p>
                <p className="font-black text-2xl">{userProfile.name}</p>
                <div className="mt-3 inline-flex items-center gap-2 bg-[var(--accent-peach)] text-black px-4 py-1.5 rounded-full border-2 border-black text-sm font-bold shadow-[2px_2px_0_#000]">
                  <Coins className="w-4 h-4"/> {userProfile.points} {isAr ? 'نقطة' : 'Credits'}
                </div>
              </div>
              <Magnetic strength={0.2} className="w-full">
                <button onClick={() => { setPage('persona_card'); onClose(); }} className="w-full py-4 px-8 bg-[var(--accent-yellow)] text-black border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group">
                  <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? 'هويتي المهنية' : 'My Career Persona'}
                </button>
              </Magnetic>
              <Magnetic strength={0.2} className="w-full">
                <button onClick={() => { setPage('saved_reports'); onClose(); }} className="w-full py-4 px-8 bg-white text-black border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group mt-2">
                  <FileArchive className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? 'التقارير المحفوظة' : 'Saved Artifacts'}
                </button>
              </Magnetic>
              <Magnetic strength={0.2} className="w-full">
                <button onClick={() => { logout(); onClose(); }} className="w-full py-4 px-8 bg-[var(--accent-coral)] text-black border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group mt-2">
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAr ? 'تسجيل الخروج' : 'Sign Out'}
                </button>
              </Magnetic>
            </>
          )}

          <Magnetic strength={0.2} className="w-full">
            <button onClick={() => { setPage('subscriptions'); onClose(); }} className="w-full py-4 px-8 bg-[var(--accent-lilac)] text-black border-4 border-theme rounded-full text-xl font-bold flex items-center justify-center gap-4 shadow-brutal-hover transition-all group mt-4">
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {isAr ? 'الخطط والنقاط' : 'Plans & Credits'}
            </button>
          </Magnetic>
        </div>
      </div>
    </div>
  );
};
