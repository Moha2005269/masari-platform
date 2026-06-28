import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Search, Globe, MapPin, Trophy, Star, ChevronUp, ChevronDown, Download, Save, Building2 } from 'lucide-react';
import { SAUDI_UNIVERSITIES } from '../../data/universities';
import { useSaveReport } from '../../hooks/useSaveReport';
import { callLMStudio } from '../../config/lmStudio';
import { NeoMarkdown } from '../../components/ui/NeoMarkdown';

export const ToolUniversityDirectory = ({ isAr, setPage, userContext, userProfile, setUserProfile, onSaveProfile, showToast, onCheckPoints, onDeductPoints }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [unlockedLocalUnis, setUnlockedLocalUnis] = useState([]);
  
  const handleToggleUni = (uniId) => {
    if (expandedId === uniId) {
      setExpandedId(null);
      return;
    }

    const isBro = userProfile.subscriptionTier === 'bro';
    const isUnlocked = unlockedLocalUnis.includes(uniId);

    if (isBro || isUnlocked) {
      setExpandedId(uniId);
      return;
    }

    // Checking and billing 5 points for going to specific university details
    if (onCheckPoints && !onCheckPoints(5)) {
      return;
    }

    if (onDeductPoints) {
      onDeductPoints(5);
    }
    setUnlockedLocalUnis(prev => [...prev, uniId]);
    setExpandedId(uniId);
  };
  
  const saveReport = useSaveReport(userProfile, setUserProfile, onSaveProfile, showToast, isAr);

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;

    if (onCheckPoints && !onCheckPoints(5)) {
      return;
    }

    setLoading(true);
    const langInst = isAr 
      ? 'MUST WRITE ENTIRELY IN ARABIC. DO NOT USE ENGLISH.' 
      : 'MUST WRITE ENTIRELY IN ENGLISH. DO NOT USE ARABIC.';
    const systemPrompt = `You are a global academic registrar. Use web search targeting specific websites (e.g., site:topuniversities.com, site:timeshighereducation.com, site:usnews.com) to find the most up-to-date admission requirements. You MUST format the output exactly as follows: \n1. University Name\n2. QS Ranking & Times Higher Education (THE) Ranking\n3. Minimum GPA & Test Requirements\n4. Acceptance Rate Estimate\n5. Top Ranked Programs. \nUse Markdown lists and tables. ${langInst}`;
    const query = `Search specific websites (e.g., site:topuniversities.com, site:timeshighereducation.com) to provide structured admission criteria, tuition, rankings, and top programs for: ${searchQuery}. Show in Markdown.`;
    const fallback = isAr ? `### معايير القبول لـ ${searchQuery}\n\n- البيانات غير متوفرة حالياً. يرجى مراجعة الموقع الرسمي للجامعة.` : `### Admissions benchmarks for ${searchQuery}\n\n- Data unavailable. Please check the official university website.`;
    
    try {
      const response = await callLMStudio(systemPrompt, query, fallback, true);
      
      const isFallback = response === fallback;
      if (!isFallback && onDeductPoints) {
        onDeductPoints(5);
      }
      
      setResult(response);
    } catch (e) {
      console.error(e);
      setResult(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `University_Report.txt`;
    document.body.appendChild(element); 
    element.click();
  };

  const filteredUnis = SAUDI_UNIVERSITIES.filter(u => {
    const matchesSearch = (u.ar.includes(localSearch) || u.en.toLowerCase().includes(localSearch.toLowerCase()));
    const matchesFilter = filterType === 'All' || 
                          (filterType === 'Public' && u.typeEn === 'Public') || 
                          (filterType === 'Private' && u.typeEn === 'Private') ||
                          (filterType === 'Top 500 QS' && u.qs <= 500);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 relative text-theme-primary">
      <div className="max-w-[1200px] mx-auto bg-theme-secondary border-4 border-black p-6 md:p-12 rounded-[2.5rem] shadow-brutal text-black">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-8 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'العودة للأدوات' : 'Back to Tools'}
        </button>

        <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
           <div>
             <h3 className="text-4xl md:text-5xl font-black mb-4">{isAr ? 'دليل الجامعات' : 'University Directory'}</h3>
             <p className="font-bold opacity-70 max-w-xl">
               {isAr 
                 ? 'استكشف أكبر قاعدة بيانات للجامعات السعودية مع تصنيفات QS و THE العالمية، أو استخدم الذكاء الاصطناعي للبحث عن الجامعات الدولية.' 
                 : 'Explore the largest KSA university database with global QS/THE rankings, or use AI for custom international searches.'}
             </p>
           </div>
           <Building2 className="w-20 h-20 text-[var(--accent-lilac)] opacity-40" />
        </div>
        
        {/* FREE Saudi Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 bg-[var(--accent-mint)] border-2 border-black font-black text-xs rounded-full shadow-[2px_2px_0_#000] free-badge">{isAr ? 'مجاني' : 'FREE'}</div>
            <h4 className="text-2xl font-bold">{isAr ? 'أهم الجامعات السعودية وتصنيفاتها:' : 'Major Saudi Universities & Rankings:'}</h4>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-4 w-5 h-5 opacity-50 rtl:right-4 rtl:left-auto" />
                <input 
                  type="text" value={localSearch} onChange={e => setLocalSearch(e.target.value)}
                  placeholder={isAr ? 'ابحث عن جامعة سعودية...' : 'Search local university...'}
                  className="w-full bg-theme-primary border-4 border-black p-3 pl-12 rtl:pr-12 rtl:pl-4 rounded-xl font-bold focus:bg-[var(--accent-yellow)] transition-colors"
                />
             </div>
             <div className="flex flex-wrap gap-2">
               {['All', 'Public', 'Private', 'Top 500 QS'].map(f => (
                 <button 
                   key={f} onClick={() => setFilterType(f)}
                   className={`px-4 py-3 rounded-xl border-2 border-black font-bold text-sm transition-all shadow-[2px_2px_0_#000] ${filterType === f ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                 >
                   {f === 'All' ? (isAr ? 'الكل' : 'All') : f === 'Public' ? (isAr ? 'حكومية' : 'Public') : f === 'Private' ? (isAr ? 'أهلية' : 'Private') : (isAr ? 'أفضل 500 QS' : 'Top 500 QS')}
                 </button>
               ))}
             </div>
          </div>

          {filteredUnis.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center bg-theme-primary border-4 border-black rounded-3xl border-dashed">
               <Globe className="w-16 h-16 opacity-20 mb-4 animate-spin-slow" />
               <p className="font-bold text-xl">{isAr ? 'لم يتم العثور على جامعات سعودية مطابقة.' : 'No matching local universities found.'}</p>
               <p className="opacity-70 font-semibold">{isAr ? 'جرب استخدام البحث الدولي بالذكاء الاصطناعي أدناه.' : 'Try using the Global AI Search below.'}</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredUnis.map((uni) => (
                <div key={uni.id} className="bg-theme-primary border-4 border-black rounded-2xl flex flex-col transition-all shadow-brutal overflow-hidden">
                  
                  <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center text-2xl shadow-[2px_2px_0_#000] shrink-0" style={{backgroundColor: uni.color}}>
                           {uni.icon}
                         </div>
                         <div>
                           <h5 className="font-black text-lg md:text-xl leading-tight">{isAr ? uni.ar : uni.en}</h5>
                           <div className="flex items-center gap-2 mt-1 text-xs font-bold opacity-70">
                             <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {isAr ? uni.cityAr : uni.cityEn}</span>
                             <span>•</span>
                             <span className={uni.typeEn === 'Public' ? 'text-green-700' : 'text-purple-700'}>{isAr ? uni.typeAr : uni.typeEn}</span>
                           </div>
                         </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                       <div className="bg-[#FFD6A5] border-2 border-black px-2 py-1 rounded-md flex items-center gap-1 text-xs font-black shadow-[2px_2px_0_#000]">
                         <Trophy className="w-3 h-3" /> QS: #{uni.qs}
                       </div>
                       <div className="bg-[#B8E0D2] border-2 border-black px-2 py-1 rounded-md flex items-center gap-1 text-xs font-black shadow-[2px_2px_0_#000]">
                         <Star className="w-3 h-3" /> THE: #{uni.the}
                       </div>
                    </div>

                    <p className="text-sm font-bold opacity-80 mb-4 h-10 line-clamp-2">{isAr ? uni.descAr : uni.descEn}</p>

                    <div className="mt-auto">
                      <div className="flex justify-between text-xs font-black mb-1">
                        <span>{isAr ? 'صعوبة القبول' : 'Acceptance Difficulty'}</span>
                        <span>{uni.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden border border-black">
                         <div className="h-full bg-black transition-all" style={{width: `${uni.score}%`}}></div>
                      </div>
                    </div>
                  </div>

                  {/* Accordion Toggle */}
                  <div className="border-t-4 border-black">
                     <button 
                       onClick={() => handleToggleUni(uni.id)}
                       className="w-full p-3 bg-gray-100 hover:bg-[var(--accent-mint)] flex justify-center items-center gap-2 font-black text-sm transition-colors"
                     >
                       {expandedId === uni.id ? (isAr ? 'إخفاء التفاصيل' : 'Hide Details') : (isAr ? 'عرض شروط القبول والتفاصيل' : 'View Admission Requirements')}
                       {expandedId === uni.id ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                     </button>
                     
                     {expandedId === uni.id && (
                       <div className="p-5 bg-white border-t-2 border-dashed border-black page-enter space-y-4">
                         <div>
                           <span className="text-xs font-black opacity-50 uppercase tracking-widest block mb-1">{isAr ? 'معايير الموزونة:' : 'Weighted Criteria:'}</span>
                           <div className="font-mono text-sm font-bold bg-[var(--bg-primary)] p-2 rounded border-2 border-black inline-block">{uni.req}</div>
                         </div>
                         <div>
                           <span className="text-xs font-black opacity-50 uppercase tracking-widest block mb-1">{isAr ? 'أبرز المسارات الأكاديمية:' : 'Prominent Academic Tracks:'}</span>
                           <div className="font-bold text-sm text-[var(--accent-coral)]">{isAr ? uni.tracks.ar : uni.tracks.en}</div>
                         </div>
                       </div>
                     )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full h-2 bg-black rounded-full mb-16 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1/3 h-full bg-[var(--accent-coral)] animate-shineSweep"></div>
        </div>

        {/* PAID AI International Search */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-[var(--accent-yellow)] border-2 border-black font-black text-xs rounded-full shadow-[2px_2px_0_#000]">5 Pts</div>
            <h4 className="text-2xl font-bold">{isAr ? 'البحث عن الجامعات العالمية بالذكاء الاصطناعي:' : 'AI Global/Custom University Search:'}</h4>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'مثال: جامعة هارفارد أو معهد ماساتشوستس للتكنولوجيا' : 'e.g. Harvard University or MIT'}
              className="flex-1 bg-white border-4 border-black p-5 rounded-2xl font-bold text-xl"
            />
            <button 
              onClick={handleAISearch} disabled={loading}
              className="py-5 px-8 bg-black text-white border-4 border-transparent font-black text-xl rounded-2xl shadow-brutal-hover disabled:opacity-50 transition-all flex items-center justify-center gap-3"
            >
              <Globe className="w-6 h-6" />
              {loading ? (isAr ? 'جاري البحث عالمياً...' : 'Searching Global...') : (isAr ? 'البحث العميق عالمياً' : 'DeepSearch Global')}
            </button>
          </div>

          {result && (
            <div className="mt-8 page-enter border-t-4 border-black pt-8">
              <NeoMarkdown text={result} />
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleDownload} className="py-4 px-6 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-brutal-hover">
                  <Download className="w-5 h-5" />
                  {isAr ? 'تنزيل ملف نصي' : 'Download Txt'}
                </button>
                <button onClick={() => saveReport(isAr ? `دليل: ${searchQuery}` : `Directory: ${searchQuery}`, result)} className="py-4 px-6 bg-[var(--accent-mint)] border-2 border-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--accent-lilac)] transition-colors shadow-brutal-hover">
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
