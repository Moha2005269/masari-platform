import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Globe } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { LM_STUDIO_CONFIG } from '../config/lmStudio';

export const AdminPanelPage = ({ isAr, setPage, showToast, db }) => {
  const [newUrl, setNewUrl] = useState(LM_STUDIO_CONFIG.baseUrl);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!db) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'config', 'global'), { aiBaseUrl: newUrl }, { merge: true });
      LM_STUDIO_CONFIG.baseUrl = newUrl;
      showToast(isAr ? 'تم تحديث رابط خادم الذكاء الاصطناعي بنجاح!' : 'AI Server URL updated successfully!');
    } catch (err) {
      console.error(err);
      showToast(isAr ? 'خطأ في حفظ الإعدادات' : 'Error saving config');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 relative text-theme-primary">
      <div className="max-w-[800px] mx-auto page-enter">
        <button onClick={() => setPage('home')} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)]">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'عودة' : 'Back'}
        </button>
        
        <h2 className="text-4xl md:text-5xl mb-8 font-display-en font-black">
          {isAr ? 'لوحة تحكم المسؤول' : 'Admin Control Panel'}
        </h2>

        <div className="bg-theme-secondary p-8 rounded-[2rem] border-4 border-theme shadow-brutal text-black">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-[var(--accent-coral)]" />
            {isAr ? 'إعدادات خادم الذكاء الاصطناعي' : 'AI Server Config'}
          </h3>
          <p className="font-bold opacity-70 mb-6">
            {isAr ? 'أدخل رابط Ngrok أو LocalTunnel المباشر لتوجيه جميع طلبات الذكاء الاصطناعي العامة إلى جهازك المحلي.' : 'Enter the live Ngrok or LocalTunnel URL to route all public AI requests to your local computer.'}
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
            {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'تحديث وتفعيل الرابط' : 'Update & Activate URL')}
          </button>
        </div>
      </div>
    </div>
  );
};
