import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CUTE_AVATARS } from '../data/avatars';

export const PersonaCard = ({ isAr, setPage, userProfile }) => {
  const avatar = CUTE_AVATARS.find(a => a.id === userProfile.avatarId);

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-theme-primary relative">
      <div className="max-w-[800px] mx-auto">
        <button onClick={() => setPage('home')} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'عودة' : 'Back'}
        </button>

        <h2 className="text-4xl md:text-5xl mb-8 font-display-en font-black">
          {isAr ? 'هويتي المهنية' : 'My Career ID'}
        </h2>

        <div className="bg-theme-secondary border-4 border-black p-8 rounded-[2.5rem] shadow-brutal text-black">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-black flex items-center justify-center text-4xl shadow-[4px_4px_0_#000] shrink-0 overflow-hidden select-none">
              {avatar ? avatar.svg() : '🎓'}
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left rtl:md:text-right w-full">
              <div>
                <h3 className="text-3xl font-black">{userProfile.name || 'Masari Pioneer'}</h3>
                <p className="font-bold opacity-70">{userProfile.email}</p>
                {userProfile.slogan && (
                  <p className="text-sm font-semibold opacity-60 italic mt-1">"{userProfile.slogan}"</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-[var(--accent-peach)] p-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                  <p className="text-sm font-bold opacity-80 mb-1">{isAr ? 'المسار المهني' : 'Career Path'}</p>
                  <p className="font-black text-sm truncate">{userProfile.careerPersona || (isAr ? 'غير محدد' : 'Not set')}</p>
                </div>
                <div className="bg-[var(--accent-mint)] p-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                  <p className="text-sm font-bold opacity-80 mb-1">{isAr ? 'المسمى المهني' : 'Professional Title'}</p>
                  <p className="font-black text-sm truncate">{userProfile.riasecTitle || (isAr ? 'غير محدد' : 'Not set')}</p>
                </div>
                <div className="bg-[var(--accent-lilac)] p-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                  <p className="text-sm font-bold opacity-80 mb-1">{isAr ? 'نسبة التطابق' : 'Match Score'}</p>
                  <p className="font-black text-sm truncate">{userProfile.testMatchScore || '--'}</p>
                </div>
                <div className="bg-[var(--accent-yellow)] p-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                  <p className="text-sm font-bold opacity-80 mb-1">{isAr ? 'النسبة الموزونة' : 'Weighted Score'}</p>
                  <p className="font-black text-sm truncate">{userProfile.weightedScore || '--'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
