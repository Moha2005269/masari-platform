import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Layers, Award, Compass, Activity, BrainCircuit, Briefcase } from 'lucide-react';

// Auth Context
import { useAuth } from './context/AuthContext';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FullscreenMenu } from './components/layout/FullscreenMenu';

// UI Components
import { CustomCursor } from './components/ui/CustomCursor';
import { PointsExhaustedModal } from './components/ui/Modals';

// Pages
import { Home } from './pages/Home';
import { AuthPage } from './pages/Auth';
import { Dashboard } from './components/Dashboard';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { PersonaCard } from './pages/PersonaCard';
import { SavedReports } from './pages/SavedReports';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { AIToolPage } from './components/AIToolPage';
import { StripeCheckoutSimulator } from './pages/StripeCheckoutSimulator';

// Specialized Tools
import { ToolCareerTest } from './pages/tools/ToolCareerTest';
import { ToolReadyTest } from './pages/tools/ToolReadyTest';
import { ToolCalculator } from './pages/tools/ToolCalculator';
import { ToolAISalaryPredictor } from './pages/tools/ToolAISalaryPredictor';
import { ToolSalary } from './pages/tools/ToolSalary';
import { ToolROI } from './pages/tools/ToolROI';
import { ToolAIChat } from './pages/tools/ToolAIChat';
import { ToolUniversityDirectory } from './pages/tools/ToolUniversityDirectory';
import { useMousePosition } from './hooks/useMousePosition';


// Dynamic AI Tool Wrappers
const ToolCurriculumPath = (props) => (
  <AIToolPage
    {...props}
    pointsCost={20}
    titleAr="مخطط المسار التعليمي المستقبلي"
    titleEn="Future Educational Path Blueprint"
    useProfilePersona={true}
    hasInput2={false}
    ph1Ar="أدخل التخصص المستهدف (مثل: هندسة البرمجيات)"
    ph1En="Enter target major (e.g. Software Engineering)"
    btnAr="توليد المخطط"
    btnEn="Generate Blueprint"
    btnColor="bg-[var(--accent-lilac)]"
    icon={<Sparkles className="w-6 h-6" />}
    systemRole="You are a senior academic director at Masari. Provide a comprehensive 4-year curriculum path and major skill roadmap."
    buildQuery={(i1) => `Create a 4-year master curriculum map with important courses and milestone certifications for a major in ${i1}. Format with clear Markdown.`}
    fallbackAr="### Curriculum Roadmap\n\n- **Year 1:** Basics\n- **Year 2:** Intermediates"
    fallbackEn="### Curriculum Roadmap\n\n- **Year 1:** Basics\n- **Year 2:** Intermediates"
    visualGraph={() => (
      <div className="flex justify-between items-center mb-10 overflow-hidden">
        {[1, 2, 3, 4].map(y => (
          <div key={y} className="flex-1 flex flex-col items-center relative z-10">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black text-xl border-4 border-theme shadow-[4px_4px_0_var(--accent-peach)] z-20">Y{y}</div>
            {y < 4 && <div className="absolute top-6 left-[50%] w-full h-2 bg-black -z-10 rtl:right-[50%] rtl:left-auto"></div>}
          </div>
        ))}
      </div>
    )}
  />
);

const ToolJobTitles = (props) => (
  <AIToolPage
    {...props}
    pointsCost={10}
    titleAr="المسميات الوظيفية وخريطة سوق العمل"
    titleEn="Career Titles Mapping"
    useProfilePersona={true}
    hasInput2={false}
    ph1Ar="أدخل التخصص أو المجال"
    ph1En="Enter major or industry domain"
    btnAr="استخراج المسميات"
    btnEn="Generate Job Titles"
    btnColor="bg-[var(--accent-yellow)]"
    icon={<Layers className="w-6 h-6" />}
    systemRole="You are an elite talent recruiter. Provide an detailed list of eligible jobs/titles and standard starting salaries."
    buildQuery={(i1) => `Provide a comprehensive list of corporate job titles, operational responsibilities, and key metrics for anyone studying ${i1}.`}
    fallbackAr="### Standard Job Titles\n\n1. Cloud Infrastructure Architect"
    fallbackEn="### Standard Job Titles\n\n1. Cloud Infrastructure Architect"
  />
);

