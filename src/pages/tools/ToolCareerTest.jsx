import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Bot, Sparkles } from 'lucide-react';
import { generate50Questions } from '../../data/questions';
import { generate100Majors } from '../../data/majors';
import { callLMStudio } from '../../config/lmStudio';
import { NeoMarkdown } from '../../components/ui/NeoMarkdown';

export const ToolCareerTest = ({ 
  isAr, 
  setPage, 
  userContext, 
  userProfile, 
  setUserProfile, 
  onSaveProfile, 
  showToast, 
  onCheckPoints,
  onDeductPoints 
}) => {
  const QUESTIONS = generate50Questions();
  const MAJORS = generate100Majors();

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [scores, setScores] = useState({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [aiPerspective, setAiPerspective] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAIPerspective = async () => {
    if (onCheckPoints && !onCheckPoints(10)) return;
    setAiLoading(true);
    const topMajors = results.map(r => isAr ? r.ar : r.en).join(', ');
    const langInst = isAr 
      ? 'MUST WRITE ENTIRELY IN ARABIC. DO NOT USE ENGLISH.' 
      : 'MUST WRITE ENTIRELY IN ENGLISH. DO NOT USE ARABIC.';
    const prompt = `Based on a RIASEC score of Realistic:${scores.R}, Investigative:${scores.I}, Artistic:${scores.A}, Social:${scores.S}, Enterprising:${scores.E}, Conventional:${scores.C}, and top recommended majors: ${topMajors}, provide a concise, insightful career perspective for this user. Speak directly to them in the second person. Do not use more than 2 paragraphs. ${langInst}`;
    const fallbackText = isAr ? 'تعذر جلب التحليل في الوقت الحالي. حاول مجدداً.' : 'Failed to fetch analysis at this time. Try again.';
    
    try {
      const res = await callLMStudio(
        'You are an expert AI Career Counselor.',
        prompt,
        fallbackText
      );
      
      const isFallback = res === fallbackText;
      if (!isFallback && onDeductPoints) {
        onDeductPoints(10);
      }
      
      setAiPerspective(res);
    } catch (e) {
      console.error(e);
      setAiPerspective(fallbackText);
    } finally {
      setAiLoading(false);
    }
  };

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
        R: { en: 'Realistic Craftsman', ar: 'الحرفي الواقعي البارع' },
        I: { en: 'Quantum Investigator', ar: 'المحقق الكمي والمحلل الفذ' },
        A: { en: 'Avant-Garde Alchemist', ar: 'الخيميائي الفني المبتكر' },
        S: { en: 'Empathetic Catalyst', ar: 'المحفز الإنساني المتعاطف' },
        E: { en: 'Unstoppable Visionary', ar: 'الريادي الطموح الملهم' },
        C: { en: 'Systems Architect', ar: 'مهندس الأنظمة الدقيقة' }
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
          {isAr ? 'العودة للأدوات' : 'Back to Tools'}
        </button>
        
        <div className="mb-12">
          <h2 className="text-5xl md:text-7xl mb-4 font-display-en font-black">
            {isAr ? 'المخطط الشامل (50 سؤال)' : 'Comprehensive Blueprint (50 Qs)'}
          </h2>
          <p className="text-xl font-bold opacity-70">
            {isAr ? 'يتم مطابقة سماتك مع 100 تخصص أكاديمي دقيق.' : 'Your traits are mapped against 100 precise academic majors.'}
          </p>
        </div>

        {!results ? (
          <div className="bg-theme-secondary p-8 md:p-12 rounded-[3rem] border-4 border-theme shadow-brutal relative page-enter text-black">
            <div className="flex justify-between font-bold mb-2">
               <span>{isAr ? 'التقدم' : 'Progress'}</span>
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
                <span className="font-bold opacity-60 text-sm md:text-base hidden md:block">{isAr ? 'لا أوافق بشدة' : 'Strongly Disagree'}</span>
                {[1, 2, 3, 4, 5].map((val) => (
                  <div key={val} className="flex flex-col items-center gap-2">
                    <input 
                      type="radio" name="likert" className="likert-radio"
                      checked={answers[currentQ] === val}
                      onChange={() => handleAnswer(val)}
                    />
                  </div>
                ))}
                <span className="font-bold opacity-60 text-sm md:text-base hidden md:block">{isAr ? 'أوافق بشدة' : 'Strongly Agree'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="page-enter">
            
            {/* Visual RIASEC Bar Graph */}
            <div className="bg-theme-secondary p-8 rounded-[2.5rem] border-4 border-theme shadow-brutal mb-12 text-black">
              <h3 className="text-2xl font-black mb-6">{isAr ? 'توزيع شخصيتك' : 'Your Personality Distribution'}</h3>
              <div className="flex items-end gap-2 md:gap-4 h-48 border-b-4 border-black pb-2">
                {[
                  { k: 'R', c: 'bg-[var(--accent-peach)]', l: isAr ? 'واقعي' : 'Realistic' },
                  { k: 'I', c: 'bg-[var(--accent-mint)]', l: isAr ? 'باحث / استقصائي' : 'Investigative' },
                  { k: 'A', c: 'bg-[var(--accent-yellow)]', l: isAr ? 'فني / مبدع' : 'Artistic' },
                  { k: 'S', c: 'bg-[var(--accent-lilac)]', l: isAr ? 'اجتماعي' : 'Social' },
                  { k: 'E', c: 'bg-[var(--accent-coral)]', l: isAr ? 'مبادر / ريادي' : 'Enterprising' },
                  { k: 'C', c: 'bg-black', l: isAr ? 'تقليدي / منظم' : 'Conventional', t: 'text-white' }
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

            <h3 className="text-3xl font-black mb-8">{isAr ? 'أفضل 5 تخصصات متطابقة بدقة:' : 'Top 5 Precision Matching Majors:'}</h3>
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
                    <div className="text-5xl font-black text-[var(--accent-peach)] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] font-display-en">{r.match}%</div>
                    <span className="opacity-70 font-bold uppercase text-sm tracking-wider">{isAr ? 'تطابق' : 'Match'}</span>
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
                {isAr ? 'عرض ومشاركة البطاقة المهنية' : 'View & Share Career ID Card'}
              </button>

              {!aiPerspective && (
                <button 
                  onClick={handleAIPerspective}
                  disabled={aiLoading}
                  className="w-full md:w-auto py-5 px-10 bg-[var(--accent-coral)] text-black rounded-full font-black text-xl border-4 border-theme shadow-brutal-hover flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                >
                  {aiLoading ? (
                    <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Bot className="w-6 h-6" />
                  )}
                  {isAr ? 'رؤية الذكاء الاصطناعي (10 نقاط)' : 'AI Better View (10 Points)'}
                </button>
              )}
            </div>

            {aiPerspective && (
              <div className="mt-12 bg-theme-secondary p-8 rounded-[2.5rem] border-4 border-theme shadow-brutal text-black page-enter">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                  <Bot className="w-8 h-8 text-[var(--accent-coral)]" />
                  {isAr ? 'رؤية الذكاء الاصطناعي المهنية' : 'Deep AI Career Perspective'}
                </h3>
                <div className="font-semibold text-lg opacity-90">
                  <NeoMarkdown text={aiPerspective} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
