import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowLeft, ArrowRight, ShieldCheck, Lock, Sparkles } from 'lucide-react';

export const StripeCheckoutSimulator = ({ 
  isAr, 
  setPage, 
  checkoutData, 
  onPaymentSuccess 
}) => {
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // If no checkout data is present, fall back to default
  const data = checkoutData || { mode: 'points', amount: 100, price: 11.99 };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvc || !cardName) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(data);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch text-slate-800 font-sans">
      {/* Left side: Order Info */}
      <div className="hidden md:flex flex-col justify-between w-[45%] bg-slate-900 text-slate-200 p-12 lg:p-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#4f46e5,#0f172a)] opacity-40 pointer-events-none"></div>
        
        <div className="relative z-10">
          <button 
            onClick={() => setPage('subscriptions')} 
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white font-bold transition-colors mb-12"
          >
            {isAr ? <ArrowRight className="w-4 h-4"/> : <ArrowLeft className="w-4 h-4"/>}
            {isAr ? 'الرجوع للاشتراكات' : 'Back to Subscriptions'}
          </button>

          <div className="space-y-2">
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">
              {isAr ? 'مساري برو بلس' : 'MASARI PRO+ PLATFORM'}
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white font-display-en">
              {data.mode === 'bro' 
                ? (isAr ? 'ترقية حساب البرو' : 'Masari Bro Upgrade') 
                : (isAr ? `شحن ${data.amount} نقطة ذكاء اصطناعي` : `Fuel ${data.amount} AI Credits`)}
            </h1>
          </div>

          <div className="mt-12 space-y-6">
            <div className="flex justify-between items-center text-lg pb-4 border-b border-slate-800">
              <span className="opacity-70">{isAr ? 'البند' : 'Description'}</span>
              <span className="font-bold text-white">
                {data.mode === 'bro' ? 'Bro Plan Upgrade (+100 Pts)' : `${data.amount} AI Credits`}
              </span>
            </div>
            <div className="flex justify-between items-end text-3xl font-black text-white pt-4">
              <span>{isAr ? 'المجموع المستحق' : 'Amount Due'}</span>
              <span className="text-indigo-400 font-display-en">${data.price}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs opacity-50 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'معالجة مشفرة وآمنة عبر Stripe' : 'Secured and encrypted by Stripe Checkout'}</span>
          </div>
          <p>© 2026 Masari Academic Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Right side: Payment form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white md:bg-slate-50">
        <div className="w-full max-w-[480px] bg-white p-8 md:p-10 rounded-[2rem] md:shadow-xl border border-slate-100 relative">
          
          <div className="md:hidden flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-xl font-bold">
              {data.mode === 'bro' ? 'Bro Plan Upgrade' : `${data.amount} AI Credits`}
            </h2>
            <span className="text-2xl font-black text-indigo-600">${data.price}</span>
          </div>

          {success ? (
            <div className="py-12 flex flex-col items-center justify-center text-center page-enter">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-500 animate-bounce">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                {isAr ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
              </h3>
              <p className="text-slate-500 font-medium">
                {isAr ? 'جاري شحن رصيدك وتوجيهك...' : 'Securing credits and redirecting...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-500 tracking-wide uppercase">
                  {isAr ? 'طريقة الدفع' : 'Payment Details'}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-100 px-2 py-1 rounded">
                  <Lock className="w-3.5 h-3.5" />
                  {isAr ? 'تأمين آمن' : 'Secure Connection'}
                </span>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input 
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                />
              </div>

              {/* Card Information */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">{isAr ? 'معلومات البطاقة' : 'Card Information'}</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" required value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" required value={expiry} onChange={e => setExpiry(e.target.value.substring(0, 5))}
                    placeholder="MM/YY"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono font-bold"
                  />
                  <input 
                    type="text" required value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                    placeholder="CVC"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono font-bold"
                  />
                </div>
              </div>

              {/* Name on Card */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">{isAr ? 'الاسم المطبوع على البطاقة' : 'Name on Card'}</label>
                <input 
                  type="text" required value={cardName} onChange={e => setCardName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 font-semibold space-y-1">
                <span className="font-bold uppercase tracking-wider block">⚠️ {isAr ? 'تنبيه وضع التجربة' : 'DEBUG CHECKOUT MODE'}</span>
                <p>
                  {isAr 
                    ? 'هذا محاكي دفع آمن. أدخل أي معلومات افتراضية لإتمام شحن نقاطك بنجاح.' 
                    : 'This is a sandbox environment. Provide mockup credentials to complete order.'}
                </p>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{isAr ? `دفع $${data.price}` : `Pay $${data.price}`}</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
