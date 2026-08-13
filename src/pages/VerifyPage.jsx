import React from 'react';
import { VerificationPortal } from '../components/certificates/VerificationPortal';
import { GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function VerifyPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-surface-muted flex flex-col">
      {/* Header */}
      <div className="bg-ink-950 text-white py-4 px-6 sm:px-10 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-8 w-8 rounded-lg bg-royal-600 flex items-center justify-center shadow-sm">
            <GraduationCap className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-none font-display">CampusHub</p>
            <p className="text-[10px] text-white/50 mt-0.5 uppercase tracking-widest">Credential Verification</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 px-4 py-12 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          <VerificationPortal />
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-6 text-center text-xs text-fg-faint">
        &copy; {new Date().getFullYear()} CampusHub Department Platform.
      </div>
    </div>
  );
}

export default VerifyPage;