const ToolImportantCourses = (props) => (
  <AIToolPage
    {...props}
    pointsCost={5}
    titleAr="تطوير المهارات والشهادات الأساسية"
    titleEn="Upskilling & Core Certifications"
    useProfilePersona={true}
    hasInput2={false}
    ph1Ar="أدخل تخصصك أو مجالك المستهدف"
    ph1En="Enter your major or target domain"
    btnAr="استكشاف الشهادات"
    btnEn="Unlock Industry Certifications"
    btnColor="bg-[var(--accent-coral)]"
    textColor="text-white"
    icon={<Award className="w-6 h-6" />}
    systemRole="You are a senior technical training manager. Suggest the top professional industry certificates and micro-degrees."
    buildQuery={(i1) => `Provide 5 specific industry-standard certifications and upskilling courses for a professional in ${i1}. Format with description.`}
    fallbackAr="### Highly Recommended\n\n1. **AWS Certified**"
    fallbackEn="### Highly Recommended\n\n1. **AWS Certified**"
  />
);

const ToolCareerPivot = (props) => (
  <AIToolPage
    {...props}
    pointsCost={15}
    titleAr="خطة الانتقال المهني"
    titleEn="Career Transition Blueprint"
    useProfilePersona={false}
    hasInput2={true}
    ph1Ar="دورك الحالي أو مجالك (مثل: دعم العملاء)"
    ph1En="Your current role or domain (e.g. Customer Support)"
    ph2Ar="الدور أو المجال المستهدف (مثل: محلل بيانات)"
    ph2En="Your target role or domain (e.g. Data Analyst)"
    btnAr="توليد خطة الانتقال"
    btnEn="Generate Transition Roadmap"
    btnColor="bg-[var(--accent-lilac)]"
    icon={<Compass className="w-6 h-6" />}
    systemRole="You are a career change counselor. Map out transferrable skills and professional transitioning steps."
    buildQuery={(i1, i2) => `Create a specific 6-month career transition blueprint moving from ${i1} to ${i2}. Format in Markdown with bullet items.`}
    fallbackAr="### 6-Month Pivot Roadmap\n\n- **Month 1:** Identify transferrable assets."
    fallbackEn="### 6-Month Pivot Roadmap\n\n- **Month 1:** Identify transferrable assets."
  />
);

const ToolDefineRoadmap = (props) => (
  <AIToolPage
    {...props}
    pointsCost={20}
    titleAr="تحديد معالم الترقية"
    titleEn="Plot Promotional Milestones"
    useProfilePersona={false}
    hasInput2={false}
    ph1Ar="ما هو هدفك المهني النهائي؟ (مثل: الرئيس التنفيذي للتكنولوجيا)"
    ph1En="What is your ultimate career goal? (e.g. Chief Technology Officer)"
    btnAr="تحديد المعالم"
    btnEn="Generate Milestones"
    btnColor="bg-[var(--accent-mint)]"
    icon={<Activity className="w-6 h-6" />}
    systemRole="You are a world-class executive career architect. Define clear executive promotion levels and years required."
    buildQuery={(i1) => `Create a granular 5-year promotional roadmap to achieve: ${i1}. Highlight operational KPIs.`}
    fallbackAr="### Promotional Roadmap\n\n- **Year 1:** High-impact output"
    fallbackEn="### Promotional Roadmap\n\n- **Year 1:** High-impact output"
  />
);

