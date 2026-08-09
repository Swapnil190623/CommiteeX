export const people = {
  ar_mehra: { name: 'Dr. Anjali Mehra', role: 'Faculty Mentor', avatarColor: 'royal' },
  prof_rao: { name: 'Prof. Kiran Rao', role: 'Faculty Mentor', avatarColor: 'emerald' },
  prof_nair: { name: 'Dr. Sarita Nair', role: 'Faculty Mentor', avatarColor: 'amber' },
  prof_banerjee: { name: 'Prof. Ravi Banerjee', role: 'Faculty Mentor', avatarColor: 'rose' },
  prof_iyer: { name: 'Dr. Meena Iyer', role: 'Faculty Mentor', avatarColor: 'cyan' },
};

export const committee = {
  asac: [
    { name: 'Aditya Sharma', role: 'Treasurer', avatarColor: 'royal' },
    { name: 'Priya Iyengar', role: 'Technical Head', avatarColor: 'emerald' },
    { name: 'Rohan Verma', role: 'Creative Head', avatarColor: 'amber' },
    { name: 'Sneha Kulkarni', role: 'Documentation Head', avatarColor: 'rose' },
    { name: 'Karan Patel', role: 'PR Head', avatarColor: 'cyan' },
    { name: 'Ishita Joshi', role: 'Volunteer', avatarColor: 'royal' },
    { name: 'Manav Gupta', role: 'Volunteer', avatarColor: 'emerald' },
    { name: 'Ananya Reddy', role: 'Volunteer', avatarColor: 'amber' },
  ],
  rnd: [
    { name: 'Vikram Desai', role: 'Treasurer', avatarColor: 'emerald' },
    { name: 'Nisha Pillai', role: 'Technical Head', avatarColor: 'royal' },
    { name: 'Arjun Nair', role: 'Creative Head', avatarColor: 'cyan' },
    { name: 'Meera Shetty', role: 'Documentation Head', avatarColor: 'rose' },
    { name: 'Sahil Khanna', role: 'PR Head', avatarColor: 'amber' },
    { name: 'Tara Bhat', role: 'Volunteer', avatarColor: 'royal' },
    { name: 'Yash Malhotra', role: 'Volunteer', avatarColor: 'emerald' },
  ],
  ectc: [
    { name: 'Rahul Menon', role: 'Treasurer', avatarColor: 'amber' },
    { name: 'Divya Rao', role: 'Technical Head', avatarColor: 'royal' },
    { name: 'Kabir Singh', role: 'Creative Head', avatarColor: 'emerald' },
    { name: 'Pooja Bhatt', role: 'Documentation Head', avatarColor: 'cyan' },
    { name: 'Aman Saxena', role: 'PR Head', avatarColor: 'rose' },
    { name: 'Neha Doshi', role: 'Volunteer', avatarColor: 'royal' },
    { name: 'Gaurav Pai', role: 'Volunteer', avatarColor: 'amber' },
  ],
  csi: [
    { name: 'Siddharth Jain', role: 'Treasurer', avatarColor: 'royal' },
    { name: 'Riya Kapoor', role: 'Technical Head', avatarColor: 'rose' },
    { name: 'Dev Agarwal', role: 'Creative Head', avatarColor: 'amber' },
    { name: 'Tanya Mishra', role: 'Documentation Head', avatarColor: 'emerald' },
    { name: 'Harsh Vora', role: 'PR Head', avatarColor: 'cyan' },
    { name: 'Kavya Rao', role: 'Volunteer', avatarColor: 'royal' },
    { name: 'Aryan Bose', role: 'Volunteer', avatarColor: 'emerald' },
  ],
  ieee: [
    { name: 'Neel Kulkarni', role: 'Treasurer', avatarColor: 'cyan' },
    { name: 'Zara Sheikh', role: 'Technical Head', avatarColor: 'royal' },
    { name: 'Pranav Menon', role: 'Creative Head', avatarColor: 'emerald' },
    { name: 'Ira Chandran', role: 'Documentation Head', avatarColor: 'amber' },
    { name: 'Vedanth Rao', role: 'PR Head', avatarColor: 'rose' },
    { name: 'Lena Thomas', role: 'Volunteer', avatarColor: 'royal' },
  ],
};

