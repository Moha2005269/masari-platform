import React from 'react';
import { GraduationCap, Briefcase } from 'lucide-react';
import { AbstractShape1, AbstractShape2, DecorativeStar } from '../components/ui/Shapes';
import { TrackingEye } from '../components/ui/TrackingEye';
import { Magnetic } from '../components/ui/Magnetic';
import { ThreeDTilt } from '../components/ui/ThreeDTilt';

export const Home = ({ isAr, setPage, setUserContext, mouseX, mouseY, userProfile }) => {
  const handleProtectedAction = (context, pageTarget) => {
    setUserContext(context);
    if (!userProfile.isLoggedIn) {
      setPage('auth_signup');
    } else {
      setPage(pageTarget);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 animate-pulse-slow" style={{ transform: `translate(${(mouseX - window.innerWidth/2) * -0.02}px, ${(mouseY - window.innerHeight/2) * -0.02}px)` }}>
        <AbstractShape1 className="absolute top-[15%] right-[10%] w-64 h-64 text-[var(--accent-lilac)] animate-float opacity-90 drop-shadow-[8px_8px_0_var(--shadow-color)]" />
        <AbstractShape2 className="absolute bottom-[10%] left-[5%] w-80 h-80 text-[var(--accent-mint)] animate-float opacity-90 drop-shadow-[8px_8px_0_var(--shadow-color)]" style={{ animationDelay: '1s' }} />
        <DecorativeStar className="absolute top-[30%] left-[20%] w-16 h-16 text-[var(--accent-peach)] animate-spin-slow drop-shadow-[4px_4px_0_var(--shadow-color)]" />
      </div>

      <div className="relative z-10 text-center max-w-[1400px] mx-auto flex flex-col items-center">
        <h1 className="text-giant text-theme-primary mb-4 font-display-en italic font-black">
          {isAr ? 'مساري' : 'Masari'}
        </h1>
        
        <div className="flex items-center gap-6 md:gap-12 flex-wrap justify-center">
           <TrackingEye mouseX={mouseX} mouseY={mouseY} />
           <h1 className="text-giant text-theme-primary font-display-en font-black">
             {isAr ? 'مفكك الرموز' : 'Decoded'}
           </h1>
        </div>
        
        <p className="mt-12 text-xl md:text-2xl font-semibold max-w-2xl mx-auto text-theme-primary opacity-80 leading-relaxed">
          {isAr 
            ? 'مفكك الرموز الأكاديمية والمهنية المتميز. ارسم مسار وظائفك عالية الدخل، وتوقعات رواتب 2026، واحفظ تقاريرك ومستنداتك.' 
            : 'A premium, neobrutalist career decoder. Map high-paying targets, expected 2026 salaries, and structure printable credentials.'}
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Magnetic strength={0.4}>
            <ThreeDTilt intensity={10}>
              <button 
                onClick={() => handleProtectedAction('student', 'dashboard_student')}
                className="clickable-card group relative bg-theme-primary border-4 border-theme text-theme-primary px-8 py-4 rounded-[2rem] font-black text-xl overflow-hidden shadow-brutal-hover flex flex-col items-center justify-center min-w-[280px]"
              >
                <div className="relative z-10 flex flex-col items-center gap-2 w-full transition-transform duration-500">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-[var(--accent-lilac)]" />
                    <span>{isAr ? 'مخطط الطلاب والقبول' : 'Academic Planner (Student)'}</span>
                  </div>
                </div>
              </button>
            </ThreeDTilt>
          </Magnetic>

          <Magnetic strength={0.4}>
            <ThreeDTilt intensity={10}>
              <button 
                onClick={() => handleProtectedAction('pro', 'dashboard_pro')}
                className="clickable-card group relative bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-[2rem] font-black text-xl overflow-hidden shadow-brutal-hover min-w-[280px] flex items-center justify-center border-4 border-transparent"
              >
                 <div className="relative z-10 flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-[var(--accent-mint)]" />
                  <span>{isAr ? 'باقة أدوات المحترفين' : 'Professional Suite (Pro)'}</span>
                </div>
              </button>
            </ThreeDTilt>
          </Magnetic>
        </div>
      </div>
    </div>
  );
};