const ToolGraduationIdeas = (props) => (
  <AIToolPage
    {...props}
    pointsCost={5}
    titleAr="أفكار مشاريع تخرج قابلة للتسويق"
    titleEn="Marketable Capstone Project Ideas"
    useProfilePersona={true}
    hasInput2={false}
    ph1Ar="أدخل تخصصك الدراسي"
    ph1En="Enter your study major"
    btnAr="اقتراح مشاريع"
    btnEn="Generate Project Proposals"
    btnColor="bg-[var(--accent-yellow)]"
    icon={<BrainCircuit className="w-6 h-6" />}
    systemRole="You are a technical director of corporate incubation programs. Provide innovative, highly marketable graduation project proposals."
    buildQuery={(i1) => `Provide 3 unique capstone or graduation projects ideas for a major in ${i1} that have high startup/commercial value.`}
    fallbackAr="### Capstone Proposals\n\n1. AI-Driven Engine"
    fallbackEn="### Capstone Proposals\n\n1. AI-Driven Engine"
  />
);

const ToolJobHunt = (props) => (
  <AIToolPage
    {...props}
    pointsCost={20}
    titleAr="الوظائف الشاغرة والفرص المتاحة"
    titleEn="Open Vacancies & Corporate Placements"
    useProfilePersona={true}
    hasInput2={true}
    ph1Ar="التخصص أو المسمى المستهدف"
    ph1En="Target Major or Title"
    ph2Ar="مهاراتك الأساسية"
    ph2En="Your key skills"
    btnAr="استكشاف الفرص"
    btnEn="Unlock Opportunities"
    btnColor="bg-[var(--accent-mint)]"
    icon={<Briefcase className="w-6 h-6" />}
    systemRole="You are a professional corporate placement assistant. Search specific websites (e.g., site:linkedin.com, site:glassdoor.com, site:indeed.com) for current live active jobs and recommend major companies actively hiring this role."
    buildQuery={(i1, i2) => `Search specific websites (e.g., site:linkedin.com, site:indeed.com) and provide a list of 5 leading corporate institutions currently recruiting individuals with a degree in ${i1} and skills in ${i2}.`}
    fallbackAr="### Hiring Entities\n\n- Saudi Aramco\n- Elm"
    fallbackEn="### Hiring Entities\n\n- Saudi Aramco\n- Elm"
    useSearchPlugins={true}
  />
);