export const communities = [
  {
    id: 'asac',
    code: 'ASAC',
    name: 'AI & Software Association',
    tagline: 'Building intelligent systems, shipping real software.',
    description:
      'ASAC is the flagship technical community for students passionate about artificial intelligence, machine learning, and modern software engineering. We run hands-on bootcamps, ship open-source projects, and connect students with industry mentors.',
    color: 'royal',
    gradient: 'from-royal-500 to-royal-700',
    members: 248,
    facultyMentor: people.ar_mehra,
    chairperson: { name: 'Aditya Sharma', role: 'Chairperson', avatarColor: 'royal' },
    viceChairperson: { name: 'Priya Iyengar', role: 'Vice Chairperson', avatarColor: 'emerald' },
    secretary: { name: 'Rohan Verma', role: 'Secretary', avatarColor: 'amber' },
    committee: committee.asac,
    upcomingEventIds: ['ai-bootcamp', 'hackathon-2026', 'web-dev-workshop'],
    announcementIds: ['a1', 'a3'],
  },
  {
    id: 'rnd',
    code: 'R&D',
    name: 'Research & Development Cell',
    tagline: 'Where curiosity becomes published research.',
    description:
      'The R&D Cell nurtures a research culture across the department. We guide students through literature reviews, paper writing, and conference submissions, and host seminars with visiting academics and industry scientists.',
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-700',
    members: 132,
    facultyMentor: people.prof_rao,
    chairperson: { name: 'Vikram Desai', role: 'Chairperson', avatarColor: 'emerald' },
    viceChairperson: { name: 'Nisha Pillai', role: 'Vice Chairperson', avatarColor: 'royal' },
    secretary: { name: 'Arjun Nair', role: 'Secretary', avatarColor: 'cyan' },
    committee: committee.rnd,
    upcomingEventIds: ['research-seminar'],
    announcementIds: ['a4'],
  },
  {
    id: 'ectc',
    code: 'ECTC',
    name: 'Electronics & Communication Technical Cell',
    tagline: 'From signals to circuits to robotics.',
    description:
      'ECTC brings together students working on embedded systems, VLSI, communication networks, and robotics. Our labs and challenges give members real hardware experience alongside strong theoretical foundations.',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    members: 176,
    facultyMentor: people.prof_nair,
    chairperson: { name: 'Rahul Menon', role: 'Chairperson', avatarColor: 'amber' },
    viceChairperson: { name: 'Divya Rao', role: 'Vice Chairperson', avatarColor: 'royal' },
    secretary: { name: 'Kabir Singh', role: 'Secretary', avatarColor: 'emerald' },
    committee: committee.ectc,
    upcomingEventIds: ['robotics-challenge'],
    announcementIds: ['a2'],
  },
  {
    id: 'csi',
    code: 'CSI',
    name: 'Computer Society of India',
    tagline: 'The national chapter, on campus.',
    description:
      'The CSI Student Chapter connects our department to the wider Computer Society of India network. We host coding contests, tech talks, and certification drives, and represent the college at the annual CSI convention.',
    color: 'rose',
    gradient: 'from-rose-500 to-rose-700',
    members: 204,
    facultyMentor: people.prof_banerjee,
    chairperson: { name: 'Siddharth Jain', role: 'Chairperson', avatarColor: 'royal' },
    viceChairperson: { name: 'Riya Kapoor', role: 'Vice Chairperson', avatarColor: 'rose' },
    secretary: { name: 'Dev Agarwal', role: 'Secretary', avatarColor: 'amber' },
    committee: committee.csi,
    upcomingEventIds: ['hackathon-2026', 'uiux-sprint'],
    announcementIds: ['a5'],
  },
  {
    id: 'ieee',
    code: 'IEEE',
    name: 'IEEE Student Chapter',
    tagline: 'Advancing technology for humanity.',
    description:
      'The IEEE Student Chapter is our bridge to the global IEEE community. Members attend IEEE conferences, publish in IEEE journals, and participate in regional student leadership programs and competitions.',
    color: 'cyan',
    gradient: 'from-cyan-500 to-cyan-700',
    members: 158,
    facultyMentor: people.prof_iyer,
    chairperson: { name: 'Neel Kulkarni', role: 'Chairperson', avatarColor: 'cyan' },
    viceChairperson: { name: 'Zara Sheikh', role: 'Vice Chairperson', avatarColor: 'royal' },
    secretary: { name: 'Pranav Menon', role: 'Secretary', avatarColor: 'emerald' },
    committee: committee.ieee,
    upcomingEventIds: ['research-seminar', 'robotics-challenge'],
    announcementIds: ['a6'],
  },
];

