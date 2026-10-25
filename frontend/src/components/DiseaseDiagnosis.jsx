import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Camera, Upload, ShieldCheck, AlertTriangle, Sprout, CheckCircle2, ChevronRight, Activity, Leaf, Info } from 'lucide-react';
import { api } from '../services/api';

export default function DiseaseDiagnosis({ language = 'English' }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cropName, setCropName] = useState('Tomato');
  const [affectedPart, setAffectedPart] = useState('Leaf');
  const [symptoms, setSymptoms] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const crops = ['Tomato', 'Potato', 'Wheat', 'Rice / Paddy', 'Corn', 'Cotton', 'General Crop'];
  const plantParts = ['Leaf', 'Stem', 'Fruit / Ear', 'Root', 'Entire Canopy'];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file (JPEG, PNG, WebP).');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setErrorMsg('');
      setResult(null);
    }
  };

  const handleDiagnose = async () => {
    if (!file) {
      setErrorMsg('Please upload or take a photograph of the affected plant.');
      return;
    }
    setIsDiagnosing(true);
    setErrorMsg('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('crop_name', cropName);
    formData.append('affected_part', affectedPart);
    formData.append('symptoms', symptoms);
    formData.append('language', language);

    try {
      const data = await api.disease.predict(formData);
      setResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Image processing failed. Please check image clarity and try again.');
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-green-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
            <Bug className="w-3.5 h-3.5 text-yellow-300" /> PyTorch Computer Vision Model
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">AI Crop Disease & Pest Diagnosis</h2>
          <p className="text-emerald-100 mt-1 max-w-2xl text-sm md:text-base">
            Upload a plant leaf or fruit photo to run real-time inference via MobileNet-V3. Receive evidence-based organic & chemical treatment plans verified by ICAR research.
          </p>
        </div>
        <Leaf className="absolute -right-6 -bottom-6 w-36 h-36 opacity-15" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Upload & Crop Metadata Form */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <Camera className="w-5 h-5 text-green-600" /> Capture / Upload Photograph
            </h3>

            {/* Drag & Drop Upload Zone */}
            <label className="border-2 border-dashed border-gray-300 hover:border-green-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-gray-50/50 hover:bg-green-50/30 overflow-hidden relative min-h-[220px]">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {preview ? (
                <div className="relative w-full h-48 flex items-center justify-center">
                  <img src={preview} alt="Plant Sample" className="w-full h-full object-cover rounded-xl shadow-xs" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs rounded-xl flex items-center justify-center text-white font-bold text-sm opacity-0 hover:opacity-100 transition-opacity">
                    Change Photo
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="font-bold text-gray-700 text-sm">Click to upload or take a photo</p>
                  <p className="text-gray-400 text-xs">Supports JPG, PNG (Max 10MB)</p>
                </div>
              )}
            </label>

            {/* Crop Species Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Crop Species</label>
              <select 
                value={cropName} 
                onChange={(e) => setCropName(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm"
              >
                {crops.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Affected Plant Part */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Affected Plant Part</label>
              <select 
                value={affectedPart} 
                onChange={(e) => setAffectedPart(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm"
              >
                {plantParts.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Symptoms Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Observed Symptoms (Optional)</label>
              <input 
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Yellow rings, brown spots, leaf curling"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
              </div>
            )}

            <button
              onClick={handleDiagnose}
              disabled={isDiagnosing || !file}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isDiagnosing ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" /> Running ML Inference...
                </>
              ) : (
                <>
                  <Bug className="w-5 h-5" /> Diagnose with Computer Vision
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Real Prediction Results */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
            <h3 className="font-bold text-gray-800 text-xl border-b pb-4 mb-6 flex items-center justify-between">
              <span>Diagnosis Report</span>
              {result && (
                <span className="text-xs bg-gray-100 text-gray-600 font-mono px-2.5 py-1 rounded-md">
                  {result.model_version}
                </span>
              )}
            </h3>

            {isDiagnosing ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="font-bold text-gray-700 text-base">Processing Image with MobileNet-V3...</p>
                <p className="text-gray-400 text-xs">Performing class feature extraction & confidence calibration</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Condition Banner */}
                <div className={`p-6 rounded-2xl border ${
                  result.is_healthy 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md inline-block mb-2 ${
                        result.is_healthy ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
                      }`}>
                        {result.is_healthy ? 'Healthy Foliage' : 'Disease Detected'}
                      </span>
                      <h4 className="text-2xl font-black">{result.predicted_disease}</h4>
                      <p className="text-xs mt-1 opacity-80">Crop: {result.crop_name} • Part: {result.affected_part}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-500 uppercase block">Model Confidence</span>
                      <span className="text-3xl font-black text-gray-900">{result.confidence_percentage}</span>
                    </div>
                  </div>

                  {/* Confidence Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${result.is_healthy ? 'bg-emerald-600' : 'bg-red-500'}`}
                      style={{ width: result.confidence_percentage }}
                    />
                  </div>
                </div>

                {/* Alternative Diagnoses */}
                {result.alternative_diagnoses && result.alternative_diagnoses.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Alternative Possibilities Evaluated</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {result.alternative_diagnoses.map((alt, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-xl border border-gray-200 text-xs">
                          <p className="font-semibold text-gray-800 truncate">{alt.disease}</p>
                          <p className="text-gray-400 font-mono mt-0.5">{alt.confidence_percentage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Treatment Tabs */}
                <div className="space-y-4">
                  {/* Organic Treatment */}
                  <div className="bg-green-50/70 p-5 rounded-2xl border border-green-200 space-y-2">
                    <h5 className="font-bold text-green-900 text-sm flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-green-600" /> Organic & Biological Treatment Plan
                    </h5>
                    <ul className="space-y-1.5 text-xs text-green-800">
                      {result.organic_treatment.map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Chemical Treatment & Precautions */}
                  {!result.is_healthy && (
                    <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 space-y-2">
                      <h5 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600" /> Evidence-Based Chemical Action Plan
                      </h5>
                      <ul className="space-y-1.5 text-xs text-blue-800">
                        {result.chemical_treatment.map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prevention & Scientific Citation */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-800">Source Authority:</span> {result.source_reference}
                    </div>
                    {result.favorable_conditions && (
                      <div className="text-gray-500 text-[11px]">
                        Conditions: {result.favorable_conditions}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16 space-y-3 text-gray-400">
                <Leaf className="w-16 h-16 text-gray-200 animate-pulse" />
                <h4 className="font-bold text-gray-600 text-base">Awaiting Leaf Photograph</h4>
                <p className="text-xs max-w-sm text-gray-400">
                  Select a photo of your crop foliage on the left and click "Diagnose with Computer Vision" to inspect pathological symptoms.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
