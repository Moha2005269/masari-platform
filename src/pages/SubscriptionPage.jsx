import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Coins, CheckCircle2 } from 'lucide-react';
import { ThreeDTilt } from '../components/ui/ThreeDTilt';

export const SubscriptionPage = ({ isAr, setPage, userProfile, setUserProfile, onSaveProfile, showToast, onTriggerCheckout }) => {
  const [selectedPackPoints, setSelectedPackPoints] = useState(100);

  const pointPacks = {
    10: { price: 1.99 }, 25: { price: 3.99 }, 50: { price: 6.99 }, 100: { price: 11.99 },
    150: { price: 16.99 }, 200: { price: 21.99 }, 250: { price: 25.99 }, 300: { price: 29.99 },
    400: { price: 37.99 }, 500: { price: 44.99 }
  };

  const handleUpgradeToBro = () => {
    if (onTriggerCheckout) {
      onTriggerCheckout({
        mode: 'bro',
        amount: 100,
        price: 5.00
      });
    }
  };
  
  const handleSelectFree = () => {
    const updated = {
      ...userProfile,
      subscriptionTier: 'free'
    };
    setUserProfile(updated);
    onSaveProfile(updated);
    showToast(isAr ? 'أنت الآن على الخطة الأساسية المجانية.' : 'You are currently on the Free Basic Plan.');
  };

  const handleBuyPoints = () => {
    const amount = Number(selectedPackPoints);
    const price = pointPacks[amount]?.price || 0;
    if (onTriggerCheckout) {
      onTriggerCheckout({
        mode: 'points',
        amount,
        price
      });
    }
  };

  const handleDebugAddPoints = () => {
    const updated = {
      ...userProfile,
      points: (userProfile.points || 0) + 100
    };
    setUserProfile(updated);
    onSaveProfile(updated);
    showToast(isAr ? 'وضع التجربة: تم إضافة +100 نقطة مجاناً! 🛠️' : 'Debug Sandbox: Added +100 Credits! 🛠️');
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 max-w-[1200px] mx-auto text-theme-primary">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <button onClick={() => setPage('home')} className="clickable-card flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors px-4 py-2 border-2 border-transparent hover:border-theme rounded-full">
          {isAr ? <ArrowRight className="w-6 h-6"/> : <ArrowLeft className="w-6 h-6"/>} 
          {isAr ? 'العودة للرئيسية' : 'Back to Home'}
        </button>
        
        <button 
          onClick={handleDebugAddPoints}
          className="clickable-card bg-amber-500 hover:bg-amber-600 text-black border-4 border-black px-6 py-2 rounded-full font-black text-sm shadow-[4px_4px_0_#000] flex items-center gap-2"
        >
          <span>🛠️ {isAr ? 'وضع المطور: إضافة +100 نقطة' : 'Debug Mode: Add +100 Pts'}</span>
        </button>
      </div>

      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl md:text-7xl font-black font-display-en">
          {isAr ? 'اشحن مستقبلك' : 'Fuel Your Future'}
        </h2>
        <p className="text-xl opacity-70 max-w-2xl mx-auto">
          {isAr ? 'اختر باقتك أو اشحن رصيد نقاطك لتفعيل محركات البحث والاستكشاف المدعومة بالذكاء الاصطناعي.' : 'Choose your tier or acquire micro-credits below to trigger real-time grounded research engines.'}
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-peach)] text-black rounded-full border-4 border-black font-black text-lg shadow-[4px_4px_0_#000]">
          <Coins className="w-6 h-6 text-yellow-600 animate-spin-slow" />
          <span>
            {isAr 
              ? `الرصيد: ${userProfile.points || 0} نقطة | الباقة: ${userProfile.subscriptionTier === 'bro' ? 'برو' : 'مجانية'}` 
              : `Balance: ${userProfile.points || 0} Credits | Tier: ${userProfile.subscriptionTier === 'bro' ? 'Bro' : 'Free'}`}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-12">
        
        <ThreeDTilt intensity={8} className="flex">
          <div className="w-full bg-theme-secondary border-4 border-black p-8 rounded-[2.5rem] shadow-brutal flex flex-col justify-between relative text-theme-primary">
            <div>
              <span className="text-xs uppercase font-black px-4 py-1.5 bg-gray-200 text-black rounded-full border-2 border-black inline-block">
                {isAr ? 'أساسي' : 'BASIC'}
              </span>
              <h3 className="text-3xl font-black mt-6 mb-2">{isAr ? 'الباقة المجانية' : 'Free Plan'}</h3>
              <div className="text-4xl font-black mb-6">$0 <span className="text-sm opacity-80">/ {isAr ? 'للأبد' : 'forever'}</span></div>
              <ul className="space-y-4 font-bold border-t-4 border-black/20 pt-6 text-base opacity-80">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" /> {isAr ? 'الوصول للتقييمات المجانية (الجاهزية)' : 'Access to free diagnostics (Readiness)'}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" /> {isAr ? 'الدفع مقابل الاستخدام للأدوات المتقدمة' : 'Pay-per-use credits for premium tools'}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" /> {isAr ? 'حفظ بطاقة الهوية المهنية الأساسية' : 'Save standard persona card'}</li>
              </ul>
            </div>
            <button 
              onClick={handleSelectFree}
              disabled={userProfile.subscriptionTier === 'free'}
              className="mt-8 w-full py-4 bg-gray-200 text-black font-black text-lg rounded-full border-4 border-black hover:bg-gray-300 transition-colors shadow-brutal disabled:opacity-50"
            >
              {userProfile.subscriptionTier === 'free' ? (isAr ? 'الباقة الحالية' : 'Current Plan') : (isAr ? 'اختر الباقة' : 'Select')}
            </button>
          </div>
        </ThreeDTilt>

        <ThreeDTilt intensity={8} className="flex">
          <div className="w-full bg-[var(--accent-lilac)] border-4 border-black p-8 rounded-[2.5rem] shadow-brutal-lg flex flex-col justify-between relative text-black transform lg:-translate-y-4 z-10">
            <div className="absolute -top-4 right-6 bg-[var(--accent-coral)] text-black border-4 border-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest animate-pulse shadow-[2px_2px_0_#000]">
              {isAr ? 'الأكثر شيوعاً' : 'Most Popular'}
            </div>
            <div>
              <span className="text-xs uppercase font-black px-4 py-1.5 bg-white text-black rounded-full border-2 border-black inline-block">
                {isAr ? 'بريميوم لايت' : 'PREMIUM LITE'}
              </span>
              <h3 className="text-4xl font-black mt-6 mb-2">{isAr ? 'باقة البرو' : 'Bro Plan'}</h3>
              <div className="text-5xl font-black mb-6">$5 <span className="text-sm opacity-80">/ {isAr ? 'شهرياً' : 'month'}</span></div>
              <ul className="space-y-4 font-bold border-t-4 border-black/20 pt-6 text-base">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" /> {isAr ? '100 نقطة شهرية' : '100 Monthly Credits'}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" /> {isAr ? 'أولوية معالجة محرك الذكاء الاصطناعي' : 'Priority AI Engine Processing'}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" /> {isAr ? 'إضافات بحث الويب الحي المباشر' : 'Live Internet Search Plugins'}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" /> {isAr ? 'تصدير الهوية المهنية الممتازة' : 'Premium UI Persona Export'}</li>
              </ul>
            </div>
            <button 
              onClick={handleUpgradeToBro}
              className="mt-8 w-full py-4 bg-black text-white font-black text-lg rounded-full border-4 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors shadow-brutal"
            >
              {isAr ? 'ترقية مقابل 5$/شهرياً 🚀' : 'Upgrade for $5/mo 🚀'}
            </button>
          </div>
        </ThreeDTilt>

        <ThreeDTilt intensity={8} className="flex">
          <div className="w-full bg-[var(--accent-mint)] border-4 border-black p-8 rounded-[2.5rem] shadow-brutal flex flex-col justify-between text-black">
            <div>
              <span className="text-xs uppercase font-black px-4 py-1.5 bg-white text-black rounded-full border-2 border-black inline-block">
                {isAr ? 'شحن نقاط' : 'TOP-UP'}
              </span>
              <h3 className="text-3xl font-black mt-6 mb-2">{isAr ? 'حزم النقاط' : 'Credit Packs'}</h3>
              <p className="font-semibold text-sm opacity-80 mb-6">
                {isAr ? 'هل تحتاج لمزيد من النقاط؟ اشحن رصيدك في أي وقت.' : 'Need more juice? Top up your credits anytime.'}
              </p>

              <div className="space-y-4 bg-white/50 border-4 border-black p-4 rounded-2xl mb-4">
                <label className="block text-sm font-black">{isAr ? 'حجم النقاط:' : 'Volume:'}</label>
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
                  <span>{isAr ? 'المجموع:' : 'Total:'}</span>
                  <span className="text-[var(--accent-coral)] text-2xl drop-shadow-[1px_1px_0_#000]">${pointPacks[selectedPackPoints]?.price}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleBuyPoints}
              className="mt-2 w-full py-4 bg-white text-black font-black text-lg rounded-full border-4 border-black hover:bg-black hover:text-white transition-colors shadow-brutal"
            >
              {isAr ? `شراء ${selectedPackPoints} نقطة` : `Buy ${selectedPackPoints} Credits`}
            </button>
          </div>
        </ThreeDTilt>

      </div>
    </div>
  );
};
