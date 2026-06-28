import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Download, Save } from 'lucide-react';
import { callLMStudio } from '../config/lmStudio';
import { NeoMarkdown } from './ui/NeoMarkdown';

export const AIToolPage = ({ 
  isAr, 
  setPage, 
  userContext, 
  userProfile, 
  setUserProfile, 
  onSaveProfile, 
  showToast,
  onCheckPoints,
  onDeductPoints,
  pointsCost = 0,
  
  // Tool Config Props:
  titleAr,
  titleEn,
  useProfilePersona,
  hasInput2,
  ph1Ar,
  ph1En,
  ph2Ar,
  ph2En,
  btnAr,
  btnEn,
  btnColor,
  textColor = 'text-black',
  icon,
  systemRole,
  buildQuery,
  fallbackAr,
  fallbackEn,
  useSearchPlugins,
  visualGraph
}) => {
  const [input1, setInput1] = useState(useProfilePersona ? userProfile.careerPersona || '' : '');
  const [input2, setInput2] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const saveReport = async (title, content) => {
    if (!userProfile.isLoggedIn) {
      showToast(isAr ? 'يجب تسجيل الدخول لحفظ التقارير!' : 'You must be logged in to save reports!');
      return;
    }
    
    try {
      const appId = 'masari-academic-decoder';
      const { getFirestore, collection, addDoc } = await import('firebase/firestore');
      const { getAuth } = await import('firebase/auth');
      const firestore = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No user object");

      const docData = {
        title,
        content,
        date: new Date().toISOString(),
      };
      
      const reportsRef = collection(firestore, 'artifacts', appId, 'users', user.uid, 'saved_reports');
      await addDoc(reportsRef, docData);
      
      showToast(isAr ? 'تم حفظ التقرير بنجاح! تجده في قائمة تقاريرك.' : 'Report saved to your artifacts successfully!');
    } catch(e) {
      console.error(e);
      showToast(isAr ? 'حدث خطأ أثناء حفظ التقرير.' : 'Error saving report.');
    }
  };

  const handleGenerate = async () => {
    if (!input1.trim()) return;
    
    // Check points first
    if (onCheckPoints && !onCheckPoints(pointsCost)) {
      return;
    }

    setLoading(false); // reset state just in case
    setLoading(true);
    
    const langInst = isAr 
      ? 'MUST WRITE ENTIRELY IN ARABIC. DO NOT USE ENGLISH.' 
      : 'MUST WRITE ENTIRELY IN ENGLISH. DO NOT USE ARABIC.';
    const systemPrompt = `${systemRole} Use Markdown extensively (###, -, **). ${langInst}`;
    const query = buildQuery(input1, input2);
    
    try {
      const result = await callLMStudio(systemPrompt, query, isAr ? fallbackAr : fallbackEn, useSearchPlugins);
      
      // Deduct points only if AI responded successfully (not hit catch or empty fallback)
      const isFallback = result === (isAr ? fallbackAr : fallbackEn);
      if (!isFallback && onDeductPoints) {
        onDeductPoints(pointsCost);
      }
      
      setOutput(result);
    } catch (e) {
      console.error(e);
      setOutput(isAr ? fallbackAr : fallbackEn);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([output], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${(isAr ? titleAr : titleEn).replace(/\s+/g, '_')}_Report.txt`;
    document.body.appendChild(element); 
    element.click();
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 relative text-theme-primary">
      <div className="max-w-[1000px] mx-auto bg-theme-secondary border-4 border-black p-8 md:p-12 rounded-[2.5rem] shadow-brutal text-black">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'العودة للأدوات' : 'Back to Tools'}
        </button>

        <h3 className="text-4xl font-black mb-8">{isAr ? titleAr : titleEn}</h3>
        
        <div className="space-y-6">
          <input 
            type="text" value={input1} onChange={e => setInput1(e.target.value)}
            placeholder={isAr ? ph1Ar : ph1En}
            className="w-full bg-theme-primary border-4 border-black p-5 rounded-2xl font-bold text-xl"
          />
          {hasInput2 && (
            <input 
              type="text" value={input2} onChange={e => setInput2(e.target.value)}
              placeholder={isAr ? ph2Ar : ph2En}
              className="w-full bg-theme-primary border-4 border-black p-5 rounded-2xl font-bold text-xl"
            />
          )}
          <button 
            onClick={handleGenerate} disabled={loading}
            className={`w-full py-5 ${btnColor} border-4 border-black font-black text-2xl rounded-2xl shadow-brutal-hover disabled:opacity-50 transition-all flex items-center justify-center gap-3 ${textColor}`}
          >
            {icon}
            {loading ? (isAr ? 'جاري معالجة الطلب...' : 'Processing Request...') : (isAr ? btnAr : btnEn)}
          </button>

          {output && (
            <div className="mt-8 page-enter border-t-4 border-black pt-8">
              {visualGraph && visualGraph(output)}
              <NeoMarkdown text={output} />
              
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleDownload} className="py-4 px-6 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-brutal-hover">
                  <Download className="w-5 h-5" />
                  {isAr ? 'تنزيل ملف نصي' : 'Download Txt'}
                </button>
                <button onClick={() => saveReport(isAr ? titleAr : titleEn, output)} className="py-4 px-6 bg-[var(--accent-mint)] border-2 border-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--accent-lilac)] transition-colors shadow-brutal-hover">
                  <Save className="w-5 h-5" />
                  {isAr ? 'حفظ في التقارير' : 'Save to Artifacts'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
