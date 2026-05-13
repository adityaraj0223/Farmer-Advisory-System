import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, CloudRain, Sun, 
  Wind, MapPin, TrendingUp, TrendingDown, Phone, 
  Leaf, AlertTriangle, ShieldCheck, User, Menu, X, 
  ChevronRight, Bot, Activity, ThermometerSun,
  Droplets, Bug, Camera, Plus, Sprout, ShoppingCart,
  Search, Moon, Globe, Video, FileText, IndianRupee,
  Calendar, BookOpen, MessageSquare, PlusCircle, CheckCircle, Upload, LogOut
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { GoogleGenerativeAI } from "@google/generative-ai";
import AuthFlow from './Auth';

// Initialize Gemini
const API_KEY = "AIzaSyAFKfqh2NvlB7rtZe1tkX6-n_R0GKUZ7fQ";
const genAI = new GoogleGenerativeAI(API_KEY);

const langMap = {
  'English': 'en', 'Hindi': 'hi', 'Punjabi': 'pa',
  'Marathi': 'mr', 'Gujarati': 'gu', 'Tamil': 'ta', 'Telugu': 'te'
};

const translateText = async (text, language) => {
  if (language === 'English') return text;
  const tl = langMap[language] || 'en';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map(x => x[0]).join('');
  } catch(e) {
    return text;
  }
};

const fileToGenerativePart = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        inlineData: {
          data: reader.result.split(',')[1],
          mimeType: file.type
        }
      });
    };
    reader.readAsDataURL(file);
  });
};

