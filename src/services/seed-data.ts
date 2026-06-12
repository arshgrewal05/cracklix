import { Firestore, doc, setDoc, serverTimestamp, collection, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Institutional Punjab-Centric Seeding Node v70.0.
 * UPDATED: Comprehensive category seeding for General and Banking nodes.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[AUDIT] Initializing Absolute Punjab Registry Sync...');
  const batch = writeBatch(db);

  // 1. STRATEGIC CATEGORIES (Matched to Student UI Mapping)
  const categories = [
    {
      id: "punjab-govt",
      title: "Punjab General Exam",
      description: "Police, PSSSB, PPSC and major state board recruitments.",
      highlight: "STATE LEVEL",
      color: "text-primary",
      bgColor: "bg-orange-50",
      iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR8W5eTBPdzztA7cziqnMmtWk9InL1yflUD_xb4vAsLw&s=10",
      displayOrder: 1
    },
    {
      id: "punjab-teaching",
      title: "Punjab Teaching Exam",
      description: "PSTET, CTET, Master Cadre, ETT & Lecturer recruitment nodes.",
      highlight: "EDUCATIONAL",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbNnoge6pNWx1HZYrUJKM58qWk1dDw85xvKPBoG-O4ew&s=10",
      displayOrder: 2
    },
    {
      id: "punjab-technical",
      title: "Punjab Technical Exam",
      description: "PSPCL, PSTCL, ALM and Technical Board recruitment nodes.",
      highlight: "POWER & TECH",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0ZK9JI5KMfg9RoNdIwcsNlpx5IcPBWuKZw&s",
      displayOrder: 3
    },
    {
      id: "banking",
      title: "Punjab Banking Corporation Exam",
      description: "State Cooperative Bank, Apex, PADB and Central Bank nodes.",
      highlight: "FINANCE",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7McWqZqOgKy-BakccvR02WQdEQFrwuvmHBG5rYJzuEg&s=10",
      displayOrder: 4
    },
    {
      id: "central-govt",
      title: "Central Govt",
      description: "SSC, Railways, Army & National exams.",
      highlight: "NATIONAL",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmRNHVIV2W9Pn_87u6EQmluADidwUQWhOotUwQUV_VWtEBWqoxjf-OBEt4&s=10",
      displayOrder: 5
    }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. HUBS (Boards)
  const boards = [
    { id: 'punjab-police', abbreviation: 'POLICE', name: 'Punjab Police Recruitment Board', categoryId: 'punjab-govt', iconUrl: 'https://www.punjabpolice.gov.in/media/images/Logo_of_Punjab_Police_India.original.png', displayOrder: 1 },
    { id: 'psssb', abbreviation: 'PSSSB', name: 'Punjab Subordinate Services Selection Board', categoryId: 'punjab-govt', iconUrl: 'https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg', displayOrder: 2 },
  ];

  for (const b of boards) {
    batch.set(doc(db, 'boards', b.id), { ...b, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. SAMPLE QUESTIONS
  const sampleQs = [
    {
      id: "seed-q-1",
      englishQuestion: "Which river is known as the 'Backbone of Punjab'?",
      punjabiQuestion: "ਪੰਜਾਬ ਦੀ ਰੀੜ੍ਹ ਦੀ ਹੱਡੀ ਕਿਸ ਦਰਿਆ ਨੂੰ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
      optionAEnglish: "Sutlej", optionAPunjabi: "ਸਤਲੁਜ",
      optionBEnglish: "Beas", optionBPunjabi: "ਬਿਆਸ",
      optionCEnglish: "Ravi", optionCPunjabi: "ਰਾਵੀ",
      optionDEnglish: "Jhelum", optionDPunjabi: "ਜੇਹਲਮ",
      correctAnswer: "A",
      subjectId: "punjab-gk",
      boardId: "psssb",
      difficulty: "Easy",
      status: "UNUSED"
    },
    {
      id: "seed-q-2",
      englishQuestion: "Who was the first Guru of the Sikhs?",
      punjabiQuestion: "ਸਿੱਖਾਂ ਦੇ ਪਹਿਲੇ ਗੁਰੂ ਕੌਣ ਸਨ?",
      optionAEnglish: "Guru Nanak Dev Ji", optionAPunjabi: "ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ",
      optionBEnglish: "Guru Angad Dev Ji", optionBPunjabi: "ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਜੀ",
      optionCEnglish: "Guru Arjan Dev Ji", optionCPunjabi: "ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ",
      optionDEnglish: "Guru Gobind Singh Ji", optionDPunjabi: "ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ",
      correctAnswer: "A",
      subjectId: "history",
      boardId: "punjab-police",
      difficulty: "Easy",
      status: "UNUSED"
    }
  ];

  for (const q of sampleQs) {
    batch.set(doc(db, 'questions', q.id), { ...q, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), usedCount: 0 }, { merge: true });
  }

  // 4. SAMPLE MOCK
  const mockId = "seed-mock-1";
  batch.set(doc(db, 'mocks', mockId), {
    id: mockId,
    title: "Punjab GK Foundation Mock",
    boardId: "psssb",
    boardIds: ["psssb"],
    examIds: ["revenue-patwari"],
    mockType: "FULL",
    accessLevel: "FREE",
    duration: 15,
    totalQuestions: 2,
    questionIds: ["seed-q-1", "seed-q-2"],
    published: true,
    languageMode: "ENGLISH_PUNJABI",
    positiveMarks: 1,
    negativeMarks: 0.25,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });

  await batch.commit();

  // 5. FINAL STATS SYNC
  await setDoc(doc(db, 'settings', 'stats'), {
     totalQuestions: 2,
     totalMocks: 1,
     totalUsers: 1,
     totalBoards: 2,
     averageAccuracy: 94,
     updatedAt: serverTimestamp()
  }, { merge: true });

  console.log('[AUDIT] Full Punjab Registry Synchronized with Baseline Content.');
}
