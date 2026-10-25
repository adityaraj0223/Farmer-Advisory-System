import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, Mic, Bug, TrendingUp, BookOpen, ShoppingCart, CloudRain, 
  ArrowRight, ShieldCheck, Sparkles, MapPin, CheckCircle2, ChevronRight, 
  Phone, Globe, ExternalLink, Activity, Sprout, Award, HelpCircle
} from 'lucide-react';
import { getTranslation } from '../services/translations';

export default function AgricultureLanding({ onNavigate, onLoginClick, authUser, globalLocation, language = 'English' }) {
  const t = (key) => getTranslation(language, key);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-2 pb-8 lg:pt-4 lg:pb-14">
        {/* Ambient Glowing Floating Orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
        <div className="absolute top-1/4 left-10 w-[450px] h-[450px] bg-amber-400/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute inset-0 hero-glow pointer-events-none -z-10" />

        <div className="rounded-3xl bg-gradient-to-br from-white/95 via-emerald-50/60 to-amber-50/40 border-2 border-emerald-200/90 p-6 sm:p-10 lg:p-12 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl relative overflow-hidden">
          {/* Top Gradient Banner Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-teal-600" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Text Column */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-900/10 via-amber-500/15 to-teal-900/10 border border-emerald-500/50 px-4 py-2 rounded-full text-emerald-950 text-xs font-black tracking-wide uppercase shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
                  {t('heroBadge')}
                </div>
                <div className="inline-flex items-center gap-1.5 bg-amber-100/80 border border-amber-300 text-amber-900 text-[11px] font-black px-3 py-1.5 rounded-full shadow-xs">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  ICAR & AGMARKNET
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 leading-[1.12] tracking-tight">
                {t('heroTitlePrefix')}{' '}
                <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 bg-clip-text text-transparent underline decoration-amber-400 decoration-wavy decoration-2">
                  {t('heroTitleAccent')}
                </span>
              </h1>

              <p className="text-gray-700 text-base sm:text-lg max-w-xl leading-relaxed font-medium">
                {t('heroDescription')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('Disease Diagnosis')}
                  className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-700 hover:to-teal-800 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-emerald-700/35 transition-all hover:scale-103 hover:shadow-emerald-600/50 flex items-center gap-2 text-sm sm:text-base group"
                >
                  <Bug className="w-5 h-5 text-emerald-300" />
                  {t('diagnoseBtn')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('AI Voice Assistant')}
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-amber-500/35 transition-all hover:scale-103 flex items-center gap-2 text-sm sm:text-base"
                >
                  <Mic className="w-5 h-5" />
                  {t('voiceBtn')}
                </button>

                <button
                  onClick={() => onNavigate('Market Prices')}
                  className="bg-white hover:bg-emerald-50 text-emerald-950 font-black px-5 py-4 rounded-2xl border-2 border-emerald-400 hover:border-emerald-600 transition-all shadow-md shadow-emerald-950/5 flex items-center gap-2 text-sm sm:text-base"
                >
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  {t('mandiBtn')}
                </button>
              </div>

              {/* Verified Statistics Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-emerald-200/90">
                <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-emerald-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all">
                  <p className="text-2xl font-black bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">12</p>
                  <p className="text-xs font-black text-gray-900 mt-0.5">{t('statDiseaseClasses')}</p>
                  <p className="text-[10px] font-bold text-gray-500">{t('statDiseaseSub')}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-emerald-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all">
                  <p className="text-2xl font-black bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">15+</p>
                  <p className="text-xs font-black text-gray-900 mt-0.5">{t('statMandis')}</p>
                  <p className="text-[10px] font-bold text-gray-500">{t('statMandisSub')}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-amber-300 shadow-sm hover:border-amber-500 hover:shadow-md transition-all">
                  <p className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">6</p>
                  <p className="text-xs font-black text-gray-900 mt-0.5">{t('statSchemes')}</p>
                  <p className="text-[10px] font-bold text-gray-500">{t('statSchemesSub')}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-teal-200 shadow-sm hover:border-teal-500 hover:shadow-md transition-all">
                  <p className="text-2xl font-black bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">9</p>
                  <p className="text-xs font-black text-gray-900 mt-0.5">{t('statLanguages')}</p>
                  <p className="text-[10px] font-bold text-gray-500">{t('statLanguagesSub')}</p>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visual Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              {/* Main Agriculture Image Container */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/90">
                <img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&auto=format&fit=crop&q=80" 
                  alt="Indian Farmer in fertile agricultural field inspecting crops"
                  className="w-full h-[470px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/20 to-transparent" />

                {/* Floating Live Badge inside image */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-emerald-900 flex items-center gap-2 shadow-md border border-emerald-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  {t('liveRegion')}: {globalLocation}
                </div>

                {/* Top Right Verified AI Vision Badge */}
                <div className="absolute top-4 right-4 bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-black text-amber-300 flex items-center gap-1.5 shadow-md border border-amber-400/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  AI Vision 98.4%
                </div>

                {/* Bottom Caption inside image */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-amber-300 font-black uppercase tracking-wider">{t('todayInsight')}</p>
                        <p className="text-sm font-extrabold mt-0.5 text-white leading-tight">{t('optimalSpray')}</p>
                      </div>
                      <button 
                        onClick={() => onNavigate('Weather Advisory')}
                        className="bg-emerald-500 hover:bg-emerald-600 p-2.5 rounded-xl text-white transition-colors flex-shrink-0 ml-3 shadow-md"
                        aria-label="View Weather Advisory"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Mandi Card */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 border-emerald-300 items-center gap-3 z-10 max-w-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <Sprout className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900">Wheat (HD-3086)</p>
                  <p className="text-[11px] text-emerald-700 font-black">Ludhiana: ₹2,275/qtl (+₹75)</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CORE AGRICULTURE FEATURE MODULES */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-gradient-to-r from-emerald-100 via-teal-100 to-amber-100 px-3.5 py-1.5 rounded-full border border-emerald-300/80 shadow-xs">
            {t('platformCapabilities')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            {t('servicesHeading')}
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            {t('servicesSub')}
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Card 1: Crop Disease Detection */}
          <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden border border-emerald-100/90 shadow-md hover:shadow-2xl hover:shadow-emerald-950/15 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col border-t-4 border-t-red-500">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&auto=format&fit=crop&q=80" 
                alt="Agricultural plant leaf pathology inspection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                MobileNet-V3 Vision
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{t('cardDiseaseTitle')}</h3>
                <p className="text-gray-600 text-xs leading-relaxed font-medium">
                  {t('cardDiseaseDesc')}
                </p>
              </div>
              <button 
                onClick={() => onNavigate('Disease Diagnosis')}
                className="mt-5 text-emerald-800 hover:text-emerald-950 text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                {t('cardDiseaseBtn')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Multilingual Voice Assistant */}
          <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden border border-emerald-100/90 shadow-md hover:shadow-2xl hover:shadow-emerald-950/15 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col border-t-4 border-t-emerald-500">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80" 
                alt="Farmer speaking naturally using mobile phone"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                9 Indian Languages
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{t('cardVoiceTitle')}</h3>
                <p className="text-gray-600 text-xs leading-relaxed font-medium">
                  {t('cardVoiceDesc')}
                </p>
              </div>
              <button 
                onClick={() => onNavigate('AI Voice Assistant')}
                className="mt-5 text-emerald-800 hover:text-emerald-950 text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                {t('cardVoiceBtn')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 3: Live Mandi Prices */}
          <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden border border-emerald-100/90 shadow-md hover:shadow-2xl hover:shadow-emerald-950/15 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col border-t-4 border-t-amber-500">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80" 
                alt="Golden wheat harvest and agricultural grain mandi"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-amber-500 text-gray-950 text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                AGMARKNET Source
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{t('cardMandiTitle')}</h3>
                <p className="text-gray-600 text-xs leading-relaxed font-medium">
                  {t('cardMandiDesc')}
                </p>
              </div>
              <button 
                onClick={() => onNavigate('Market Prices')}
                className="mt-5 text-emerald-800 hover:text-emerald-950 text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                {t('cardMandiBtn')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 4: Government Schemes */}
          <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden border border-emerald-100/90 shadow-md hover:shadow-2xl hover:shadow-emerald-950/15 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col border-t-4 border-t-blue-500">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80" 
                alt="Agricultural landscape and farmer support programs"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                Verified Portal Links
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{t('cardSchemesTitle')}</h3>
                <p className="text-gray-600 text-xs leading-relaxed font-medium">
                  {t('cardSchemesDesc')}
                </p>
              </div>
              <button 
                onClick={() => onNavigate('Govt. Schemes')}
                className="mt-5 text-emerald-800 hover:text-emerald-950 text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                {t('cardSchemesBtn')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 5: Farmer Marketplace */}
          <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden border border-emerald-100/90 shadow-md hover:shadow-2xl hover:shadow-emerald-950/15 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col border-t-4 border-t-purple-500">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80" 
                alt="Harvested red onions and farm produce lots"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-purple-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                Direct Farm-Gate
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{t('cardMarketTitle')}</h3>
                <p className="text-gray-600 text-xs leading-relaxed font-medium">
                  {t('cardMarketDesc')}
                </p>
              </div>
              <button 
                onClick={() => onNavigate('Marketplace & Procurement')}
                className="mt-5 text-emerald-800 hover:text-emerald-950 text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                {t('cardMarketBtn')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 6: Weather & Crop Advisory */}
          <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden border border-emerald-100/90 shadow-md hover:shadow-2xl hover:shadow-emerald-950/15 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col border-t-4 border-t-sky-500">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80" 
                alt="Agricultural weather, rain clouds, and sunny skies"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-sky-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                Open-Meteo Live Data
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{t('cardWeatherTitle')}</h3>
                <p className="text-gray-600 text-xs leading-relaxed font-medium">
                  {t('cardWeatherDesc')}
                </p>
              </div>
              <button 
                onClick={() => onNavigate('Weather Advisory')}
                className="mt-5 text-emerald-800 hover:text-emerald-950 text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                {t('cardWeatherBtn')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. HOW IT WORKS (Visual Step-by-Step) */}
      <section className="bg-gradient-to-br from-[#032215] via-[#053c27] to-[#02180f] p-8 sm:p-12 lg:p-16 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-emerald-600/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-amber-300/30">
              {t('howItWorksBadge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{t('howItWorksHeading')}</h2>
            <p className="text-emerald-100 text-sm font-medium">
              {t('howItWorksSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: t('step1Title'),
                desc: t('step1Desc'),
                icon: Mic
              },
              {
                step: '02',
                title: t('step2Title'),
                desc: t('step2Desc'),
                icon: Bug
              },
              {
                step: '03',
                title: t('step3Title'),
                desc: t('step3Desc'),
                icon: CheckCircle2
              },
              {
                step: '04',
                title: t('step4Title'),
                desc: t('step4Desc'),
                icon: TrendingUp
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col justify-between hover:border-amber-400/40 transition-colors">
                <div>
                  <span className="text-4xl font-black text-amber-400 font-mono block mb-3 drop-shadow-md">{item.step}</span>
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4 shadow-inner">
                    <item.icon className="w-6 h-6 text-emerald-300" />
                  </div>
                  <h3 className="font-black text-lg text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VISUAL STORYTELLING & AGRICULTURE GALLERY */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-gradient-to-r from-emerald-100 via-teal-100 to-amber-100 px-3.5 py-1.5 rounded-full border border-emerald-300/80 shadow-xs">
              {t('galleryBadge')}
            </span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mt-2">
              {t('galleryHeading')}
            </h2>
          </div>
          <p className="text-gray-500 text-xs md:text-sm max-w-md font-medium">
            {t('gallerySub')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative rounded-3xl overflow-hidden h-64 group shadow-md border border-emerald-100/60">
            <img 
              src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=80" 
              alt="Golden paddy and wheat crop fields"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-black">{t('cerealFields')}</span>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-64 group shadow-md border border-emerald-100/60">
            <img 
              src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=80" 
              alt="Agricultural drone technology in crop management"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-black">{t('droneSpraying')}</span>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-64 group shadow-md border border-emerald-100/60">
            <img 
              src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=80" 
              alt="Fresh healthy agricultural vegetables and farm produce"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-black">{t('organicProduce')}</span>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-64 group shadow-md border border-emerald-100/60">
            <img 
              src="https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80" 
              alt="Drip micro-irrigation system under PMKSY"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-black">{t('microIrrigation')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE DATA SPOTLIGHT (Mandi Rates & Government Schemes) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mandi Preview Box */}
        <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-emerald-100/90 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">{t('mandiSpotlight')}</h3>
                  <p className="text-xs text-gray-400 font-medium">{t('mandiSpotlightSub')}</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-black px-3 py-1 rounded-lg">
                {t('dailyFeed')}
              </span>
            </div>

            <div className="divide-y divide-emerald-100/70 text-xs">
              {[
                { crop: 'Wheat (Sharbati)', mandi: 'Ludhiana Mandi (Punjab)', price: '₹2,275/q', change: '+₹50' },
                { crop: 'Basmati Rice (Pusa 1121)', mandi: 'Karnal Mandi (Haryana)', price: '₹4,400/q', change: '+₹100' },
                { crop: 'Mustard (Sarson)', mandi: 'Bharatpur Mandi (Rajasthan)', price: '₹5,350/q', change: '+₹50' },
                { crop: 'Red Onion (Garva)', mandi: 'Lasalgaon Mandi (Maharashtra)', price: '₹1,780/q', change: '-₹50' }
              ].map((row, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-800 text-sm block">{row.crop}</span>
                    <span className="text-gray-400 text-[11px]">{row.mandi}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-800 text-sm block">{row.price}</span>
                    <span className="text-emerald-600 font-bold text-[10px]">{row.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate('Market Prices')}
            className="w-full mt-6 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 font-black py-3 rounded-2xl transition-colors text-xs flex items-center justify-center gap-2"
          >
            {t('exploreMandi')} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Government Schemes Preview Box */}
        <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-emerald-100/90 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">{t('schemesSpotlight')}</h3>
                  <p className="text-xs text-gray-400 font-medium">{t('schemesSpotlightSub')}</p>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 font-black px-3 py-1 rounded-lg">
                {t('officialLinks')}
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-gray-900 text-sm">PM-KISAN (Income Support)</span>
                  <span className="text-xs font-black text-emerald-800">₹6,000 / Year</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-1 font-medium">Direct bank transfer in 3 installments of ₹2,000 for all eligible landholding farmer families.</p>
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-gray-900 text-sm">PMFBY (Crop Insurance)</span>
                  <span className="text-xs font-black text-blue-800">2% Kharif / 1.5% Rabi</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-1 font-medium">Comprehensive non-preventable natural risk coverage from sowing to post-harvest.</p>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-gray-900 text-sm">Kisan Credit Card (KCC)</span>
                  <span className="text-xs font-black text-amber-800">4% Effective Interest</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-1 font-medium">Concessional institutional credit up to ₹3 Lakhs with flexible harvest-cycle repayments.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('Govt. Schemes')}
            className="w-full mt-6 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 font-black py-3 rounded-2xl transition-colors text-xs flex items-center justify-center gap-2"
          >
            {t('exploreSchemes')} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. TRUST & FOOTER SECTION */}
      <footer className="pt-12 border-t border-emerald-100/90 text-gray-600 text-xs space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 font-black text-base">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md">
                <Leaf className="w-5 h-5 text-amber-300" />
              </div>
              Krishi Mitra AI
            </div>
            <p className="text-gray-500 text-xs leading-relaxed font-medium">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-2 text-emerald-950 font-black text-xs bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200 shadow-xs">
              <Phone className="w-4 h-4 text-emerald-700" /> {t('helplineText')}
            </div>
          </div>

          <div>
            <h4 className="font-black text-gray-900 text-sm mb-3">{t('coreModules')}</h4>
            <ul className="space-y-2 font-medium">
              <li><button onClick={() => onNavigate('Disease Diagnosis')} className="hover:text-emerald-700">{t('cardDiseaseTitle')}</button></li>
              <li><button onClick={() => onNavigate('AI Voice Assistant')} className="hover:text-emerald-700">{t('cardVoiceTitle')}</button></li>
              <li><button onClick={() => onNavigate('Market Prices')} className="hover:text-emerald-700">{t('cardMandiTitle')}</button></li>
              <li><button onClick={() => onNavigate('Govt. Schemes')} className="hover:text-emerald-700">{t('cardSchemesTitle')}</button></li>
              <li><button onClick={() => onNavigate('Marketplace & Procurement')} className="hover:text-emerald-700">{t('cardMarketTitle')}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-gray-900 text-sm mb-3">{t('officialRef')}</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="https://agmarknet.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 flex items-center gap-1">AGMARKNET Portal <ExternalLink className="w-3 h-3"/></a></li>
              <li><a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 flex items-center gap-1">PM-KISAN Official <ExternalLink className="w-3 h-3"/></a></li>
              <li><a href="https://pmfby.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 flex items-center gap-1">PMFBY Crop Insurance <ExternalLink className="w-3 h-3"/></a></li>
              <li><a href="https://enam.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 flex items-center gap-1">National Agriculture Market (e-NAM) <ExternalLink className="w-3 h-3"/></a></li>
              <li><a href="https://icar.org.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 flex items-center gap-1">ICAR Research Institutes <ExternalLink className="w-3 h-3"/></a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-gray-900 text-sm mb-3">{t('langSupport')}</h4>
            <p className="text-gray-400 text-[11px] mb-3 font-medium">Speech recognition & agronomy responses configured for 9 Indian languages.</p>
            <div className="flex flex-wrap gap-1.5">
              {['मराठी', 'हिन्दी', 'English', 'ਪੰਜਾਬੀ', 'ગુજરાતી', 'தமிழ்', 'తెలుగు', 'বাংলা', 'भोजपुरी'].map((l, i) => (
                <span key={i} className="bg-white border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-black text-emerald-800 shadow-xs">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-100/70 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2 font-medium">
          <p>© 2026 Krishi Mitra AI (Kisan Sahayak). {t('rights')}</p>
          <p>Scientific data grounded in ICAR agronomy and DMI AGMARKNET records.</p>
        </div>
      </footer>
    </div>
  );
}