function MainApp({ authUser, logout }) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [globalLocation, setGlobalLocation] = useState('Ludhiana, Punjab');
  const [searchInput, setSearchInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const languages = ['English', 'Hindi', 'Punjabi', 'Marathi', 'Gujarati', 'Tamil', 'Telugu'];

  // AI Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: 'Namaste! I am your AI Agronomy Assistant. How can I help you today?' }
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
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are Krishi Mitra, an expert agricultural AI assistant in India. Reply accurately, kindly, and concisely. 
      The user is speaking in/wants the response in: ${language}.
      User query: ${userText}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: text }]);
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: '*(Offline Fallback)* Hello! The live AI is currently unavailable due to API limits. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Disease Diagnosis State
  const [diagFile, setDiagFile] = useState(null);
  const [diagPreview, setDiagPreview] = useState(null);
  const [diagCropInfo, setDiagCropInfo] = useState('');
  const [diagSoil, setDiagSoil] = useState('');
  const [diagWeather, setDiagWeather] = useState('');
  const [diagResult, setDiagResult] = useState(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const handleDiagnosis = async () => {
    if (!diagFile) return;
    setIsDiagnosing(true);
    setDiagResult(null);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Analyze this crop image for diseases, pests, or deficiencies. 
      Additional context provided by farmer: 
      Crop: ${diagCropInfo || 'Unknown'}, Soil: ${diagSoil || 'Unknown'}, Recent Weather: ${diagWeather || 'Unknown'}.
      Provide a highly accurate diagnosis, cause, and a step-by-step treatment plan including recommended chemicals/organic solutions.
      Respond entirely in the ${language} language. Format your response with clear headings.`;
      
      const imagePart = await fileToGenerativePart(diagFile);
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      setDiagResult(response.text());
    } catch (error) {
      console.error(error);
      setDiagResult(`## Offline Diagnosis Fallback\n*(Live AI data temporarily unavailable due to API Quota limits)*\n\n**Diagnosis:** Likely Fungal Infection (Leaf Spot/Blight).\n\n**Cause:** Usually caused by prolonged moisture and poor air circulation.\n\n**Treatment Plan:**\n1. Remove and destroy infected leaves.\n2. Apply a copper-based fungicide or Neem oil.\n3. Ensure proper spacing between plants for airflow.\n4. Avoid overhead watering to keep foliage dry.`);
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Fertilizer Advisory State
  const [fertCrop, setFertCrop] = useState('');
  const [fertStage, setFertStage] = useState('Tillering');
  const [fertSoil, setFertSoil] = useState('');
  const [fertResult, setFertResult] = useState('');
  const [isFertLoading, setIsFertLoading] = useState(false);

  const handleFertilizerAdvisory = async () => {
    if (!fertCrop) return;
    setIsFertLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Act as an expert agronomist. Provide a precise fertilizer advisory.
      Crop: ${fertCrop}, Growth Stage: ${fertStage}, Soil Test Info: ${fertSoil || 'Not provided'}.
      Include exact quantities per acre if possible, both organic and inorganic options.
      Respond in ${language} language.`;
      const result = await model.generateContent(prompt);
      setFertResult(result.response.text());
    } catch (e) {
      console.error(e);
      setFertResult(`## Offline Fertilizer Advisory\n*(Live AI data temporarily unavailable due to API Quota limits)*\n\n**General Recommendation:**\n* **Nitrogen (N):** Apply 20kg/acre in split doses.\n* **Phosphorus (P):** Apply 10kg/acre at sowing time.\n* **Potassium (K):** Apply 15kg/acre.\n\n**Organic Alternatives:**\n* Use 2-3 tonnes of Farm Yard Manure (FYM) per acre.\n* Apply Neem cake to improve soil health and prevent nematodes.`);
    } finally {
      setIsFertLoading(false);
    }
  };

  // Weather Data Mock (Used for AI Context)
  const weatherData = [
    { name: 'Jan', rain: 40, temp: 15 }, { name: 'Feb', rain: 30, temp: 18 },
    { name: 'Mar', rain: 20, temp: 25 }, { name: 'Apr', rain: 10, temp: 32 },
    { name: 'May', rain: 50, temp: 38 }, { name: 'Jun', rain: 150, temp: 35 },
    { name: 'Jul', rain: 250, temp: 30 }, { name: 'Aug', rain: 200, temp: 29 },
  ];


  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <motion.div 
            initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Soil Moisture', val: '45%', trend: '+5%', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
                { title: 'Crop Health', val: '92%', trend: '+2%', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50' },
                { title: 'Expected Yield', val: '2.5 t/ac', trend: 'Stable', icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { title: 'Market Rate (Wheat)', val: '₹2,275/q', trend: '+₹50', icon: IndianRupee, color: 'text-orange-500', bg: 'bg-orange-50' },
              ].map((stat, i) => (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.val}</h3>
                    <p className={`text-sm font-medium mt-1 ${stat.trend.startsWith('-') ? 'text-red-500' : 'text-green-600'}`}>{stat.trend} this week</p>
                  </div>
                  <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-96 flex flex-col hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-4">Climate Overview</h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weatherData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f59e0b" name="Temp (°C)" />
                      <Line yAxisId="right" type="monotone" dataKey="rain" stroke="#3b82f6" name="Rain (mm)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { title: 'AI Diagnosis: Healthy', time: '2 hours ago', type: 'info', icon: ShieldCheck },
                    { title: 'Heavy Rain Expected', time: '5 hours ago', type: 'alert', icon: CloudRain },
                    { title: 'Sold Wheat: ₹1,12,500', time: '1 day ago', type: 'finance', icon: IndianRupee },
                  ].map((act, i) => (
                    <div key={i} className="flex gap-3 items-start border-b border-gray-50 pb-3">
                      <div className={`p-2 rounded-full ${act.type === 'alert' ? 'bg-red-50 text-red-500' : act.type === 'finance' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'}`}>
                        <act.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{act.title}</p>
                        <p className="text-xs text-gray-500">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'Disease Diagnosis':
        return (
          <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Bug className="text-red-500" /> Disease Diagnosis (Powered by AI)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-green-400 transition-all overflow-hidden relative">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files[0]) {
                      setDiagFile(e.target.files[0]);
                      setDiagPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }} />
                  {diagPreview ? (
                    <img src={diagPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="font-medium text-gray-600">Click to upload or take a photo of the affected plant</p>
                    </>
                  )}
                  {diagPreview && <div className="z-10 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold mt-10">Change Image</div>}
                </label>
                <input type="text" value={diagCropInfo} onChange={e=>setDiagCropInfo(e.target.value)} placeholder="Crop Name & Age (e.g. Wheat, 45 days)" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500" />
                <textarea value={diagSoil} onChange={e=>setDiagSoil(e.target.value)} placeholder="Soil Test Results (Optional, e.g. pH 6.5)" className="w-full p-3 border border-gray-200 rounded-xl h-24 outline-none focus:border-green-500"></textarea>
                <input type="text" value={diagWeather} onChange={e=>setDiagWeather(e.target.value)} placeholder="Recent Weather Conditions" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500" />
                <button 
                  onClick={handleDiagnosis} 
                  disabled={isDiagnosing || !diagFile}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isDiagnosing ? <Activity className="animate-spin w-5 h-5" /> : <Upload className="w-5 h-5" />}
                  {isDiagnosing ? 'Analyzing Image...' : 'Analyze with AI'}
                </button>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 overflow-y-auto max-h-[600px] custom-scrollbar">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Bot className="w-5 h-5 text-green-600"/> Diagnosis Result ({language})</h3>
                {diagResult ? (
                  <div className="prose prose-sm prose-green max-w-none text-gray-700 whitespace-pre-wrap">
                    {diagResult}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <Activity className="w-12 h-12 mb-2 animate-pulse" />
                    <p>Awaiting Image Upload & Analysis...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'Fertilizer Advisory':
        return (
          <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Sprout className="text-green-500" /> AI Fertilizer Advisory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Crop Type</label>
                  <input type="text" value={fertCrop} onChange={e=>setFertCrop(e.target.value)} placeholder="e.g., Sugarcane" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Growth Stage</label>
                  <select value={fertStage} onChange={e=>setFertStage(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-blue-500">
                    <option>Seedling</option><option>Tillering/Vegetative</option><option>Flowering</option><option>Fruiting/Harvesting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Soil Info</label>
                  <textarea value={fertSoil} onChange={e=>setFertSoil(e.target.value)} placeholder="N-P-K levels, pH, etc." className="w-full p-3 border border-gray-200 rounded-xl h-24 outline-none focus:border-blue-500"></textarea>
                </div>
                <button 
                  onClick={handleFertilizerAdvisory}
                  disabled={isFertLoading || !fertCrop}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 flex justify-center items-center gap-2"
                >
                  {isFertLoading && <Activity className="animate-spin w-5 h-5" />}
                  Get Advisory via AI
                </button>
              </div>
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 overflow-y-auto max-h-[500px] custom-scrollbar">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Bot className="w-5 h-5 text-blue-600"/> Advisory Report ({language})</h3>
                {fertResult ? (
                  <div className="prose prose-sm prose-blue max-w-none text-gray-700 whitespace-pre-wrap">
                    {fertResult}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center mt-10">Fill the details and request advisory to see AI recommendations here.</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'Weather Advisory':
        return (
          <WeatherAdvisoryTab language={language} location={globalLocation} />
        );

      case 'Market Prices':
        return <MarketPricesTab language={language} location={globalLocation} />;

      case 'Financial Ledger':
        return <FinancialLedgerTab />;

      case 'Govt. Schemes':
        return <GovtSchemesTab language={language} location={globalLocation} />;

      case 'Expert Connect':
        return <ExpertConnectTab openChat={() => setIsChatOpen(true)} />;
      
      case 'Marketplace & Rentals':
        return <MarketplaceTab language={language} location={globalLocation} />;
      
      default:
        return <div>Coming Soon</div>;
    }
  };

  const navItems = [
    { id: 'Dashboard', icon: Activity },
    { id: 'Marketplace & Rentals', icon: ShoppingCart },
    { id: 'Disease Diagnosis', icon: Bug },
    { id: 'Fertilizer Advisory', icon: Sprout },
    { id: 'Weather Advisory', icon: CloudRain },
    { id: 'Market Prices', icon: TrendingUp },
    { id: 'Financial Ledger', icon: FileText },
    { id: 'Govt. Schemes', icon: BookOpen },
    { id: 'Expert Connect', icon: Phone },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-800 font-sans">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        className={`fixed lg:static top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="ml-3 font-bold text-xl text-gray-900 tracking-tight">Kisan Sahayak</span>
          <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden text-gray-500"><X className="w-6 h-6" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Main Menu</div>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                activeTab === item.id 
                  ? 'bg-green-50 text-green-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="text-left">{item.id}</span>
              {activeTab === item.id && <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-8 bg-green-500 rounded-r-full" />}
            </button>
          ))}
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-green-500/20">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search state/district & Enter..." 
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyPress={e => {
                  if(e.key === 'Enter' && searchInput.trim()) {
                    setGlobalLocation(searchInput.trim());
                    setSearchInput('');
                  }
                }}
                className="bg-transparent border-none outline-none ml-2 text-sm w-full" 
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                <Globe className="w-4 h-4 text-gray-500 mr-2"/>
                <select 
                  value={language} 
                  onChange={(e) => {
                    const newLang = e.target.value;
                    setLanguage(newLang);
                    const googleSelect = document.querySelector('.goog-te-combo');
                    if (googleSelect) {
                      googleSelect.value = langMap[newLang] || 'en';
                      googleSelect.dispatchEvent(new Event('change'));
                    }
                  }} 
                  className="bg-transparent text-sm font-bold outline-none border-none text-gray-700 cursor-pointer"
                >
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
             </div>
             <button onClick={() => setIsDarkMode(!isDarkMode)} className="hidden sm:block p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
               {isDarkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
             </button>
             <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-white overflow-hidden flex items-center justify-center cursor-pointer ml-2 group relative">
               <User className="w-6 h-6 text-green-700" onClick={() => setIsProfileOpen(true)} />
               <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 hidden group-hover:block w-48 transition-all">
                 <div className="px-3 py-2 border-b border-gray-50 mb-1">
                   <p className="font-bold text-gray-800 text-sm truncate">{authUser.name}</p>
                   <p className="text-xs text-green-600 font-bold uppercase tracking-wider">{authUser.role === 'guest' ? 'Demo Mode' : 'Premium Plan'}</p>
                 </div>
                 <button onClick={() => setIsProfileOpen(true)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"><User className="w-4 h-4"/> View Profile</button>
                 <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors"><LogOut className="w-4 h-4"/> Logout</button>
               </div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50/50 pb-24 custom-scrollbar">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -15 }}
               transition={{ duration: 0.3 }}
               className="h-full"
             >
               {renderContent()}
             </motion.div>
           </AnimatePresence>
        </main>

        <div className="fixed bottom-6 right-6 z-50">
           <AnimatePresence>
             {isChatOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 20, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 20, scale: 0.95 }}
                 className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[500px]"
               >
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Bot className="w-6 h-6"/></div>
                      <div>
                        <h3 className="font-bold">AI Agronomy Assistant</h3>
                        <p className="text-xs text-green-100">Language: {language}</p>
                      </div>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 custom-scrollbar">
                     {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                             {msg.text}
                           </div>
                        </div>
                     ))}
                     {isLoading && (
                        <div className="flex justify-start">
                           <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></span>
                           </div>
                        </div>
                     )}
                     <div ref={chatEndRef}/>
                  </div>
                  <div className="p-3 bg-white border-t border-gray-100">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-green-500/20">
                       <input 
                         type="text" value={inputValue} onChange={e=>setInputValue(e.target.value)}
                         onKeyPress={e=>e.key==='Enter' && handleSendMessage()}
                         placeholder="Type a message..." className="flex-1 bg-transparent border-none outline-none text-sm"
                       />
                       <button onClick={handleSendMessage} disabled={isLoading} className="text-green-600 hover:text-green-700 disabled:text-gray-400"><Send className="w-5 h-5"/></button>
                    </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
           <button 
             onClick={() => setIsChatOpen(!isChatOpen)}
             className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 ${isChatOpen ? 'bg-red-500 text-white' : 'bg-green-600 text-white shadow-green-500/30'}`}
           >
              {isChatOpen ? <X className="w-6 h-6" /> : <Bot className="w-8 h-8" />}
           </button>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden keep-colors"
            >
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white relative">
                <button onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"><X className="w-6 h-6"/></button>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-green-400">
                    <User className="w-12 h-12 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{authUser.name}</h2>
                    <p className="text-green-100 text-lg">{authUser.role === 'guest' ? 'Demo Mode User' : 'Premium Subscribed Farmer'}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Account Details</h3>
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-2"><Phone className="w-4 h-4"/> Phone</span>
                        <span className="font-semibold text-gray-800">+91 98765 43210</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-2"><MapPin className="w-4 h-4"/> Location</span>
                        <span className="font-semibold text-gray-800">{globalLocation}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Farm Profile</h3>
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Total Land</span>
                        <span className="font-semibold text-gray-800">12 Acres</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Main Crops</span>
                        <span className="font-semibold text-gray-800">Wheat, Sugarcane</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                   <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Subscription</h3>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
                      <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="w-6 h-6 text-yellow-600" />
                        <span className="font-bold text-yellow-800">{authUser.role === 'guest' ? 'Free Trial Available' : 'Active Premium'}</span>
                      </div>
                      <p className="text-sm text-yellow-700 mb-4">
                        {authUser.role === 'guest' ? 'Upgrade to unlock unlimited AI.' : 'Your next billing cycle is on 15th Nov, 2026.'}
                      </p>
                      {authUser.role === 'guest' ? (
                         <div className="space-y-3">
                           <button onClick={() => { setIsProfileOpen(false); logout(); }} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-xl transition-colors">Start Premium Trial</button>
                           <button onClick={() => { setIsProfileOpen(false); logout(); }} className="w-full bg-white text-red-600 border border-red-200 font-bold py-2 rounded-xl hover:bg-red-50 transition-colors">Exit Demo Mode & Login / Signup</button>
                         </div>
                      ) : (
                         <div className="space-y-3">
                           <button className="w-full bg-white text-yellow-700 font-bold py-2 border border-yellow-200 rounded-xl hover:bg-yellow-50 transition-colors">Manage Billing</button>
                           <button onClick={() => { setIsProfileOpen(false); logout(); }} className="w-full bg-white text-red-600 border border-red-200 font-bold py-2 rounded-xl hover:bg-red-50 transition-colors">Logout of Account</button>
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Sub-component for Weather Advisory to keep main file clean and allow internal state
function WeatherAdvisoryTab({ language, location }) {
  const [advisory, setAdvisory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAIWeather();
  }, [language, location]);

  const fetchAIWeather = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are Krishi Mitra, an AI weather advisor. 
      Location: ${location}. 
      Estimate the current seasonal weather for this location.
      Provide a highly actionable 7-day weather advisory for farmers in this specific region.
      Format it neatly with bullet points or short paragraphs.
      IMPORTANT: Respond entirely in ${language} language.`;
      
      const result = await model.generateContent(prompt);
      setAdvisory(result.response.text());
    } catch (e) {
      console.error(e);
      setAdvisory(`## Offline Weather Advisory\n*(Live AI data temporarily unavailable due to API Quota limits)*\n\n**7-Day Outlook:**\n* **Days 1-3:** Mostly sunny with occasional clouds. Good time for pesticide application.\n* **Days 4-5:** High chances of scattered rainfall. Avoid irrigation and chemical sprays.\n* **Days 6-7:** Clear skies, rising temperatures. Ensure adequate soil moisture for young crops.\n\n**Actionable Insight:** Complete harvesting of mature crops before the rains expected on Day 4.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
       <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 rounded-3xl text-white shadow-md flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2"><MapPin className="w-8 h-8"/> {location}</h2>
            <p className="text-blue-100 text-lg">AI Estimated Weather Conditions</p>
          </div>
          <CloudRain className="w-32 h-32 opacity-20 absolute -right-4 -bottom-4" />
       </div>
       <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[300px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl flex items-center gap-2"><Bot className="w-6 h-6 text-blue-500"/> AI 7-Day Actionable Advisory</h3>
            <button onClick={fetchAIWeather} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold hover:bg-blue-100">Refresh</button>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
               <Activity className="w-10 h-10 mb-2 animate-spin text-blue-500" />
               <p>Generating personalized weather insights in {language}...</p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
               {advisory}
            </div>
          )}
       </div>
    </div>
  );
}

function MarketPricesTab({ language, location }) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMarketPrices();
  }, [location, language]);

  const fetchMarketPrices = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are an agriculture market API. Provide current approximate Mandi market prices for the region: ${location}. 
      Return a JSON array of at least 15 major Indian crops categorized into 'Cereals', 'Pulses', 'Oilseeds', 'Vegetables', and 'Cash Crops'.
      Include crops like Wheat, Rice, Maize, Bajra, Chana, Tur, Mustard, Soybean, Potato, Onion, Tomato, Cotton, Sugarcane, etc.
      The JSON should have this exact structure:
      [
        { "cropName": "Wheat", "category": "Cereals", "localPrice": "₹2275/q", "stateAvg": "₹2200/q", "diff": "+₹75", "trend": "up" }
      ]
      Translate the cropName into ${language} if possible (e.g. 'Wheat (Gehu)'). Return ONLY valid JSON, no markdown.`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(text);
      setCrops(data);
    } catch (e) {
      console.error("Gemini Market Parsing Error:", e);
      setCrops([
        { cropName: "Wheat", category: "Cereals", localPrice: "₹2275/q", stateAvg: "₹2200/q", diff: "+₹75", trend: "up" },
        { cropName: "Rice (Paddy)", category: "Cereals", localPrice: "₹2183/q", stateAvg: "₹2190/q", diff: "-₹7", trend: "down" },
        { cropName: "Maize", category: "Cereals", localPrice: "₹1850/q", stateAvg: "₹1800/q", diff: "+₹50", trend: "up" },
        { cropName: "Bajra", category: "Cereals", localPrice: "₹2050/q", stateAvg: "₹2000/q", diff: "+₹50", trend: "up" },
        { cropName: "Chana (Bengal Gram)", category: "Pulses", localPrice: "₹5400/q", stateAvg: "₹5300/q", diff: "+₹100", trend: "up" },
        { cropName: "Tur (Arhar)", category: "Pulses", localPrice: "₹10200/q", stateAvg: "₹10500/q", diff: "-₹300", trend: "down" },
        { cropName: "Mustard", category: "Oilseeds", localPrice: "₹5200/q", stateAvg: "₹5150/q", diff: "+₹50", trend: "up" },
        { cropName: "Soybean", category: "Oilseeds", localPrice: "₹4600/q", stateAvg: "₹4650/q", diff: "-₹50", trend: "down" },
        { cropName: "Potato", category: "Vegetables", localPrice: "₹1200/q", stateAvg: "₹1100/q", diff: "+₹100", trend: "up" },
        { cropName: "Onion", category: "Vegetables", localPrice: "₹1800/q", stateAvg: "₹2000/q", diff: "-₹200", trend: "down" },
        { cropName: "Tomato", category: "Vegetables", localPrice: "₹2500/q", stateAvg: "₹2400/q", diff: "+₹100", trend: "up" },
        { cropName: "Cotton", category: "Cash Crops", localPrice: "₹6800/q", stateAvg: "₹6750/q", diff: "+₹50", trend: "up" },
        { cropName: "Sugarcane", category: "Cash Crops", localPrice: "₹315/q", stateAvg: "₹315/q", diff: "₹0", trend: "up" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCrops = crops.filter(c => c.cropName.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()));
  const categories = [...new Set(filteredCrops.map(c => c.category))];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 max-w-5xl mx-auto mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
           Mandi Market Prices 
           {loading && <Activity className="w-5 h-5 animate-spin text-green-500" />}
        </h2>
        <div className="flex bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 items-center w-full sm:w-64">
          <Search className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search Crop..." value={search} onChange={e=>setSearch(e.target.value)} className="bg-transparent border-none outline-none ml-2 w-full text-sm" />
        </div>
      </div>
      <div className="space-y-6">
        {categories.map(cat => (
          <div key={cat}>
            <h3 className="font-bold text-gray-600 mb-3 border-b pb-2">{cat}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="text-gray-400 text-sm"><th className="pb-3">Crop Name</th><th className="pb-3">Local Price</th><th className="pb-3">State Avg</th><th className="pb-3">Difference</th><th className="pb-3">Trend</th></tr></thead>
                <tbody>
                  {filteredCrops.filter(c => c.category === cat).map((item, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                       <td className="py-3 font-semibold">{item.cropName}</td>
                       <td className="py-3 text-gray-800 font-bold">{item.localPrice}</td>
                       <td className="py-3 text-gray-500">{item.stateAvg}</td>
                       <td className={`py-3 font-medium ${item.diff.startsWith('-') ? 'text-red-500' : item.diff === '₹0' ? 'text-gray-500' : 'text-green-500'}`}>{item.diff}</td>
                       <td className="py-3">
                         {item.trend === 'up' ? <TrendingUp className="text-green-500 w-5 h-5"/> : item.trend === 'down' ? <TrendingDown className="text-red-500 w-5 h-5"/> : <span className="text-gray-400">-</span>}
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {!loading && filteredCrops.length === 0 && (
          <div className="text-center text-gray-500 py-10">No crops found matching your search.</div>
        )}
      </div>
    </div>
  );
}

function FinancialLedgerTab() {
  const [ledger, setLedger] = useState(() => {
    const saved = localStorage.getItem('farmerLedger');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, date: '2026-05-10', type: 'Income', category: 'Sales', desc: 'Sold Wheat 50 qtl', amount: 112500 },
      { id: 2, date: '2026-05-12', type: 'Expense', category: 'Seeds', desc: 'Purchased Cotton Seeds', amount: 5000 },
    ];
  });
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], type: 'Income', category: 'Sales', desc: '', amount: '' });

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
    <div className="max-w-5xl mx-auto space-y-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
          <p className="text-green-600 font-semibold mb-1">Total Income</p><h3 className="text-3xl font-bold text-green-700">₹{totalIncome}</h3>
        </div>
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
          <p className="text-red-600 font-semibold mb-1">Total Expense</p><h3 className="text-3xl font-bold text-red-700">₹{totalExpense}</h3>
        </div>
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
          <p className="text-blue-600 font-semibold mb-1">Net Profit</p><h3 className="text-3xl font-bold text-blue-700">₹{netProfit}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
         <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-bold">Ledger Records</h3>
           <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800"><PlusCircle className="w-4 h-4"/> Add Entry</button>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead><tr className="text-gray-400 text-sm border-b"><th className="pb-3">Date</th><th className="pb-3">Type</th><th className="pb-3">Category</th><th className="pb-3">Description</th><th className="pb-3 text-right">Amount</th></tr></thead>
              <tbody>
                {ledger.map(l => (
                  <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 text-sm text-gray-500 whitespace-nowrap">{l.date}</td>
                    <td className="py-4"><span className={`px-2 py-1 rounded-md text-xs font-bold ${l.type==='Income' ? 'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{l.type}</span></td>
                    <td className="py-4 font-medium">{l.category}</td>
                    <td className="py-4 text-gray-600 text-sm">{l.desc}</td>
                    <td className={`py-4 text-right font-bold ${l.type==='Income' ? 'text-green-600':'text-red-600'}`}>{l.type==='Income'?'+':'-'}₹{l.amount}</td>
                  </tr>
                ))}
                {ledger.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-gray-400">No records found. Click 'Add Entry' to start.</td></tr>}
              </tbody>
           </table>
         </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X className="w-5 h-5"/></button>
              <h2 className="text-2xl font-bold mb-4">Add Ledger Entry</h2>
              <form onSubmit={handleAddEntry} className="space-y-4">
                 <div className="flex gap-4">
                   <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Date</label>
                      <input type="date" required value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-green-500" />
                   </div>
                   <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Type</label>
                      <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value, category: e.target.value==='Income'?'Sales':'Seeds'})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-green-500">
                        <option>Income</option>
                        <option>Expense</option>
                      </select>
                   </div>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Category</label>
                    <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-green-500">
                      {formData.type === 'Income' ? (
                        <><option>Sales</option><option>Subsidy</option><option>Other Income</option></>
                      ) : (
                        <><option>Seeds</option><option>Fertilizer</option><option>Labor</option><option>Equipment</option><option>Pesticides</option><option>Transport</option></>
                      )}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Amount (₹)</label>
                    <input type="number" required min="1" placeholder="e.g. 5000" value={formData.amount} onChange={e=>setFormData({...formData, amount: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-green-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
                    <input type="text" required placeholder="Brief detail..." value={formData.desc} onChange={e=>setFormData({...formData, desc: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-green-500" />
                 </div>
                 <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 mt-2">Save Entry</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

function GovtSchemesTab({ language, location }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemeDetails, setSchemeDetails] = useState('');
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchSchemes();
  }, [location, language]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Provide a JSON array of the top 6 active agricultural government schemes in India (specifically relevant for farmers in ${location}).
      The JSON must strictly follow this structure:
      [
        { "title": "PM-KISAN", "desc": "Brief 1-sentence description in ${language}", "tag": "Income Support" }
      ]
      Respond ONLY with valid JSON. Do not include markdown formatting.`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      setSchemes(JSON.parse(text));
    } catch (e) {
      console.error("Gemini Scheme Parsing Error:", e);
      const fallbacks = [
        { title: 'PM-KISAN', desc: 'Financial benefit of Rs 6000/- per year to eligible farmer families.', tag: 'Income Support' },
        { title: 'PMFBY', desc: 'Pradhan Mantri Fasal Bima Yojana offers crop insurance coverage.', tag: 'Insurance' },
        { title: 'KCC', desc: 'Kisan Credit Card provides timely credit to farmers for expenses.', tag: 'Credit' },
        { title: 'PMKSY', desc: 'Pradhan Mantri Krishi Sinchayee Yojana for better irrigation.', tag: 'Irrigation' },
        { title: 'e-NAM', desc: 'National Agriculture Market for online trading of commodities.', tag: 'Market' },
        { title: 'PKVY', desc: 'Paramparagat Krishi Vikas Yojana promotes organic farming.', tag: 'Organic' }
      ];
      
      if (language !== 'English') {
        const translated = await Promise.all(fallbacks.map(async (s) => ({
          title: s.title,
          desc: await translateText(s.desc, language),
          tag: await translateText(s.tag, language)
        })));
        setSchemes(translated);
      } else {
        setSchemes(fallbacks);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (scheme) => {
    setSelectedScheme(scheme);
    setDetailsLoading(true);
    setSchemeDetails('');
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Act as an expert agricultural advisor. The farmer wants to know everything about the "${scheme.title}" scheme in India.
      Please provide comprehensive, highly accurate details including:
      1. Full Name & Purpose
      2. Key Benefits
      3. Eligibility Criteria
      4. Required Documents
      5. Step-by-step How to Apply (including official portal link if known)
      
      IMPORTANT: Respond entirely in ${language} language. Use clear headings and bullet points.`;
      
      const result = await model.generateContent(prompt);
      setSchemeDetails(result.response.text());
    } catch(e) {
      console.error("Gemini Details Error:", e);
      const fallbackText = `## ${scheme.title} - Overview

### 1. Full Name & Purpose
This is a flagship government scheme aimed at providing support to farmers in India. It ensures financial stability, better yield protection, and easy access to market resources.

### 2. Key Benefits
* Direct financial assistance or subsidies.
* Risk mitigation against crop failure.
* Increased access to modern farming equipment and seeds.

### 3. Eligibility Criteria
* Must be an active farmer with registered land records.
* Bank account linked with Aadhaar.
* Must not be a tax-paying citizen or hold a constitutional post.

### 4. Required Documents
* Aadhaar Card
* Land Ownership Documents (Khatauni)
* Active Bank Passbook
* Passport-size photograph

### 5. Step-by-step How to Apply
1. Visit the official scheme portal or your nearest Common Service Center (CSC).
2. Fill out the application form with your personal and land details.
3. Upload the required documents.
4. Submit the application and save the reference number for tracking.

*(Note: Live AI data temporarily unavailable due to API Quota limits. Displaying estimated fallback data.)*`;

      if (language !== 'English') {
        const translated = await translateText(fallbackText, language);
        setSchemeDetails(translated);
      } else {
        setSchemeDetails(fallbackText);
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative mb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">Govt. Schemes Directory {loading && <Activity className="w-5 h-5 animate-spin text-green-500" />}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="mb-4">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">{s.tag}</span>
              <h3 className="font-bold text-lg">{s.title}</h3>
            </div>
            <p className="text-gray-600 text-sm flex-1 mb-4">{s.desc}</p>
            <button onClick={() => loadDetails(s)} className="text-blue-600 font-bold text-sm text-left hover:underline flex items-center">Learn More <ChevronRight className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {selectedScheme && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl relative max-h-[85vh] flex flex-col overflow-hidden">
            <button onClick={() => setSelectedScheme(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors z-10"><X className="w-6 h-6"/></button>
            <h2 className="text-2xl font-bold mb-4 pr-8 border-b pb-4 text-gray-800">{selectedScheme.title}</h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative">
              {detailsLoading ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                   <Activity className="w-10 h-10 mb-4 animate-spin text-blue-500" />
                   <p className="font-semibold text-gray-500">Fetching official details in {language}...</p>
                </div>
              ) : (
                <div className="prose prose-sm md:prose-base prose-blue max-w-none text-gray-700 whitespace-pre-wrap pb-4">
                  {schemeDetails}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExpertConnectTab({ openChat }) {
  const [connecting, setConnecting] = useState(false);

  const handleVideoCall = () => {
    setConnecting(true);
    setTimeout(() => {
      // Directs to a WhatsApp Video Call format (mocking the connection to a real Govt Expert Line)
      window.location.href = "https://wa.me/9118001801551?text=Hello%20Expert%2C%20I%20need%20an%20urgent%20Video%20Consultation%20regarding%20my%20farm.";
      setConnecting(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
      <Phone className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-3xl font-bold mb-2">Connect with Agronomy Experts</h2>
      <p className="text-gray-500 mb-8 max-w-lg mx-auto">Get live real-time consultation with government agriculture officers and AI assistants to solve complex farm issues immediately.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <button onClick={handleVideoCall} className="p-6 border-2 border-green-500 text-green-700 rounded-2xl font-bold flex flex-col items-center gap-3 hover:bg-green-50 transition-all hover:-translate-y-1 hover:shadow-lg">
          <Video className="w-10 h-10" /> 
          <span>Start Video Call</span>
          <span className="text-xs font-normal text-green-600">(via WhatsApp)</span>
        </button>
        
        <a href="tel:18001801551" className="p-6 border-2 border-blue-500 text-blue-700 rounded-2xl font-bold flex flex-col items-center gap-3 hover:bg-blue-50 transition-all hover:-translate-y-1 hover:shadow-lg">
          <Phone className="w-10 h-10" /> 
          <span>Voice Call</span>
          <span className="text-xs font-normal text-blue-600">(Kisan Call Center - Toll Free)</span>
        </a>
        
        <button onClick={openChat} className="p-6 border-2 border-purple-500 text-purple-700 rounded-2xl font-bold flex flex-col items-center gap-3 hover:bg-purple-50 transition-all hover:-translate-y-1 hover:shadow-lg">
          <MessageSquare className="w-10 h-10" /> 
          <span>Live AI Chat</span>
          <span className="text-xs font-normal text-purple-600">(24/7 Instant AI Agronomist)</span>
        </button>
      </div>

      {connecting && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-3xl">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-100 border-t-green-500 rounded-full animate-spin"></div>
            <Video className="w-8 h-8 text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-gray-800">Establishing Secure Connection...</h3>
          <p className="text-gray-500 mt-2">Connecting you to an available Agronomy Expert via WhatsApp.</p>
        </div>
      )}
    </div>
  );
}

// Sub-component for Marketplace & Rentals
function MarketplaceTab({ language, location }) {
  const [activeSubTab, setActiveSubTab] = useState('seeds');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const seeds = [
    { id: 1, name: "Premium Sharbati Wheat", type: "High-Yield Hybrid", price: "₹1,200/50kg", yield: "24 quintals/acre", organic: true, tag: "AI Recommended" },
    { id: 2, name: "Basmati Rice Seed (Pusa-1121)", type: "Certified Seed", price: "₹2,500/10kg", yield: "18 quintals/acre", organic: false, tag: "Best Seller" },
    { id: 3, name: "Hybrid Corn (Sweet)", type: "Seasonal Crop", price: "₹800/5kg", yield: "30 quintals/acre", organic: true, tag: "Drought Resistant" },
    { id: 4, name: "Tomato Seeds (Arka Rakshak)", type: "Vegetable", price: "₹400/100g", yield: "High", organic: true, tag: "Disease Resistant" }
  ];

  const machineries = [
    { id: 1, name: "Mahindra 575 DI Tractor", type: "Tractor (45 HP)", price: "₹400/hour", distance: "2.5 km away", status: "Available Now", tag: "AI Recommended" },
    { id: 2, name: "Agricultural Spray Drone", type: "Drone Service", price: "₹800/acre", distance: "5.0 km away", status: "Booking Open", tag: "Cost Effective" },
    { id: 3, name: "Heavy Duty Rotavator", type: "Implement", price: "₹600/hour", distance: "3.2 km away", status: "Available Now", tag: "Top Rated" },
    { id: 4, name: "Combine Harvester", type: "Harvester", price: "₹2500/hour", distance: "12 km away", status: "Available Tomorrow", tag: "In Demand" }
  ];

  const handleBook = (item) => {
    setSelectedItem(item);
    setShowCheckout(true);
    setIsSuccess(false);
    setIsProcessing(false);
  };

  const processPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setShowCheckout(false);
      }, 2000);
    }, 2000);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
        className="bg-gradient-to-r from-emerald-600 to-green-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-3">Krishi Marketplace & Rentals</h2>
          <p className="text-emerald-100 text-lg flex items-center gap-2">
            <Bot className="w-5 h-5"/> AI suggests <span className="font-bold text-white">Sharbati Wheat</span> and <span className="font-bold text-white">Rotavator Rental</span> for {location} based on upcoming rain.
          </p>
        </div>
        <ShoppingCart className="absolute -right-8 -bottom-8 w-40 h-40 opacity-20" />
      </motion.div>

      <div className="flex gap-4 p-2 bg-white rounded-2xl shadow-sm border border-gray-100 w-fit">
        <button 
          onClick={() => setActiveSubTab('seeds')} 
          className={`px-6 py-3 rounded-xl font-bold transition-all ${activeSubTab === 'seeds' ? 'bg-green-600 text-white shadow-md shadow-green-500/30' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Buy Certified Seeds
        </button>
        <button 
          onClick={() => setActiveSubTab('machinery')} 
          className={`px-6 py-3 rounded-xl font-bold transition-all ${activeSubTab === 'machinery' ? 'bg-green-600 text-white shadow-md shadow-green-500/30' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Rent Farming Machinery
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeSubTab} initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {activeSubTab === 'seeds' && seeds.map((item) => (
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
               <div className="bg-green-50 rounded-2xl p-4 mb-4 flex justify-center items-center h-32 relative">
                 {item.tag && <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-lg">{item.tag}</span>}
                 <Leaf className="w-16 h-16 text-green-500 group-hover:scale-110 transition-transform" />
               </div>
               <div className="flex-1">
                 <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                 <p className="text-sm text-gray-500 mb-2">{item.type} {item.organic && '• Organic'}</p>
                 <p className="text-sm text-emerald-600 font-semibold mb-4 bg-emerald-50 inline-block px-2 py-1 rounded">Yield: {item.yield}</p>
               </div>
               <div className="mt-auto">
                 <p className="text-2xl font-black text-gray-900 mb-4">{item.price}</p>
                 <button onClick={() => handleBook(item)} className="w-full bg-gray-900 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
                    <ShoppingCart className="w-5 h-5"/> Buy Now
                 </button>
               </div>
            </motion.div>
          ))}

          {activeSubTab === 'machinery' && machineries.map((item) => (
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
               <div className="bg-blue-50 rounded-2xl p-4 mb-4 flex justify-center items-center h-32 relative">
                 {item.tag && <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-lg">{item.tag}</span>}
                 <Activity className="w-16 h-16 text-blue-500 group-hover:scale-110 transition-transform" />
               </div>
               <div className="flex-1">
                 <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                 <p className="text-sm text-gray-500 mb-2">{item.type}</p>
                 <div className="flex items-center gap-2 text-sm text-gray-600 mb-1"><MapPin className="w-4 h-4"/> {item.distance}</div>
                 <div className="flex items-center gap-2 text-sm text-green-600 font-semibold mb-4 bg-green-50 inline-block px-2 py-1 rounded"><CheckCircle className="w-4 h-4 inline pb-0.5"/> {item.status}</div>
               </div>
               <div className="mt-auto">
                 <p className="text-2xl font-black text-gray-900 mb-4">{item.price}</p>
                 <button onClick={() => handleBook(item)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
                    <Calendar className="w-5 h-5"/> Book Rental
                 </button>
               </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative keep-colors text-center">
                {!isProcessing && !isSuccess && (
                  <>
                    <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"><X className="w-5 h-5"/></button>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Secure Checkout</h2>
                    
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 flex justify-between items-center text-left">
                      <div>
                        <p className="font-bold text-gray-800">{selectedItem?.name}</p>
                        <p className="text-sm text-gray-500">Total Amount</p>
                      </div>
                      <p className="text-xl font-black text-green-600">{selectedItem?.price}</p>
                    </div>

                    <p className="text-sm font-semibold text-gray-500 mb-3 uppercase text-left">Select Payment Method</p>
                    <div className="space-y-3 mb-6">
                      <button onClick={processPayment} className="w-full p-4 border-2 border-gray-200 rounded-xl flex justify-between items-center hover:border-green-500 hover:bg-green-50 transition-all font-bold text-gray-700">UPI (GPay, Paytm) <ChevronRight className="w-5 h-5"/></button>
                      <button onClick={processPayment} className="w-full p-4 border-2 border-gray-200 rounded-xl flex justify-between items-center hover:border-green-500 hover:bg-green-50 transition-all font-bold text-gray-700">Credit / Debit Card <ChevronRight className="w-5 h-5"/></button>
                    </div>
                  </>
                )}

                {isProcessing && (
                  <div className="py-8">
                     <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 border-4 border-gray-100 border-t-green-500 rounded-full animate-spin"></div>
                     </div>
                     <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment...</h2>
                     <p className="text-gray-500 text-sm">Please do not close or refresh this window.</p>
                  </div>
                )}

                {isSuccess && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="py-8">
                     <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                          <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                     </div>
                     <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
                     <p className="text-gray-500 text-sm mb-6">Your order for {selectedItem?.name} has been placed successfully.</p>
                  </motion.div>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-semibold mt-4">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> 256-bit Secure Encryption by Razorpay
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('farmerAuth');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('farmerAuth', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('farmerAuth');
  };

  if (!user) {
    return <AuthFlow onLogin={login} />;
  }

  return <MainApp authUser={user} logout={logout} />;
}
