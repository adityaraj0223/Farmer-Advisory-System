import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ExternalLink, ShieldCheck, CheckCircle2, ChevronRight, X, Phone, Calendar, AlertCircle, FileText } from 'lucide-react';
import { api } from '../services/api';

export default function GovtSchemes({ language = 'English', location = 'Ludhiana, Punjab' }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const data = await api.schemes.getAll();
      setSchemes(data);
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-green-800 via-emerald-800 to-teal-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
            <BookOpen className="w-3.5 h-3.5 text-yellow-300" /> Verified Central & State Portals
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Government Schemes Directory</h2>
          <p className="text-emerald-100 mt-1 max-w-2xl text-sm md:text-base">
            Verified agricultural support programmes including income assistance, crop insurance, credit cards, micro-irrigation subsidies, and e-trading portals with direct official application links.
          </p>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-gray-400">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading verified government schemes...
          </div>
        ) : (
          schemes.map((scheme) => (
            <motion.div
              key={scheme.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                    {scheme.category}
                  </span>
                  <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Official Portal
                  </span>
                </div>

                <h3 className="font-extrabold text-gray-900 text-lg mb-1 leading-snug">{scheme.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{scheme.department}</p>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">{scheme.benefit}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedScheme(scheme)}
                  className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-900"
                >
                  View Details & Steps <ChevronRight className="w-4 h-4" />
                </button>

                <a 
                  href={scheme.official_portal_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 rounded-xl transition-colors"
                  title="Open Official Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Scheme Detail Modal */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedScheme(null)}
                className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="border-b pb-4 pr-10">
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md uppercase">
                  {selectedScheme.category}
                </span>
                <h3 className="text-2xl font-black text-gray-900 mt-2">{selectedScheme.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{selectedScheme.department}</p>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-2 custom-scrollbar text-sm">
                {/* Benefits */}
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-950 mb-1 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Purpose & Financial Benefits
                  </h4>
                  <p className="text-emerald-900 text-xs leading-relaxed">{selectedScheme.benefit}</p>
                </div>

                {/* Eligibility & Exclusions */}
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-2">Eligibility Criteria</h4>
                  <p className="text-gray-600 text-xs leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    {selectedScheme.eligibility}
                  </p>
                  {selectedScheme.exclusions && (
                    <p className="text-xs text-red-600 mt-2 font-medium">
                      Exclusions: {selectedScheme.exclusions}
                    </p>
                  )}
                </div>

                {/* Required Documents */}
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-gray-500" /> Mandatory Documents Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedScheme.documents.map((doc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step How To Apply */}
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-2">Scheme-Specific How to Apply Steps</h4>
                  <ol className="space-y-2 text-xs text-gray-700">
                    {selectedScheme.how_to_apply_steps.map((step, i) => (
                      <li key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Safety Warning */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    Clicking "Apply on Official Portal" opens the authenticated government destination. <strong>Never</strong> provide your government portal passwords, Aadhaar OTPs, or bank PINs to third parties.
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
                <div className="text-xs text-gray-500">
                  {selectedScheme.helpline && (
                    <div className="flex items-center gap-1 font-semibold text-gray-700">
                      <Phone className="w-3.5 h-3.5 text-green-600" /> Helpline: {selectedScheme.helpline}
                    </div>
                  )}
                  <span className="text-[11px] text-gray-400">Verified: {selectedScheme.last_verified_date}</span>
                </div>

                <a
                  href={selectedScheme.official_portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-green-600/20 flex items-center justify-center gap-2 text-sm"
                >
                  Apply on Official Portal <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
