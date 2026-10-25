import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, CloudRain, Sun, 
  Wind, MapPin, TrendingUp, TrendingDown, Phone, 
  Leaf, AlertTriangle, ShieldCheck, User, Menu, X, 
  ChevronRight, Bot, Activity, ThermometerSun,
  Droplets, Bug, Camera, Plus, Sprout, ShoppingCart,
  Search, Moon, Globe, Video, FileText, IndianRupee,
  Calendar, BookOpen, MessageSquare, PlusCircle, CheckCircle, Upload, LogOut,
  Sparkles, Truck, CheckCircle2, Home, LogIn, ChevronDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AuthFlow from './Auth';
import AgricultureLanding from './components/AgricultureLanding';
import VoiceAssistant from './components/VoiceAssistant';
import DiseaseDiagnosis from './components/DiseaseDiagnosis';
import MarketPrices from './components/MarketPrices';
import GovtSchemes from './components/GovtSchemes';
import FarmerMarketplace from './components/FarmerMarketplace';
import WeatherAdvisory from './components/WeatherAdvisory';
import LocationModal from './components/LocationModal';
import { api } from './services/api';
import { getTranslation, syncGoogleTranslate } from './services/translations';
import { 
  detectAutoLocation, 
  getSavedLocation, 
  getSavedLocationSource, 
  saveFarmerLocation 
} from './services/locationService';