export const events = [
  {
    id: 'ai-bootcamp',
    title: 'AI Bootcamp 2026',
    communityId: 'asac',
    poster: 'AI Bootcamp',
    description:
      'A five-day intensive bootcamp covering the full ML lifecycle — from data wrangling and feature engineering to model training, evaluation, and deployment. Participants build and ship a complete AI project by the final day.',
    date: '2026-08-18',
    time: '9:00 AM – 5:00 PM',
    venue: 'AI Lab, Block C — 3rd Floor',
    seatsTotal: 120,
    seatsFilled: 87,
    deadline: '2026-08-15',
    status: 'Filling Fast',
    timeline: [
      { time: '9:00 AM', title: 'Check-in & Kit Distribution', desc: 'Collect your bootcamp kit and credentials.' },
      { time: '10:00 AM', title: 'ML Fundamentals', desc: 'Supervised learning, evaluation metrics, pitfalls.' },
      { time: '1:00 PM', title: 'Lunch & Networking', desc: 'Mentor-led lunch tables by track.' },
      { time: '2:00 PM', title: 'Hands-on Lab', desc: 'Build a classifier end-to-end on real data.' },
      { time: '4:30 PM', title: 'Project Kickoff', desc: 'Teams form and scope their capstone.' },
    ],
    organizers: ['Aditya Sharma', 'Priya Iyengar'],
    tags: ['Machine Learning', 'Python', 'Deployment'],
  },
  {
    id: 'hackathon-2026',
    title: 'Hackathon 2026 — CodeForge',
    communityId: 'csi',
    poster: 'Hackathon 2026',
    description:
      '36 hours. 40 teams. One mission. CodeForge is the department flagship hackathon — build, ship, and pitch a working product to a panel of industry judges. Themes: AI for Good, Developer Tools, and Campus Tech.',
    date: '2026-09-05',
    time: '9:00 AM (36 hours)',
    venue: 'Innovation Hall, Main Block',
    seatsTotal: 200,
    seatsFilled: 156,
    deadline: '2026-09-02',
    status: 'Open',
    timeline: [
      { time: '9:00 AM', title: 'Opening Ceremony', desc: 'Themes announced, rules and judging criteria.' },
      { time: '10:00 AM', title: 'Coding Begins', desc: '36-hour build window opens.' },
      { time: 'Day 2 · 10:00 AM', title: 'Mid-Review', desc: 'Mentor checkpoints across all teams.' },
      { time: 'Day 2 · 6:00 PM', title: 'Final Submissions', desc: 'Code freeze and demo prep.' },
      { time: 'Day 2 · 8:00 PM', title: 'Judging & Awards', desc: 'Live demos, panel Q&A, prize ceremony.' },
    ],
    organizers: ['Siddharth Jain', 'Riya Kapoor'],
    tags: ['Hackathon', 'Team', 'Prizes'],
  },
  {
    id: 'web-dev-workshop',
    title: 'Web Development Workshop',
    communityId: 'asac',
    poster: 'Web Dev Workshop',
    description:
      'A two-day workshop taking you from zero to a deployed full-stack web app. Day one covers modern frontend with React and Tailwind; day two covers APIs, databases, and deployment. No prior experience required.',
    date: '2026-08-25',
    time: '10:00 AM – 4:00 PM',
    venue: 'Lab 204, Block B',
    seatsTotal: 60,
    seatsFilled: 60,
    deadline: '2026-08-22',
    status: 'Closed',
    timeline: [
      { time: '10:00 AM', title: 'Modern Frontend', desc: 'React, components, state, Tailwind.' },
      { time: '1:00 PM', title: 'Lunch Break', desc: 'Pizza and informal Q&A.' },
      { time: '2:00 PM', title: 'Backend & APIs', desc: 'REST, databases, authentication basics.' },
      { time: '3:30 PM', title: 'Deploy Live', desc: 'Ship your app to the web.' },
    ],
    organizers: ['Rohan Verma', 'Sneha Kulkarni'],
    tags: ['React', 'Full-stack', 'Beginner'],
  },
  {
    id: 'research-seminar',
    title: 'Research Paper Seminar',
    communityId: 'rnd',
    poster: 'Research Seminar',
    description:
      'A seminar on writing and publishing high-quality research papers. Covers selecting venues, structuring a paper, the peer-review process, and responding to reviewers. Features a guest talk by a visiting IEEE senior member.',
    date: '2026-08-30',
    time: '2:00 PM – 5:00 PM',
    venue: 'Seminar Hall, Block A',
    seatsTotal: 80,
    seatsFilled: 41,
    deadline: '2026-08-28',
    status: 'Open',
    timeline: [
      { time: '2:00 PM', title: 'Paper Structure 101', desc: 'Anatomy of a strong technical paper.' },
      { time: '3:00 PM', title: 'Guest Talk', desc: 'Prof. on publishing in IEEE journals.' },
      { time: '4:00 PM', title: 'Peer Review Workshop', desc: 'Mock review of a sample submission.' },
      { time: '4:45 PM', title: 'Q&A', desc: 'Open floor with the panel.' },
    ],
    organizers: ['Vikram Desai', 'Nisha Pillai'],
    tags: ['Research', 'Publishing', 'Seminar'],
  },
  {
    id: 'uiux-sprint',
    title: 'UI/UX Design Sprint',
    communityId: 'csi',
    poster: 'UI/UX Sprint',
    description:
      'A one-day design sprint where teams take a problem brief from research to high-fidelity prototype. Learn design thinking, wireframing, and Figma fundamentals. Open to all departments — no design background needed.',
    date: '2026-09-12',
    time: '9:30 AM – 6:00 PM',
    venue: 'Design Studio, Block C',
    seatsTotal: 50,
    seatsFilled: 23,
    deadline: '2026-09-10',
    status: 'Open',
    timeline: [
      { time: '9:30 AM', title: 'Design Thinking 101', desc: 'Empathy maps and problem framing.' },
      { time: '11:00 AM', title: 'Wireframing', desc: 'Low-fidelity sketches and flows.' },
      { time: '1:00 PM', title: 'Lunch', desc: 'Catered lunch with design mentors.' },
      { time: '2:00 PM', title: 'Figma Build', desc: 'High-fidelity prototyping session.' },
      { time: '5:00 PM', title: 'Showcase & Critique', desc: 'Teams present, panel gives feedback.' },
    ],
    organizers: ['Riya Kapoor', 'Dev Agarwal'],
    tags: ['Design', 'Figma', 'Sprint'],
  },
  {
    id: 'robotics-challenge',
    title: 'Robotics Challenge 2026',
    communityId: 'ectc',
    poster: 'Robotics Challenge',
    description:
      'Build an autonomous bot to navigate an obstacle course and complete pick-and-place tasks. Kits provided on the day. Teams of up to four. Top three teams receive mentorship and a slot at the inter-college robotics fest.',
    date: '2026-09-20',
    time: '8:30 AM – 7:00 PM',
    venue: 'Robotics Arena, Block D',
    seatsTotal: 40,
    seatsFilled: 31,
    deadline: '2026-09-17',
    status: 'Filling Fast',
    timeline: [
      { time: '8:30 AM', title: 'Kit Distribution', desc: 'Each team receives their bot kit.' },
      { time: '9:30 AM', title: 'Build Phase', desc: '4 hours to assemble and program.' },
      { time: '2:00 PM', title: 'Qualifier Runs', desc: 'Obstacle course time trials.' },
      { time: '5:00 PM', title: 'Finals', desc: 'Top 8 teams compete head-to-head.' },
      { time: '6:30 PM', title: 'Awards', desc: 'Prizes and inter-college slots announced.' },
    ],
    organizers: ['Rahul Menon', 'Divya Rao'],
    tags: ['Robotics', 'Embedded', 'Team'],
  },
];

