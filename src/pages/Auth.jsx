import React, { useState, useContext } from 'react';
import { ArrowLeft, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CUTE_AVATARS } from '../data/avatars';
import { AbstractShape2, DecorativeStar } from '../components/ui/Shapes';
import { TrackingEye } from '../components/ui/TrackingEye';
import { Magnetic } from '../components/ui/Magnetic';

export const AuthPage = ({ isAr, setPage, mode, mouseX, mouseY, showToast }) => {
  const { signUpWithEmail, loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar_blobby');
  const [slogan, setSlogan] = useState('');
  const [loading, setLoading] = useState(false);
  
  const isSignIn = mode === 'auth_signin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignIn) {
        await loginWithEmail(email, password);
        showToast(isAr ? 'تم تسجيل الدخول بنجاح!' : 'Signed in successfully!');
      } else {
        const defaultSlogan = slogan || (isAr ? 'فك الرموز التعليمية والمسارات المهنية' : 'Decoding academic milestones & professional trajectories');
        await signUpWithEmail(email, password, name, selectedAvatar, defaultSlogan);
        showToast(isAr ? 'تم إنشاء الحساب بنجاح!' : 'Account registered successfully!');
      }
      setPage('dashboard_student');
    } catch (err) {
      console.error(err);
      showToast(isAr ? `فشل التحقق: ${err.message}` : `Authentication failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      showToast(isAr ? 'تم تسجيل الدخول بجوجل بنجاح!' : 'Signed in with Google successfully!');
      setPage('dashboard_student');
    } catch (err) {
      console.error(err);
      showToast(isAr ? `فشل تسجيل الدخول بجوجل: ${err.message}` : `Google sign-in failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 flex flex-col items-center justify-center relative overflow-hidden">
      <AbstractShape2 className="absolute top-[20%] right-[10%] w-[30vw] text-[var(--accent-peach)] opacity-40 animate-float" />
      <DecorativeStar className="absolute bottom-[20%] left-[10%] w-32 h-32 text-[var(--accent-mint)] animate-spin-slow" />
      
      <div className="w-full max-w-xl bg-theme-secondary p-8 md:p-10 rounded-[3rem] border-4 border-theme shadow-brutal relative z-10 text-black">
        <button onClick={() => setPage('home')} className="clickable-card mb-6 flex items-center gap-2 font-bold hover:text-[var(--accent-coral)] transition-colors">
          {isAr ? <ArrowRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>} 
          {isAr ? 'العودة للرئيسية' : 'Back to Home'}
        </button>

        <div className="flex justify-between items-end mb-6 text-black">
           <h2 className="text-3xl md:text-4xl font-display-en font-black">
             {isSignIn ? (isAr ? 'تسجيل دخول موثق' : 'Verified Sign In') : (isAr ? 'تسجيل معرّف جديد' : 'Register Custom ID')}
           </h2>
           <TrackingEye mouseX={mouseX} mouseY={mouseY} className="w-14 h-14" />
        </div>

        <form className="flex flex-col gap-5 text-black" onSubmit={handleSubmit}>
          {!isSignIn && (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-lg">{isAr ? 'اختر صورتك الرمزية' : 'Choose your PFP Persona'}</label>
                <div className="grid grid-cols-5 gap-3 p-3 bg-theme-primary rounded-2xl border-4 border-theme">
                  {CUTE_AVATARS.map((avatar) => (
                    <button
                      key={avatar.id} type="button" onClick={() => setSelectedAvatar(avatar.id)}
                      className={`relative aspect-square rounded-xl border-4 transition-transform p-1 overflow-hidden ${selectedAvatar === avatar.id ? 'border-[var(--accent-coral)] scale-110 shadow-brutal bg-white' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}
                    >
                      {avatar.svg()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-lg">{isAr ? 'الاسم الكامل' : 'Display Full Name'}</label>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)} placeholder={isAr ? 'الاسم بالكامل' : 'Your name'}
                  className="w-full bg-theme-primary border-4 border-theme p-3 rounded-2xl font-bold focus:outline-none focus:bg-[var(--accent-mint)] focus:text-black transition-colors" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-lg">{isAr ? 'شعارك الملهم' : 'Inspirational Slogan'}</label>
                <input 
                  type="text" value={slogan} onChange={e => setSlogan(e.target.value)} placeholder={isAr ? 'مثال: مهندس برمجيات ومفكر تصميمي' : 'e.g. Code wizard & Design thinker'}
                  className="w-full bg-theme-primary border-4 border-theme p-3 rounded-2xl font-bold focus:outline-none focus:bg-[var(--accent-yellow)] focus:text-black transition-colors" 
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-bold text-lg">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-theme-primary border-4 border-theme p-3 rounded-2xl font-bold focus:outline-none focus:bg-[var(--accent-lilac)] focus:text-black transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-lg">{isAr ? 'كلمة المرور' : 'Password'}</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-theme-primary border-4 border-theme p-3 rounded-2xl font-bold focus:outline-none focus:bg-[var(--accent-peach)] focus:text-black transition-colors" />
          </div>

          <Magnetic strength={0.1} className="w-full mt-2">
            <button type="submit" disabled={loading} className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xl border-4 border-transparent shadow-brutal-hover hover:scale-105 transition-all flex items-center justify-center gap-3">
              {isSignIn ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isSignIn ? (isAr ? 'تسجيل الدخول للهوية' : 'Sign In to ID') : (isAr ? 'تسجيل وإنشاء الهوية المهنية' : 'Register & Generate ID')}
            </button>
          </Magnetic>
        
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-1 bg-black/20 rounded"></div>
            <span className="font-bold text-sm opacity-50">{isAr ? 'أو' : 'OR'}</span>
            <div className="flex-1 h-1 bg-black/20 rounded"></div>
          </div>

          <Magnetic strength={0.1} className="w-full">
            <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full py-4 bg-white text-black rounded-full font-bold text-xl border-4 border-black shadow-brutal-hover hover:scale-105 transition-all flex items-center justify-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {isAr ? 'المتابعة باستخدام جوجل' : 'Continue with Google'}
            </button>
          </Magnetic>
        </form>

        <div className="mt-6 text-center font-bold opacity-70">
          {isSignIn ? (
             <p>{isAr ? 'جديد هنا؟' : 'New here?'} <span onClick={() => setPage('auth_signup')} className="text-[var(--accent-coral)] cursor-pointer hover:underline">{isAr ? 'إنشاء حساب' : 'Create an Account'}</span></p>
          ) : (
             <p>{isAr ? 'مسجل بالفعل؟' : 'Already registered?'} <span onClick={() => setPage('auth_signin')} className="text-[var(--accent-lilac)] cursor-pointer hover:underline">{isAr ? 'تسجيل الدخول' : 'Sign In'}</span></p>
          )}
        </div>
      </div>
    </div>
  );
};
