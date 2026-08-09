import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PageHeader({ title, subtitle, back = false, action = null }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-start gap-4">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="mt-1 p-2 rounded-lg hover:bg-surface-hover text-fg-muted transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight">{title}</h1>
          {subtitle && <p className="text-fg-muted mt-1.5 text-sm sm:text-base">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default PageHeader;