export const announcements = [
  {
    id: 'a1',
    communityId: 'asac',
    title: 'AI Bootcamp registrations close in 2 days',
    body: 'Only 33 seats remaining. Registration closes August 15 at 11:59 PM. No on-spot entries will be accepted.',
    time: '2h ago',
    type: 'urgent',
  },
  {
    id: 'a2',
    communityId: 'ectc',
    title: 'Robotics Challenge venue updated',
    body: 'The arena has moved to Block D — Robotics Arena (ground floor) to accommodate the larger course this year.',
    time: '5h ago',
    type: 'info',
  },
  {
    id: 'a3',
    communityId: 'asac',
    title: 'Volunteer meeting at 5 PM today',
    body: 'All ASAC committee members and volunteers — quick sync at 5 PM in Lab 204 to finalize bootcamp logistics.',
    time: '6h ago',
    type: 'info',
  },
  {
    id: 'a4',
    communityId: 'rnd',
    title: 'Research seminar postponed to Aug 30',
    body: 'Due to the guest speaker travel schedule, the seminar moves from Aug 28 to Aug 30. Registrations remain valid.',
    time: '1d ago',
    type: 'warning',
  },
  {
    id: 'a5',
    communityId: 'csi',
    title: 'Hackathon team formation portal is live',
    body: 'Form your team (2–4 members) on the portal before Sept 1. Solo entrants will be matched into teams on the day.',
    time: '1d ago',
    type: 'success',
  },
  {
    id: 'a6',
    communityId: 'ieee',
    title: 'IEEE membership renewal window open',
    body: 'Renew your IEEE student membership by Aug 31 to remain eligible for chapter events and travel grants.',
    time: '2d ago',
    type: 'info',
  },
];

