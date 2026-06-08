
import { Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function seedInitialData(db: Firestore) {
  console.log('[AUDIT] Initializing Cracklix Performance Hub Sync...');

  await setDoc(doc(db, 'settings', 'stats'), {
    mcqCount: 12500,
    userCount: 15400,
    mockCount: 520,
    avgAccuracy: 94,
    updatedAt: serverTimestamp()
  }, { merge: true });

  const plans = [
    {
      id: 'monthly-pass',
      name: 'Monthly PASS',
      price: 99,
      durationDays: 30,
      description: 'Institutional access for 1 month.',
      features: ["Premium Mocks", "Subject Tests", "PYQ Archives", "State Rankings"],
      displayOrder: 1,
      type: 'PREMIUM',
      active: true,
      adFree: false
    },
    {
      id: 'quarterly-pass',
      name: 'Quarterly PASS',
      price: 249,
      durationDays: 90,
      description: 'Strategic tier for final preparation.',
      features: ["Everything in Monthly", "AI Rationale", "Priority Alerts"],
      displayOrder: 2,
      type: 'PREMIUM',
      recommended: true,
      active: true,
      adFree: true
    },
    {
      id: 'yearly-pass',
      name: 'Yearly PASS',
      price: 799,
      durationDays: 365,
      description: 'Total preparation node for 1 year.',
      features: ["Everything in Quarterly", "Mentorship", "Ad-Free CBT"],
      displayOrder: 3,
      type: 'PREMIUM',
      active: true,
      adFree: true
    }
  ];

  for (const p of plans) {
    await setDoc(doc(db, 'passes', p.id), { ...p, updatedAt: serverTimestamp() }, { merge: true });
  }

  const psssbLogo = "https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg";
  const psebLogo = "https://static.pseb.ac.in/uploads/1648628722_PSEBlogo_2.png";
  
  const boards = [
    { id: 'psssb', abbreviation: 'PSSSB', name: 'Punjab Subordinate Services Selection Board', region: 'Punjab', category: 'STATE_BOARD', iconUrl: psssbLogo },
    { id: 'punjab-police', abbreviation: 'POLICE', name: 'Punjab Police Recruitment Board', region: 'Punjab', category: 'DEFENCE_BOARD', iconUrl: "https://www.punjabpolice.gov.in/media/images/Logo_of_Punjab_Police_India.original.png" },
    { id: 'education', abbreviation: 'EDUCATION', name: 'Education Recruitment Board Punjab', region: 'Punjab', category: 'TEACHING_BOARD', iconUrl: psebLogo }
  ];

  for (const b of boards) {
    await setDoc(doc(db, 'boards', b.id), { ...b, updatedAt: serverTimestamp() }, { merge: true });
  }

  const subjects = [
    { id: 'punjab-gk', name: 'Punjab History & Culture', aliases: ['Punjab GK'] },
    { id: 'reasoning', name: 'Logical Reasoning', aliases: ['Reasoning'] },
    { id: 'quant', name: 'Quantitative Aptitude', aliases: ['Maths'] }
  ];

  for (const s of subjects) {
    await setDoc(doc(db, 'subjects', s.id), { ...s, updatedAt: serverTimestamp() }, { merge: true });
  }

  console.log('[AUDIT] Performance Nodes Synchronized.');
}
