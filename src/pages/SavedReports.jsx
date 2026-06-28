import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { ArrowLeft, ArrowRight, BrainCircuit, FileText, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SavedReports = ({ isAr, setPage, userContext }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const appId = 'masari-academic-decoder';
        const firestore = getFirestore();
        
        const reportsRef = collection(firestore, 'artifacts', appId, 'users', user.uid, 'saved_reports');
        const querySnapshot = await getDocs(reportsRef);
        
        const fetched = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        
        fetched.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReports(fetched);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  const handleDownloadReport = (report) => {
    const element = document.createElement("a");
    const file = new Blob([`${report.title}\n\n${report.content}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${report.title.replace(/\s+/g, '_')}_Masari.txt`;
    document.body.appendChild(element); 
    element.click();
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 max-w-[1200px] mx-auto text-theme-primary">
      <button onClick={() => setPage('home')} className="clickable-card mb-8 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors px-4 py-2 border-2 border-transparent hover:border-theme rounded-full">
        {isAr ? <ArrowRight className="w-6 h-6"/> : <ArrowLeft className="w-6 h-6"/>} 
        {isAr ? 'العودة للرئيسية' : 'Back to Home'}
      </button>

      <div className="mb-12">
        <h2 className="text-5xl md:text-7xl font-black mb-4 font-display-en">
          {isAr ? 'التقارير المحفوظة' : 'Saved Reports'}
        </h2>
        <p className="text-xl opacity-70">
          {isAr ? 'جميع التقارير الذكية التي قمت بإنشائها وحفظها بأمان على مساري.' : 'All the cognitive reports you generated and securely saved on Masari.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><BrainCircuit className="w-16 h-16 animate-pulse" /></div>
      ) : reports.length === 0 ? (
        <div className="bg-theme-secondary border-4 border-theme p-12 rounded-[2.5rem] shadow-brutal text-center text-black">
           <FileText className="w-24 h-24 mx-auto mb-6 opacity-20" />
           <h3 className="text-2xl font-black">{isAr ? 'لا توجد تقارير محفوظة' : 'No Saved Artifacts'}</h3>
           <p className="mt-2 opacity-70">{isAr ? 'استخدم أدوات الذكاء الاصطناعي واضغط على زر حفظ لتخزين التقارير هنا.' : 'Use AI tools and hit the Save button to store reports here.'}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-theme-secondary border-4 border-theme p-6 rounded-3xl shadow-brutal flex flex-col justify-between text-black">
              <div>
                <h4 className="font-black text-xl mb-2">{r.title}</h4>
                <p className="text-xs font-bold opacity-50 mb-4">{new Date(r.date).toLocaleDateString()}</p>
                <div className="line-clamp-4 text-sm font-medium opacity-80 mb-6 bg-gray-100 p-3 rounded-xl border-2 border-black">
                  {r.content.substring(0, 150)}...
                </div>
              </div>
              <button 
                onClick={() => handleDownloadReport(r)}
                className="w-full py-3 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--accent-mint)] hover:text-black border-2 border-transparent hover:border-black transition-colors"
              >
                <Download className="w-4 h-4" />
                {isAr ? 'تنزيل ملف نصي' : 'Download Txt'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
