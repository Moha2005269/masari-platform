import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Calculator, Sparkles } from 'lucide-react';
import { SAUDI_UNIVERSITIES } from '../../data/universities';
import { Magnetic } from '../../components/ui/Magnetic';

export const ToolCalculator = ({ isAr, setPage, userContext, userProfile, setUserProfile, onSaveProfile, showToast }) => {
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
        chance: numScore >= u.score ? (isAr ? 'عالي جداً' : 'Very High') : (isAr ? 'متوسط' : 'Medium')
      }));
      setMatchingUnis(matches.slice(0, 3));

      setAnalyzing(false);
      const updated = { ...userProfile, weightedScore: `${score}%` };
      setUserProfile(updated);
      onSaveProfile(updated);
      showToast(isAr ? 'تم حساب المؤشر الموزون وحفظه بأمان!' : 'Calculated and securely backed up weighted index!');
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-theme-primary relative">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'العودة للأدوات' : 'Back to Tools'}
        </button>
        
        <h2 className="text-5xl md:text-7xl mb-12 font-display-en font-black">
          {isAr ? 'فرز القبول الموزون' : 'Weighted Admission Sorting'}
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12 text-black">
          <div className="bg-theme-secondary p-10 rounded-[2.5rem] border-4 border-theme shadow-brutal">
            {[
              { label: isAr ? 'المعدل التراكمي للثانوية' : 'High School GPA', val: gpa, set: setGpa, color: 'text-[var(--accent-lilac)]' },
              { label: isAr ? 'درجة القدرات' : 'Qudrat Score', val: qudrat, set: setQudrat, color: 'text-[var(--accent-mint)]' },
              { label: isAr ? 'درجة التحصيلي' : 'Tahsili Score', val: tahsili, set: setTahsili, color: 'text-[var(--accent-peach)]' },
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
                {analyzing ? (isAr ? 'جاري تحليل المقاييس...' : 'Analyzing Metrics...') : (isAr ? 'حساب المطابقة الرسمية' : 'Calculate Official Match')}
              </button>
            </Magnetic>
          </div>

          <div className="flex flex-col justify-center items-center">
            {result ? (
              <div className="w-full page-enter">
                <div className="text-center mb-10 text-theme-primary">
                  <p className="text-2xl font-bold mb-4">{isAr ? 'النسبة الموزونة الرسمية (30-30-40)' : 'Official Weighted Score (30-30-40)'}</p>
                  <div className="text-8xl md:text-9xl text-[var(--accent-coral)] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] font-display-en font-black">
                    {result}<span className="text-4xl text-theme-primary">%</span>
                  </div>
                </div>
                
                <div className="bg-theme-secondary border-4 border-theme p-8 rounded-3xl shadow-brutal relative overflow-hidden mb-6">
                   <h4 className="font-bold text-2xl mb-6 flex items-center gap-3 relative z-10 text-theme-primary">
                     <Sparkles className="w-8 h-8 text-[var(--accent-lilac)]"/> 
                     {isAr ? 'تطابقات الجامعات الواقعية:' : 'Realistic Universities Matches:'}
                   </h4>
                   <ul className="space-y-4 font-bold text-xl relative z-10 text-black">
                     {matchingUnis.map((u, i) => (
                       <li key={i} className="p-5 rounded-2xl border-4 border-theme flex flex-col md:flex-row justify-between shadow-[4px_4px_0_rgba(0,0,0,1)] bg-white" style={{backgroundColor: `var(--accent-${['mint', 'peach', 'yellow'][i]})`}}>
                         <span>{isAr ? u.ar : u.en}</span> 
                         <span className="bg-white/80 px-2 py-1 rounded text-sm mt-2 md:mt-0 self-start">{isAr ? 'الفرصة:' : 'Chance:'} {u.chance}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-30">
                <Calculator className="w-40 h-40 mx-auto mb-8 text-theme-primary" />
                <p className="text-3xl font-display-en">
                  {isAr ? 'أدخل درجاتك القياسية لرؤية مطابقات الجامعات الحقيقية' : 'Enter standard scores to see real university matches'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
