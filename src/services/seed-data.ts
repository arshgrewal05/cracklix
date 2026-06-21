import { Firestore, doc, serverTimestamp, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Massive Hierarchical Registry Seeder v20.0.
 * REBUILT: Strict 6-Category Hierarchy (Category -> Board -> Exam).
 * ENFORCED: Title Case and "View Exams" Terminology.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[REBUILD] Initializing Synchronized Hierarchical Architecture...');
  const batch = writeBatch(db);

  // 1. THE 6 CANONICAL CATEGORIES
  const categories = [
    { id: "punjab-government-exams", title: "Punjab Government Exams", description: "State recruitments through PPSC, PSSSB, Punjab Police and Courts.", displayOrder: 1 },
    { id: "punjab-teaching-exams", title: "Punjab Teaching Exams", description: "Teacher recruitments through PSTET, Master Cadre and ETT.", displayOrder: 2 },
    { id: "punjab-technical-exams", title: "Punjab Technical Exams", description: "Technical posts in PSPCL, PSTCL and Health (BFUHS).", displayOrder: 3 },
    { id: "banking-exams", title: "Banking Exams", description: "Recruitments for Punjab Cooperative and Central Banks.", displayOrder: 4 },
    { id: "judiciary-exams", title: "Judiciary Exams", description: "Staff and clerk recruitments for High Court and District Courts.", displayOrder: 5 },
    { id: "central-government-exams", title: "Central Government Exams", description: "National recruitments through SSC, Railway, UPSC and Defence.", displayOrder: 6 }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. AUTHORITY BOARDS (Nesting Nodes)
  const boards = [
    // Punjab Govt Category
    { id: "ppsc", abbreviation: "PPSC", name: "Punjab Public Service Commission", categoryId: "punjab-government-exams", displayOrder: 1 },
    { id: "psssb", abbreviation: "PSSSB", name: "Punjab Subordinate Services Selection Board", categoryId: "punjab-government-exams", displayOrder: 2 },
    { id: "punjab-police", abbreviation: "Punjab Police", name: "State Police Recruitment", categoryId: "punjab-government-exams", displayOrder: 3 },

    // Technical Category
    { id: "pspcl", abbreviation: "PSPCL", name: "Punjab State Power Corporation Ltd", categoryId: "punjab-technical-exams", displayOrder: 1 },
    { id: "pstcl", abbreviation: "PSTCL", name: "Punjab State Transmission Corporation Ltd", categoryId: "punjab-technical-exams", displayOrder: 2 },
    { id: "bfuhs", abbreviation: "BFUHS", name: "Medical and Health Recruitment", categoryId: "punjab-technical-exams", displayOrder: 3 }
  ];

  for (const board of boards) {
    batch.set(doc(db, 'boards', board.id), { ...board, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. EXAM VERTICAL REGISTRY
  const examMap: Record<string, { boardId?: string, categoryId: string, names: string[] }> = {
    "ppsc": {
      categoryId: "punjab-government-exams",
      names: ["PCS", "Naib Tehsildar", "Tehsildar", "DSP", "ETO", "BDPO", "Assistant Professor", "JE Civil", "JE Mechanical", "JE Electrical", "Other PPSC Exams"]
    },
    "psssb": {
      categoryId: "punjab-government-exams",
      names: ["Clerk", "Clerk IT", "Clerk Accounts", "CCDEO", "Patwari", "Canal Patwari", "VDO", "Excise Inspector", "Jail Warder", "Forest Guard", "Veterinary Inspector", "Other PSSSB Exams"]
    },
    "punjab-police": {
      categoryId: "punjab-government-exams",
      names: ["Constable", "Sub Inspector", "Intelligence Assistant", "Technical Cadre"]
    },
    "punjab-teaching-exams": {
      categoryId: "punjab-teaching-exams",
      names: ["PSTET Paper 1", "PSTET Paper 2", "Master Cadre", "Lecturer Cadre", "ETT", "Pre Primary Teacher", "CTET"]
    },
    "pspcl": {
      categoryId: "punjab-technical-exams",
      names: ["ALM", "ASSA", "LDC", "Revenue Accountant", "JE Electrical"]
    },
    "pstcl": {
      categoryId: "punjab-technical-exams",
      names: ["JE Electrical", "Clerk", "Technical Posts"]
    },
    "bfuhs": {
      categoryId: "punjab-technical-exams",
      names: ["Staff Nurse", "Pharmacist", "Medical Officer", "Food Safety Officer", "Lab Technician", "Radiographer"]
    },
    "banking-exams": {
      categoryId: "banking-exams",
      names: ["PSCB Clerk", "PSCB Manager", "IT Officer", "Steno Typist", "DCCB Recruitment"]
    },
    "judiciary-exams": {
      categoryId: "judiciary-exams",
      names: ["High Court Clerk", "High Court Stenographer", "District Court Clerk", "Process Server", "Peon", "Other Court Posts"]
    },
    "central-government-exams": {
      categoryId: "central-government-exams",
      names: ["SSC CGL", "SSC CHSL", "SSC MTS", "SSC GD", "SSC JE", "RRB NTPC", "RRB Group D", "RRB JE", "IBPS Clerk", "IBPS PO", "SBI Clerk", "SBI PO", "NDA", "CDS", "AFCAT", "CAPF", "CRPF", "BSF", "CISF", "Indian Army"]
    }
  };

  Object.entries(examMap).forEach(([idOrBoard, data]) => {
    data.names.forEach((name, i) => {
      const examId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      batch.set(doc(db, 'exams', examId), {
        id: examId, 
        name,
        boardId: boards.find(b => b.id === idOrBoard) ? idOrBoard : null,
        categoryId: data.categoryId,
        displayOrder: i,
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
  });

  await batch.commit();
  console.log('[REBUILD] Total Architecture Synchronised Successfully.');
}