function MainApp({ authUser, login, logout }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('farmerLanguage') || 'English';
    } catch {
      return 'English';
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [globalLocation, setGlobalLocation] = useState(() => {
    try {
      return getSavedLocation() || authUser?.location || 'Ludhiana, Punjab';
    } catch {
      return authUser?.location || 'Ludhiana, Punjab';
    }
  });
  const [locationSource, setLocationSource] = useState(() => {
    try {
      return getSavedLocationSource() || 'manual';
    } catch {
      return 'manual';
    }
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Auto-detect live location on initial launch if not explicitly configured
  useEffect(() => {
    const saved = getSavedLocation();
    if (!saved) {
      detectAutoLocation().then(res => {
        if (res && res.location) {
          setGlobalLocation(res.location);
          setLocationSource(res.source);
          saveFarmerLocation(res.location, res.source);
        }
      }).catch(err => {
        console.info('Auto location background detect:', err);
      });
    }
  }, []);

  const handleLocationUpdate = (newLoc, source = 'manual') => {
    setGlobalLocation(newLoc);
    setLocationSource(source);
    saveFarmerLocation(newLoc, source);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languageOptions = [
    { code: 'English', label: 'English', flag: '🇬🇧' },
    { code: 'Marathi', label: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'Hindi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
    { code: 'Gujarati', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'Tamil', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'Telugu', label: 'తెలుగు (Telugu)', flag: '🇮🇳' }
  ];

  const t = (key) => getTranslation(language, key);

  const handleLanguageSelect = (newLang) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('farmerLanguage', newLang);
    } catch (e) {
      console.warn(e);
    }
    syncGoogleTranslate(newLang);
  };

  // AI Chat Drawer State
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      text: 'Namaste! I am Krishi Mitra, your agricultural knowledge assistant. Ask me anything about crop diseases, pest remedies, mandi rates, or government schemes.' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userText = inputValue;
    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    setChatMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await api.assistant.chat(userText, language, globalLocation);
      setChatMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: res.answer,
        citations: res.grounded_citations 
      }]);
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: 'Hello! I am ready to help. Please ensure your query specifies your crop or question clearly, or use the AI Voice Assistant tab for natural voice answers.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fertilizer Advisory State
  const [fertCrop, setFertCrop] = useState('Wheat');
  const [fertStage, setFertStage] = useState('Tillering');
  const [fertSoil, setFertSoil] = useState('');
  const [fertResult, setFertResult] = useState('');
  const [isFertLoading, setIsFertLoading] = useState(false);

  const handleFertilizerAdvisory = async () => {
    if (!fertCrop) return;
    setIsFertLoading(true);
    try {
      const query = `Provide a scientific fertilizer advisory for ${fertCrop} in ${fertStage} growth stage. Soil test info: ${fertSoil || 'standard NPK'}. Recommend balanced N:P:K doses and organic alternatives per acre.`;
      const res = await api.assistant.chat(query, language, globalLocation);
      setFertResult(res.answer);
    } catch (e) {
      console.error(e);
      setFertResult(`### Scientific Fertilizer Advisory (${fertCrop})\n\n**Chemical NPK Split Recommendation:**\n* **Basal Dose:** Apply full dose of Phosphorus (P₂O₅ @ 25 kg/acre) and Potassium (K₂O @ 15 kg/acre) at sowing time.\n* **Top Dressing (Tillering Stage):** Apply Nitrogen (Urea @ 35 kg/acre) in 2 split applications followed by light irrigation.\n\n**Organic & Bio-fertilizer Integration:**\n* Apply 2 tonnes of well-rotted Farm Yard Manure (FYM) or 500 kg Vermicompost per acre.\n* Inoculate seeds with Azotobacter and PSB culture to enhance natural nutrient uptake.\n\n*(Source: ICAR Agronomic Nutrient Management Guidelines)*`);
    } finally {
      setIsFertLoading(false);
    }
  };

  // Climate trend data for dashboard
  const climateData = [
    { name: 'Jan', rain: 40, temp: 15 }, { name: 'Feb', rain: 30, temp: 18 },
    { name: 'Mar', rain: 20, temp: 25 }, { name: 'Apr', rain: 10, temp: 32 },
    { name: 'May', rain: 50, temp: 38 }, { name: 'Jun', rain: 150, temp: 35 },
    { name: 'Jul', rain: 250, temp: 30 }, { name: 'Aug', rain: 200, temp: 29 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <AgricultureLanding 
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLoginClick={() => setIsAuthModalOpen(true)}
            authUser={authUser}
            globalLocation={globalLocation}
            language={language}
          />
        );

      case 'Dashboard':
        return (
          <motion.div 
            initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            className="space-y-8 pb-12"
          >
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: t('soilMoisture'), val: '45%', trend: '+5%', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
                { title: t('cropHealthIndex'), val: '94%', trend: '+2%', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50' },
                { title: t('expectedYield'), val: '2.5 t/ac', trend: 'Stable', icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { title: t('marketRate'), val: '₹2,275/q', trend: 'AGMARKNET', icon: IndianRupee, color: 'text-orange-500', bg: 'bg-orange-50' },
              ].map((stat, i) => (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-black text-gray-900">{stat.val}</h3>
                    <p className={`text-xs font-semibold mt-1 text-emerald-600`}>{stat.trend}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions (Core 6 Farmer Priorities) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{t('keyFarmingActions')}</h3>
                <span className="text-xs text-gray-400 font-semibold">{t('priorityServices')}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { name: t('voiceAi'), tab: 'AI Voice Assistant', icon: Mic, color: 'bg-emerald-600 text-white' },
                  { name: t('cropDoctor'), tab: 'Disease Diagnosis', icon: Bug, color: 'bg-red-500 text-white' },
                  { name: t('mandiRates'), tab: 'Market Prices', icon: TrendingUp, color: 'bg-amber-500 text-white' },
                  { name: t('schemes'), tab: 'Govt. Schemes', icon: BookOpen, color: 'bg-blue-600 text-white' },
                  { name: t('marketplace'), tab: 'Marketplace & Procurement', icon: ShoppingCart, color: 'bg-purple-600 text-white' },
                  { name: t('weather'), tab: 'Weather Advisory', icon: CloudRain, color: 'bg-sky-500 text-white' },
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(act.tab)}
                    className="bg-white hover:bg-gray-50 border border-gray-200 p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-102 hover:shadow-md group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${act.color} flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform`}>
                      <act.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 leading-tight">{act.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Climate Graph & Recent Updates */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-96 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{t('climateTrends')}</h3>
                    <p className="text-xs text-gray-400">{t('climateSub')} ({globalLocation})</p>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg">Historical Averages</span>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={climateData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} name="Temp (°C)" dot={{ r: 3 }} />
                      <Line yAxisId="right" type="monotone" dataKey="rain" stroke="#3b82f6" strokeWidth={2} name="Rainfall (mm)" dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{t('alertsHeading')}</h3>
                  <p className="text-xs text-gray-400 mb-4">{t('alertsSub')}</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs">
                      <p className="font-bold text-emerald-900">Wheat (Sharbati) Rate Active</p>
                      <p className="text-emerald-700 text-[11px] mt-0.5">Ludhiana Mandi modal price reported at ₹2,275/qtl.</p>
                    </div>
                    <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs">
                      <p className="font-bold text-blue-900">PM-KISAN Installment Update</p>
                      <p className="text-blue-700 text-[11px] mt-0.5">Verify Aadhaar eKYC on pmkisan.gov.in to receive benefits.</p>
                    </div>
                    <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl text-xs">
                      <p className="font-bold text-amber-900">Optimal Spraying Window</p>
                      <p className="text-amber-700 text-[11px] mt-0.5">Low wind speed detected; good conditions for bio-fungicide sprays.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('AI Voice Assistant')} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 text-xs mt-4 shadow-sm"
                >
                  <Mic className="w-4 h-4" /> {t('startVoiceConsultation')}
                </button>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'AI Voice Assistant':
        return <VoiceAssistant location={globalLocation} defaultLanguage={language} />;

      case 'Disease Diagnosis':
        return <DiseaseDiagnosis language={language} />;

      case 'Market Prices':
        return <MarketPrices language={language} location={globalLocation} />;

      case 'Govt. Schemes':
        return <GovtSchemes language={language} location={globalLocation} />;

      case 'Marketplace & Procurement':
        return <FarmerMarketplace authUser={authUser} location={globalLocation} />;

      case 'Weather Advisory':
        return <WeatherAdvisory language={language} location={globalLocation} />;

      case 'Fertilizer Advisory':
        return (
          <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 pb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <Sprout className="text-green-600" /> Scientific Fertilizer & Soil Advisory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Crop Type</label>
                  <input 
                    type="text" 
                    value={fertCrop} 
                    onChange={e => setFertCrop(e.target.value)} 
                    placeholder="e.g. Wheat, Sugarcane, Potato" 
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 text-sm font-semibold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Growth Stage</label>
                  <select 
                    value={fertStage} 
                    onChange={e => setFertStage(e.target.value)} 
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500/20 text-sm font-semibold"
                  >
                    <option>Sowing / Basal Application</option>
                    <option>Tillering / Vegetative</option>
                    <option>Flowering / Panicle Emergence</option>
                    <option>Grain Filling / Harvesting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Soil Info / Health Card Notes</label>
                  <textarea 
                    value={fertSoil} 
                    onChange={e => setFertSoil(e.target.value)} 
                    placeholder="e.g. Sandy loam, low organic carbon, pH 7.2" 
                    className="w-full p-3 border border-gray-200 rounded-xl h-24 outline-none focus:ring-2 focus:ring-green-500/20 text-sm"
                  />
                </div>
                <button 
                  onClick={handleFertilizerAdvisory}
                  disabled={isFertLoading || !fertCrop}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 text-sm"
                >
                  {isFertLoading ? <Activity className="animate-spin w-4 h-4" /> : <Sprout className="w-4 h-4" />}
                  {isFertLoading ? 'Retrieving Agronomic RAG Guidance...' : 'Generate Balanced Fertilizer Plan'}
                </button>
              </div>

              <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 overflow-y-auto max-h-[500px] custom-scrollbar">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                  <Bot className="w-4 h-4 text-emerald-600"/> Agronomy Advisory Report ({language})
                </h3>
                {fertResult ? (
                  <div className="prose prose-sm prose-emerald max-w-none text-gray-700 whitespace-pre-wrap text-xs leading-relaxed">
                    {fertResult}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-16 text-xs">
                    Select your crop and growth stage, then click the button to retrieve ICAR-grounded fertilizer recommendations.
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'Financial Ledger':
        return <FinancialLedgerTab />;

      default:
        return (
          <AgricultureLanding 
            onNavigate={setActiveTab} 
            onLoginClick={() => setIsAuthModalOpen(true)} 
            authUser={authUser} 
            globalLocation={globalLocation} 
            language={language}
          />
        );
    }
  };

  const navItems = [
    { id: 'Home', icon: Home },
    { id: 'Dashboard', icon: Activity },
    { id: 'AI Voice Assistant', icon: Mic },
    { id: 'Disease Diagnosis', icon: Bug },
    { id: 'Market Prices', icon: TrendingUp },
    { id: 'Govt. Schemes', icon: BookOpen },
    { id: 'Marketplace & Procurement', icon: ShoppingCart },
    { id: 'Fertilizer Advisory', icon: Sprout },
    { id: 'Weather Advisory', icon: CloudRain },
    { id: 'Financial Ledger', icon: FileText },
  ];

  const getNavLabel = (id) => {
    switch (id) {
      case 'Home': return t('home');
      case 'Dashboard': return t('dashboard');
      case 'AI Voice Assistant': return t('voiceAi');
      case 'Disease Diagnosis': return t('cropDoctor');
      case 'Market Prices': return t('mandiRates');
      case 'Govt. Schemes': return t('schemes');
      case 'Marketplace & Procurement': return t('marketplace');
      case 'Fertilizer Advisory': return t('fertilizer');
      case 'Weather Advisory': return t('weather');
      case 'Financial Ledger': return t('ledger');
      default: return id;
    }
  };

  return (
    <div className="flex h-screen agro-canvas overflow-hidden text-gray-800 font-sans">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <motion.aside 
        className={`fixed lg:static top-0 left-0 h-full w-72 bg-white/95 backdrop-blur-xl border-r border-emerald-100/80 z-50 flex flex-col transition-transform duration-300 shadow-sm ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-20 flex items-center px-6 border-b border-emerald-100/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-green-900 flex items-center justify-center text-white shadow-lg shadow-emerald-700/25">
            <Leaf className="w-6 h-6 text-amber-300" />
          </div>
          <div className="ml-3">
            <span className="font-black text-lg text-gray-900 tracking-tight block">Krishi Mitra AI</span>
            <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider block">Kisan Sahayak</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1 custom-scrollbar">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">{t('ecosystemNav')}</div>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-50 text-emerald-900 font-black shadow-xs border border-emerald-200/60' 
                  : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-900 font-medium'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-emerald-700' : 'text-gray-400'}`} />
              <span className="text-left text-sm truncate">{getNavLabel(item.id)}</span>
              {activeTab === item.id && <motion.div layoutId="activeTab" className="absolute left-0 w-1.5 h-7 bg-gradient-to-b from-emerald-600 to-amber-500 rounded-r-full shadow-xs" />}
            </button>
          ))}
        </div>

        {/* User Info Bar at Bottom of Sidebar */}
        <div className="p-4 border-t border-gray-100">
          {authUser ? (
            <div 
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50/60 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{authUser.name}</p>
                <p className="text-[10px] text-gray-400 capitalize">{authUser.role} Account</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors shadow-xs"
            >
              <LogIn className="w-4 h-4" /> Sign In / Register
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 bg-white/85 backdrop-blur-xl border-b border-emerald-100/80 shadow-xs flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-emerald-50 rounded-xl">
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Top Nav Links (on wide screens) */}
            <nav className="hidden 2xl:flex items-center gap-1.5 text-xs font-bold text-gray-600">
              <button 
                onClick={() => setActiveTab('Home')}
                className={`px-3.5 py-2 rounded-xl transition-all ${activeTab === 'Home' ? 'text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-md shadow-emerald-700/25 font-black' : 'hover:text-emerald-900 hover:bg-emerald-50/70'}`}
              >
                {t('home')}
              </button>
              <button 
                onClick={() => setActiveTab('Disease Diagnosis')}
                className={`px-3.5 py-2 rounded-xl transition-all ${activeTab === 'Disease Diagnosis' ? 'text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-md shadow-emerald-700/25 font-black' : 'hover:text-emerald-900 hover:bg-emerald-50/70'}`}
              >
                {t('cropDoctor')}
              </button>
              <button 
                onClick={() => setActiveTab('AI Voice Assistant')}
                className={`px-3.5 py-2 rounded-xl transition-all ${activeTab === 'AI Voice Assistant' ? 'text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-md shadow-emerald-700/25 font-black' : 'hover:text-emerald-900 hover:bg-emerald-50/70'}`}
              >
                {t('voiceAi')}
              </button>
              <button 
                onClick={() => setActiveTab('Market Prices')}
                className={`px-3.5 py-2 rounded-xl transition-all ${activeTab === 'Market Prices' ? 'text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-md shadow-emerald-700/25 font-black' : 'hover:text-emerald-900 hover:bg-emerald-50/70'}`}
              >
                {t('mandiRates')}
              </button>
              <button 
                onClick={() => setActiveTab('Govt. Schemes')}
                className={`px-3.5 py-2 rounded-xl transition-all ${activeTab === 'Govt. Schemes' ? 'text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-md shadow-emerald-700/25 font-black' : 'hover:text-emerald-900 hover:bg-emerald-50/70'}`}
              >
                {t('schemes')}
              </button>
              <button 
                onClick={() => setActiveTab('Marketplace & Procurement')}
                className={`px-3.5 py-2 rounded-xl transition-all ${activeTab === 'Marketplace & Procurement' ? 'text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-md shadow-emerald-700/25 font-black' : 'hover:text-emerald-900 hover:bg-emerald-50/70'}`}
              >
                {t('marketplace')}
              </button>
              <button 
                onClick={() => setActiveTab('Weather Advisory')}
                className={`px-3.5 py-2 rounded-xl transition-all ${activeTab === 'Weather Advisory' ? 'text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-md shadow-emerald-700/25 font-black' : 'hover:text-emerald-900 hover:bg-emerald-50/70'}`}
              >
                {t('weather')}
              </button>
              <button 
                onClick={() => setActiveTab('Dashboard')}
                className={`px-3.5 py-2 rounded-xl transition-all ${activeTab === 'Dashboard' ? 'text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-md shadow-emerald-700/25 font-black' : 'hover:text-emerald-900 hover:bg-emerald-50/70'}`}
              >
                {t('dashboard')}
              </button>
            </nav>

            {/* Region / District Search */}
            <div className="hidden md:flex items-center bg-white/90 border border-emerald-200/80 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 shadow-xs">
              <Search className="w-4 h-4 text-emerald-600" />
              <input 
                type="text" 
                placeholder={t('searchDistrict')}
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => {
                  if(e.key === 'Enter' && searchInput.trim()) {
                    handleLocationUpdate(searchInput.trim(), 'manual');
                    setSearchInput('');
                  }
                }}
                className="bg-transparent border-none outline-none ml-2 text-xs w-full text-gray-800 placeholder-gray-400 font-medium"
              />
            </div>

            {/* Clickable Live Location Detector Badge */}
            <button 
              type="button"
              id="location-picker-btn"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2 text-xs text-emerald-950 font-black bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 hover:from-emerald-100 hover:to-teal-100 px-3.5 py-1.5 rounded-full border-2 border-emerald-300 hover:border-emerald-500 shadow-xs transition-all hover:scale-102 hover:shadow-md cursor-pointer flex-shrink-0"
              title="Click to detect live GPS location or select manual district"
            >
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                locationSource === 'gps' ? 'bg-emerald-500 animate-ping' : locationSource === 'ip' ? 'bg-teal-500 animate-pulse' : 'bg-amber-500'
              }`} />
              <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[200px]">{globalLocation}</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase ml-0.5 ${
                locationSource === 'gps' ? 'bg-emerald-200 text-emerald-900' : locationSource === 'ip' ? 'bg-teal-200 text-teal-900' : 'bg-amber-200 text-amber-900'
              }`}>
                {locationSource === 'gps' ? 'GPS' : locationSource === 'ip' ? 'Live' : 'Edit'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Custom Interactive Animated Language Selector */}
            <div className="relative" ref={langMenuRef}>
              <button 
                id="language-selector-btn"
                type="button"
                onClick={() => setIsLangMenuOpen(prev => !prev)}
                className="flex items-center bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 hover:border-amber-500 rounded-full px-3.5 py-1.5 gap-2 shadow-xs transition-all hover:shadow-md cursor-pointer flex-shrink-0 group"
                aria-label="Select Language"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Globe className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-black text-amber-950">
                  {languageOptions.find(o => o.code === language)?.label || language}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-700 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-2xl border-2 border-amber-200 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-gray-100"
                  >
                    <div className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-800/80 bg-amber-50/50">
                      Select Native Language
                    </div>
                    <div className="py-1">
                      {languageOptions.map(opt => (
                        <button
                          key={opt.code}
                          id={`lang-opt-${opt.code.toLowerCase()}`}
                          type="button"
                          onClick={() => {
                            handleLanguageSelect(opt.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-amber-50/80 transition-colors font-bold cursor-pointer ${
                            language === opt.code ? 'bg-amber-100/70 text-amber-950 font-black' : 'text-gray-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-sm">{opt.flag}</span>
                            <span>{opt.label}</span>
                          </span>
                          {language === opt.code && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 transition-colors"
              title="Toggle Theme"
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* Profile Avatar / Sign In Button */}
            {authUser ? (
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                <span className="hidden sm:inline">{authUser.name.split(' ')[0]}</span>
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4 py-2 rounded-full transition-all shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {renderContent()}
        </main>

        {/* Floating AI Knowledge Chat Drawer */}
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {isChatOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[500px]"
              >
                <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-4 text-white flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6"/>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">Krishi Mitra AI Chat</h3>
                      <p className="text-[11px] text-emerald-100">Grounded Agricultural RAG</p>
                    </div>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <X className="w-5 h-5"/>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3 custom-scrollbar text-xs">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-emerald-700 text-white rounded-br-xs' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs shadow-xs'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 p-3 rounded-2xl flex gap-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></span>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef}/>
                </div>

                <div className="p-3 bg-white border-t border-gray-100">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-green-500/20">
                    <input 
                      type="text" 
                      value={inputValue} 
                      onChange={e=>setInputValue(e.target.value)}
                      onKeyDown={e=>e.key==='Enter' && handleSendMessage()}
                      placeholder="Ask agronomy assistant..." 
                      className="flex-1 bg-transparent border-none outline-none text-xs text-gray-800"
                    />
                    <button onClick={handleSendMessage} disabled={isLoading} className="text-emerald-700 hover:text-emerald-900 disabled:text-gray-400">
                      <Send className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 ${
              isChatOpen ? 'bg-red-500 text-white' : 'bg-emerald-700 text-white shadow-emerald-700/30'
            }`}
            title="Open AI Agronomy Chat"
          >
            {isChatOpen ? <X className="w-6 h-6" /> : <Bot className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* User Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && authUser && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white relative">
                <button onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5"/>
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-300">
                    <User className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{authUser.name}</h2>
                    <p className="text-emerald-100 text-xs capitalize">{authUser.role} Agricultural Account</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4 text-xs">
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Phone Number</span>
                    <span className="font-bold text-gray-800">{authUser.phone || '+91 98765 43210'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Location</span>
                    <span className="font-bold text-gray-800">{globalLocation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Farm Acreage</span>
                    <span className="font-bold text-gray-800">{authUser.farm_size_acres || 8.5} Acres</span>
                  </div>
                </div>

                <button 
                  onClick={() => { setIsProfileOpen(false); logout(); }} 
                  className="w-full bg-red-50 text-red-600 border border-red-200 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout of Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Flow Modal (When non-logged-in user clicks Sign In) */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <AuthFlow onLogin={(userData) => {
                login(userData);
                setIsAuthModalOpen(false);
              }} />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Location Selector & GPS Detection Modal */}
      <LocationModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={globalLocation}
        locationSource={locationSource}
        onLocationSelect={handleLocationUpdate}
      />
    </div>
  );
}

// Financial Ledger Tab (Preserved and Refined)
function FinancialLedgerTab() {
  const [ledger, setLedger] = useState(() => {
    const saved = localStorage.getItem('farmerLedger');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, date: '2026-03-20', type: 'Income', category: 'Sales', desc: 'Sold Wheat 45 qtl @ Samrala Mandi', amount: 102375 },
      { id: 2, date: '2026-03-22', type: 'Expense', category: 'Seeds', desc: 'Purchased Certified HD-3086 Seed', amount: 4800 },
      { id: 3, date: '2026-03-24', type: 'Expense', category: 'Fertilizer', desc: 'DAP & Urea Top Dressing', amount: 3200 },
    ];
  });
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    type: 'Income', 
    category: 'Sales', 
    desc: '', 
    amount: '' 
  });

  useEffect(() => {
    localStorage.setItem('farmerLedger', JSON.stringify(ledger));
  }, [ledger]);

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.desc) return;
    const newEntry = {
      id: Date.now(),
      date: formData.date,
      type: formData.type,
      category: formData.category,
      desc: formData.desc,
      amount: parseFloat(formData.amount)
    };
    setLedger([newEntry, ...ledger]);
    setShowModal(false);
    setFormData({ date: new Date().toISOString().split('T')[0], type: 'Income', category: 'Sales', desc: '', amount: '' });
  };

  const totalIncome = ledger.filter(l => l.type === 'Income').reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = ledger.filter(l => l.type === 'Expense').reduce((sum, item) => sum + item.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
          <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">Total Crop Income</p>
          <h3 className="text-3xl font-black text-emerald-800">₹{totalIncome.toLocaleString()}</h3>
        </div>
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
          <p className="text-red-700 text-xs font-bold uppercase tracking-wider mb-1">Input Expenses</p>
          <h3 className="text-3xl font-black text-red-800">₹{totalExpense.toLocaleString()}</h3>
        </div>
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
          <p className="text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">Net Seasonal Profit</p>
          <h3 className="text-3xl font-black text-blue-800">₹{netProfit.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Farm Revenue & Expense Records</h3>
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4"/> Add Ledger Entry
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {ledger.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-gray-500 font-mono">{item.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      item.type === 'Income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 font-semibold">{item.category}</td>
                  <td className="py-3 px-4 text-gray-800">{item.desc}</td>
                  <td className={`py-3 px-4 text-right font-black ${
                    item.type === 'Income' ? 'text-emerald-700' : 'text-red-600'
                  }`}>
                    {item.type === 'Income' ? '+' : '-'}₹{item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600">
                <X className="w-4 h-4"/>
              </button>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Add Farm Entry</h3>
              <form onSubmit={handleAddEntry} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Entry Type</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                  >
                    <option>Income</option>
                    <option>Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                  >
                    <option>Sales</option>
                    <option>Seeds</option>
                    <option>Fertilizer</option>
                    <option>Pesticide</option>
                    <option>Machinery Rental</option>
                    <option>Labor</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Description</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.desc} 
                    onChange={e => setFormData({...formData, desc: e.target.value})}
                    placeholder="e.g. Sold 20 qtl Paddy" 
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Amount (₹)</label>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    value={formData.amount} 
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    placeholder="e.g. 5000" 
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl mt-4">
                  Save Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('farmerAuth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to an initial guest farmer profile so the platform is immediately interactive
    return { role: 'guest', name: 'Demo Farmer (Kisan)', location: 'Ludhiana, Punjab', farm_size_acres: 8.5 };
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('farmerAuth', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('farmerAuth');
  };

  return <MainApp authUser={user} login={login} logout={logout} />;
}
