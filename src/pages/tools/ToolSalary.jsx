import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Magnetic } from '../../components/ui/Magnetic';

export const ToolSalary = ({ isAr, setPage, userContext }) => {
  const [experience, setExperience] = useState(2);
  const [selectedMajor, setSelectedMajor] = useState('cs');

  const majors = {
    cs: { name: isAr ? 'Computer Science' : 'Computer Science', base: 12000, growth: 1.15 },
    med: { name: isAr ? 'Medicine' : 'Medicine', base: 18000, growth: 1.08 },
    bus: { name: isAr ? 'Business Admin' : 'Business Admin', base: 9000, growth: 1.12 },
    eng: { name: isAr ? 'Engineering' : 'Engineering', base: 11000, growth: 1.10 },
  };

  const calculateSalary = (base, growth, years) => Math.round(base * Math.pow(growth, years));

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-theme-primary">
      <div className="max-w-[1200px] mx-auto text-black">
        <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card mb-12 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'العودة للأدوات' : 'Back to Tools'}
        </button>

        <h2 className="text-5xl md:text-7xl mb-4 text-theme-primary font-display-en font-black">
          {isAr ? 'منحنى نمو الرواتب' : 'Salary Growth Curve'}
        </h2>
        <p className="text-xl opacity-70 mb-12 max-w-2xl text-theme-primary">
          {isAr ? 'توقع مسار نمو راتبك بناءً على سنوات الخبرة.' : 'Forecast your salary growth trajectory based on experience.'}
        </p>

        <div className="grid lg:grid-cols-12 gap-8 text-black">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-theme-secondary border-4 border-black p-8 rounded-3xl shadow-brutal text-theme-primary">
              <h3 className="font-bold text-2xl mb-6">{isAr ? 'اختر التخصص' : 'Select Major'}</h3>
              <div className="flex flex-col gap-4">
                {Object.entries(majors).map(([key, data]) => (
                  <button
                    key={key} onClick={() => setSelectedMajor(key)}
                    className={`p-4 rounded-xl border-4 font-bold text-lg transition-all text-left rtl:text-right flex justify-between items-center ${selectedMajor === key ? 'border-black bg-[var(--accent-mint)] text-black shadow-[4px_4px_0_#000]' : 'border-transparent bg-theme-primary text-theme-primary hover:border-black'}`}
                  >
                    {data.name}
                    {selectedMajor === key && <CheckCircle2 className="w-6 h-6" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-theme-secondary border-4 border-black p-8 rounded-3xl shadow-brutal text-theme-primary">
               <h3 className="font-bold text-2xl mb-6 flex justify-between">
                 <span>{isAr ? 'الخبرة' : 'Experience'}</span>
                 <span className="text-[var(--accent-coral)]">{experience} {isAr ? 'سنوات' : 'Yrs'}</span>
               </h3>
               <input 
                  type="range" min="0" max="15" value={experience} onChange={(e) => setExperience(Number(e.target.value))}
                  className="clickable-card"
               />
            </div>
          </div>

          <div className="lg:col-span-8 bg-theme-secondary border-4 border-black p-8 md:p-12 rounded-[2.5rem] shadow-brutal flex flex-col justify-between text-theme-primary">
            <div>
              <div className="inline-block p-3 bg-[var(--accent-lilac)] text-black rounded-2xl border-4 border-black font-bold mb-8 shadow-[4px_4px_0_#000]">
                {majors[selectedMajor].name}
              </div>
              <p className="text-xl font-bold opacity-70 mb-2">{isAr ? 'الراتب الشهري المتوقع' : 'Expected Monthly Salary'}</p>
              <div className="text-6xl md:text-8xl text-[var(--accent-peach)] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] font-display-en font-black">
                {calculateSalary(majors[selectedMajor].base, majors[selectedMajor].growth, experience).toLocaleString()}
                <span className="text-3xl text-theme-primary ml-2">{isAr ? 'ريال' : 'SAR'}</span>
              </div>
            </div>

            <div className="mt-16 h-64 flex items-end gap-2 md:gap-4 w-full">
              {[0, 3, 5, 10, 15].map((year) => {
                const sal = calculateSalary(majors[selectedMajor].base, majors[selectedMajor].growth, year);
                const maxSal = calculateSalary(majors[selectedMajor].base, majors[selectedMajor].growth, 15);
                const heightPct = (sal / maxSal) * 100;

                return (
                  <div key={year} className="flex-1 flex flex-col items-center gap-4 group text-theme-primary">
                    <div className="opacity-0 group-hover:opacity-100 font-bold text-sm bg-theme-secondary px-2 py-1 rounded border-2 border-black transition-opacity">
                      {sal / 1000}k
                    </div>
                    <div 
                      className={`w-full rounded-t-xl border-4 border-b-0 border-black transition-all duration-700 ease-out flex items-end justify-center pb-4 ${year <= experience ? 'bg-[var(--accent-mint)]' : 'bg-theme-secondary opacity-50'}`}
                      style={{ height: `${Math.max(10, heightPct)}%` }}
                    ></div>
                    <div className="font-bold">{year}{isAr ? 'سنة' : 'y'}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
