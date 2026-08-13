import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Palette, CopyPlus, History, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { TemplateEditor } from '../components/certificates/TemplateEditor';
import { BulkGenerator } from '../components/certificates/BulkGenerator';
import { VerificationPortal } from '../components/certificates/VerificationPortal';
import { useCertificateStore } from '../stores/certificateStore';
import { Button } from '../components/Button';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { CertificateCanvas } from '../components/certificates/CertificateCanvas';
import { createRoot } from 'react-dom/client';

export function CertificateStudio({ role }) {
  const [activeTab, setActiveTab] = useState('templates');
  const { issuedCertificates } = useCertificateStore();

  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7715/ingest/69a774dc-9dd4-4874-aa14-461272b168d1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8fb8b9'},body:JSON.stringify({sessionId:'8fb8b9',location:'CertificateStudio.jsx:mount',message:'CertificateStudio page active',data:{role,activeTab,viewportWidth:window.innerWidth},timestamp:Date.now(),hypothesisId:'B-E'})}).catch(()=>{});
  }, [role, activeTab]);
  // #endregion

  // Guard: Only faculty/admin can access
  if (role !== 'faculty' && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const tabs = [
    { id: 'templates', label: 'Template Studio', icon: Palette },
    { id: 'bulk', label: 'Bulk Generation', icon: CopyPlus },
    { id: 'issued', label: 'Issued Log', icon: History },
    { id: 'verify', label: 'Verification Portal', icon: ShieldCheck },
  ];

  const downloadCertPDF = async (cert) => {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '1123px';
      container.style.height = '794px';
      container.style.zIndex = '-1';
      document.body.appendChild(container);

      const root = createRoot(container);

      await new Promise((resolve) => {
        root.render(
          <CertificateCanvas
            template={{...useCertificateStore.getState().activeTemplate, preset: cert.templatePreset}}
            data={{
              studentName: cert.studentName,
              rollNumber: cert.rollNumber,
              department: cert.department,
              eventName: cert.eventName,
              achievementTitle: cert.achievementTitle,
              certificateNumber: cert.id,
              issueDate: cert.issueDate,
              facultyMentor: cert.facultyMentor,
              coordinatorName: cert.coordinatorName,
            }}
            scale={1}
            showQR={true}
          />
        );
        setTimeout(resolve, 400);
      });

      try {
        const dataUrl = await toPng(container, { pixelRatio: 2, cacheBust: true });
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1123, 794] });
        pdf.addImage(dataUrl, 'PNG', 0, 0, 1123, 794);
        pdf.save(`${cert.studentName}_${cert.id}.pdf`);
      } catch (err) {
        console.error('PDF export failed:', err);
      }

      root.unmount();
      document.body.removeChild(container);
  };


  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Certificate Studio"
        subtitle="Design, bulk-generate, and verify official event certificates."
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/70 pb-px overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap ${
                active
                  ? 'bg-surface border-x border-t border-border/70 text-royal-600'
                  : 'text-fg-muted hover:text-fg hover:bg-surface-hover/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.id === 'issued' && issuedCertificates.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-royal-100 text-royal-700 text-[10px] font-bold">
                  {issuedCertificates.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="pt-2">
        {activeTab === 'templates' && <TemplateEditor />}
        
        {activeTab === 'bulk' && <BulkGenerator />}
        
        {activeTab === 'issued' && (
          <div className="bg-surface rounded-2xl border border-border/70 shadow-soft overflow-hidden animate-fade-in">
            {issuedCertificates.length === 0 ? (
              <div className="p-12 text-center text-fg-muted">
                <History className="h-10 w-10 mx-auto mb-3 text-fg-faint" />
                <p>No certificates issued in this session.</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-surface-muted border-b border-border/50 text-left">
                    <th className="px-5 py-3 font-semibold text-fg-muted">Cert ID</th>
                    <th className="px-5 py-3 font-semibold text-fg-muted">Recipient</th>
                    <th className="px-5 py-3 font-semibold text-fg-muted">Event</th>
                    <th className="px-5 py-3 font-semibold text-fg-muted">Date</th>
                    <th className="px-5 py-3 font-semibold text-fg-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedCertificates.map((cert) => (
                    <tr key={cert.id} className="border-b border-border/30 hover:bg-surface-muted/50">
                      <td className="px-5 py-3 font-mono text-fg-faint">{cert.id}</td>
                      <td className="px-5 py-3 font-semibold text-fg">{cert.studentName}</td>
                      <td className="px-5 py-3 text-fg-secondary">{cert.eventName}</td>
                      <td className="px-5 py-3 text-fg-faint">{cert.issueDate}</td>
                      <td className="px-5 py-3 text-right">
                         <Button variant="ghost" size="sm" onClick={() => downloadCertPDF(cert)}>
                            <Download className="h-3 w-3" />
                         </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {activeTab === 'verify' && <VerificationPortal />}
      </div>
    </div>
  );
}

export default CertificateStudio;
