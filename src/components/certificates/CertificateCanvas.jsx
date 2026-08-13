import React from 'react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

// Interpolate {{variable}} placeholders in text
function interpolate(text, data) {
  if (!text) return '';
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const map = {
      student_name: data.studentName || 'Student Name',
      roll_number: data.rollNumber || 'XXXX',
      department: data.department || 'Department',
      event_name: data.eventName || 'Event Name',
      achievement_title: data.achievementTitle || 'Participation',
      certificate_number: data.certificateNumber || 'CX-0000-00000',
      issue_date: data.issueDate || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      faculty_mentor: data.facultyMentor || 'Faculty Mentor',
      coordinator_name: data.coordinatorName || 'Coordinator',
    };
    return map[key] || `{{${key}}}`;
  });
}

// QR Code component
function QRCodeImage({ value, size = 80, color = '#000000' }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    QRCode.toDataURL(value || 'https://committeex.verify', {
      width: size * 2,
      margin: 1,
      color: { dark: color, light: '#FFFFFF00' },
    }).then(setSrc).catch(() => {});
  }, [value, size, color]);
  if (!src) return null;
  return <img src={src} alt="QR" style={{ width: size, height: size }} />;
}

// ────────────────────────────────────────────────────
// PRESET 1: Memphis Geometric
// ────────────────────────────────────────────────────
function MemphisPreset({ template, data, showQR }) {
  const { colors, fonts, visibility, headerText, subHeaderText, bodyText, achievementLine, eventLine, footerText, assets, signatories } = template;
  
  return (
    <div style={{
      width: '100%', height: '100%', background: colors.background,
      position: 'relative', overflow: 'hidden', fontFamily: fonts.body, color: colors.text
    }}>
      {/* Top Left Geometric Graphics */}
      <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none z-0">
        <svg className="absolute top-0 left-0 w-56 h-36" viewBox="0 0 200 120">
          <polygon points="0,0 200,0 0,120" fill={colors.primary} />
          <pattern id="memphisDotsTL" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2" fill={colors.secondary} opacity="0.6" />
          </pattern>
          <polygon points="10,10 180,10 10,100" fill="url(#memphisDotsTL)" />
        </svg>
        <div className="absolute top-10 left-20 w-12 h-12 transform rotate-45 shadow-md" style={{ background: colors.secondary }} />
        <div className="absolute top-14 left-24 w-12 h-12 border-2 transform rotate-45" style={{ borderColor: colors.primary }} />
        <div className="absolute top-32 left-10 text-3xl font-black" style={{ color: colors.secondary }}>✕</div>
        <div className="absolute top-12 left-44 grid grid-cols-4 gap-2 opacity-80">
          {[...Array(12)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full" style={{ background: colors.secondary }} />)}
        </div>
        <div className="absolute top-16 left-64 w-6 h-6 rounded-full border-2" style={{ borderColor: colors.primary }} />
        <div className="absolute top-8 left-72 w-4 h-4 rounded-full" style={{ background: colors.primary }} />
      </div>

      {/* Top Right Geometric Graphics */}
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none z-0">
        <div className="absolute top-8 right-36 flex space-x-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] transform rotate-90" style={{ borderBottomColor: colors.primary }} />
          ))}
        </div>
        <div className="absolute top-16 right-24 text-2xl font-bold" style={{ color: colors.secondary }}>+</div>
        <svg className="absolute top-8 right-8 w-20 h-20" viewBox="0 0 100 100">
          <path d="M 10 10 L 25 30 L 40 10 L 55 30 L 70 10 L 85 30" fill="none" stroke={colors.secondary} strokeWidth="3" strokeLinecap="round" />
          <path d="M 10 25 L 25 45 L 40 25 L 55 45 L 70 25 L 85 45" fill="none" stroke={colors.secondary} strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {visibility.qrCode && (
        <div className="absolute left-3 bottom-12 transform -rotate-90 origin-bottom-left text-[10px] font-mono tracking-widest uppercase opacity-40" style={{ color: colors.secondary }}>
          ID: {interpolate('{{certificate_number}}', data)}
        </div>
      )}

      {/* Header Branding Logos */}
      <div className="relative z-10 flex justify-center items-center gap-6 mt-12">
        {visibility.collegeLogo && assets.collegeLogo && <img src={assets.collegeLogo} alt="" className="h-16 w-auto object-contain" />}
        <div className="text-center">
          <h4 className="text-sm font-bold tracking-widest uppercase opacity-80" style={{ fontFamily: fonts.heading }}>
            {interpolate(footerText, data)}
          </h4>
        </div>
        {visibility.communityLogo && assets.communityLogo && <img src={assets.communityLogo} alt="" className="h-16 w-auto object-contain" />}
      </div>

      {/* Main Title Block */}
      <div className="relative z-10 text-center mt-6 mb-2">
        <h1 className="text-4xl font-extrabold tracking-wider uppercase" style={{ fontFamily: fonts.heading, color: colors.secondary }}>
          {interpolate(headerText, data) || 'CERTIFICATE'}
        </h1>
        <p className="text-xs tracking-widest font-semibold uppercase opacity-60 mt-2">
          {interpolate(subHeaderText, data) || 'PROUDLY PRESENTED TO'}
        </p>
      </div>

      {/* Recipient Name */}
      <div className="relative z-10 text-center my-6">
        <div className="inline-flex items-center justify-center gap-6">
          <div className="text-xl font-black tracking-tighter" style={{ color: colors.primary }}>❯❯❯❯</div>
          <h2 className="text-5xl font-black tracking-wide border-b-4 pb-2 px-4 min-w-[320px]" style={{ fontFamily: fonts.heading, color: colors.secondary, borderBottomColor: colors.secondary }}>
            {interpolate('{{student_name}}', data)}
          </h2>
          <div className="text-xl font-black tracking-tighter" style={{ color: colors.primary }}>❮❮❮❮</div>
        </div>
        <div className="flex justify-center items-center gap-4 text-xs font-semibold opacity-70 mt-4">
          {visibility.rollNumber && <span className="bg-black/5 px-3 py-1 rounded border border-black/10">Roll No: {interpolate('{{roll_number}}', data)}</span>}
          {visibility.department && <span className="bg-black/5 px-3 py-1 rounded border border-black/10">Dept: {interpolate('{{department}}', data)}</span>}
        </div>
      </div>

      {/* Body & Achievement */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
        <p className="text-sm font-medium leading-relaxed opacity-80 px-8">
          {interpolate(bodyText, data)}
        </p>
        <p className="text-lg font-bold" style={{ color: colors.secondary, fontFamily: fonts.heading }}>
          {interpolate(eventLine, data)}
        </p>
        <div className="inline-block py-2 px-8 font-black text-2xl tracking-widest uppercase rounded shadow-lg" style={{ background: colors.secondary, color: colors.background }}>
          {interpolate(achievementLine, data) || 'PARTICIPATION'}
        </div>
      </div>

      {/* Footer Row */}
      <div className="absolute bottom-10 left-16 right-16 z-10 flex justify-between items-end">
        <div className="text-center w-48">
          {visibility.signatures && assets.signature1 && <img src={assets.signature1} alt="" className="h-12 mx-auto object-contain mb-2" />}
          <div className="border-t-2 pt-2" style={{ borderColor: colors.secondary }}>
            <p className="text-sm font-bold" style={{ color: colors.secondary }}>{interpolate(signatories[0]?.name || '{{faculty_mentor}}', data)}</p>
            <p className="text-[10px] opacity-60 font-semibold uppercase tracking-wider">{signatories[0]?.label || 'Faculty'}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {visibility.officialSeal && assets.officialSeal && <img src={assets.officialSeal} alt="Seal" className="w-20 h-20 object-contain drop-shadow-md" />}
          {showQR && visibility.qrCode && (
            <div className="p-1.5 bg-white border border-black/10 rounded shadow-sm text-center">
              <QRCodeImage value={`https://committeex.verify/${interpolate('{{certificate_number}}', data)}`} size={64} color={colors.secondary} />
            </div>
          )}
        </div>

        <div className="text-center w-48">
          {visibility.signatures && assets.signature2 && <img src={assets.signature2} alt="" className="h-12 mx-auto object-contain mb-2" />}
          <div className="border-t-2 pt-2" style={{ borderColor: colors.secondary }}>
            <p className="text-sm font-bold" style={{ color: colors.secondary }}>{interpolate(signatories[1]?.name || '{{coordinator_name}}', data)}</p>
            <p className="text-[10px] opacity-60 font-semibold uppercase tracking-wider">{signatories[1]?.label || 'Coordinator'}</p>
          </div>
        </div>
      </div>

      {/* Bottom Right Graphic */}
      <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none z-0">
        <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full border-4 flex items-center justify-center" style={{ borderColor: colors.primary }}>
          <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center" style={{ borderColor: colors.secondary }}>
            <div className="w-8 h-8 rounded-full" style={{ background: colors.primary }} />
          </div>
        </div>
        <div className="absolute bottom-20 right-20 w-20 h-20 flex items-center justify-center overflow-hidden" style={{ background: colors.secondary }}>
          <div className="w-28 h-1 transform rotate-45 my-1" style={{ background: colors.primary }} />
          <div className="w-28 h-1 transform -rotate-45 my-1" style={{ background: colors.primary }} />
        </div>
        <div className="absolute bottom-4 right-32 grid grid-cols-5 gap-1.5 opacity-70">
          {[...Array(20)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: colors.secondary }} />)}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────
