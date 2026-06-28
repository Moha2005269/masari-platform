import React from 'react';
import { X } from 'lucide-react';

export const PointsExhaustedModal = ({ isAr, isOpen, onClose, onGoToSubscriptions }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm flex items-center justify-center p-6 page-enter">
      <div className="bg-white text-black border-4 border-black p-8 rounded-[2.5rem] shadow-brutal-lg max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full border-2 border-black transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-peach)] border-4 border-black flex items-center justify-center text-2xl font-bold animate-bounce shadow-[3px_3px_0_#000]">💵</div>
          <h3 className="text-3xl font-black">{isAr ? 'نقاطك غير كافية!' : 'Insufficient Credits!'}</h3>
          <p className="font-semibold text-gray-700">
            {isAr ? 'لا يوجد لديك نقاط كافية لفتح هذه الأداة. يرجى شحن نقاطك أو الترقية لباقة البرو.' : 'You have depleted your available credits. Purchase standalone points or upgrade to the Bro Plan.'}
          </p>
          <div className="flex gap-4 w-full mt-4">
            <button 
              onClick={() => { onClose(); onGoToSubscriptions(); }}
              className="w-full py-4 bg-[var(--accent-lilac)] text-black border-4 border-black rounded-xl font-bold hover:translate-y-[-2px] transition-transform shadow-brutal"
            >
              {isAr ? 'الترقية الآن' : 'Upgrade Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
