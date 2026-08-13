import React from 'react';
import { Award, Download, CheckCircle2, ShieldCheck, Download as DownloadIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCertificates } from '../services/certificates';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { useCertificateStore } from '../stores/certificateStore';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { CertificateCanvas } from '../components/certificates/CertificateCanvas';
import { createRoot } from 'react-dom/client';
import { currentUser } from '../data/mock';

export function Certificates() {
  const { data: apiCertificates = [] } = useQuery({ queryKey: ['certificates'], queryFn: fetchCertificates });
  const { issuedCertificates, activeTemplate } = useCertificateStore();
  
  // Combine API mock and newly generated certificates for current student
  const studentCerts = issuedCertificates.filter(
    (c) => c.studentName.toLowerCase() === currentUser.name.toLowerCase()
  );
  const certificates = [...studentCerts, ...apiCertificates];

  const downloadCertPDF = async (cert) => {
    // If it's a mock cert without template data, fallback to normal download alert
    if (!cert.templatePreset) {
      alert(`Downloading Certificate ${cert.verificationCode}`);
      return;
    }

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
          template={{...activeTemplate, preset: cert.templatePreset}}
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
      <PageHeader title="Event Certificates & Credentials" subtitle="Verified participation and completion certificates issued by department technical communities." />

      <div className="grid sm:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft hover:shadow-float transition-all space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Verified Certificate</span>
                  <p className="font-bold text-fg text-sm">{cert.eventTitle || cert.eventName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-fg-secondary">
              <div className="flex justify-between"><span className="text-fg-faint">Awarded To</span><span className="font-bold text-fg">{cert.studentName}</span></div>
              <div className="flex justify-between"><span className="text-fg-faint">Issuing Authority</span><span className="font-semibold text-fg">{cert.issuedBy}</span></div>
              <div className="flex justify-between"><span className="text-fg-faint">Issue Date</span><span className="font-semibold text-fg">{cert.issueDate}</span></div>
              <div className="flex justify-between"><span className="text-fg-faint">Credential ID</span><span className="font-mono text-fg">{cert.verificationCode || cert.id}</span></div>
            </div>

            <div className="pt-2">
              <Button variant="secondary" className="w-full text-xs" onClick={() => downloadCertPDF(cert)}>
                <DownloadIcon className="h-4 w-4" /> Download PDF Certificate
              </Button>
            </div>
          </div>
        ))}
        {certificates.length === 0 && (
          <div className="col-span-full p-12 text-center text-fg-muted border border-dashed rounded-2xl">
            <p>No certificates earned yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Certificates;
