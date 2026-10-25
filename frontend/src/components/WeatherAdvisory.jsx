import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Sun, Wind, Droplets, MapPin, AlertTriangle, CheckCircle2, RefreshCw, ThermometerSun, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function WeatherAdvisory({ language = 'English', location = 'Ludhiana, Punjab' }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = async () => {
    setLoading(true);
    try {
      const data = await api.weather.getWeather(location);
      setWeather(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const curr = weather?.current || {};
  const forecast = weather?.forecast_7days || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
              <MapPin className="w-3.5 h-3.5" /> {location}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Agricultural Weather Advisory</h2>
            <p className="text-blue-100 mt-1 max-w-xl text-sm md:text-base">
              Precision meteorological data mapped to crop physiological needs, spraying windows, and irrigation scheduling.
            </p>
          </div>

          <button 
            onClick={loadWeatherData}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 text-white backdrop-blur-md self-start md:self-auto transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <CloudRain className="absolute -right-8 -bottom-8 w-44 h-44 opacity-15" />
      </div>

      {/* Current Conditions Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase">Temperature</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{curr.temperature || 26}°C</h3>
            <span className="text-xs text-blue-600 font-semibold">{curr.status || 'Sunny'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <ThermometerSun className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase">Relative Humidity</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{curr.humidity || 55}%</h3>
            <span className="text-xs text-emerald-600 font-semibold">Optimal for Foliage</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase">Wind Speed</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{curr.wind_speed_kmh || 8.5} km/h</h3>
            <span className="text-xs text-gray-500 font-semibold">Gentle Breeze</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <Wind className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase">Rain Risk</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">
              {forecast[0]?.rain_probability || 5}%
            </h3>
            <span className="text-xs text-green-600 font-semibold">Dry Weather</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <CloudRain className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Agronomic Decision Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-3xl border ${
          weather?.spray_favorable ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className={`w-5 h-5 ${weather?.spray_favorable ? 'text-emerald-600' : 'text-amber-600'}`} />
            <h4 className="font-extrabold text-base text-gray-900">Spraying Window Status</h4>
          </div>
          <p className="text-xs leading-relaxed text-gray-700">
            {weather?.spray_favorable 
              ? 'Wind speed is below 15 km/h with low precipitation probability. Safe for foliar nutrient sprays and organic bio-fungicides.'
              : 'Postpone chemical spray applications due to higher wind velocity or imminent rain.'}
          </p>
        </div>

        <div className="bg-blue-50/80 border border-blue-200 p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <h4 className="font-extrabold text-base text-gray-900">Irrigation Recommendation</h4>
          </div>
          <p className="text-xs leading-relaxed text-gray-700">
            {weather?.irrigation_recommended
              ? 'Soil moisture depletion is steady. Light irrigation recommended for wheat in vegetative / CRI stage.'
              : 'Hold off irrigation as scattered rainfall is expected in the upcoming 48 hours.'}
          </p>
        </div>
      </div>

      {/* 7-Day Outlook */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h4 className="font-bold text-gray-900 text-lg">7-Day Regional Weather Outlook</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {forecast.map((day, idx) => (
            <div key={idx} className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 text-center space-y-1">
              <p className="text-[11px] font-bold text-gray-400">{day.date.split('-').slice(1).join('/') || `Day ${idx+1}`}</p>
              <div className="w-8 h-8 mx-auto flex items-center justify-center">
                {day.rain_probability > 30 ? <CloudRain className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
              </div>
              <p className="text-xs font-black text-gray-800">{Math.round(day.max_temp)}°C</p>
              <p className="text-[10px] text-gray-400">{Math.round(day.min_temp)}°C</p>
              <span className="text-[10px] font-semibold text-blue-600 block">{day.rain_probability}% rain</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
