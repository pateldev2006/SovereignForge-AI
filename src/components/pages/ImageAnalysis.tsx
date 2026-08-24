import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Camera, Upload, Eye, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, RefreshCcw
} from 'lucide-react';

export const ImageAnalysis: React.FC = () => {
  const { createInvestigationFromImage, currentUser } = useApp();

  // Preset equipment image sample
  const samplePumpImage = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';

  const [currentImage, setCurrentImage] = useState<string>(samplePumpImage);
  const [imageName, setImageName] = useState<string>('pump_p204_discharge_valve.jpg');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(true); // Pre-analyzed for instant demo

  const detectedEquipment = 'Industrial Pump P204';
  const observedConditions = [
    'Minor surface oxidation & localized corrosion on flange bolts',
    'Possible hydraulic fluid leakage near secondary bleed valve V-04',
    'Vibration damping mount isolation degradation',
    'Expedited 24-hour mechanical inspection recommended'
  ];
  const riskLevel = 'Medium';
  const confidence = 82;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentImage(url);
      setImageName(file.name);
      setIsAnalyzing(true);
      setHasAnalyzed(false);

      setTimeout(() => {
        setIsAnalyzing(false);
        setHasAnalyzed(true);
      }, 1200);
    }
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 1000);
  };

  const handleCreateInvestigationClick = () => {
    createInvestigationFromImage(
      detectedEquipment,
      observedConditions[1],
      riskLevel as 'Medium',
      confidence
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 mb-1">
            <Camera className="w-4 h-4" /> Sovereign Vision Model v1.4
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Industrial Visual Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Computer vision anomaly detection on local high-resolution equipment imagery.
          </p>
        </div>

        <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md glow-cyan flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Custom Photo
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Main Grid: Image Viewer & Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left: Image Container with Simulated Bounding Box Overlay */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" /> Source Telemetry Frame
            </span>
            <span className="text-slate-500 truncate max-w-[200px]">{imageName}</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video group">
            <img 
              src={currentImage} 
              alt="Industrial Equipment" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Bounding Box Visual Overlay */}
            {hasAnalyzed && !isAnalyzing && (
              <div className="absolute top-1/4 left-1/3 w-1/3 h-1/2 border-2 border-dashed border-amber-400 rounded-xl bg-amber-500/10 p-2 animate-pulse">
                <span className="px-2 py-0.5 rounded bg-amber-500/80 text-slate-950 font-mono font-bold text-[9px] uppercase shadow">
                  ANOMALY #1: CORROSION / LEAK
                </span>
              </div>
            )}

            {/* Analyzing Spinner Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                <RefreshCcw className="w-8 h-8 text-cyan-400 animate-spin" />
                <span className="text-xs font-mono text-cyan-300 font-semibold">
                  Executing Vision Transformer v1.4 Inference...
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-xs pt-2">
            <span className="text-slate-400 font-mono">Resolution: 3840x2160 UHD</span>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Re-scan Image
            </button>
          </div>
        </div>

        {/* Right: Analysis Results Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="font-bold text-white text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Image Analysis Result
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
              CONFIDENCE {confidence}%
            </span>
          </div>

          {/* Detected Equipment & Risk Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                Detected Equipment
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {detectedEquipment}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block mb-1">
                Risk Classification
              </span>
              <span className="text-sm font-bold text-amber-300 font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> {riskLevel} Risk
              </span>
            </div>
          </div>

          {/* Observed Conditions Bullet List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
              Observed Conditions
            </h3>
            <div className="space-y-2">
              {observedConditions.map((cond, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{cond}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Create Investigation CTA Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={handleCreateInvestigationClick}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-lg glow-cyan flex items-center justify-center gap-2"
            >
              Create Investigation Workflow <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-slate-500 text-center font-mono mt-2">
              Generates multi-step agent workflow and creates Human Approval Card for Manager signoff.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
