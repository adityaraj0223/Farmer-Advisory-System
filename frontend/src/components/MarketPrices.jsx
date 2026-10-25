import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, RefreshCw, MapPin, Calendar, Info, BarChart2, X, AlertCircle, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '../services/api';

export default function MarketPrices({ language = 'English', location = 'Ludhiana, Punjab' }) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCropHistory, setSelectedCropHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    loadPrices();
  }, [selectedCategory, selectedState]);

  const loadPrices = async () => {
    setLoading(true);
    setSyncStatus('');
    try {
      const cat = selectedCategory === 'All' ? '' : selectedCategory;
      const st = selectedState === 'All' ? '' : selectedState;
      const data = await api.market.getPrices(search, st, cat);
      setPrices(data);
    } catch (err) {
      console.error('Failed to load mandi prices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await api.market.sync();
      setSyncStatus(res.message);
      await loadPrices();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const viewHistory = async (crop) => {
    setSelectedCropHistory(crop);
    setHistoryLoading(true);
    try {
      const data = await api.market.getHistory(crop.commodity);
      setHistoryData(data.history || []);
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const filtered = prices.filter(p => 
    p.commodity.toLowerCase().includes(search.toLowerCase()) ||
    p.market.toLowerCase().includes(search.toLowerCase()) ||
    p.state.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ['All', 'Cereals', 'Pulses', 'Oilseeds', 'Vegetables', 'Cash Crops'];
  const states = ['All', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Uttar Pradesh', 'Gujarat', 'Bihar'];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-green-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-yellow-300" /> Verified Daily Mandi Integration
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Daily Mandi Market Prices</h2>
            <p className="text-emerald-100 mt-1 max-w-xl text-sm md:text-base">
              Accurate wholesale prices sourced from official AGMARKNET reporting mandis across major agricultural states.
            </p>
          </div>

          <button 
            onClick={handleSync}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-2.5 rounded-2xl backdrop-blur-md text-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Live Mandis
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" /> {syncStatus}
        </div>
      )}

      {/* Advisory Banner */}
      <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-800">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
        <div>
          <span className="font-bold">Mandi Price Disclaimer:</span> Mandi prices displayed are official reference modal rates reported from regulated APMC wholesale markets. Final prices received by farmers may vary based on crop moisture, grade assaying, and local transportation.
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commodity, mandi, or state..."
              className="bg-transparent border-none outline-none ml-2 text-sm w-full text-gray-800"
            />
          </div>

          {/* State Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-gray-400 uppercase">State:</span>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat 
                  ? 'bg-green-600 text-white shadow-xs' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mandi Prices Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Commodity & Variety</th>
                <th className="py-4 px-4">Market / Mandi</th>
                <th className="py-4 px-4">State & District</th>
                <th className="py-4 px-4">Modal Price</th>
                <th className="py-4 px-4">Min - Max Range</th>
                <th className="py-4 px-4">Reported Date</th>
                <th className="py-4 px-4 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-green-600" />
                    Loading verified mandi prices...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    No market price records found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{item.commodity}</div>
                      <div className="text-xs text-gray-400">{item.variety} • {item.category}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-800">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        {item.market}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-600">
                      {item.district}, {item.state}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-base text-emerald-700">₹{item.modal_price}</span>
                      <span className="text-xs text-gray-400 ml-1">/{item.unit.replace('₹/', '')}</span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-gray-600">
                      ₹{item.min_price} - ₹{item.max_price}
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {item.observation_date}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold">{item.source}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => viewHistory(item)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg"
                      >
                        <BarChart2 className="w-3.5 h-3.5" /> Trend
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Trend Modal */}
      <AnimatePresence>
        {selectedCropHistory && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedCropHistory(null)}
                className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
                  Historical Price Trend
                </span>
                <h3 className="text-2xl font-extrabold text-gray-800 mt-2">{selectedCropHistory.commodity}</h3>
                <p className="text-xs text-gray-500">{selectedCropHistory.market} ({selectedCropHistory.state}) • Unit: {selectedCropHistory.unit}</p>
              </div>

              <div className="h-64 w-full pt-4">
                {historyLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Loading trend...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 100', 'dataMax + 100']} />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Modal Rate']} />
                      <Line type="monotone" dataKey="price" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="mt-4 pt-3 border-t text-xs text-gray-500 flex justify-between">
                <span>Verified reporting source: AGMARKNET</span>
                <span>Current Modal: ₹{selectedCropHistory.modal_price}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
