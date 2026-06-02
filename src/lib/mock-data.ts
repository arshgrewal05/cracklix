import { Exam, Mock, Question, CurrentAffair, Notification } from "@/types";

export const EXAMS: Exam[] = [
  // 1. PSSSB
  {
    id: "psssb-patwari",
    name: "Revenue Patwari",
    board: "PSSSB",
    description: "Revenue Patwari, Canal Patwari and Ziladar recruitment for Punjab.",
    category: "Revenue",
    thumbnail: "exam-psssb",
    totalMocks: 45,
    activeQuestions: 1200,
    totalQuestions: 120,
    duration: 120
  },
  {
    id: "psssb-clerk",
    name: "PSSSB Clerk (General/IT/Accounts)",
    board: "PSSSB",
    description: "Multi-departmental clerk recruitment exams.",
    category: "Clerical",
    thumbnail: "exam-psssb",
    totalMocks: 60,
    activeQuestions: 2500,
    totalQuestions: 120,
    duration: 120
  },
  {
    id: "psssb-excise",
    name: "Excise & Taxation Inspector",
    board: "PSSSB",
    description: "Tax collection and excise duty monitoring posts.",
    category: "Inspection",
    thumbnail: "exam-psssb",
    totalMocks: 30,
    activeQuestions: 1500,
    totalQuestions: 100,
    duration: 120
  },

  // 2. PPSC
  {
    id: "ppsc-pcs",
    name: "Punjab Civil Services (PCS)",
    board: "PPSC",
    description: "Executive, DSP, Tehsildar and Higher Class A/B services.",
    category: "Executive",
    thumbnail: "exam-ppsc",
    totalMocks: 20,
    activeQuestions: 5000,
    totalQuestions: 100,
    duration: 120
  },
  {
    id: "ppsc-naib",
    name: "Naib Tehsildar",
    board: "PPSC",
    description: "Revenue administration and judicial powers at sub-tehsil level.",
    category: "Revenue",
    thumbnail: "exam-ppsc",
    totalMocks: 25,
    activeQuestions: 1800,
    totalQuestions: 120,
    duration: 120
  },

  // 3. Punjab Police
  {
    id: "police-constable",
    name: "Punjab Police Constable",
    board: "Punjab Police",
    description: "District and Armed Cadre recruitment.",
    category: "Police",
    thumbnail: "exam-police",
    totalMocks: 50,
    activeQuestions: 3000,
    totalQuestions: 100,
    duration: 120
  },
  {
    id: "police-si",
    name: "Police Sub-Inspector",
    board: "Punjab Police",
    description: "District, Armed and Investigation SI cadre.",
    category: "Police",
    thumbnail: "exam-police",
    totalMocks: 35,
    activeQuestions: 2800,
    totalQuestions: 100,
    duration: 120
  },

  // 4. Education
  {
    id: "pstet",
    name: "PSTET (Paper 1 & 2)",
    board: "Education",
    description: "Punjab State Teacher Eligibility Test.",
    category: "Teaching",
    thumbnail: "exam-teaching",
    totalMocks: 40,
    activeQuestions: 3500,
    totalQuestions: 150,
    duration: 150
  },
  {
    id: "master-cadre",
    name: "Master Cadre (Subject-wise)",
    board: "Education",
    description: "Subject specialist teachers for high schools.",
    category: "Teaching",
    thumbnail: "exam-teaching",
    totalMocks: 30,
    activeQuestions: 4000,
    totalQuestions: 150,
    duration: 150
  },

  // 5. High Court
  {
    id: "hc-clerk",
    name: "High Court Clerk (SSSC)",
    board: "High Court",
    description: "Clerical recruitment for Subordinate Courts of Punjab.",
    category: "Judicial",
    thumbnail: "exam-hc",
    totalMocks: 25,
    activeQuestions: 1200,
    totalQuestions: 100,
    duration: 120
  },

  // 6. Power Sector
  {
    id: "pspcl-alm",
    name: "Assistant Lineman (ALM)",
    board: "Power Sector",
    description: "Technical recruitment for PSPCL.",
    category: "Technical",
    thumbnail: "exam-pspcl",
    totalMocks: 20,
    activeQuestions: 1000,
    totalQuestions: 100,
    duration: 120
  },

  // 7. Health
  {
    id: "bfuhs-staff-nurse",
    name: "Staff Nurse (BFUHS)",
    board: "Health",
    description: "Health department recruitment through Baba Farid University.",
    category: "Medical",
    thumbnail: "exam-hc",
    totalMocks: 15,
    activeQuestions: 1500,
    totalQuestions: 100,
    duration: 120
  },

  // 8. Cooperative
  {
    id: "coop-bank-clerk",
    name: "Cooperative Bank Clerk",
    board: "Cooperative",
    description: "Management and Data Entry Operator posts for Coop Banks.",
    category: "Banking",
    thumbnail: "exam-pspcl",
    totalMocks: 30,
    activeQuestions: 2000,
    totalQuestions: 100,
    duration: 120
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    topic: "Punjabi Grammar",
    question: "ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਦੀ ਲਿਪੀ ਕਿਹੜੀ ਹੈ?",
    options: ["ਦੇਵਨਾਗਰੀ", "ਗੁਰਮੁਖੀ", "ਰੋਮਨ", "ਸ਼ਾਹਮੁਖੀ"],
    correctAnswer: 1, 
    difficulty: "Easy",
    explanation: "ਗੁਰਮੁਖੀ ਲਿਪੀ ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਲਿਖਣ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।"
  },
  {
    id: "q2",
    topic: "Punjab GK",
    question: "Which city is known as the 'Steel City' of Punjab?",
    options: ["Ludhiana", "Mandi Gobindgarh", "Jalandhar", "Amritsar"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "Mandi Gobindgarh is famous for its steel industry."
  },
  {
    id: "q3",
    topic: "Reasoning",
    question: "If PUNJAB is coded as QVOKBC, how is POLICE coded?",
    options: ["QPMJDF", "QPMKDF", "QOMJDF", "QPMJDG"],
    correctAnswer: 0,
    difficulty: "Medium",
    explanation: "Each letter is shifted by one position forward."
  }
];

export const SAMPLE_MOCK: Mock = {
  id: "mock-punjab-1",
  examId: "psssb-patwari",
  title: "PSSSB Patwari Full Length Mock 01",
  durationInMinutes: 120,
  questions: MOCK_QUESTIONS,
  totalMarks: 100,
  attempts: 1250
};

export const CURRENT_AFFAIRS: CurrentAffair[] = [
  {
    id: "ca1",
    title: "Punjab Cabinet approves new Industrial Policy 2026",
    date: "Oct 24, 2026",
    category: "Policy",
    summary: "The Punjab Cabinet chaired by the CM has approved the new Industrial and Business Development Policy to boost startups."
  }
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Result Declared!",
    message: "Your score for PSSSB Mock 05 is now available.",
    time: "2 hours ago",
    isRead: false,
    type: "result"
  }
];