export const recentActivity = [
  { id: 'ac1', text: 'Priya Iyengar created event "AI Bootcamp 2026"', time: '2h ago', icon: 'plus' },
  { id: 'ac2', text: '156 students registered for Hackathon 2026', time: '3h ago', icon: 'users' },
  { id: 'ac3', text: 'Dr. Anjali Mehra approved the R&D seminar budget', time: '5h ago', icon: 'check' },
  { id: 'ac4', text: 'Web Dev Workshop reached full capacity', time: '8h ago', icon: 'alert' },
  { id: 'ac5', text: 'Siddharth Jain posted an announcement', time: '1d ago', icon: 'megaphone' },
  { id: 'ac6', text: 'Robotics Challenge venue updated to Block D', time: '1d ago', icon: 'map-pin' },
];

export const initialRegistrations = [
  { id: 'REG-2026-001', eventId: 'ai-bootcamp', studentName: 'Aarav Patel', rollNumber: '21CS012', department: 'Computer Engineering', year: 'TE', registrationStatus: 'Registered', attendanceStatus: 'Registered', registeredAt: '2026-08-10' },
  { id: 'REG-2026-002', eventId: 'ai-bootcamp', studentName: 'Diya Sharma', rollNumber: '22EC045', department: 'Electronics & Communication', year: 'SE', registrationStatus: 'Registered', attendanceStatus: 'Present', registeredAt: '2026-08-09' },
  { id: 'REG-2026-003', eventId: 'ai-bootcamp', studentName: 'Kabir Singh', rollNumber: '23IT078', department: 'Information Technology', year: 'FE', registrationStatus: 'Waitlisted', attendanceStatus: 'Registered', registeredAt: '2026-08-12' },
  { id: 'REG-2026-004', eventId: 'ai-bootcamp', studentName: 'Ananya Reddy', rollNumber: '21CS091', department: 'Computer Engineering', year: 'TE', registrationStatus: 'Registered', attendanceStatus: 'Registered', registeredAt: '2026-08-08' },
  { id: 'REG-2026-005', eventId: 'hackathon-2026', studentName: 'Rohan Verma', rollNumber: '20CS034', department: 'Computer Engineering', year: 'BE', registrationStatus: 'Registered', attendanceStatus: 'Registered', registeredAt: '2026-08-20' },
  { id: 'REG-2026-006', eventId: 'hackathon-2026', studentName: 'Ishita Joshi', rollNumber: '22IT067', department: 'Information Technology', year: 'SE', registrationStatus: 'Registered', attendanceStatus: 'Present', registeredAt: '2026-08-19' },
  { id: 'REG-2026-007', eventId: 'hackathon-2026', studentName: 'Manav Gupta', rollNumber: '21EC023', department: 'Electronics & Communication', year: 'TE', registrationStatus: 'Registered', attendanceStatus: 'Registered', registeredAt: '2026-08-21' },
  { id: 'REG-2026-008', eventId: 'web-dev-workshop', studentName: 'Aarav Patel', rollNumber: '21CS012', department: 'Computer Engineering', year: 'TE', registrationStatus: 'Registered', attendanceStatus: 'Present', registeredAt: '2026-08-18' },
  { id: 'REG-2026-009', eventId: 'web-dev-workshop', studentName: 'Diya Sharma', rollNumber: '22EC045', department: 'Electronics & Communication', year: 'SE', registrationStatus: 'Registered', attendanceStatus: 'Present', registeredAt: '2026-08-17' },
  { id: 'REG-2026-010', eventId: 'research-seminar', studentName: 'Vikram Desai', rollNumber: '20CS008', department: 'Computer Engineering', year: 'BE', registrationStatus: 'Registered', attendanceStatus: 'Registered', registeredAt: '2026-08-22' },
  { id: 'REG-2026-011', eventId: 'research-seminar', studentName: 'Nisha Pillai', rollNumber: '21EC019', department: 'Electronics & Communication', year: 'TE', registrationStatus: 'Registered', attendanceStatus: 'Registered', registeredAt: '2026-08-23' },
  { id: 'REG-2026-012', eventId: 'uiux-sprint', studentName: 'Riya Kapoor', rollNumber: '22IT031', department: 'Information Technology', year: 'SE', registrationStatus: 'Registered', attendanceStatus: 'Registered', registeredAt: '2026-08-25' },
  { id: 'REG-2026-013', eventId: 'robotics-challenge', studentName: 'Kabir Singh', rollNumber: '23IT078', department: 'Information Technology', year: 'FE', registrationStatus: 'Registered', attendanceStatus: 'Registered', registeredAt: '2026-08-27' },
  { id: 'REG-2026-014', eventId: 'robotics-challenge', studentName: 'Rahul Menon', rollNumber: '21EC045', department: 'Electronics & Communication', year: 'TE', registrationStatus: 'Registered', attendanceStatus: 'Present', registeredAt: '2026-08-26' },
];

