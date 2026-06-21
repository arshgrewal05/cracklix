import { Firestore, doc, serverTimestamp, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Canonical 7-Category Architecture Rebuild v1.0.
 * STRICT: Title Case, Nested Boards, and Fresh IDs.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[REBUILD] Initializing CRITICAL ARCHITECTURE REBUILD (7 Categories)...');
  const batch = writeBatch(db);

  // 1. CANONICAL TOP-LEVEL CATEGORIES (7 ONLY)
  const categories = [
    { 
      id: "punjab-government-exams", 
      title: "Punjab Government Exams", 
      description: "Direct recruitment exams for PPSC, PSSSB and Punjab Police cadres.", 
      displayOrder: 1,
      highlight: "STATE GOVT"
    },
    { 
      id: "punjab-teaching-exams", 
      title: "Punjab Teaching Exams", 
      description: "PSTET, ETT, Master Cadre and Teacher recruitment examinations.", 
      displayOrder: 2,
      highlight: "TEACHING"
    },
    { 
      id: "punjab-technical-exams", 
      title: "Punjab Technical Exams", 
      description: "Technical recruitment nodes for PSPCL and PSTCL corporations.", 
      displayOrder: 3,
      highlight: "TECHNICAL"
    },
    { 
      id: "banking-exams", 
      title: "Banking Exams", 
      description: "Punjab State Cooperative Bank and central banking recruitments.", 
      displayOrder: 4,
      highlight: "BANKING"
    },
    { 
      id: "medical-health-exams", 
      title: "Medical & Health Exams", 
      description: "Staff Nurse, MPHW and health recruitments under BFUHS.", 
      displayOrder: 5,
      highlight: "HEALTH"
    },
    { 
      id: "judiciary-exams", 
      title: "Judiciary Exams", 
      description: "Clerk and stenographer recruitment for Punjab Courts.", 
      displayOrder: 6,
      highlight: "JUDICIARY"
    },
    { 
      id: "central-government-exams", 
      title: "Central Government Exams", 
      description: "SSC, Railway, Banking, Defence and UPSC examinations.", 
      displayOrder: 7,
      highlight: "CENTRAL GOVT"
    }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. AUTHORITATIVE BOARDS (Nested Nodes)
  const boards = [
    // Under punjab-government-exams
    { id: 'board-ppsc', abbreviation: 'PPSC', name: 'Punjab Public Service Commission', categoryId: 'punjab-government-exams', displayOrder: 1 },
    { id: 'board-psssb', abbreviation: 'PSSSB', name: 'Punjab Subordinate Services Selection Board', categoryId: 'punjab-government-exams', displayOrder: 2 },
    { id: 'board-punjab-police', abbreviation: 'Punjab Police', name: 'Punjab Police Recruitment', categoryId: 'punjab-government-exams', displayOrder: 3 },
    
    // Under punjab-technical-exams
    { id: 'board-pspcl', abbreviation: 'PSPCL', name: 'Punjab State Power Corporation', categoryId: 'punjab-technical-exams', displayOrder: 4 },
    { id: 'board-pstcl', abbreviation: 'PSTCL', name: 'Punjab State Transmission Corporation', categoryId: 'punjab-technical-exams', displayOrder: 5 },
    
    // Under banking-exams
    { id: 'board-pscb', abbreviation: 'PSCB', name: 'Punjab State Cooperative Bank', categoryId: 'banking-exams', displayOrder: 6 },
    
    // Under medical-health-exams
    { id: 'board-bfuhs', abbreviation: 'BFUHS', name: 'Health Recruitment Hub', categoryId: 'medical-health-exams', displayOrder: 7 },
    
    // Under central-government-exams
    { id: 'board-ssc', abbreviation: 'SSC', name: 'Staff Selection Commission', categoryId: 'central-government-exams', displayOrder: 8 },
    { id: 'board-railway', abbreviation: 'Railway', name: 'Railway Recruitment Board', categoryId: 'central-government-exams', displayOrder: 9 },
    { id: 'board-banking-central', abbreviation: 'Banking', name: 'Central Banking Exams', categoryId: 'central-government-exams', displayOrder: 10 },
    { id: 'board-defence', abbreviation: 'Defence', name: 'Defence Services', categoryId: 'central-government-exams', displayOrder: 11 },
    { id: 'board-upsc', abbreviation: 'UPSC', name: 'Union Public Service Commission', categoryId: 'central-government-exams', displayOrder: 12 }
  ];

  for (const b of boards) {
    batch.set(doc(db, 'boards', b.id), { ...b, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. EXAM VERTICALS (Specific Exams)
  const examMappings = [
    { cat: 'punjab-government-exams', board: 'board-ppsc', list: ["PCS", "DSP", "Tehsildar", "Naib Tehsildar", "ETO", "BDPO", "Assistant Professor", "Junior Engineer", "Assistant Engineer"] },
    { cat: 'punjab-government-exams', board: 'board-psssb', list: ["Clerk General", "Clerk IT", "Clerk Accounts", "Patwari", "Canal Patwari", "VDO", "Excise Inspector", "Jail Warder", "Forest Guard", "Veterinary Inspector", "Draftsman", "Senior Assistant"] },
    { cat: 'punjab-government-exams', board: 'board-punjab-police', list: ["Constable", "Sub Inspector", "Intelligence Assistant"] },
    
    { cat: 'punjab-teaching-exams', board: null, list: ["PSTET Paper 1", "PSTET Paper 2", "ETT", "Master Cadre", "Lecturer Cadre", "Pre Primary Teacher"] },
    
    { cat: 'punjab-technical-exams', board: 'board-pspcl', list: ["ALM", "ASSA", "LDC", "Revenue Accountant", "Internal Auditor", "JE Electrical"] },
    { cat: 'punjab-technical-exams', board: 'board-pstcl', list: ["JE", "Technical Posts"] },
    
    { cat: 'banking-exams', board: 'board-pscb', list: ["Clerk", "Manager", "IT Officer"] },
    
    { cat: 'medical-health-exams', board: 'board-bfuhs', list: ["Staff Nurse", "Medical Officer", "Pharmacist", "Food Safety Officer", "EMO", "MPHW", "Lab Technician", "Radiographer"] },
    
    { cat: 'judiciary-exams', board: null, list: ["High Court Clerk", "High Court Stenographer", "District Court Clerk", "District Court Stenographer", "Process Server", "Peon"] },
    
    { cat: 'central-government-exams', board: 'board-ssc', list: ["SSC CGL", "SSC CHSL", "SSC GD", "SSC MTS", "SSC JE"] },
    { cat: 'central-government-exams', board: 'board-railway', list: ["RRB NTPC", "RRB Group D", "RRB JE"] },
    { cat: 'central-government-exams', board: 'board-banking-central', list: ["IBPS PO", "IBPS Clerk", "SBI PO", "SBI Clerk", "LIC AAO"] },
    { cat: 'central-government-exams', board: 'board-defence', list: ["NDA", "CDS", "AFCAT", "Agniveer"] },
    { cat: 'central-government-exams', board: 'board-upsc', list: ["Civil Services", "CAPF", "EPFO"] }
  ];

  examMappings.forEach((mapping) => {
    mapping.list.forEach((name, i) => {
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      batch.set(doc(db, 'exams', id), {
        id, name,
        boardId: mapping.board,
        categoryId: mapping.cat,
        displayOrder: i,
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
  });

  await batch.commit();
  console.log('[REBUILD] Ecosystem Rebuilt Successfully.');
}
