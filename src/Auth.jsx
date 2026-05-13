import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Lock, Mail, Smartphone, ArrowRight, ShieldCheck, CreditCard, ChevronLeft, Bot, CloudRain, Sprout, CheckCircle, Smartphone as PhoneIcon } from 'lucide-react';

export default function AuthFlow({ onLogin }) {
  const [view, setView] = useState('welcome'); // welcome, login, signup, trial, payment

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const handleGuest = () => {
    onLogin({ role: 'guest', name: 'Demo Farmer' });
  };

  const completeLogin = () => {
    onLogin({ role: 'premium', name: 'Kisan Kumar', trialEnd: Date.now() + 30 * 24 * 60 * 60 * 1000 });
  };

  const handlePayment = (method) => {
    setView('processing');
    setTimeout(() => {
      setView('success');
      setTimeout(() => {
        completeLogin();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/20 rounded-full blur-3xl"></div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'welcome' && (
          <motion.div key="welcome" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="bg-white/80 backdrop-blur-xl border border-white/50 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">Krishi Mitra AI</h1>
            <p className="text-center text-gray-500 mb-8 font-medium">Smart Agriculture Ecosystem</p>

            <div className="space-y-4">
              <button onClick={() => setView('signup')} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-green-500/30 transition-all flex justify-center items-center gap-2">
                Create Account <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => setView('login')} className="w-full bg-white border-2 border-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all">
                Login to Account
              </button>
            </div>

            <div className="mt-8 relative flex items-center py-5">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-semibold uppercase">Or Try It First</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button onClick={handleGuest} className="w-full bg-gray-50 text-gray-600 border border-gray-200 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all">
              Explore Guest Demo
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">Demo includes limited features. No registration required.</p>
          </motion.div>
        )}

        {(view === 'login' || view === 'signup') && (
          <motion.div key="auth" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="bg-white/90 backdrop-blur-xl border border-white/50 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative z-10">
            <button onClick={() => setView('welcome')} className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8 mt-2">
              {view === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>

            <div className="space-y-3 mb-6">
              <button onClick={() => setView('trial')} className="w-full bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
              <button onClick={() => setView('trial')} className="w-full bg-black text-white font-bold py-3.5 rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Continue with Apple
              </button>
              <button onClick={() => setView('trial')} className="w-full bg-blue-50 text-blue-600 border border-blue-100 font-bold py-3.5 rounded-2xl hover:bg-blue-100 transition-all flex items-center justify-center gap-3">
                <PhoneIcon className="w-5 h-5" />
                Phone Number (OTP)
              </button>
            </div>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-semibold uppercase">Or email</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setView('trial'); }}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" required placeholder="Email Address" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:bg-white transition-all" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" required placeholder="Password" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:bg-white transition-all" />
              </div>
              
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-all shadow-md shadow-green-500/20">
                {view === 'login' ? 'Login' : 'Create Account'}
              </button>
            </form>
          </motion.div>
        )}

        {view === 'trial' && (
          <motion.div key="trial" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="bg-white/95 backdrop-blur-xl border border-white/50 w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl relative z-10 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Unlock 30 Days Free</h2>
            <p className="text-gray-500 mb-8">Experience the full power of AI for your farm, absolutely free for a month. Cancel anytime.</p>
            
            <div className="text-left space-y-4 mb-8">
              <div className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-green-500"/><span className="font-semibold text-gray-700">Unlimited AI Disease Diagnosis</span></div>
              <div className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-green-500"/><span className="font-semibold text-gray-700">Live Multilingual Voice Assistant</span></div>
              <div className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-green-500"/><span className="font-semibold text-gray-700">Advanced Fertilizer & Weather Intel</span></div>
              <div className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-green-500"/><span className="font-semibold text-gray-700">Real-Time Market Prices</span></div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl mb-8 border border-gray-200 flex justify-between items-center">
              <div className="text-left">
                <p className="text-gray-500 text-sm font-bold uppercase">After 30 Days</p>
                <p className="text-xl font-bold text-gray-800">₹50 <span className="text-sm font-normal text-gray-500">/ month</span></p>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">Most Affordable</span>
              </div>
            </div>

            <button onClick={() => setView('payment')} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-green-500/30 transition-all text-lg">
              Start 30-Day Free Trial
            </button>
            <button onClick={completeLogin} className="mt-4 text-gray-400 text-sm font-semibold hover:text-gray-700 transition-colors">
              Skip for now, just show me the app
            </button>
          </motion.div>
        )}

        {view === 'payment' && (
          <motion.div key="payment" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="bg-white/95 backdrop-blur-xl border border-white/50 w-full max-w-lg p-6 sm:p-8 rounded-[2.5rem] shadow-2xl relative z-10">
             <button onClick={() => setView('trial')} className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2 mt-2">Setup Auto-Pay</h2>
            <p className="text-center text-gray-500 text-sm mb-8">You won't be charged today. Cancel before 30 days to avoid the ₹50/mo fee.</p>

            <div className="space-y-3 mb-6">
              <button onClick={() => handlePayment('UPI')} className="w-full border-2 border-gray-100 p-4 rounded-2xl flex items-center justify-between hover:border-green-500 hover:bg-green-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-green-100"><Smartphone className="w-5 h-5 text-blue-600 group-hover:text-green-600"/></div>
                  <div className="text-left"><p className="font-bold text-gray-800">UPI Payment</p><p className="text-xs text-gray-500">GPay, PhonePe, Paytm</p></div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
              </button>
              
              <button onClick={() => handlePayment('Card')} className="w-full border-2 border-gray-100 p-4 rounded-2xl flex items-center justify-between hover:border-green-500 hover:bg-green-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-green-100"><CreditCard className="w-5 h-5 text-purple-600 group-hover:text-green-600"/></div>
                  <div className="text-left"><p className="font-bold text-gray-800">Credit / Debit Card</p><p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p></div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
              </button>

              <button onClick={() => handlePayment('NetBanking')} className="w-full border-2 border-gray-100 p-4 rounded-2xl flex items-center justify-between hover:border-green-500 hover:bg-green-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-green-100"><CloudRain className="w-5 h-5 text-orange-600 group-hover:text-green-600"/></div>
                  <div className="text-left"><p className="font-bold text-gray-800">Net Banking / Wallets</p><p className="text-xs text-gray-500">All Major Banks</p></div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-semibold mt-8">
              <ShieldCheck className="w-4 h-4 text-green-500" /> 256-bit Secure Encryption by Razorpay
            </div>
          </motion.div>
        )}

        {view === 'processing' && (
          <motion.div key="processing" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="bg-white/95 backdrop-blur-xl border border-white/50 w-full max-w-sm p-10 rounded-[2.5rem] shadow-2xl relative z-10 text-center">
             <div className="flex justify-center mb-8">
                <div className="w-20 h-20 border-4 border-gray-100 border-t-green-500 rounded-full animate-spin"></div>
             </div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment...</h2>
             <p className="text-gray-500 text-sm mb-6">Please do not close or refresh this window securely connecting to gateway.</p>
             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Amount to Authorize</span>
                <span className="text-xl font-bold text-green-600">₹50.00</span>
             </div>
             <div className="mt-6 text-xs text-gray-400 flex justify-center items-center gap-2">
               <Lock className="w-4 h-4" /> Secure Gateway
             </div>
          </motion.div>
        )}

        {view === 'success' && (
          <motion.div key="success" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="bg-white/95 backdrop-blur-xl border border-white/50 w-full max-w-sm p-10 rounded-[2.5rem] shadow-2xl relative z-10 text-center">
             <motion.div 
               initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
               className="flex justify-center mb-6"
             >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
             </motion.div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
             <p className="text-gray-500 text-sm mb-6">Your premium subscription is now active.</p>
             <p className="text-xs text-gray-400 animate-pulse">Redirecting to your dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
