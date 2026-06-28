import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { DecorativeStar } from '../ui/Shapes';

export const Footer = ({ isAr }) => {
  return (
    <footer className="w-full bg-[#111111] text-white border-t-8 border-black p-12 md:p-20 relative overflow-hidden mt-20">
      <div className="absolute top-10 right-10 opacity-10">
        <DecorativeStar className="w-48 h-48 text-[var(--accent-coral)]" />
      </div>
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        <div className="md:col-span-7 space-y-6">
          <h3 className="text-4xl font-black italic font-display-en">
            {isAr ? 'مساري' : 'MASARI'}
          </h3>
          <p className="text-gray-400 font-medium max-w-md">
            {isAr 
              ? 'نهج ريادي معاصر ومتميز لتشكيل الهويات المهنية للأجيال القادمة باستخدام الذكاء الاصطناعي العميق والبحث العملي.' 
              : 'A pioneer neobrutalist approach to shaping career personas for the next generation using deep AI and empirical research.'}
          </p>
        </div>

        <div className="md:col-span-5 space-y-4">
          <h4 className="font-bold text-xl uppercase tracking-widest text-[var(--accent-lilac)]">
            {isAr ? 'اتصل بنا' : 'Contact'}
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
