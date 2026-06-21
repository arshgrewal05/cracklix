import { Firestore, doc, serverTimestamp, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Strict 7-Category Canonical Registry Seeder v8.0.
 * WIPES legacy data and establishes a clean Category -> Board -> Exam hierarchy.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[REBUILD] Initializing STRATEGIC 7-CATEGORY ARCHITECTURE...');
  const batch = writeBatch(db);

  // 1. THE 7 AUTHORIZED CATEGORIES ONLY
  const categories = [
    { 
      id: "punjab-government-exams", 
      title: "Punjab Government Exams", 
      description: "Recruitment for PSSSB, Punjab Police, PPSC and State Departments.", 
      displayOrder: 1 
    },
    { 
      id: "punjab-teaching-exams", 
      title: "Punjab Teaching Exams", 
      description: "PSTET, Master Cadre, ETT, Lecturer and Education recruitments.", 
      displayOrder: 2 
    },
    { 
      id: "punjab-technical-exams", 
      title: "Punjab Technical Exams", 
      description: "Power sector recruitment for PSPCL, PSTCL and Technical wings.", 
      displayOrder: 3 
    },
    { 
      id: "banking-exams", 
      title: "Banking Exams", 
      description: "Punjab State Cooperative Bank, IBPS, SBI and Regional Rural Banks.", 
      displayOrder: 4 
    },
    { 
      id: "medical-health-exams", 
      title: "Medical & Health Exams", 
      description: "Medical recruitment for BFUHS and State Health Department.", 
      displayOrder: 5 
    },
    { 
      id: "judiciary-exams", 
      title: "Judiciary Exams", 
      description: "Punjab & Haryana High Court and District Court recruitments.", 
      displayOrder: 6 
    },
    { 
      id: "central-government-exams", 
      title: "Central Government Exams", 
      description: "National recruitments for SSC, Railway, UPSC and Defence.", 
      displayOrder: 7 
    }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. BOARDS / DEPARTMENTS (Authority Nodes)
  const boards = [
    // Punjab Government Exams
    { id: "ppsc", abbreviation: "PPSC", name: "Punjab Public Service Commission", categoryId: "punjab-government-exams", displayOrder: 1 },
    { id: "psssb", abbreviation: "PSSSB", name: "Punjab Subordinate Services Selection Board", categoryId: "punjab-government-exams", displayOrder: 2 },
    { id: "punjab-police", abbreviation: "Punjab Police", name: "Punjab Police Recruitment Board", categoryId: "punjab-government-exams", displayOrder: 3 },
    
    // Teaching
    { id: "education-board", abbreviation: "ERB", name: "Education Recruitment Board", categoryId: "punjab-teaching-exams", displayOrder: 1 },

    // Technical
    { id: "pspcl", abbreviation: "PSPCL", name: "Punjab State Power Corporation Ltd", categoryId: "punjab-technical-exams", displayOrder: 1 },
    { id: "pstcl", abbreviation: "PSTCL", name: "Punjab State Transmission Corporation Ltd", categoryId: "punjab-technical-exams", displayOrder: 2 },

    // Banking
    { id: "pscb", abbreviation: "PSCB", name: "Punjab State Cooperative Bank", categoryId: "banking-exams", displayOrder: 1 },
    { id: "ibps", abbreviation: "IBPS", name: "Institute of Banking Personnel Selection", categoryId: "banking-exams", displayOrder: 2 },

    // Health
    { id: "bfuhs", abbreviation: "BFUHS", name: "Baba Farid University of Health Sciences", categoryId: "medical-health-exams", displayOrder: 1 },

    // Judiciary
    { id: "punjab-courts", abbreviation: "Punjab Courts", name: "Punjab & Haryana High Court", categoryId: "judiciary-exams", displayOrder: 1 },

    // Central
    { id: "ssc", abbreviation: "SSC", name: "Staff Selection Commission", categoryId: "central-government-exams", displayOrder: 1 },
    { id: "railway", abbreviation: "Railway", name: "RRB Recruitment Hub", categoryId: "central-government-exams", displayOrder: 2 },
    { id: "defence", abbreviation: "Defence", name: "Army, Navy & Airforce", categoryId: "central-government-exams", displayOrder: 3 },
    { id: "upsc", abbreviation: "UPSC", name: "Union Public Service Commission", categoryId: "central-government-exams", displayOrder: 4 }
  ];

  for (const board of boards) {
    batch.set(doc(db, 'boards', board.id), { ...board, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. EXAM VERTICALS (Nested Hierarchy)
  const examMappings = [
    // PPSC
    { board: 'ppsc', cat: 'punjab-government-exams', list: ["PCS", "DSP", "Tehsildar", "Naib Tehsildar", "Excise & Taxation Officer", "BDPO", "Assistant Professor", "Veterinary Officer", "Assistant Engineer", "Junior Engineer"] },
    // PSSSB
    { board: 'psssb', cat: 'punjab-government-exams', list: ["Clerk", "Clerk IT", "Clerk Accounts", "Steno Typist", "Patwari", "Canal Patwari", "VDO / Gram Sevak", "Excise Inspector", "Jail Warder", "Forest Guard", "Junior Draftsman", "Veterinary Inspector"] },
    // Police
    { board: 'punjab-police', cat: 'punjab-government-exams', list: ["Constable", "Sub Inspector (SI)", "Intelligence Assistant", "Technical Cadre", "Investigation Cadre"] },
    // Teaching
    { board: 'education-board', cat: 'punjab-teaching-exams', list: ["PSTET Paper 1", "PSTET Paper 2", "ETT", "Master Cadre", "Lecturer Cadre", "Pre Primary Teacher", "CTET"] },
    // Technical
    { board: 'pspcl', cat: 'punjab-technical-exams', list: ["Assistant Lineman (ALM)", "ASSA", "LDC", "Revenue Accountant", "Internal Auditor", "JE Electrical", "JE Civil"] },
    // Banking
    { board: 'pscb', cat: 'banking-exams', list: ["Cooperative Bank Clerk", "Manager", "IT Officer", "Steno Typist"] },
    // Health
    { board: 'bfuhs', cat: 'medical-health-exams', list: ["Staff Nurse", "Pharmacist", "Medical Officer", "Food Safety Officer", "Emergency Medical Officer", "ANM", "MPHW", "Lab Technician", "Radiographer"] },
    // Courts
    { board: 'punjab-courts', cat: 'judiciary-exams', list: ["High Court Clerk", "High Court Stenographer", "District Court Clerk", "Process Server", "Peon"] },
    // Central
    { board: 'ssc', cat: 'central-government-exams', list: ["SSC CGL", "SSC CHSL", "SSC MTS", "SSC GD", "SSC CPO"] },
    { board: 'railway', cat: 'central-government-exams', list: ["RRB NTPC", "RRB Group D", "RRB ALP", "RRB JE"] },
    { board: 'upsc', cat: 'central-government-exams', list: ["Civil Services", "CAPF", "EPFO"] }
  ];

  examMappings.forEach((mapping) => {
    mapping.list.forEach((name, i) => {
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      batch.set(doc(db, 'exams', id), {
        id, 
        name,
        categoryId: mapping.cat,
        boardId: mapping.board,
        displayOrder: i,
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
  });

  await batch.commit();
  console.log('[REBUILD] Total Hierarchical Architecture Deployed.');
}
