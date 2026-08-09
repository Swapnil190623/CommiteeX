import React from 'react';
import { Award, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCertificates } from '../services/certificates';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';

export function Certificates() {
  const { data: certificates = [] } = useQuery({ queryKey: ['certificates'], queryFn: fetchCertificates });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Event Certificates & Credentials" subtitle="Verified participation and completion certificates issued by department technical communities." />

      <div className="grid sm:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white rounded-2xl border border-ink-200/70 p-6 shadow-soft hover:shadow-float transition-all space-y-4">
            <div className="flex items-center justify-between border-b border-ink-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Verified Certificate</span>
                  <p className="font-bold text-ink-900 text-sm">{cert.eventTitle}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-ink-600">
              <div className="flex justify-between"><span className="text-ink-400">Awarded To</span><span className="font-bold text-ink-900">{cert.studentName}</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Issuing Authority</span><span className="font-semibold text-ink-800">{cert.issuedBy}</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Issue Date</span><span className="font-semibold text-ink-800">{cert.issueDate}</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Credential ID</span><span className="font-mono text-ink-800">{cert.verificationCode}</span></div>
            </div>

            <div className="pt-2">
              <Button variant="secondary" className="w-full text-xs" onClick={() => alert(`Downloading Certificate ${cert.verificationCode}`)}>
                <Download className="h-4 w-4" /> Download PDF Certificate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Certificates;
