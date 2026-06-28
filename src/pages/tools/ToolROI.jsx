import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react';

export const ToolROI = ({ isAr, setPage, userContext }) => {
  const [cost, setCost] = useState(150000);
  const [salaryBump, setSalaryBump] = useState(4000);

  const monthsToBreakeven = Math.ceil(cost / salaryBump);
  const yearsToBreakeven = (monthsToBreakeven / 12).toFixed(1);

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-theme-primary">
      <div className="max-w-[1000px] mx-auto text-center">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors mx-auto">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'العودة للأدوات' : 'Back to Tools'}
        </button>

        <h2 className="text-5xl md:text-7xl mb-6 font-display-en font-black">
          {isAr ? 'العائد المالي بعد التخرج' : 'Post-grad ROI'}
        </h2>
        <p className="text-xl opacity-70 mb-16 max-w-2xl mx-auto">
          {isAr ? 'حساب مسار التعادل لمعالمك المهنية.' : 'Calculate your career milestones break-even trajectory.'}
        </p>

        <div className="bg-theme-secondary p-8 md:p-16 rounded-[3rem] border-4 border-theme shadow-brutal flex flex-col md:flex-row gap-12 items-center text-left rtl:text-right text-black">
          
          <div className="flex-1 w-full space-y-12">
            <div>
              <div className="flex justify-between font-bold mb-4 text-2xl">
                <label>{isAr ? 'تكلفة البرنامج' : 'Program Cost'}</label>
                <span className="text-[var(--accent-coral)]">{cost.toLocaleString()}</span>
              </div>
              <input type="range" min="50000" max="400000" step="10000" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-4 text-2xl">
                <label>{isAr ? 'الزيادة المتوقعة في الراتب' : 'Expected Salary Bump'}</label>
                <span className="text-[var(--accent-mint)]">+{salaryBump.toLocaleString()} / mo</span>
              </div>
              <input type="range" min="1000" max="15000" step="500" value={salaryBump} onChange={(e) => setSalaryBump(Number(e.target.value))} />
            </div>
          </div>

          <div className="w-px h-64 bg-theme-primary border-r-4 border-theme hidden md:block"></div>

          <div className="flex-1 text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[var(--accent-lilac)] border-4 border-theme shadow-[6px_6px_0_rgba(0,0,0,1)] mb-8">
               <TrendingUp className="w-16 h-16 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{isAr ? 'نقطة التعادل' : 'Break-even Point'}</h3>
            <div className="text-7xl text-[var(--accent-peach)] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] font-display-en font-black">
              {yearsToBreakeven} <span className="text-3xl text-theme-primary">{isAr ? 'سنوات' : 'Years'}</span>
            </div>
            <p className="mt-4 font-bold opacity-70">
              ({monthsToBreakeven} {isAr ? 'أشهر' : 'months'})
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
