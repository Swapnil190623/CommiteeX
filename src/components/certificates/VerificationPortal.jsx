import React, { useState } from 'react';
import {
  Search, ShieldCheck, ShieldX, Award, User, Hash, Building2,
  CalendarDays, Trophy, Stamp, QrCode,
} from 'lucide-react';
import { useCertificateStore } from '../../stores/certificateStore';

export function VerificationPortal({ initialCertId = '' }) {
  const { verifyCertificate, issuedCertificates } = useCertificateStore();
  const [certIdInput, setCertIdInput] = useState(initialCertId);
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = (e) => {
    e?.preventDefault();
    if (!certIdInput.trim()) return;
    const result = verifyCertificate(certIdInput.trim());
    setSearchResult(result);
    setHasSearched(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Search Card */}
      <div className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-royal-50 text-royal-600 flex items-center justify-center">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-fg font-display">Certificate Verification</h3>
            <p className="text-xs text-fg-faint">Enter a Certificate ID to verify its authenticity</p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-faint" />
            <input
              value={certIdInput}
              onChange={(e) => setCertIdInput(e.target.value)}
              placeholder="Enter Certificate ID (e.g. CX-2026-88142)"
              className="w-full pl-10 pr-4 py-3 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-500/30 text-fg"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 text-sm font-semibold bg-royal-600 text-white rounded-xl hover:bg-royal-700 transition-all shadow-sm"
          >
            Verify
          </button>
        </form>

        {issuedCertificates.length > 0 && !hasSearched && (
          <div className="mt-3">
            <p className="text-[10px] text-fg-faint mb-1.5">Recent certificates (click to verify):</p>
            <div className="flex flex-wrap gap-1.5">
              {issuedCertificates.slice(-5).map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setCertIdInput(c.id); setSearchResult(verifyCertificate(c.id)); setHasSearched(true); }}
                  className="px-2 py-1 text-[10px] font-mono bg-surface-muted border border-border rounded-lg hover:bg-surface-hover transition-colors text-fg-muted"
                >
                  {c.id}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result */}
      {hasSearched && (
        <div className="animate-cert-scale-in">
          {searchResult ? (
            // ✅ Verified
            <div className="bg-surface rounded-2xl border-2 border-emerald-500/50 p-6 shadow-float">
              {/* Verified Badge */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-200/50">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                      ✓ Verified
                    </span>
                  </div>
                  <p className="text-sm text-fg-muted mt-1">
                    This certificate is authentic and has been officially issued.
                  </p>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow icon={User} label="Recipient Name" value={searchResult.studentName} highlight />
                <DetailRow icon={Hash} label="Roll Number" value={searchResult.rollNumber} />
                <DetailRow icon={Building2} label="Department" value={searchResult.department} />
                <DetailRow icon={Award} label="Event Name" value={searchResult.eventName} highlight />
                <DetailRow icon={Trophy} label="Achievement" value={searchResult.achievementTitle} />
                <DetailRow icon={Stamp} label="Issuing Authority" value={searchResult.issuedBy} />
                <DetailRow icon={CalendarDays} label="Issue Date" value={searchResult.issueDate} />
                <DetailRow icon={QrCode} label="Certificate ID" value={searchResult.id} mono />
              </div>

              {/* Signatures */}
              {(searchResult.facultyMentor || searchResult.coordinatorName) && (
                <div className="mt-5 pt-4 border-t border-border/50">
                  <p className="text-[10px] font-semibold text-fg-faint uppercase tracking-wider mb-2">Authorized Signatories</p>
                  <div className="flex gap-6">
                    {searchResult.facultyMentor && (
                      <div>
                        <p className="text-xs font-semibold text-fg">{searchResult.facultyMentor}</p>
                        <p className="text-[10px] text-fg-faint">Faculty Mentor</p>
                      </div>
                    )}
                    {searchResult.coordinatorName && (
                      <div>
                        <p className="text-xs font-semibold text-fg">{searchResult.coordinatorName}</p>
                        <p className="text-[10px] text-fg-faint">Coordinator</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // ❌ Not Found
            <div className="bg-surface rounded-2xl border-2 border-rose-500/30 p-6 shadow-soft text-center">
              <div className="h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
                <ShieldX className="h-9 w-9 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-fg mb-1 font-display">Certificate Not Found</h3>
              <p className="text-sm text-fg-muted max-w-md mx-auto">
                No certificate with ID <strong className="font-mono text-fg">"{certIdInput}"</strong> was found in our records. Please double-check the Certificate ID and try again.
              </p>
              <p className="text-xs text-fg-faint mt-3">
                If you believe this is an error, contact the issuing department.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, highlight = false, mono = false }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg">
      <Icon className="h-4 w-4 text-fg-faint mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-[10px] text-fg-faint uppercase tracking-wider">{label}</p>
        <p className={`text-sm ${highlight ? 'font-bold text-fg' : 'font-medium text-fg-secondary'} ${mono ? 'font-mono text-xs' : ''}`}>
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

export default VerificationPortal;
