import { Firestore, doc, setDoc, serverTimestamp, collection, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Institutional Punjab-Centric Seeding Node v80.0 (Free Pass Hardened).
 * UPDATED: Explicitly seeded a FOUNDATIONAL FREE PASS node for trial visibility.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[AUDIT] Initializing Absolute Punjab Registry Sync...');
  const batch = writeBatch(db);

  // 1. STRATEGIC CATEGORIES
  const categories = [
    {
      id: "punjab-govt",
      title: "Punjab General Exams",
      description: "Police, PSSSB, PPSC and major state board recruitments.",
      highlight: "STATE LEVEL",
      color: "text-primary",
      bgColor: "bg-orange-50",
      iconUrl: "https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg",
      displayOrder: 1
    },
    {
      id: "punjab-teaching",
      title: "Punjab Teaching Exams",
      description: "PSTET, CTET, Master Cadre, ETT and lecturer recruitment nodes.",
      highlight: "EDUCATIONAL",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbNnoge6pNWx1HZYrUJKM58qWk1dDw85xvKPBoG-O4ew&s=10",
      displayOrder: 2
    },
    {
      id: "punjab-technical",
      title: "Punjab Technical Exams",
      description: "PSPCL, PSTCL, ALM and Technical Board recruitment nodes.",
      highlight: "POWER & TECH",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0ZK9JI5KMfg9RoNdIwcsNlpx5IcPBWuKZw&s",
      displayOrder: 3
    },
    {
      id: "banking",
      title: "Punjab Banking Exams",
      description: "State Cooperative Bank, Apex, PADB and Central Bank nodes.",
      highlight: "FINANCE",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7McWqZqOgKy-BakccvR02WQdEQFrwuvmHBG5rYJzuEg&s=10",
      displayOrder: 4
    }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. BOARDS SILO
  const boards = [
    { 
      id: 'psssb', 
      abbreviation: 'PSSSB', 
      name: 'Punjab Subordinate Services Selection Board', 
      categoryId: 'punjab-govt', 
      displayOrder: 1, 
      iconUrl: "https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg" 
    },
    { 
      id: 'ppsc', 
      abbreviation: 'PPSC', 
      name: 'Punjab Public Service Commission', 
      categoryId: 'punjab-govt', 
      displayOrder: 2, 
      iconUrl: "https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg" 
    },
    { 
      id: 'punjab-police', 
      abbreviation: 'POLICE', 
      name: 'Punjab Police Recruitment Board', 
      categoryId: 'punjab-govt', 
      displayOrder: 3, 
      iconUrl: 'https://www.punjabpolice.gov.in/media/images/Logo_of_Punjab_Police_India.original.png' 
    },
    { 
      id: 'pspcl', 
      abbreviation: 'PSPCL', 
      name: 'Punjab State Power Corporation Limited', 
      categoryId: 'punjab-technical', 
      displayOrder: 4, 
      iconUrl: 'https://www.pspcl.in/images/logo.png' 
    }
  ];

  for (const b of boards) {
    batch.set(doc(db, 'boards', b.id), { ...b, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. SEEDING INITIAL VERTICALS
  const examNames = [
    "PSSSB Clerk", "PSSSB Clerk IT", "PSSSB Clerk Accounts", "Revenue Patwari", "Excise Inspector", "Senior Assistant", "Junior Draftsman",
    "Police Constable", "Police Sub-Inspector", "Police Head Constable", "Police Intelligence", "PSTET Paper 1", "PSTET Paper 2", "Master Cadre Punjabi",
    "Master Cadre SST", "Master Cadre Maths", "ETT Recruitment", "PSPCL ALM", "PSPCL JE", "PSPCL LDC", "Cooperative Bank Clerk", "Cooperative Bank Manager"
  ];

  examNames.forEach((name, i) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    batch.set(doc(db, 'exams', id), {
      id, name,
      boardId: i < 7 ? 'psssb' : i < 11 ? 'punjab-police' : i < 17 ? 'ppsc' : i < 20 ? 'pspcl' : 'banking',
      categoryId: i < 11 ? 'punjab-govt' : i < 17 ? 'punjab-teaching' : i < 20 ? 'punjab-technical' : 'banking',
      displayOrder: i + 1,
      isTrending: i < 5,
      updatedAt: serverTimestamp()
    }, { merge: true });
  });

  // 4. PASS PLANS (Restored Free Pass Visibility)
  const passes = [
    { id: 'free-pass', name: 'Free Elite Trial', price: 0, durationDays: 7, features: ['Unlimited Trial Mocks', 'Bilingual Support', 'Performance Audit', 'Basic Notes'], active: true, displayOrder: 0, type: 'FREE' },
    { id: 'monthly-pass', name: 'Monthly Elite', price: 299, durationDays: 30, features: ['Unlimited Full Mocks', 'AI Logic Solutions', 'PDF Study Notes', 'Ad-Free Hub'], active: true, displayOrder: 1, type: 'PREMIUM' },
    { id: 'quarterly-pass', name: 'Quarterly Elite', price: 799, durationDays: 90, features: ['Everything in Monthly', 'PYQ Mega Archive', 'Priority Updates', 'Extended Validity'], active: true, displayOrder: 2, type: 'PREMIUM' },
    { id: 'yearly-pass', name: 'Yearly Elite', price: 1999, durationDays: 365, features: ['Maximum Savings', 'Full Year Access', 'Selection Batch Entry', 'Founder Mentorship'], active: true, displayOrder: 3, type: 'PREMIUM' }
  ];

  for (const p of passes) {
    batch.set(doc(db, 'passes', p.id), { ...p, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 5. GLOBAL SETTINGS
  batch.set(doc(db, 'settings', 'global'), {
    platformName: "Cracklix",
    announcement: "🔥 Official Punjab Latest Pattern Recruitment Calendar Live.",
    showAnnouncement: true,
    trustBadgeCount: 0,
    trustBadgeText: "Aspirants Trusting Cracklix for Punjab Exams",
    upiId: "arshdeepgrewal1122-1@oksbi",
    updatedAt: serverTimestamp()
  }, { merge: true });

  await batch.commit();

  console.log('[AUDIT] Initial Registry Synchronized. Please use Admin Hub to sync live counts.');
}
