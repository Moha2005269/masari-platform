import React from 'react';
import { 
  ArrowLeft, ArrowRight, BrainCircuit, Activity, Calculator, BookOpen, 
  Briefcase, Globe, Award, Compass, TrendingUp, Bot, Layers, Coins, Search 
} from 'lucide-react';
import { Magnetic } from './ui/Magnetic';
import { TrackingEye } from './ui/TrackingEye';
import { ThreeDTilt } from './ui/ThreeDTilt';

export const Dashboard = ({ isAr, type, setPage, mouseX, mouseY, userProfile, onTriggerTool }) => {
  const isStudent = type === 'student';
  
  const studentFeatures = [
    { id: 'tool_career_test', num: '01', titleAr: 'اختبار تحديد المسار (50 سؤال)', titleEn: 'Career Blueprint (50 Qs)', descAr: 'اختبار دقيق من 50 سؤالاً يغطي مطابقة 100 تخصص أكاديمي.', descEn: 'Robust 50-Question matching test mapping 100 majors.', points: 0, color: 'bg-[var(--accent-peach)]', span: 'span-2', icon: <BrainCircuit className="bento-bg-icon" /> },
    { id: 'tool_ready_test', num: '02', titleAr: 'اختبار الجاهزية (10 أسئلة)', titleEn: 'Readiness Check (10 Qs)', descAr: 'تقييم سريع لمدى جاهزيتك من 10 أسئلة.', descEn: 'A fast 10-question evaluation of your readiness.', points: 0, color: 'bg-[var(--accent-mint)]', span: 'span-2', icon: <Activity className="bento-bg-icon" /> },
    { id: 'tool_calculator', num: '03', titleAr: 'محرك القبول الموزون', titleEn: 'Weighted Admission Engine', descAr: 'حساب ومطابقة قبولك الموزون في السعودية.', descEn: 'Calculate and match your weighted placement in KSA.', points: 0, color: 'bg-[var(--accent-lilac)]', span: 'span-2', icon: <Calculator className="bento-bg-icon" /> },
    { id: 'tool_curriculum', num: '04', titleAr: 'مخطط المنهج الدراسي', titleEn: 'Curriculum Blueprint', descAr: 'تحليل المنهج الدراسي لتخصصك بالذكاء الاصطناعي.', descEn: 'AI-generated curriculum breakdown for your degree.', points: 20, color: 'bg-[var(--accent-yellow)]', icon: <BookOpen className="bento-bg-icon" /> },
    { id: 'tool_job_titles', num: '05', titleAr: 'المسميات الوظيفية', titleEn: 'Career Titles', descAr: 'المسميات الوظيفية الدقيقة المتوافقة مع تخصصك.', descEn: 'Exact titles eligible for your target major.', points: 10, color: 'bg-[var(--accent-coral)]', icon: <Briefcase className="bento-bg-icon" /> },
    { id: 'tool_university_directory', num: '06', titleAr: 'دليل الجامعات بالذكاء الاصطناعي', titleEn: 'AI University Directory', descAr: 'دليل الجامعات السعودية والبحث العالمي بالذكاء الاصطناعي.', descEn: 'KSA Universities & Global AI Search.', points: 0, color: 'bg-[var(--accent-peach)]', span: 'span-2', icon: <Globe className="bento-bg-icon" /> },
    { id: 'tool_important_courses', num: '07', titleAr: 'الشهادات الأساسية', titleEn: 'Core Certifications', descAr: 'أهم الشهادات المصغرة لدعم مسارك الأكاديمي.', descEn: 'Top micro-degrees to support your academic path.', points: 5, color: 'bg-white', icon: <Award className="bento-bg-icon" /> },
    { id: 'tool_graduation_ideas', num: '08', titleAr: 'أفكار مشاريع تخرج', titleEn: 'Capstone Ideas', descAr: 'عصف ذهني لمشاريع تخرج قابلة للتوسع.', descEn: 'Brainstorm scalable capstone projects.', points: 5, color: 'bg-[var(--accent-yellow)]', icon: <Compass className="bento-bg-icon" /> },
    { id: 'tool_ai_jobs_salary', num: '09', titleAr: 'البحث المباشر عن الرواتب', titleEn: 'Live Salary Search', descAr: 'يستخرج الرواتب الحية باستخدام البحث المباشر عبر الويب.', descEn: 'Scrapes live salaries using grounded Web Search.', points: 15, color: 'bg-[var(--accent-mint)]', span: 'span-2', icon: <Search className="bento-bg-icon" /> },
    { id: 'tool_roi', num: '10', titleAr: 'العائد المالي بعد التخرج', titleEn: 'Post-grad ROI', descAr: 'تحليل العائد المالي ونقطة التعادل.', descEn: 'Analyze financial break-even.', points: 0, color: 'bg-[var(--accent-lilac)]', icon: <TrendingUp className="bento-bg-icon" /> },
    { id: 'tool_ai', num: '11', titleAr: 'المستشار المهني بالذكاء الاصطناعي', titleEn: 'AI Career Counselor', descAr: 'مساعد محادثة للحصول على توجيه مهني عميق.', descEn: 'Conversational assistant for deep guidance.', points: 10, color: 'bg-[var(--accent-coral)]', icon: <Bot className="bento-bg-icon" /> }
  ];

  const proFeatures = [
    { id: 'tool_job_titles', num: '01', titleAr: 'المسميات المهنية', titleEn: 'Professional Titles', descAr: 'التحقق من الخرائط التنظيمية الدقيقة للمسميات.', descEn: 'Verify exact organizational mappings.', points: 10, color: 'bg-[var(--accent-peach)]', icon: <Layers className="bento-bg-icon" /> },
    { id: 'tool_salary', num: '02', titleAr: 'منحنى الرواتب', titleEn: 'Salary Curve', descAr: 'تصور دقيق لمقاييس نمو الرواتب بمرور الوقت.', descEn: 'Visualize precise salary scaling metrics.', points: 0, color: 'bg-[var(--accent-mint)]', span: 'span-2', icon: <TrendingUp className="bento-bg-icon" /> },
    { id: 'tool_important_courses', num: '03', titleAr: 'شهادات التطوير المهني', titleEn: 'Upskilling Certifications', descAr: 'تحديد الشهادات الاحترافية للوصول إلى مستويات أعلى.', descEn: 'Identify certifications to secure higher tiers.', points: 5, color: 'bg-[var(--accent-yellow)]', icon: <Award className="bento-bg-icon" /> },
    { id: 'tool_career_pivot', num: '04', titleAr: 'خريطة التحول المهني', titleEn: 'Career Pivot Roadmap', descAr: 'وضع خارطة طريق خطوة بخطوة للانتقال المهني.', descEn: 'Establish step-by-step transition roadmaps.', points: 15, color: 'bg-[var(--accent-lilac)]', span: 'span-2', icon: <Compass className="bento-bg-icon" /> },
    { id: 'tool_ai_jobs_salary', num: '05', titleAr: 'البحث المباشر عن الرواتب', titleEn: 'Live Salary Search', descAr: 'يستخرج الرواتب الحية باستخدام البحث المباشر عبر الويب.', descEn: 'Scrapes live salaries using grounded Web Search.', points: 15, color: 'bg-[var(--accent-coral)]', span: 'span-2', icon: <Briefcase className="bento-bg-icon" /> },
    { id: 'tool_job_hunt', num: '06', titleAr: 'الفرص الوظيفية المتاحة', titleEn: 'Live Open Opportunities', descAr: 'قائمة مخصصة بالشركات المتاحة للتوظيف حالياً.', descEn: 'Custom, grounded list of hiring companies.', points: 20, color: 'bg-[var(--accent-mint)]', span: 'span-2', icon: <Briefcase className="bento-bg-icon" /> },
    { id: 'tool_define_roadmap', num: '07', titleAr: 'تحديد الأهداف والمعالم', titleEn: 'Define Custom Milestones', descAr: 'تحديد خطوات واقعية للترقية المهنية.', descEn: 'Plot realistic promotional steps.', points: 20, color: 'bg-white', icon: <Activity className="bento-bg-icon" /> },
    { id: 'tool_ai', num: '08', titleAr: 'المستشار المهني بالذكاء الاصطناعي', titleEn: 'AI Career Counselor', descAr: 'مساعد محادثة للحصول على توجيه مهني عميق.', descEn: 'Conversational assistant for deep guidance.', points: 10, color: 'bg-[var(--accent-lilac)]', span: 'span-3', icon: <Bot className="bento-bg-icon" /> },
    { id: 'tool_roi', num: '09', titleAr: 'العائد المالي بعد التخرج', titleEn: 'Post-grad ROI', descAr: 'تحليل العائد المالي ونقطة التعادل.', descEn: 'Analyze financial break-even.', points: 0, color: 'bg-[var(--accent-peach)]', icon: <TrendingUp className="bento-bg-icon" /> }
  ];

  const activeFeatures = isStudent ? studentFeatures : proFeatures;

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 max-w-[1400px] mx-auto text-theme-primary">
      <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <Magnetic strength={0.2} className="mb-8">
            <button onClick={() => setPage('home')} className="clickable-card flex items-center gap-2 font-bold text-lg hover:text-[var(--accent-coral)] transition-colors px-4 py-2 border-2 border-transparent hover:border-theme rounded-full">
              {isAr ? <ArrowRight className="w-6 h-6"/> : <ArrowLeft className="w-6 h-6"/>} 
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </button>
          </Magnetic>
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <h2 className="text-5xl md:text-7xl font-display-en font-black">
              {isStudent ? (isAr ? 'أدوات الطلاب والقبول' : 'Student & Admission') : (isAr ? 'أدوات التطوير المهني' : 'Pro Suite Tools')}
            </h2>
          </div>
          <p className="text-xl font-medium opacity-70 max-w-xl mt-4">
            {isAr 
              ? 'قم بتشغيل محركات التشخيص الأكاديمي والمهني المتميزة باستخدام البيانات المدعومة ببحث الويب الآمن.' 
              : 'Execute premium academic and career diagnostic engines using secure web grounding.'}
          </p>
        </div>
        <div className="hidden md:block">
           <TrackingEye mouseX={mouseX} mouseY={mouseY} className="bg-theme-secondary" />
         </div>
      </div>

      <div className="bento-grid">
        {activeFeatures.map((feat) => (
          <Magnetic key={feat.id} strength={0.02} className={`w-full h-full ${feat.span || ''}`}>
            <ThreeDTilt intensity={8} className="w-full h-full">
              <div 
                onClick={() => onTriggerTool(feat.id, feat.points)}
                className={`bento-card text-black ${feat.color} group h-full`}
              >
                {feat.icon}
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-5xl font-black opacity-30 font-mono tracking-tighter">{feat.num}</span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-black border-2 border-black flex items-center gap-1 shadow-[2px_2px_0_#000] ${feat.points === 0 ? 'bg-[var(--accent-yellow)] free-badge' : 'bg-white/80'}`}>
                      <Coins className="w-3.5 h-3.5 text-yellow-600 relative z-10" />
                      <span className="relative z-10">{feat.points === 0 ? (isAr ? 'مجاني' : 'FREE') : `${feat.points} ${isAr ? 'نقطة' : 'Pts'}`}</span>
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-3 font-display-en">
                    {isAr ? feat.titleAr : feat.titleEn}
                  </h3>
                  <p className="font-semibold opacity-80 text-sm leading-relaxed">
                    {isAr ? feat.descAr : feat.descEn}
                  </p>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center border-2 border-black transition-transform group-hover:scale-110">
                    {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  </div>
                </div>
              </div>
            </ThreeDTilt>
          </Magnetic>
        ))}
      </div>
    </div>
  );
};
