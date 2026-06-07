import { Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @fileOverview Institutional Seeding Engine v41.0.
 * Features: Expanded PSSSB Vertical Registry (Clerk, VDO, JE, Senior Assistant).
 * ReferrerPolicy Hardening is applied at the rendering layer.
 */
export async function seedInitialData(db: Firestore) {
  console.log('[AUDIT] Initializing Cracklix Global Registry Sync...');

  // High-Fidelity Official Assets
  const psssbSvg = "https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg";
  const ppscJpg = "https://upload.wikimedia.org/wikipedia/en/a/a1/Punjab_Public_Service_Commission.jpg";
  const policeEmblem = "https://www.punjabpolice.gov.in/media/images/Logo_of_Punjab_Police_India.original.png";
  const ssscLogo = "https://highcourtchd.gov.in/images/logo.png";
  const pspclLogo = "https://pspcl.in/assets/images/logo.png";
  const anganwadiLogo = "https://sswcd.punjab.gov.in/sites/default/files/download.png";
  const armyEmblem = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Indian_Army_Insignia_circular.png/1280px-Indian_Army_Insignia_circular.png";
  const punjabEmblem = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Emblem_of_Punjab.svg/512px-Emblem_of_Punjab.svg.png";

  // 1. BOARDS REGISTRY
  const boards = [
    { id: 'psssb', abbreviation: 'PSSSB', name: 'Punjab Subordinate Services Selection Board', region: 'Punjab', category: 'STATE_BOARD', iconUrl: psssbSvg },
    { id: 'ppsc', abbreviation: 'PPSC', name: 'Punjab Public Service Commission', region: 'Punjab', category: 'GAZETTED_BOARD', iconUrl: ppscJpg },
    { id: 'punjab-police', abbreviation: 'POLICE', name: 'Punjab Police Recruitment Board', region: 'Punjab', category: 'DEFENCE_BOARD', iconUrl: policeEmblem },
    { id: 'high-court', abbreviation: 'SSSC', name: 'High Court of Punjab & Haryana (SSSC)', region: 'Punjab/Haryana', category: 'JUDICIAL_BOARD', iconUrl: ssscLogo },
    { id: 'sswcd', abbreviation: 'SSWCD', name: 'Social Security and Women & Child Development', region: 'Punjab', category: 'STATE_BOARD', iconUrl: anganwadiLogo },
    { id: 'pspcl', abbreviation: 'PSPCL', name: 'Punjab State Power Corporation Ltd', region: 'Punjab', category: 'TECHNICAL_BOARD', iconUrl: pspclLogo },
    { id: 'army', abbreviation: 'ARMY', name: 'Indian Army Recruitment', region: 'National', category: 'CENTRAL_BOARD', iconUrl: armyEmblem },
    { id: 'education', abbreviation: 'EDUCATION', name: 'Education Recruitment Board Punjab', region: 'Punjab', category: 'TEACHING_BOARD', iconUrl: punjabEmblem }
  ];

  for (const b of boards) {
    await setDoc(doc(db, 'boards', b.id), { ...b, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. CANONICAL EXAM MASTER HUBS (Expanded PSSSB sequence)
  const exams = [
    { id: 'psssb-clerk-gen', boardId: 'psssb', name: 'PSSSB Clerk (General/IT/Accounts)', category: 'STATE', description: 'Clerical recruitment for multi-departmental Punjab govt posts.', totalFullMocks: 60, iconUrl: psssbSvg },
    { id: 'psssb-vdo', boardId: 'psssb', name: 'VDO / Gram Sevak', category: 'STATE', description: 'Village Development Officer recruitment series.', totalFullMocks: 30, iconUrl: psssbSvg },
    { id: 'punjab-patwari', boardId: 'psssb', name: 'Revenue Patwari 2026', category: 'STATE', description: 'Prepare for Revenue Patwari, Canal Patwari and Ziladar recruitment.', totalFullMocks: 45, iconUrl: psssbSvg },
    { id: 'psssb-senior-asst-insp', boardId: 'psssb', name: 'Senior Assistant cum Inspector', category: 'STATE', description: 'Official mock series for Senior Assistant level posts.', totalFullMocks: 25, iconUrl: psssbSvg },
    { id: 'psssb-senior-asst', boardId: 'psssb', name: 'Senior Assistant', category: 'STATE', description: 'Mastery hub for Senior Assistant recruitment.', totalFullMocks: 20, iconUrl: psssbSvg },
    { id: 'psssb-je', boardId: 'psssb', name: 'PSSSB Junior Engineer (JE)', category: 'STATE', description: 'Technical JE recruitment series.', totalFullMocks: 25, iconUrl: psssbSvg },
    { id: 'psssb-steno', boardId: 'psssb', name: 'Steno-Typist / Junior Scale Stenographer', category: 'STATE', description: 'Shorthand and Typing recruitment hub.', totalFullMocks: 15, iconUrl: psssbSvg },
    { id: 'psssb-group-d', boardId: 'psssb', name: 'PSSSB Group D (Sewadar/Chowkidar)', category: 'STATE', description: 'Class IV recruitment preparation matrix.', totalFullMocks: 10, iconUrl: psssbSvg },
    { id: 'psssb-technical', boardId: 'psssb', name: 'Technical / Field Posts (Librarian/Storekeeper)', category: 'STATE', description: 'Specialized field post recruitment series.', totalFullMocks: 12, iconUrl: psssbSvg },
    { id: 'psssb-excise', boardId: 'psssb', name: 'Excise & Taxation Inspector', category: 'STATE', description: 'Official mock series for PSSSB Excise Inspector recruitment.', totalFullMocks: 25, iconUrl: psssbSvg },
    
    { id: 'police-si', boardId: 'punjab-police', name: 'Sub-Inspector (Dist/Armed)', category: 'POLICE', description: 'District and Armed Cadre recruitment for Punjab Police.', totalFullMocks: 30, iconUrl: policeEmblem },
    { id: 'police-constable', boardId: 'punjab-police', name: 'Constable Recruitment', category: 'POLICE', description: 'Direct recruitment for Constable posts in Punjab Police.', totalFullMocks: 50, iconUrl: policeEmblem },
    { id: 'ppsc-pcs', boardId: 'ppsc', name: 'PCS Executive Prelims', category: 'CIVIL', description: 'Higher Class A & B services including DSP and Tehsildar posts.', totalFullMocks: 20, iconUrl: ppscJpg },
    { id: 'master-cadre', boardId: 'education', name: 'Master Cadre', category: 'TEACHING', description: 'Subject-wise teacher recruitment for Punjab Government Schools.', totalFullMocks: 40, iconUrl: punjabEmblem }
  ];

  for (const e of exams) {
    await setDoc(doc(db, 'exams', e.id), { ...e, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. SUBJECT REGISTRY
  const subjects = [
    { id: 'punjab-gk', name: 'Punjab History & Culture', aliases: ['Punjab GK', 'Virasat'] },
    { id: 'reasoning', name: 'Logical Reasoning & Mental Ability', aliases: ['Reasoning', 'Mental Ability'] },
    { id: 'quant', name: 'Quantitative Aptitude', aliases: ['Maths', 'Aptitude'] },
    { id: 'punjabi-a', name: 'Punjabi (Qualifying - Part A)', aliases: ['Punjabi A', 'Gurmukhi'] },
    { id: 'punjabi-b', name: 'Punjabi (Part B)', aliases: ['Punjabi Grammer'] },
    { id: 'english', name: 'English Language', aliases: ['General English'] },
    { id: 'ict', name: 'Information Technology (ICT)', aliases: ['Computers', 'Digital Literacy'] },
    { id: 'gk-ca', name: 'General Knowledge & Current Affairs', aliases: ['GK', 'Daily Analysis'] }
  ];

  for (const s of subjects) {
    await setDoc(doc(db, 'subjects', s.id), { ...s, updatedAt: serverTimestamp() }, { merge: true });
  }

  console.log('[AUDIT] Institutional Registry Sync Complete.');
}
