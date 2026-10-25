import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, RotateCcw, Send, Sparkles, Bot, AlertCircle, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { api } from '../services/api';

const SUPPORTED_LANGUAGES = [
  { name: 'Hindi', code: 'hi-IN', native: 'हिन्दी' },
  { name: 'English', code: 'en-IN', native: 'English' },
  { name: 'Punjabi', code: 'pa-IN', native: 'ਪੰਜਾਬੀ' },
  { name: 'Marathi', code: 'mr-IN', native: 'मराठी' },
  { name: 'Gujarati', code: 'gu-IN', native: 'ગુજરાતી' },
  { name: 'Tamil', code: 'ta-IN', native: 'தமிழ்' },
  { name: 'Telugu', code: 'te-IN', native: 'తెలుగు' },
  { name: 'Bengali', code: 'bn-IN', native: 'বাংলা' },
  { name: 'Bhojpuri', code: 'bho-IN', native: 'भोजपुरी' }
];

export default function VoiceAssistant({ location = 'Ludhiana, Punjab', defaultLanguage = 'Hindi' }) {
  const [selectedLang, setSelectedLang] = useState(defaultLanguage);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [conversation, setConversation] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: selectedLang === 'Hindi' 
        ? 'नमस्ते किसान साथी! मैं आपका कृषिमित्र एआई वॉयस असिस्टेंट हूँ। आप बोलकर मंडी भाव, फसल रोग, मौसम या सरकारी योजनाओं के बारे में पूछ सकते हैं।'
        : 'Welcome! I am your AI Agronomy Voice Assistant. Tap the microphone and speak naturally to ask about mandi prices, weather, crop diseases, or government schemes.',
      tools: ['VoiceEngineReady']
    }
  ]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      
      const langObj = SUPPORTED_LANGUAGES.find(l => l.name === selectedLang) || SUPPORTED_LANGUAGES[0];
      recognition.lang = langObj.code;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event) => {
        console.warn('Speech Recognition notice:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access denied. Please grant browser microphone permission or use the text box below.');
        } else if (event.error !== 'no-speech') {
          setErrorMsg(`Voice input: ${event.error}. You can also type your query below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setErrorMsg('Voice recognition not natively supported in this browser. Please use the text input below.');
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [selectedLang]);

  // Handle Speech Synthesis
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    synthRef.current.cancel();

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const langObj = SUPPORTED_LANGUAGES.find(l => l.name === selectedLang);
    if (langObj) utterance.lang = langObj.code;
    utterance.rate = 0.95; // Farmer friendly cadence

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    synthRef.current.speak(utterance);
  };

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript.trim()) {
        handleProcessTurn(transcript);
      }
    } else {
      stopAudio();
      setTranscript('');
      setErrorMsg('');
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleProcessTurn = async (queryText) => {
    if (!queryText.trim()) return;
    const userQuery = queryText.trim();
    
    // Add user turn to conversation
    const userMsg = { id: Date.now(), sender: 'user', text: userQuery };
    setConversation(prev => [...prev, userMsg]);
    setTranscript('');
    setManualInput('');
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const res = await api.assistant.processVoice(userQuery, selectedLang, location);
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: res.spoken_response,
        tools: res.invoked_tools || []
      };
      setConversation(prev => [...prev, assistantMsg]);
      speakText(res.spoken_response);
    } catch (err) {
      console.error(err);
      const fallbackText = selectedLang === 'Hindi'
        ? 'क्षमा करें, इंटरनेट संपर्क धीमा होने के कारण आवाज संसाधित नहीं हो सकी। कृपया पुनः प्रयास करें।'
        : 'Network request timed out. Please check your connection or try again.';
      setConversation(prev => [...prev, { id: Date.now() + 1, sender: 'assistant', text: fallbackText }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Multilingual AI Voice Engine
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Kisan Sahayak Voice Assistant</h2>
            <p className="text-emerald-100 mt-1 max-w-xl text-sm md:text-base">
              Speak naturally in your native language. Our AI detects intent and answers via real Mandi records, crop pathology models, and live weather.
            </p>
          </div>

          {/* Language Selector Dropdown */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-col gap-1 min-w-[200px]">
            <label className="text-xs font-semibold text-emerald-200 uppercase">Spoken Language</label>
            <select 
              value={selectedLang} 
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-emerald-900/60 border border-emerald-400/40 text-white font-bold text-sm rounded-xl p-2 outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.name} value={lang.name} className="bg-gray-800 text-white">
                  {lang.name} ({lang.native})
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Main Interactive Voice Visualizer & Mic Section */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Animated wave rings when listening */}
        <div className="relative flex items-center justify-center mb-6">
          {isListening && (
            <>
              <motion.div 
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-32 h-32 rounded-full bg-green-400/30"
              />
              <motion.div 
                animate={{ scale: [1, 2.4, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="absolute w-32 h-32 rounded-full bg-emerald-500/20"
              />
            </>
          )}

          <button
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-95 z-10 ${
              isListening 
                ? 'bg-red-500 text-white shadow-red-500/40 animate-pulse' 
                : 'bg-gradient-to-tr from-green-600 to-emerald-500 text-white shadow-green-500/40 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-1">
          {isListening ? 'Listening to your speech...' : isProcessing ? 'AI Analyzing Query & Invoking Tools...' : 'Tap the Microphone to Speak'}
        </h3>
        <p className="text-gray-500 text-sm max-w-md">
          {isListening ? 'Speak your farming query. Tap again when finished.' : `Configured for ${selectedLang}. Tap above or type below.`}
        </p>

        {/* Live Transcript Bubble */}
        <AnimatePresence>
          {transcript && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }} 
              className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-2xl text-base font-semibold max-w-xl"
            >
              "{transcript}"
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio control pill */}
        {isPlayingAudio && (
          <div className="mt-4 flex items-center gap-3 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce">
            <Volume2 className="w-4 h-4 text-green-400" /> Speaking Answer in {selectedLang}...
            <button onClick={stopAudio} className="bg-red-500 px-2 py-0.5 rounded text-[10px] hover:bg-red-600">Stop</button>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-xs max-w-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {[
            { hi: 'आज गेहूं का मंडी भाव क्या है?', en: 'What is the wheat mandi price today?' },
            { hi: 'टमाटर के पत्ते पीले क्यों पड़ रहे हैं?', en: 'Why are tomato leaves turning yellow?' },
            { hi: 'क्या आज कीटनाशक का छिड़काव करना सुरक्षित है?', en: 'Is it safe to spray pesticides today?' },
            { hi: 'पीएम किसान योजना में कैसे आवेदन करें?', en: 'How to apply for PM-KISAN scheme?' }
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleProcessTurn(selectedLang === 'Hindi' ? prompt.hi : prompt.en)}
              className="bg-gray-50 hover:bg-green-50 hover:text-green-700 text-gray-600 text-xs font-medium px-3.5 py-1.5 rounded-full border border-gray-200 transition-colors"
            >
              {selectedLang === 'Hindi' ? prompt.hi : prompt.en}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation History Feed */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Bot className="w-5 h-5 text-green-600" /> Voice Conversation History
          </h3>
          <span className="text-xs bg-green-50 text-green-700 font-bold px-2.5 py-1 rounded-lg">
            Active Region: {location}
          </span>
        </div>

        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
          {conversation.map(msg => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-green-600 text-white rounded-br-none shadow-sm' 
                  : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-bl-none'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                
                {/* Tools invoked badge */}
                {msg.tools && msg.tools.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200/60 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                      <Layers className="w-3 h-3"/> Backend Tools:
                    </span>
                    {msg.tools.map((tool, idx) => (
                      <span key={idx} className="bg-white border border-gray-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'assistant' && (
                <div className="flex gap-2 mt-1.5 ml-2">
                  <button 
                    onClick={() => speakText(msg.text)} 
                    className="text-gray-400 hover:text-green-600 text-xs flex items-center gap-1 font-semibold"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Replay Voice
                  </button>
                </div>
              )}
            </motion.div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 text-gray-400 text-xs p-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              Agronomy RAG Engine synthesizing evidence-based answer...
            </div>
          )}
        </div>

        {/* Text Input Fallback Bar */}
        <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
          <input 
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleProcessTurn(manualInput)}
            placeholder={`Or type your question here in ${selectedLang}...`}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
          />
          <button
            onClick={() => handleProcessTurn(manualInput)}
            disabled={!manualInput.trim() || isProcessing}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-200 text-white p-3 rounded-2xl transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
