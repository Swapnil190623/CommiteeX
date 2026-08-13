import { create } from 'zustand';

// Generate unique certificate ID: CX-YYYY-XXXXX
function generateCertId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `CX-${year}-${rand}`;
}

// Default template configuration
const defaultTemplate = {
  preset: 'corporate', // memphis | corporate | cyberpunk | academic | swiss
  headerText: 'Certificate of Achievement',
  subHeaderText: 'This is to certify that',
  bodyText: '{{student_name}} (Roll No: {{roll_number}}) of {{department}} has successfully participated in',
  eventLine: '{{event_name}}',
  achievementLine: 'for outstanding contribution as {{achievement_title}}',
  footerText: 'Issued by the Department of Computer Engineering',
  signatories: [
    { label: 'Faculty Mentor', name: '{{faculty_mentor}}' },
    { label: 'Event Coordinator', name: '{{coordinator_name}}' },
  ],
  colors: {
    primary: '#1e3a5f',
    secondary: '#c9a84c',
    background: '#ffffff',
    text: '#1a1a2e',
  },
  fonts: {
    heading: 'Cinzel',
    body: 'Montserrat',
  },
  visibility: {
    collegeLogo: true,
    communityLogo: true,
    officialSeal: true,
    qrCode: true,
    rollNumber: true,
    department: true,
    signatures: true,
  },
  assets: {
    collegeLogo: null,
    communityLogo: null,
    officialSeal: null,
    signature1: null,
    signature2: null,
  },
};

export const useCertificateStore = create((set, get) => ({
  // State
  issuedCertificates: [],
  savedTemplates: [],
  activeTemplate: { ...defaultTemplate },
  currentData: {
    studentName: 'Aarav Patel',
    rollNumber: '21CS012',
    department: 'Computer Engineering',
    eventName: 'AI Bootcamp 2026',
    achievementTitle: 'Outstanding Participant',
    certificateNumber: 'CX-2026-88142',
    issueDate: 'August 13, 2026',
    facultyMentor: 'Dr. Anjali Mehra',
    coordinatorName: 'Aditya Sharma',
  },

  // Data actions
  setCurrentData: (updates) =>
    set((state) => ({
      currentData: { ...state.currentData, ...updates },
    })),

  // Template actions
  setActiveTemplate: (updates) =>
    set((state) => ({
      activeTemplate: { ...state.activeTemplate, ...updates },
    })),

  resetTemplate: () =>
    set({ activeTemplate: { ...defaultTemplate } }),

  setPreset: (preset) =>
    set((state) => ({
      activeTemplate: {
        ...state.activeTemplate,
        preset,
        ...getPresetColors(preset),
      },
    })),

  saveTemplate: (name) => {
    const template = { ...get().activeTemplate, name, savedAt: new Date().toISOString() };
    set((state) => ({
      savedTemplates: [...state.savedTemplates, template],
    }));
  },

  loadTemplate: (index) => {
    const templates = get().savedTemplates;
    if (templates[index]) {
      set({ activeTemplate: { ...templates[index] } });
    }
  },

  // Certificate issuance
  issueCertificateBatch: (participants, eventName, template) => {
    const now = new Date().toISOString().split('T')[0];
    const certs = participants.map((p) => ({
      id: generateCertId(),
      studentName: p.studentName || p.name || '',
      rollNumber: p.rollNumber || p.roll || '',
      department: p.department || 'Computer Engineering',
      eventName: eventName || '',
      achievementTitle: p.achievementTitle || p.achievement || 'Participation',
      facultyMentor: p.facultyMentor || template?.signatories?.[0]?.name || '',
      coordinatorName: p.coordinatorName || template?.signatories?.[1]?.name || '',
      issueDate: now,
      issuedBy: template?.footerText || 'Department of Computer Engineering',
      templatePreset: template?.preset || 'corporate',
      verified: true,
    }));

    set((state) => ({
      issuedCertificates: [...state.issuedCertificates, ...certs],
    }));

    return certs;
  },

  // Verification
  verifyCertificate: (certId) => {
    const cert = get().issuedCertificates.find(
      (c) => c.id.toLowerCase() === certId.toLowerCase()
    );
    return cert || null;
  },

  // Clear
  clearIssuedCertificates: () => set({ issuedCertificates: [] }),
}));

// Preset color schemes
function getPresetColors(preset) {
  const presets = {
    memphis: {
      colors: { primary: '#f5c518', secondary: '#1a1a2e', background: '#fffdf5', text: '#1a1a2e' },
      fonts: { heading: 'Outfit', body: 'Space Grotesk' },
    },
    corporate: {
      colors: { primary: '#1e3a5f', secondary: '#c9a84c', background: '#ffffff', text: '#1a1a2e' },
      fonts: { heading: 'Cinzel', body: 'Montserrat' },
    },
    cyberpunk: {
      colors: { primary: '#00e5ff', secondary: '#e040fb', background: '#0a0a1a', text: '#e0e0e0' },
      fonts: { heading: 'Space Grotesk', body: 'Outfit' },
    },
    academic: {
      colors: { primary: '#8b6914', secondary: '#c9a84c', background: '#fdf6e3', text: '#3e2723' },
      fonts: { heading: 'Playfair Display', body: 'Montserrat' },
    },
    swiss: {
      colors: { primary: '#1a1a2e', secondary: '#e63946', background: '#ffffff', text: '#1a1a2e' },
      fonts: { heading: 'Outfit', body: 'Montserrat' },
    },
  };
  return presets[preset] || presets.corporate;
}

export { defaultTemplate, getPresetColors };