// PRESET 2: Corporate Navy & Gold
// ────────────────────────────────────────────────────
function CorporatePreset({ template, data, showQR }) {
  const { colors, fonts, visibility, headerText, subHeaderText, bodyText, achievementLine, eventLine, footerText, assets, signatories } = template;
  
  return (
    <div style={{
      width: '100%', height: '100%', background: colors.background,
      position: 'relative', overflow: 'hidden', fontFamily: fonts.body, color: colors.text
    }}>
      {/* Outer Navy Polygon Corners matching the provided SVG logic */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1050 742">
        <polygon points="0,0 350,0 300,50 0,50" fill={colors.primary} />
        <polygon points="700,0 1050,0 1050,350 1000,300 1000,50 700,50" fill={colors.primary} />
        <polygon points="1050,742 700,742 750,692 1000,692 1000,392 1050,392" fill={colors.primary} />
        <polygon points="0,742 350,742 300,692 0,692" fill={colors.primary} />
        <polygon points="0,50 50,100 50,642 0,692" fill={colors.primary} />
        {/* Inner thin gold borders around the shapes */}
        <polyline points="0,60 290,60 340,10" fill="none" stroke={colors.secondary} strokeWidth="2" opacity="0.7"/>
        <polyline points="710,10 760,60 1040,60" fill="none" stroke={colors.secondary} strokeWidth="2" opacity="0.7"/>
        <polyline points="1040,682 760,682 710,732" fill="none" stroke={colors.secondary} strokeWidth="2" opacity="0.7"/>
        <polyline points="0,682 290,682 340,732" fill="none" stroke={colors.secondary} strokeWidth="2" opacity="0.7"/>
        <rect x="60" y="110" width="930" height="522" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.3" />
      </svg>

      {/* Gold ribbon badge top-center */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 z-10 flex flex-col items-center">
        <div className="w-full h-20 flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.secondary}, #f5d76e, ${colors.secondary})` }}>
          {visibility.officialSeal && assets.officialSeal ? (
             <img src={assets.officialSeal} alt="Seal" className="w-12 h-12 object-contain mix-blend-multiply opacity-80" />
          ) : (
             <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center bg-white/30 text-[10px] font-black" style={{ borderColor: colors.primary, color: colors.primary }}>SEAL</div>
          )}
        </div>
        <div className="w-0 h-0 border-l-[48px] border-r-[48px] border-b-[30px] border-b-transparent" style={{ borderLeftColor: colors.secondary, borderRightColor: colors.secondary }} />
      </div>

      {/* Content */}
      <div className="relative z-10 px-24 py-16 flex flex-col h-full justify-between text-center pt-24">
        <div>
          <div className="flex justify-center items-center gap-6 mb-6">
            {visibility.collegeLogo && assets.collegeLogo && <img src={assets.collegeLogo} alt="" className="h-12" />}
            <div className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: colors.primary }}>
              {interpolate(footerText, data)}
            </div>
            {visibility.communityLogo && assets.communityLogo && <img src={assets.communityLogo} alt="" className="h-12" />}
          </div>
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-2" style={{ color: colors.primary, fontFamily: fonts.heading }}>
            {interpolate(headerText, data)}
          </h1>
          <div className="w-48 h-0.5 mx-auto mb-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.secondary}, transparent)` }} />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <p className="text-sm italic opacity-70 mb-4 font-serif">
            {interpolate(subHeaderText, data)}
          </p>
          <h2 className="text-4xl font-bold mb-4 inline-block mx-auto border-b-2 pb-2 px-8" style={{ color: colors.primary, fontFamily: fonts.heading, borderBottomColor: colors.secondary }}>
            {interpolate('{{student_name}}', data)}
          </h2>
          {visibility.rollNumber && (
            <p className="text-xs opacity-60 font-mono tracking-widest mb-6 uppercase">
              {interpolate('{{department}}', data)} • {interpolate('{{roll_number}}', data)}
            </p>
          )}
          <p className="text-lg leading-relaxed max-w-3xl mx-auto opacity-80">
            {interpolate(bodyText, data)}
          </p>
          <div className="text-xl font-bold mt-4" style={{ color: colors.primary, fontFamily: fonts.heading }}>
            {interpolate(eventLine, data)}
          </div>
          <div className="text-sm font-semibold tracking-widest uppercase mt-4 py-2 px-6 inline-block mx-auto border border-dashed rounded" style={{ borderColor: colors.secondary, color: colors.secondary }}>
            {interpolate(achievementLine, data)}
          </div>
        </div>

        <div className="flex justify-between items-end mt-8 relative">
          <div className="flex justify-center gap-24 flex-1">
            {visibility.signatures && signatories.map((s, i) => (
              <div key={i} className="text-center w-48">
                {assets[`signature${i + 1}`] && <img src={assets[`signature${i + 1}`]} alt="" className="h-14 mx-auto object-contain mb-2 opacity-90 mix-blend-multiply" />}
                <div className="border-t border-black/30 pt-2">
                  <p className="text-sm font-bold" style={{ color: colors.primary }}>{interpolate(s.name, data)}</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-50">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
          {showQR && visibility.qrCode && (
             <div className="absolute bottom-0 right-0 text-center">
               <QRCodeImage value={`https://committeex.verify/${interpolate('{{certificate_number}}', data)}`} size={64} color={colors.primary} />
               <p className="text-[8px] uppercase tracking-widest opacity-40 mt-1">Verify</p>
             </div>
          )}
          <div className="absolute bottom-0 left-0 text-left">
            <p className="text-[9px] uppercase tracking-widest opacity-40">Certificate ID</p>
            <p className="text-xs font-mono font-bold" style={{ color: colors.primary }}>{interpolate('{{certificate_number}}', data)}</p>
            <p className="text-[9px] uppercase tracking-widest opacity-40 mt-2">Date Issued</p>
            <p className="text-xs font-bold" style={{ color: colors.primary }}>{interpolate('{{issue_date}}', data)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────
// PRESET 3: Cyberpunk Hackathon
// ────────────────────────────────────────────────────
function CyberpunkPreset({ template, data, showQR }) {
  const { colors, fonts, visibility, headerText, subHeaderText, bodyText, achievementLine, eventLine, footerText, assets, signatories } = template;
  
  return (
    <div style={{
      width: '100%', height: '100%', background: colors.background || '#0a0a1a',
      position: 'relative', overflow: 'hidden', fontFamily: fonts.body, color: colors.text || '#e0e0e0',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${colors.primary}11 1px, transparent 1px), linear-gradient(90deg, ${colors.primary}11 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />
      <div style={{ position: 'absolute', top: 12, left: 12, right: 12, height: 4, background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`, boxShadow: `0 0 20px ${colors.primary}` }} />
      <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, height: 4, background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 0 20px ${colors.secondary}` }} />
      <div style={{ position: 'absolute', top: 12, left: 12, bottom: 12, width: 4, background: `linear-gradient(180deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 0 15px ${colors.primary}` }} />
      <div style={{ position: 'absolute', top: 12, right: 12, bottom: 12, width: 4, background: `linear-gradient(180deg, ${colors.secondary}, ${colors.primary})`, boxShadow: `0 0 15px ${colors.secondary}` }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '55px 65px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        <div>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] font-bold tracking-[0.4em] uppercase mb-2" style={{ color: colors.primary }}>
                {interpolate(footerText, data)}
              </div>
              <h1 className="text-4xl font-black uppercase tracking-wider" style={{ fontFamily: fonts.heading, color: colors.secondary, textShadow: `0 0 20px ${colors.secondary}80` }}>
                {interpolate(headerText, data)}
              </h1>
            </div>
            <div className="flex gap-4 items-center">
              {visibility.collegeLogo && assets.collegeLogo && <img src={assets.collegeLogo} alt="" className="h-12 brightness-200 contrast-125 grayscale" />}
              {visibility.communityLogo && assets.communityLogo && <img src={assets.communityLogo} alt="" className="h-12 brightness-200 contrast-125 grayscale" />}
            </div>
          </div>
          <div className="w-32 h-1 mt-4" style={{ background: `linear-gradient(90deg, ${colors.primary}, transparent)` }} />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <p className="text-sm opacity-60 font-mono mb-6">
            {'>'} {interpolate(subHeaderText, data)}
          </p>
          <h2 className="text-5xl font-black mb-4 uppercase" style={{ color: colors.primary, fontFamily: fonts.heading, textShadow: `0 0 30px ${colors.primary}60` }}>
            {interpolate('{{student_name}}', data)}
          </h2>
          {visibility.rollNumber && (
            <p className="text-xs opacity-50 font-mono tracking-wider mb-6 border-l-2 pl-3" style={{ borderColor: colors.secondary }}>
              SYS.ID: {interpolate('{{roll_number}}', data)} [{interpolate('{{department}}', data)}]
            </p>
          )}
          <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
            {interpolate(bodyText, data)}
          </p>
          <div className="text-2xl font-bold mt-6 tracking-wide" style={{ color: colors.secondary, fontFamily: fonts.heading }}>
            {interpolate(eventLine, data)}
          </div>
          <div className="mt-4 px-6 py-2 border-2 inline-block font-mono text-sm uppercase tracking-widest font-bold" style={{ borderColor: colors.primary, color: colors.primary, boxShadow: `inset 0 0 10px ${colors.primary}40, 0 0 10px ${colors.primary}40` }}>
            STATUS: {interpolate(achievementLine, data)}
          </div>
        </div>

        <div className="flex justify-between items-end mt-8 border-t border-white/20 pt-6">
          <div className="flex gap-16">
            {visibility.signatures && signatories.map((s, i) => (
              <div key={i}>
                {assets[`signature${i + 1}`] && <img src={assets[`signature${i + 1}`]} alt="" className="h-12 mb-2 invert opacity-80" />}
                <p className="text-sm font-bold uppercase tracking-wider" style={{ color: colors.primary }}>{interpolate(s.name, data)}</p>
                <p className="text-[10px] opacity-40 font-mono uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-6 text-right">
            <div>
              <p className="text-[9px] opacity-40 font-mono">HASH.ID:</p>
              <p className="text-sm font-mono font-bold" style={{ color: colors.secondary }}>{interpolate('{{certificate_number}}', data)}</p>
              <p className="text-[9px] opacity-40 font-mono mt-2">TIMESTAMP:</p>
              <p className="text-xs font-mono" style={{ color: colors.primary }}>{interpolate('{{issue_date}}', data)}</p>
            </div>
            {showQR && visibility.qrCode && (
              <div className="p-2 bg-white/10 rounded border border-white/20 backdrop-blur-sm">
                <QRCodeImage value={`https://committeex.verify/${interpolate('{{certificate_number}}', data)}`} size={64} color="#ffffff" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────
// Main CertificateCanvas Component
// ────────────────────────────────────────────────────
const presetComponents = {
  memphis: MemphisPreset,
  corporate: CorporatePreset,
  cyberpunk: CyberpunkPreset,
  academic: CorporatePreset, // Fallback to corporate for academic
  swiss: MemphisPreset,      // Fallback to memphis for swiss
};

export function CertificateCanvas({ template, data = {}, scale = 1, id }) {
  const PresetComponent = presetComponents[template?.preset] || CorporatePreset;

  return (
    <div
      id={id}
      className="cert-canvas"
      style={{
        width: 1050,
        height: 742,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      <PresetComponent template={template} data={data} showQR={true} />
    </div>
  );
}

export default CertificateCanvas;
