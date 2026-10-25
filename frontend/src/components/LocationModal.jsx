import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Navigation, Search, CheckCircle2, X, RefreshCw, 
  Sparkles, Sprout, TrendingUp, Compass, AlertCircle
} from 'lucide-react';
import { 
  INDIAN_AGRI_DISTRICTS, 
  detectAutoLocation, 
  detectGpsLocation,
  saveFarmerLocation 
} from '../services/locationService';

export default function LocationModal({ 
  isOpen, 
  onClose, 
  currentLocation, 
  locationSource = 'manual',
  onLocationSelect 
}) {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectStatus, setDetectStatus] = useState('');
  const [previewDistrict, setPreviewDistrict] = useState(null);

  if (!isOpen) return null;

  const states = ['All', 'Punjab', 'Maharashtra', 'Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Haryana', 'Gujarat', 'Rajasthan', 'Karnataka'];

  const filteredDistricts = INDIAN_AGRI_DISTRICTS.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(search.toLowerCase()) || 
      d.state.toLowerCase().includes(search.toLowerCase()) ||
      d.primaryCrop.toLowerCase().includes(search.toLowerCase());
    const matchesState = selectedState === 'All' || d.state === selectedState;
    return matchesSearch && matchesState;
  });

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    setDetectStatus('Detecting live GPS coordinates and local district...');
    try {
      const result = await detectAutoLocation();
      if (result && result.location) {
        saveFarmerLocation(result.location, result.source);
        onLocationSelect(result.location, result.source);
        setDetectStatus(`✓ Successfully detected: ${result.location} (${result.source.toUpperCase()})`);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setDetectStatus('Could not detect location automatically. Please choose your district below.');
      }
    } catch (e) {
      console.error(e);
      setDetectStatus('Location detection timed out. Please pick your district manually.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSelect = (dist) => {
    const locStr = `${dist.name}, ${dist.state}`;
    saveFarmerLocation(locStr, 'manual');
    onLocationSelect(locStr, 'manual');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 15 }} 
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border-2 border-emerald-100 overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 p-5 sm:p-6 text-white relative flex-shrink-0">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200">
              Krishi Location & Mandi Registry
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            Select Your Agricultural Region
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-lg">
            Sets your local Mandi wholesale prices, ICAR crop disease telemetry, and 7-day spraying weather advisory.
          </p>

          {/* Current Active Location Pill */}
          <div className="mt-3.5 inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/25 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>Active Region: <strong className="text-amber-200">{currentLocation}</strong></span>
            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
              locationSource === 'gps' ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400/30 text-amber-100'
            }`}>
              {locationSource === 'gps' ? 'Live GPS' : locationSource === 'ip' ? 'Network' : 'Manual'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {/* 1-Click Auto-Detect Button */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-amber-50/40 p-4 rounded-2xl border-2 border-emerald-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-emerald-700" /> Automatic Live Location
                </p>
                <p className="text-gray-600 text-xs mt-0.5">
                  Detects your exact Indian district using your mobile or computer GPS/Network.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoDetect}
                disabled={isDetecting}
                className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:bg-gray-400 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
                {isDetecting ? 'Detecting GPS...' : 'Detect My Live Location'}
              </button>
            </div>

            {detectStatus && (
              <p className={`text-xs font-bold mt-2.5 ${detectStatus.startsWith('✓') ? 'text-emerald-700' : 'text-amber-700'}`}>
                {detectStatus}
              </p>
            )}
          </div>

          {/* Manual Search Input */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wide">
              Or Search Any District in India
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Type district (e.g. Pune, Patna, Nashik, Varanasi, Karnal, Indore)..."
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* State Filter Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Filter by State</span>
            <div className="flex flex-wrap gap-1.5">
              {states.map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedState(st)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    selectedState === st 
                      ? 'bg-emerald-700 text-white shadow-xs' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* District Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
              <span>Matching Districts ({filteredDistricts.length})</span>
              <span>Click to select</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1 custom-scrollbar">
              {filteredDistricts.map(dist => {
                const isSelected = currentLocation.toLowerCase().includes(dist.name.toLowerCase());
                return (
                  <div
                    key={`${dist.state}-${dist.name}`}
                    onClick={() => handleSelect(dist)}
                    onMouseEnter={() => setPreviewDistrict(dist)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs' 
                        : 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-black text-gray-900 group-hover:text-emerald-950 flex items-center gap-1.5">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-gray-400 group-hover:text-emerald-600'}`} />
                        {dist.name}, <span className="font-semibold text-gray-500 text-[11px]">{dist.state}</span>
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                        <Sprout className="w-3 h-3 text-emerald-600" /> {dist.primaryCrop}
                      </p>
                    </div>

                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-emerald-700">Select</span>
                    )}
                  </div>
                );
              })}

              {filteredDistricts.length === 0 && (
                <div className="col-span-2 py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-500">No matching preset district found for "{search}".</p>
                  <button
                    onClick={() => {
                      if (search.trim()) {
                        const custom = `${search.trim()}, India`;
                        saveFarmerLocation(custom, 'manual');
                        onLocationSelect(custom, 'manual');
                        onClose();
                      }
                    }}
                    className="mt-2 text-xs font-black text-emerald-700 underline"
                  >
                    Use "{search}" as custom location anyway
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs flex-shrink-0">
          <span className="text-gray-500">
            Current: <strong>{currentLocation}</strong>
          </span>
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