export const currentUser = {
  name: 'Aarav Patel',
  rollNumber: '21CS012',
  department: 'Computer Engineering',
  year: 'TE',
  email: 'aarav.patel@college.edu',
};

export const adminStats = {
  totalUsers: 918,
  totalEvents: 6,
  totalCommunities: 5,
  totalRegistrations: 645,
  activeStudents: 812,
  facultyCount: 34,
  pendingApprovals: 3,
};

export const adminUsers = [
  { name: 'Dr. Anjali Mehra', role: 'Faculty Mentor', community: 'ASAC', status: 'Active' },
  { name: 'Aditya Sharma', role: 'Chairperson', community: 'ASAC', status: 'Active' },
  { name: 'Siddharth Jain', role: 'Chairperson', community: 'CSI', status: 'Active' },
  { name: 'Vikram Desai', role: 'Chairperson', community: 'R&D', status: 'Active' },
  { name: 'Rahul Menon', role: 'Chairperson', community: 'ECTC', status: 'Active' },
  { name: 'Neel Kulkarni', role: 'Chairperson', community: 'IEEE', status: 'Active' },
  { name: 'Karan Patel', role: 'PR Head', community: 'ASAC', status: 'Active' },
  { name: 'Pending: Student Rep', role: 'Volunteer', community: 'CSI', status: 'Pending' },
];

export function getCommunity(id) {
  return communities.find((c) => c.id === id);
}

export function getEvent(id) {
  return events.find((e) => e.id === id);
}

export function getAnnouncementsForCommunity(id) {
  return announcements.filter((a) => a.communityId === id);
}