export default function App() {
  const { x, y } = useMousePosition();
  const [lang, setLang] = useState('ar');
  const [page, setPage] = useState('home');
  const [userContext, setUserContext] = useState('student');
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transitionState, setTransitionState] = useState('idle');
  const [toastMessage, setToastMessage] = useState(null);
  const [isInsufficientPointsOpen, setIsInsufficientPointsOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  const { user, userProfile: ctxProfile, saveProfile: ctxSaveProfile, logout, loading, db } = useAuth();
  
  const userProfile = ctxProfile || {
    id: 'UNAUTHENTICATED', name: 'Masari Pioneer', email: 'pioneer@masari.io',
    avatarId: 'avatar_blobby', slogan: 'Decoding academic milestones & professional trajectories',
    weightedScore: '', testMatchScore: '', riasecTitle: '', careerPersona: '',
    isLoggedIn: false, hasTakenTest: false, points: 50, subscriptionTier: 'free'
  };

  const handleSaveProfileToServer = async (profileObject) => {
    if (ctxSaveProfile) {
      await ctxSaveProfile(profileObject);
    }
  };

  const setUserProfile = (newProfile) => {
    handleSaveProfileToServer(newProfile);
  };

  const handleTriggerCheckout = (data) => {
    if (!userProfile.isLoggedIn) {
      showToast(lang === 'ar' ? 'يرجى تسجيل الدخول أو إنشاء حساب لإتمام عملية الشحن!' : 'Please sign in or create an account to process payment!');
      handleTransition(() => {
        setPage('auth_signup');
      });
      return;
    }
    setCheckoutData(data);
    handleTransition(() => {
      setPage('stripe_checkout');
    });
  };

  const handlePaymentSuccess = (data) => {
    const isUpgrade = data.mode === 'bro';
    const updated = {
      ...userProfile,
      subscriptionTier: isUpgrade ? 'bro' : userProfile.subscriptionTier,
      points: (userProfile.points || 0) + data.amount
    };
    setUserProfile(updated);
    handleSaveProfileToServer(updated);
    showToast(lang === 'ar' ? 'تم تأكيد الدفع بنجاح وشحن رصيدك!' : 'Payment completed successfully and account funded!');
    handleTransition(() => {
      setPage('subscriptions');
    });
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    setPage('home');
    showToast(lang === 'ar' ? 'تم تسجيل الخروج بنجاح.' : 'Signed out successfully.');
  };
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [theme]);

  // Load html2canvas for profile ID export
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleTransition = useCallback((action) => {
    setTransitionState('exiting');
    setTimeout(() => {
      action();
      setTransitionState('entering');
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => setTransitionState('idle'), 500);
    }, 300);
  }, []);

  const toggleLang = () => {
    handleTransition(() => {
      setLang(prev => prev === 'ar' ? 'en' : 'ar');
    });
  };

  const handleCheckPoints = (pointsCost) => {
    const isBro = userProfile.subscriptionTier === 'bro';
    const currentPoints = userProfile.points || 0;

    if (!isBro && pointsCost > 0 && currentPoints < pointsCost) {
      setIsInsufficientPointsOpen(true);
      return false;
    }
    return true;
  };

  const handleDeductPoints = (pointsCost) => {
    const isBro = userProfile.subscriptionTier === 'bro';
    const currentPoints = userProfile.points || 0;

    if (!isBro && pointsCost > 0) {
      const updatedProfile = {
        ...userProfile,
        points: Math.max(0, currentPoints - pointsCost)
      };
      setUserProfile(updatedProfile);
      showToast(lang === 'ar' ? `تم استخدام ${pointsCost} نقطة.` : `Used ${pointsCost} credits.`);
    }
    return true;
  };

  const triggerToolWithCredits = (targetTool) => {
    handleTransition(() => {
      setPage(targetTool);
    });
  };
  
  const handleSetPage = (newPage) => {
    const bypassPages = ['home', 'auth_signin', 'auth_signup', 'subscriptions'];
    if (!userProfile.isLoggedIn && !bypassPages.includes(newPage)) {
      showToast(lang === 'ar' ? 'يجب تسجيل الدخول أو إنشاء حساب موثق أولاً للوصول إلى أدوات الذكاء الاصطناعي!' : 'Please sign up or log in first to access premium modules!');
      handleTransition(() => {
        setPage('auth_signup');
        setIsMenuOpen(false);
      });
      return;
    }

    if (page === newPage) return;
    handleTransition(() => {
      setPage(newPage);
      setIsMenuOpen(false);
    });
  };

  const isAr = lang === 'ar';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-primary">
        <div className="w-16 h-16 border-8 border-theme border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Common props passed to tool views
  const commonToolProps = {
    isAr,
    setPage: handleSetPage,
    userContext,
    userProfile,
    setUserProfile,
    onSaveProfile: handleSaveProfileToServer,
    showToast,
    onCheckPoints: handleCheckPoints,
    onDeductPoints: handleDeductPoints
  };

  return (
    <>
      <CustomCursor />
      <div 
        className={`min-h-screen ${isAr ? 'lang-ar dir-rtl' : 'lang-en dir-ltr'} ${theme === 'dark' ? 'dark-mode' : ''}`}
      >
        <Navbar 
          isAr={isAr} toggleLang={toggleLang} setPage={handleSetPage} 
          theme={theme} toggleTheme={toggleTheme} toggleMenu={toggleMenu}
          userProfile={userProfile}
        />

        <FullscreenMenu 
          isAr={isAr} isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} 
          setPage={handleSetPage} userProfile={userProfile} logout={handleLogout}
        />

        <PointsExhaustedModal 
          isAr={isAr} isOpen={isInsufficientPointsOpen} onClose={() => setIsInsufficientPointsOpen(false)} 
          onGoToSubscriptions={() => handleSetPage('subscriptions')}
        />

        {toastMessage && (
          <div className="toast-container">
            <div className="toast-element bg-theme-secondary text-theme-primary px-6 py-4 rounded-2xl border-4 border-theme shadow-brutal flex items-center gap-3 font-bold">
              <Sparkles className="w-5 h-5 text-[var(--accent-coral)] animate-pulse" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        <main className={`
          ${transitionState === 'exiting' ? 'page-exit' : ''}
          ${transitionState === 'entering' ? 'page-enter' : ''}
        `}>
          {page === 'home' && <Home isAr={isAr} setPage={handleSetPage} setUserContext={setUserContext} mouseX={x} mouseY={y} userProfile={userProfile} />}
          {page === 'auth_signin' && <AuthPage isAr={isAr} setPage={handleSetPage} mode="auth_signin" mouseX={x} mouseY={y} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast} />}
          {page === 'auth_signup' && <AuthPage isAr={isAr} setPage={handleSetPage} mode="auth_signup" mouseX={x} mouseY={y} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast} />}
          {page === 'dashboard_student' && <Dashboard isAr={isAr} type="student" setPage={handleSetPage} mouseX={x} mouseY={y} userProfile={userProfile} onTriggerTool={triggerToolWithCredits} />}
          {page === 'dashboard_pro' && <Dashboard isAr={isAr} type="pro" setPage={handleSetPage} mouseX={x} mouseY={y} userProfile={userProfile} onTriggerTool={triggerToolWithCredits} />}
          {page === 'subscriptions' && <SubscriptionPage isAr={isAr} setPage={handleSetPage} userProfile={userProfile} setUserProfile={setUserProfile} onSaveProfile={handleSaveProfileToServer} showToast={showToast} onTriggerCheckout={handleTriggerCheckout} />}
          {page === 'stripe_checkout' && <StripeCheckoutSimulator isAr={isAr} setPage={handleSetPage} checkoutData={checkoutData} onPaymentSuccess={handlePaymentSuccess} />}
          
          {page === 'persona_card' && <PersonaCard isAr={isAr} setPage={handleSetPage} userProfile={userProfile} />}
          {page === 'saved_reports' && <SavedReports isAr={isAr} setPage={handleSetPage} userContext={userContext} />}
          {page === 'admin_panel' && <AdminPanelPage isAr={isAr} setPage={handleSetPage} showToast={showToast} db={db} />}
          
          {/* Diagnostic Sub-Tools */}
          {page === 'tool_career_test' && <ToolCareerTest {...commonToolProps} />}
          {page === 'tool_calculator' && <ToolCalculator {...commonToolProps} />}
          {page === 'tool_ai' && <ToolAIChat {...commonToolProps} />}
          {page === 'tool_ai_jobs_salary' && <ToolAISalaryPredictor {...commonToolProps} />}
          {page === 'tool_salary' && <ToolSalary {...commonToolProps} />}
          {page === 'tool_roi' && <ToolROI {...commonToolProps} />}

          {/* Generator Sub-Tools */}
          {page === 'tool_ready_test' && <ToolReadyTest {...commonToolProps} />}
          {page === 'tool_curriculum' && <ToolCurriculumPath {...commonToolProps} />}
          {page === 'tool_job_titles' && <ToolJobTitles {...commonToolProps} />}
          {page === 'tool_important_courses' && <ToolImportantCourses {...commonToolProps} />}
          {page === 'tool_career_pivot' && <ToolCareerPivot {...commonToolProps} />}
          {page === 'tool_define_roadmap' && <ToolDefineRoadmap {...commonToolProps} />}
          {page === 'tool_graduation_ideas' && <ToolGraduationIdeas {...commonToolProps} />}
          {page === 'tool_university_directory' && <ToolUniversityDirectory {...commonToolProps} />}
          {page === 'tool_job_hunt' && <ToolJobHunt {...commonToolProps} />}
        </main>

        <Footer isAr={isAr} />
      </div>
    </>
  );
}