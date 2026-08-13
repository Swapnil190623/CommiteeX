import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Palette,
  Type,
  Eye,
  Image as ImageIcon,
  Sliders,
  Download,
  Grid,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  FileText
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { CertificateCanvas } from './CertificateCanvas';
import { useCertificateStore } from '../../stores/certificateStore';

const PRESETS = [
  { id: 'memphis', name: 'Memphis Geometric', category: 'Creative' },
  { id: 'corporate', name: 'Corporate Navy & Gold', category: 'Professional' },
  { id: 'cyberpunk', name: 'Cyberpunk Hackathon', category: 'Tech' },
  { id: 'academic', name: 'Classic Academic', category: 'Traditional' },
  { id: 'swiss', name: 'Modern Swiss', category: 'Minimalist' },
  { id: 'ai_innovation', name: 'AI Innovation Award', category: 'Tech' },
  { id: 'modern_waves', name: 'Modern Abstract Waves', category: 'Creative' },
  { id: 'digital_hackathon', name: 'Digital Tech Hackathon', category: 'Tech' },
  { id: 'classic_achievement', name: 'Honorable Achievement', category: 'Traditional' },
  { id: 'sports_participation', name: 'Sports Participation Badge', category: 'Creative' }
];

export const TemplateEditor = () => {
  const { activeTemplate: template, setActiveTemplate: onUpdateTemplate, currentData, setCurrentData: onUpdateData, setPreset: onSelectPreset } = useCertificateStore();
  const [activeTab, setActiveTab] = useState('text');
  const [zoomScale, setZoomScale] = useState(0.72);
  const [showGrid, setShowGrid] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const canvasContainerRef = useRef(null);

  // Prevent page scroll when zooming on canvas
  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        setZoomScale((z) => Math.max(0.2, z - 0.05));
      } else {
        setZoomScale((z) => Math.min(2.0, z + 0.05));
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const fontOptions = [
    { label: 'Outfit (Modern Sans)', value: 'Outfit' },
    { label: 'Playfair Display (Serif)', value: 'Playfair Display' },
    { label: 'Cinzel (Royal Gold Serif)', value: 'Cinzel' },
    { label: 'Space Grotesk (Tech Monospace)', value: 'Space Grotesk' },
    { label: 'Montserrat (Bold Display)', value: 'Montserrat' },
  ];

  const insertVariable = (fieldKey, tag) => {
    const currentVal = template[fieldKey] || '';
    onUpdateTemplate({ [fieldKey]: currentVal + ` ${tag}` });
  };

  const handleColorChange = (key, value) => {
    onUpdateTemplate({ colors: { ...template.colors, [key]: value } });
  };

  const handleVisibilityToggle = (key) => {
    onUpdateTemplate({ visibility: { ...template.visibility, [key]: !template.visibility[key] } });
  };

  const handleImageUpload = (assetKey, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdateTemplate({ assets: { ...template.assets, [assetKey]: event.target.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = async (format) => {
    const canvasNode = document.getElementById('editor-certificate-canvas');
    if (!canvasNode) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(canvasNode, { pixelRatio: 2, cacheBust: true });
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `${currentData.studentName || 'certificate'}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'pdf') {
        const pdf = new jsPDF({ orientation: 'landscape', format: 'a4' });
        pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210);
        pdf.save(`${currentData.studentName || 'certificate'}.pdf`);
      }
    } catch {
      alert('Failed to export certificate. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const dynamicVariablesList = [
    '{{student_name}}', '{{roll_number}}', '{{department}}', '{{event_name}}',
    '{{achievement_title}}', '{{certificate_number}}', '{{issue_date}}',
    '{{faculty_mentor}}', '{{coordinator_name}}'
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full min-h-[calc(100vh-160px)] animate-fade-in">
      {/* LEFT SIDEBAR: Visual Template Editor Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-96 bg-[#111114] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col h-full shrink-0"
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Template Studio
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Customize layout, colors & typography</p>
          </div>
          <span className="text-[10px] font-mono bg-indigo-600/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
            VISUAL EDITOR
          </span>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Switch Template Preset
          </label>
          <select
            value={template.preset}
            onChange={(e) => onSelectPreset(e.target.value)}
            className="w-full bg-[#0A0A0B] border border-white/10 text-slate-200 text-xs rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none transition"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category})
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-5 gap-1 bg-[#0A0A0B] p-1 rounded-xl mb-5 text-xs font-medium border border-white/10">
          <button onClick={() => setActiveTab('text')} className={`py-2 rounded-lg transition-all flex flex-col items-center gap-1 ${activeTab === 'text' ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}`}>
            <Type className="w-4 h-4" />
            <span className="text-[10px]">Text</span>
          </button>
          <button onClick={() => setActiveTab('style')} className={`py-2 rounded-lg transition-all flex flex-col items-center gap-1 ${activeTab === 'style' ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}`}>
            <Palette className="w-4 h-4" />
            <span className="text-[10px]">Style</span>
          </button>
          <button onClick={() => setActiveTab('visibility')} className={`py-2 rounded-lg transition-all flex flex-col items-center gap-1 ${activeTab === 'visibility' ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}`}>
            <Eye className="w-4 h-4" />
            <span className="text-[10px]">Layers</span>
          </button>
          <button onClick={() => setActiveTab('assets')} className={`py-2 rounded-lg transition-all flex flex-col items-center gap-1 ${activeTab === 'assets' ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}`}>
            <ImageIcon className="w-4 h-4" />
            <span className="text-[10px]">Logos</span>
          </button>
          <button onClick={() => setActiveTab('testdata')} className={`py-2 rounded-lg transition-all flex flex-col items-center gap-1 ${activeTab === 'testdata' ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}`}>
            <FileText className="w-4 h-4" />
            <span className="text-[10px]">Preview</span>
          </button>
        </div>

        {/* TAB 1: TEXT & TEMPLATE PHRASES */}
        {activeTab === 'text' && (
          <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2 scrollbar-thin">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Main Header Title</label>
              <input
                type="text"
                value={template.headerText || ''}
                onChange={(e) => onUpdateTemplate({ headerText: e.target.value })}
                className="w-full bg-[#0A0A0B] border border-white/10 text-slate-200 text-xs rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subheader Tagline</label>
              <input
                type="text"
                value={template.subHeaderText || ''}
                onChange={(e) => onUpdateTemplate({ subHeaderText: e.target.value })}
                className="w-full bg-[#0A0A0B] border border-white/10 text-slate-200 text-xs rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Body Description Phrase</label>
              <textarea
                rows={3}
                value={template.bodyText || ''}
                onChange={(e) => onUpdateTemplate({ bodyText: e.target.value })}
                className="w-full bg-[#0A0A0B] border border-white/10 text-slate-200 text-xs rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none leading-relaxed resize-none"
              />
              <p className="text-[10px] font-mono text-slate-500 mt-1.5 mb-1.5 uppercase tracking-wider">Insert Dynamic Variables:</p>
              <div className="flex flex-wrap gap-1">
                {dynamicVariablesList.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => insertVariable('bodyText', tag)}
                    className="text-[10px] font-mono bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30 transition"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Achievement Title / Rank</label>
              <input
                type="text"
                value={template.achievementLine || ''}
                onChange={(e) => onUpdateTemplate({ achievementLine: e.target.value })}
                className="w-full bg-[#0A0A0B] border border-white/10 text-slate-200 text-xs rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Footer / Issuer</label>
              <input
                type="text"
                value={template.footerText || ''}
                onChange={(e) => onUpdateTemplate({ footerText: e.target.value })}
                className="w-full bg-[#0A0A0B] border border-white/10 text-slate-200 text-xs rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 2: STYLING & FONTS */}
        {activeTab === 'style' && (
          <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2 scrollbar-thin">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Certificate Palette</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0A0A0B] p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Primary</span>
                  <input type="color" value={template.colors.primary} onChange={(e) => handleColorChange('primary', e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" />
                </div>
                <div className="bg-[#0A0A0B] p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Secondary</span>
                  <input type="color" value={template.colors.secondary} onChange={(e) => handleColorChange('secondary', e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" />
                </div>
                <div className="bg-[#0A0A0B] p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Background</span>
                  <input type="color" value={template.colors.background} onChange={(e) => handleColorChange('background', e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" />
                </div>
                <div className="bg-[#0A0A0B] p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Text Primary</span>
                  <input type="color" value={template.colors.text} onChange={(e) => handleColorChange('text', e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Header Title Font</label>
              <select
                value={template.fonts.heading}
                onChange={(e) => onUpdateTemplate({ fonts: { ...template.fonts, heading: e.target.value } })}
                className="w-full bg-[#0A0A0B] border border-white/10 text-slate-200 text-xs rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
              >
                {fontOptions.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Body Font</label>
              <select
                value={template.fonts.body}
                onChange={(e) => onUpdateTemplate({ fonts: { ...template.fonts, body: e.target.value } })}
                className="w-full bg-[#0A0A0B] border border-white/10 text-slate-200 text-xs rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
              >
                {fontOptions.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* TAB 3: VISIBILITY LAYERS */}
        {activeTab === 'visibility' && (
          <div className="space-y-2 overflow-y-auto max-h-[480px] pr-2 scrollbar-thin">
            <p className="text-xs text-slate-400 mb-2">Toggle element visibility on canvas:</p>
            {Object.entries(template.visibility).map(([key, val]) => (
              <div
                key={key}
                onClick={() => handleVisibilityToggle(key)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0A0B] border border-white/10 hover:border-white/20 cursor-pointer transition"
              >
                <span className="text-xs text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <div className={`w-5 h-5 rounded flex items-center justify-center transition ${val ? 'bg-indigo-600 text-white font-bold' : 'bg-white/5 text-slate-500'}`}>
                  {val && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: LOGOS & ASSETS */}
        {activeTab === 'assets' && (
          <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2 scrollbar-thin">
            <p className="text-xs text-slate-400">Upload custom PNG/SVG graphics:</p>
            {[
              { key: 'collegeLogo', label: 'College Logo' },
              { key: 'communityLogo', label: 'Community Logo' },
              { key: 'officialSeal', label: 'Official Seal' },
              { key: 'signature1', label: 'Signature 1' },
              { key: 'signature2', label: 'Signature 2' },
            ].map((asset) => (
              <div key={asset.key} className="bg-[#0A0A0B] p-3 rounded-lg border border-white/10">
                <label className="block text-xs font-semibold text-slate-300 mb-2">{asset.label}</label>
                <div className="flex items-center gap-3">
                  {template.assets[asset.key] && <img src={template.assets[asset.key]} alt="Preview" className="w-12 h-12 object-contain bg-[#111114] rounded p-1 border border-white/10" />}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(asset.key, e)} className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/30 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: PREVIEW DATA INPUTS */}
        {activeTab === 'testdata' && (
          <div className="space-y-3 overflow-y-auto max-h-[480px] pr-2 scrollbar-thin">
            <p className="text-xs text-slate-400 mb-1">Edit live canvas preview parameters:</p>
            {Object.keys(currentData).map((key) => (
              <div key={key}>
                <label className="block text-[11px] text-slate-400 mb-1 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input
                  type="text"
                  value={currentData[key]}
                  onChange={(e) => onUpdateData({ [key]: e.target.value })}
                  className="w-full bg-[#0A0A0B] border border-white/10 text-slate-200 text-xs rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* RIGHT SIDE: Interactive Zoomable Canvas Preview & Quick Export */}
      <div className="flex-1 flex flex-col bg-[#111114] border border-white/10 rounded-2xl p-5 shadow-2xl overflow-hidden relative">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-[#0A0A0B] p-3 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-white uppercase tracking-widest">{PRESETS.find(p=>p.id===template.preset)?.name || 'Editor'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowGrid(!showGrid)} className={`p-2 rounded-lg text-xs font-medium border transition ${showGrid ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`} title="Toggle Alignment Grid">
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setZoomScale(Math.max(0.4, zoomScale - 0.08))} className="p-2 bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 rounded-lg">
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-mono">
              <span className="text-slate-500">Zoom</span>
              <span className="font-semibold text-white">{Math.round(zoomScale * 100)}%</span>
            </div>
            <button onClick={() => setZoomScale(Math.min(1.1, zoomScale + 0.08))} className="p-2 bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 rounded-lg">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => setZoomScale(0.72)} className="p-2 bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 rounded-lg">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button disabled={isExporting} onClick={() => handleExport('png')} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition shadow-md shadow-indigo-600/20 disabled:opacity-50">
              <Download className="w-3.5 h-3.5" /> PNG
            </button>
            <button disabled={isExporting} onClick={() => handleExport('pdf')} className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-medium text-xs px-3 py-2 rounded-lg transition disabled:opacity-50">
              PDF
            </button>
          </div>
        </div>

        <div 
          ref={canvasContainerRef}
          className="flex-1 overflow-hidden flex items-center justify-center p-6 bg-[#0A0A0B]/80 rounded-xl border border-white/5 min-h-[550px] relative inner-shadow touch-none"
        >
          <motion.div
            drag
            dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
            dragElastic={0.1}
            dragMomentum={false}
            whileDrag={{ cursor: 'grabbing' }}
            style={{
              width: '1050px',
              height: '742px',
              scale: zoomScale,
              cursor: 'grab'
            }}
            className="shadow-2xl"
          >
            <CertificateCanvas id="editor-certificate-canvas" template={template} data={currentData} scale={1} showGrid={showGrid} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
