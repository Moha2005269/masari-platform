import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const ToolReadyTest = ({ isAr, setPage, userContext, showToast }) => {
  const READINESS_QUESTIONS = [
    { ar: 'لقد قرأت عن متطلبات التخصصات التي أفكر بها باستفاضة.', en: 'I have extensively researched the curriculum of my target majors.' },
    { ar: 'أعلم تماماً ما هي طبيعة الوظائف التي سأعمل بها بعد التخرج.', en: 'I know exactly what daily job tasks I will perform post-graduation.' },
    { ar: 'أنا على دراية بمتوسط الرواتب في سوق العمل لمجالي.', en: 'I am aware of the median salaries in the job market for my field.' },
    { ar: 'لدي خطة واضحة لتطوير مهاراتي التقنية واللغوية أثناء الجامعة.', en: 'I have a clear plan to develop my technical/language skills during college.' },
    { ar: 'أعرف الفروقات الدقيقة بين تخصصي والتخصصات المشابهة.', en: 'I know the nuanced differences between my major and similar ones.' },
    { ar: 'قمت بالتحدث مع أشخاص يعملون حالياً في المجال الذي أطمح إليه.', en: 'I have spoken with professionals currently working in my target field.' },
    { ar: 'أعرف تماماً كيف سأوازن بين الدراسة والحياة الشخصية.', en: 'I know exactly how I will balance studies and personal life.' },
    { ar: 'لقد استكشفت الشهادات المهنية المطلوبة التي تدعم شهادتي الجامعية.', en: 'I explored the professional certificates needed to support my degree.' },
    { ar: 'لا أشعر بالضغط من العائلة أو المجتمع لاختيار مسار محدد.', en: 'I do not feel pressured by family/society to pick a specific path.' },
    { ar: 'لدي شغف حقيقي سيدفعني للاستمرار عند مواجهة صعوبات أكاديمية.', en: 'I have genuine passion that will push me through academic hardships.' }
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
      showToast(isAr ? 'اكتمل تقييم الجاهزية!' : 'Readiness evaluation complete!');
    }
  };

  const readinessPercent = Math.round((score / (READINESS_QUESTIONS.length * 10)) * 100);

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 relative text-theme-primary">
      <div className="max-w-[800px] mx-auto bg-theme-secondary border-4 border-black p-8 md:p-12 rounded-[2.5rem] shadow-brutal text-black">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'العودة للأدوات' : 'Back to Tools'}
        </button>

        <h3 className="text-4xl font-black mb-8">{isAr ? 'تقييم الجاهزية الأكاديمية' : 'Academic Readiness Assessment'}</h3>
        
        {!finished ? (
          <div className="space-y-8 page-enter">
            <div className="flex justify-between font-bold text-sm opacity-60">
               <span>{isAr ? 'التقدم' : 'Progress'}</span>
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
              <button onClick={() => handleAnswer(10)} className="py-4 bg-[var(--accent-mint)] border-4 border-black font-black text-lg rounded-xl shadow-brutal-hover">{isAr ? 'نعم، بالتأكيد' : 'Yes, absolutely'}</button>
              <button onClick={() => handleAnswer(5)} className="py-4 bg-[var(--accent-peach)] border-4 border-black font-black text-lg rounded-xl shadow-brutal-hover">{isAr ? 'إلى حد ما' : 'Somewhat'}</button>
              <button onClick={() => handleAnswer(2)} className="py-4 bg-[var(--accent-yellow)] border-4 border-black font-black text-lg rounded-xl shadow-brutal-hover">{isAr ? 'نادراً' : 'Rarely'}</button>
              <button onClick={() => handleAnswer(0)} className="py-4 bg-gray-200 border-4 border-black font-black text-lg rounded-xl shadow-brutal-hover">{isAr ? 'على الإطلاق' : 'Not at all'}</button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8 page-enter">
            <h4 className="text-3xl font-bold">{isAr ? 'درجة رؤيتك وجاهزيتك:' : 'Your Vision & Readiness Score:'}</h4>
            <div className="text-8xl font-black text-[var(--accent-coral)] drop-shadow-[4px_4px_0_#000]">{readinessPercent}%</div>
            <p className="font-bold text-xl bg-theme-primary p-6 rounded-2xl border-4 border-black">
              {readinessPercent >= 80 
                ? (isAr ? 'ممتاز! لديك رؤية واضحة ومحددة جداً.' : 'Excellent! You have a highly concrete vision.')
                : readinessPercent >= 50
                ? (isAr ? 'جيد، لكن ابحث أكثر لتجنب المفاجآت الأكاديمية.' : 'Good, but research deeper to avoid academic surprises.')
                : (isAr ? 'تحذير: لا تختر بشكل عشوائي. قم ببحث مكثف أولاً!' : 'Warning: Do not pick blindly. Do massive research first!')}
            </p>
            <button onClick={() => setPage(`dashboard_${userContext}`)} className="mt-4 py-4 px-10 bg-black text-white rounded-full font-black text-xl hover:scale-105 transition-transform">
               {isAr ? 'عودة' : 'Return'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
