import React, { useState, useRef, useCallback } from 'react';
import {
  Upload, FileSpreadsheet, Users, Search, Download, Play,
  Trash2, Plus, ChevronLeft, ChevronRight, Loader2, PartyPopper,
  FileText, AlertCircle,
} from 'lucide-react';
import Papa from 'papaparse';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { useCertificateStore } from '../../stores/certificateStore';
import { CertificateCanvas } from './CertificateCanvas';
import { events as mockEvents, initialRegistrations } from '../../data/mock';

const ITEMS_PER_PAGE = 8;

export function BulkGenerator() {
  const { activeTemplate, issueCertificateBatch } = useCertificateStore();
  const [participants, setParticipants] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [dataSource, setDataSource] = useState('event'); // event | csv | paste
  const [pasteText, setPasteText] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const fileInputRef = useRef(null);
  const offscreenRef = useRef(null);

  // Load from event attendees
  const loadFromEvent = (eventId) => {
    setSelectedEvent(eventId);
    const event = mockEvents.find((e) => e.id === eventId);
    if (!event) return;

    const regs = initialRegistrations.filter((r) => r.eventId === eventId);
    const rows = regs.map((r, i) => ({
      id: `row-${Date.now()}-${i}`,
      studentName: r.studentName,
      rollNumber: r.rollNumber,
      department: r.department,
      achievementTitle: 'Participation',
      certificateNumber: '',
      eventName: event.title,
      facultyMentor: activeTemplate.signatories[0]?.name || '',
      coordinatorName: activeTemplate.signatories[1]?.name || '',
    }));
    setParticipants(rows);
    setCurrentPage(1);
  };

  // Load from CSV
  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map((row, i) => ({
          id: `csv-${Date.now()}-${i}`,
          studentName: row['Student Name'] || row['Name'] || row['student_name'] || row['name'] || '',
          rollNumber: row['Roll Number'] || row['Roll No'] || row['roll_number'] || row['roll'] || '',
          department: row['Department'] || row['department'] || row['Dept'] || 'Computer Engineering',
          achievementTitle: row['Achievement'] || row['achievement_title'] || row['Title'] || 'Participation',
          certificateNumber: '',
          eventName: row['Event'] || row['event_name'] || selectedEvent || '',
          facultyMentor: activeTemplate.signatories[0]?.name || '',
          coordinatorName: activeTemplate.signatories[1]?.name || '',
        }));
        setParticipants(rows);
        setCurrentPage(1);
      },
    });
    e.target.value = '';
  };

  // Load from paste
  const loadFromPaste = () => {
    if (!pasteText.trim()) return;
    const lines = pasteText.split('\n').filter((l) => l.trim());
    const rows = lines.map((line, i) => {
      const parts = line.split(',').map((s) => s.trim());
      return {
        id: `paste-${Date.now()}-${i}`,
        studentName: parts[0] || '',
        rollNumber: parts[1] || '',
        department: parts[2] || 'Computer Engineering',
        achievementTitle: parts[3] || 'Participation',
        certificateNumber: '',
        eventName: '',
        facultyMentor: activeTemplate.signatories[0]?.name || '',
        coordinatorName: activeTemplate.signatories[1]?.name || '',
      };
    });
    setParticipants(rows);
    setPasteText('');
    setCurrentPage(1);
  };

  // Edit cell
  const updateCell = (rowId, field, value) => {
    setParticipants((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [field]: value } : r))
    );
  };

  // Add row
  const addRow = () => {
    setParticipants((prev) => [
      ...prev,
      {
        id: `manual-${Date.now()}`,
        studentName: '',
        rollNumber: '',
        department: 'Computer Engineering',
        achievementTitle: 'Participation',
        certificateNumber: '',
        eventName: '',
        facultyMentor: activeTemplate.signatories[0]?.name || '',
        coordinatorName: activeTemplate.signatories[1]?.name || '',
      },
    ]);
  };

  // Remove row
  const removeRow = (rowId) => {
    setParticipants((prev) => prev.filter((r) => r.id !== rowId));
  };

  // Filtered & paginated data
  const filtered = participants.filter((p) =>
    [p.studentName, p.rollNumber, p.department, p.achievementTitle]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ── BULK GENERATION ──
  const generateBatch = useCallback(async () => {
    if (participants.length === 0) return;
    setIsGenerating(true);
    setIsComplete(false);
    setProgress({ current: 0, total: participants.length });

    const zip = new JSZip();
    const certs = [];

    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      const certId = `CX-${new Date().getFullYear()}-${String(10000 + i).slice(-5)}${Math.floor(Math.random() * 10)}`;

      // Create a copy to avoid mutating state directly
      const participantWithCert = { ...p, certificateNumber: certId };

      // Create offscreen render
      const container = document.createElement('div');
      container.id = `offscreen-cert-${i}`;
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '1123px';
      container.style.height = '794px';
      container.style.zIndex = '-1';
      document.body.appendChild(container);

      // Render React element — we'll use a simpler approach with direct DOM
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(container);

      await new Promise((resolve) => {
        root.render(
          <CertificateCanvas
            id={`offscreen-canvas-${i}`}
            template={activeTemplate}
            data={{
              studentName: p.studentName,
              rollNumber: p.rollNumber,
              department: p.department,
              eventName: p.eventName,
              achievementTitle: p.achievementTitle,
              certificateNumber: certId,
              issueDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
              facultyMentor: p.facultyMentor,
              coordinatorName: p.coordinatorName,
            }}
            scale={1}
            showQR={true}
          />
        );
        // Wait for render + fonts
        setTimeout(resolve, 400);
      });

      try {
        const el = container.querySelector(`#offscreen-canvas-${i}`) || container;
        const dataUrl = await toPng(el, { pixelRatio: 2, cacheBust: true });

        // Convert data URL to blob
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const safeName = (p.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
        zip.file(`${safeName}_${certId}.png`, blob);

        certs.push({
          ...p,
          certificateNumber: certId,
        });
      } catch (err) {
        console.error(`Failed to generate cert for ${p.studentName}:`, err);
      }

      // Cleanup
      root.unmount();
      document.body.removeChild(container);

      setProgress({ current: i + 1, total: participants.length });
    }

    // Update participants with cert numbers
    setParticipants([...participants]);

    // Issue to store for verification
    issueCertificateBatch(certs, certs[0]?.eventName || '', activeTemplate);

    // Generate and download ZIP
    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.download = `certificates_batch_${new Date().toISOString().split('T')[0]}.zip`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP generation failed:', err);
    }

    setIsGenerating(false);
    setIsComplete(true);

    // Celebration confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#c9a84c', '#1e3a5f', '#3b5bf0', '#10b981', '#f59e0b'],
    });
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.3, y: 0.5 },
      });
    }, 300);
  }, [participants, activeTemplate, issueCertificateBatch]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Data Source Tabs */}
      <div className="bg-surface rounded-2xl border border-border/70 p-5 shadow-soft">
        <h3 className="text-sm font-bold text-fg mb-3 font-display">Load Participant Data</h3>
        <div className="flex gap-2 mb-4">
          {[
            { id: 'event', label: 'From Event', icon: Users },
            { id: 'csv', label: 'CSV Import', icon: FileSpreadsheet },
            { id: 'paste', label: 'Paste Text', icon: FileText },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setDataSource(s.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all ${
                dataSource === s.id
                  ? 'bg-royal-600 text-white shadow-sm'
                  : 'bg-surface-muted text-fg-muted hover:bg-surface-hover border border-border/70'
              }`}
            >
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </button>
          ))}
        </div>

        {/* Event Source */}
        {dataSource === 'event' && (
          <div>
            <select
              value={selectedEvent}
              onChange={(e) => loadFromEvent(e.target.value)}
              className="w-full text-sm px-3 py-2.5 bg-surface border border-border rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-royal-500/30"
            >
              <option value="">Select an event...</option>
              {mockEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({initialRegistrations.filter((r) => r.eventId === ev.id).length} attendees)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* CSV Source */}
        {dataSource === 'csv' && (
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-royal-500/50 hover:bg-royal-50/30 transition-all"
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-fg-faint" />
              <p className="text-sm font-medium text-fg-muted">Click to upload CSV file</p>
              <p className="text-xs text-fg-faint mt-1">Columns: Student Name, Roll Number, Department, Achievement</p>
            </div>
            <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleCSV} />
          </div>
        )}

        {/* Paste Source */}
        {dataSource === 'paste' && (
          <div className="space-y-2">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste data — one participant per line&#10;Format: Name, Roll Number, Department, Achievement&#10;&#10;Aarav Patel, 21CS012, Computer Engineering, Participation&#10;Diya Sharma, 22EC045, Electronics, Outstanding Contribution"
              rows={5}
              className="w-full text-xs px-3 py-2.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-500/30 text-fg resize-none font-mono"
            />
            <button
              onClick={loadFromPaste}
              disabled={!pasteText.trim()}
              className="px-4 py-2 text-xs font-medium bg-royal-600 text-white rounded-xl hover:bg-royal-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Parse & Load
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      {participants.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border/70 shadow-soft overflow-hidden">
          {/* Table Header */}
          <div className="px-5 py-3 border-b border-border/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-fg font-display">
                Participants ({filtered.length})
              </h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-faint" />
                <input
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search..."
                  className="text-xs pl-8 pr-3 py-1.5 bg-surface-muted border border-border rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-royal-500/30 text-fg"
                />
              </div>
            </div>
            <button onClick={addRow} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface-muted border border-border rounded-lg hover:bg-surface-hover transition-colors text-fg-muted">
              <Plus className="h-3.5 w-3.5" /> Add Row
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-surface-muted border-b border-border/50">
                  <th className="px-4 py-2.5 text-left font-semibold text-fg-muted w-8">#</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-fg-muted">Student Name</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-fg-muted">Roll No</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-fg-muted">Department</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-fg-muted">Achievement</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-fg-muted">Cert No</th>
                  <th className="px-4 py-2.5 text-center font-semibold text-fg-muted w-10"></th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((row, idx) => (
                  <tr key={row.id} className="border-b border-border/30 hover:bg-surface-muted/50 transition-colors">
                    <td className="px-4 py-2 text-fg-faint">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                    {['studentName', 'rollNumber', 'department', 'achievementTitle'].map((field) => (
                      <td key={field} className="px-4 py-2">
                        <input
                          value={row[field]}
                          onChange={(e) => updateCell(row.id, field, e.target.value)}
                          className="w-full bg-transparent text-fg text-xs border-b border-transparent focus:border-royal-500 focus:outline-none py-0.5 transition-colors"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-2">
                      <span className="font-mono text-fg-faint text-[10px]">
                        {row.certificateNumber || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => removeRow(row.id)} className="p-1 text-fg-faint hover:text-rose-500 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-border/50 flex items-center justify-between">
              <span className="text-[10px] text-fg-faint">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg bg-surface-muted border border-border hover:bg-surface-hover disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5 text-fg-muted" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg bg-surface-muted border border-border hover:bg-surface-hover disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-fg-muted" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generate Button & Progress */}
      {participants.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border/70 p-5 shadow-soft">
          {isGenerating ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-royal-600 animate-spin" />
                <p className="text-sm font-semibold text-fg">
                  Processing {progress.current} of {progress.total}...
                </p>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-royal-500 to-royal-600 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-fg-faint">
                Generating high-resolution certificates and packaging into ZIP...
              </p>
            </div>
          ) : isComplete ? (
            <div className="flex items-center gap-3 text-emerald-600">
              <PartyPopper className="h-6 w-6" />
              <div>
                <p className="text-sm font-bold">Batch Complete! 🎉</p>
                <p className="text-xs text-fg-muted">
                  {participants.length} certificates generated and downloaded. All certificates are now verifiable.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <p className="text-xs text-fg-muted">
                  Ready to generate <strong className="text-fg">{participants.length}</strong> certificates using the active template.
                </p>
              </div>
              <button
                onClick={generateBatch}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-royal-600 to-royal-700 text-white rounded-xl hover:from-royal-700 hover:to-royal-800 transition-all shadow-md"
              >
                <Play className="h-4 w-4" /> Generate & Download ZIP
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BulkGenerator;
