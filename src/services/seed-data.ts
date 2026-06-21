import { Firestore, doc, serverTimestamp, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Massive Hierarchical Registry Seeder v30.0.
 * REBUILT: Category → Board → Exam Hierarchy.
 * ENFORCED: Title Case and "View Exams" Terminology.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[REBUILD] Initializing Synchronized Hierarchical Architecture...');
  const batch = writeBatch(db);

  // 1. THE 6 CANONICAL CATEGORIES
  const categories = [
    { id: "punjab-govt", title: "Punjab Government Exams", description: "Government jobs through PPSC, PSSSB, Punjab Police and Punjab Courts.", displayOrder: 1 },
    { id: "punjab-teaching", title: "Punjab Teaching Exams", description: "Teacher recruitments for Master Cadre, ETT, PSTET and more.", displayOrder: 2 },
    { id: "punjab-technical", title: "Punjab Technical Exams", description: "Technical posts in PSPCL, PSTCL and Engineering departments.", displayOrder: 3 },
    { id: "punjab-banking", title: "Punjab Banking Exams", description: "Recruitments for PSCB and Cooperative Banks.", displayOrder: 4 },
    { id: "punjab-health", title: "Punjab Health Exams", description: "Medical and nursing posts under BFUHS and Health Dept.", displayOrder: 5 },
    { id: "central-govt", title: "Central Government Exams", description: "National level recruitments through SSC, Railway, Banking and UPSC.", displayOrder: 6 }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. AUTHORITY BOARDS (Nesting Nodes)
  const boards = [
    // Punjab Govt Category
    { id: "ppsc", abbreviation: "PPSC", name: "Punjab Public Service Commission", categoryId: "punjab-govt", displayOrder: 1 },
    { id: "psssb", abbreviation: "PSSSB", name: "Punjab Subordinate Services Selection Board", categoryId: "punjab-govt", displayOrder: 2 },
    { id: "punjab-police", abbreviation: "Punjab Police", name: "State Police Recruitment", categoryId: "punjab-govt", displayOrder: 3 },
    { id: "punjab-courts", abbreviation: "Punjab Courts", name: "High Court & District Courts", categoryId: "punjab-govt", displayOrder: 4 },

    // Teaching Category
    { id: "erb", abbreviation: "Education Recruitment Board", name: "ERB Punjab", categoryId: "punjab-teaching", displayOrder: 1 },
    { id: "pstet", abbreviation: "PSTET", name: "Punjab State Teacher Eligibility Test", categoryId: "punjab-teaching", displayOrder: 2 },
    { id: "ctet", abbreviation: "CTET", name: "Central Teacher Eligibility Test", categoryId: "punjab-teaching", displayOrder: 3 },

    // Technical Category
    { id: "pspcl", abbreviation: "PSPCL", name: "Punjab State Power Corporation Ltd", categoryId: "punjab-technical", displayOrder: 1 },
    { id: "pstcl", abbreviation: "PSTCL", name: "Punjab State Transmission Corporation Ltd", categoryId: "punjab-technical", displayOrder: 2 },
    { id: "engineering-rec", abbreviation: "Engineering Recruitments", name: "PWD, Water Supply & Irrigation", categoryId: "punjab-technical", displayOrder: 3 },

    // Banking Category
    { id: "pscb", abbreviation: "PSCB", name: "Punjab State Cooperative Bank", categoryId: "punjab-banking", displayOrder: 1 },
    { id: "coop-banks", abbreviation: "Cooperative Banks", name: "DCCB & Field Offices", categoryId: "punjab-banking", displayOrder: 2 },

    // Health Category
    { id: "bfuhs", abbreviation: "BFUHS", name: "Baba Farid University of Health Sciences", categoryId: "punjab-health", displayOrder: 1 },

    // Central Govt Category
    { id: "ssc", abbreviation: "SSC", name: "Staff Selection Commission", categoryId: "central-govt", displayOrder: 1 },
    { id: "railway", abbreviation: "Railway", name: "Railway Recruitment Board", categoryId: "central-govt", displayOrder: 2 },
    { id: "central-banking", abbreviation: "Banking", name: "SBI, IBPS & RBI Hub", categoryId: "central-govt", displayOrder: 3 },
    { id: "defence", abbreviation: "Defence", name: "Army, Navy & Air Force", categoryId: "central-govt", displayOrder: 4 },
    { id: "upsc", abbreviation: "UPSC", name: "Union Public Service Commission", categoryId: "central-govt", displayOrder: 5 }
  ];

  for (const board of boards) {
    batch.set(doc(db, 'boards', board.id), { ...board, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. EXAM VERTICAL REGISTRY (Category → Board → Exam)
  const examMap: Record<string, { categoryId: string, names: string[] }> = {
    "ppsc": {
      categoryId: "punjab-govt",
      names: ["PCS", "DSP", "Tehsildar", "Naib Tehsildar", "Excise & Taxation Officer", "Food Supply Officer", "BDPO", "Assistant Registrar", "Assistant Professor", "Veterinary Officer", "Junior Engineer", "Assistant Engineer", "Senior Assistant"]
    },
    "psssb": {
      categoryId: "punjab-govt",
      names: ["Clerk", "Clerk IT", "Clerk Accounts", "CCDEO", "Steno Typist", "Junior Scale Stenographer", "Patwari", "Canal Patwari", "Gram Sevak / VDO", "Excise Inspector", "Jail Warder", "Matron", "Veterinary Inspector", "Forest Guard", "Forester", "Junior Draftsman", "Horticulture Supervisor", "Laboratory Assistant", "Dairy Inspector", "Senior Assistant"]
    },
    "punjab-police": {
      categoryId: "punjab-govt",
      names: ["Constable", "Sub Inspector", "Intelligence Assistant", "Constable Technical Support", "Cyber Crime Technical Staff"]
    },
    "punjab-courts": {
      categoryId: "punjab-govt",
      names: ["High Court Clerk", "High Court Stenographer", "Senior Assistant", "District Court Clerk", "Process Server", "Peon", "Mali", "Safai Sewak"]
    },
    "erb": {
      categoryId: "punjab-teaching",
      names: ["Master Cadre Maths", "Master Cadre Science", "Master Cadre English", "Master Cadre Punjabi", "Master Cadre Hindi", "Master Cadre SST", "Master Cadre Physical Education", "ETT Teacher", "Lecturer Cadre", "Pre Primary Teacher"]
    },
    "pstet": {
      categoryId: "punjab-teaching",
      names: ["PSTET Paper 1", "PSTET Paper 2"]
    },
    "ctet": {
      categoryId: "punjab-teaching",
      names: ["CTET Paper 1", "CTET Paper 2"]
    },
    "pspcl": {
      categoryId: "punjab-technical",
      names: ["Assistant Lineman (ALM)", "Assistant Sub Station Attendant (ASSA)", "Junior Engineer Electrical", "Revenue Accountant", "Internal Auditor", "LDC", "Typist"]
    },
    "pstcl": {
      categoryId: "punjab-technical",
      names: ["JE Electrical", "ALM", "ASSA", "Clerk"]
    },
    "engineering-rec": {
      categoryId: "punjab-technical",
      names: ["JE Civil", "JE Mechanical", "JE Electrical", "AE Civil", "AE Mechanical", "AE Electrical"]
    },
    "pscb": {
      categoryId: "punjab-banking",
      names: ["Clerk", "Clerk Cum DEO", "Steno Typist", "IT Officer", "Manager", "Senior Manager"]
    },
    "coop-banks": {
      categoryId: "punjab-banking",
      names: ["Cooperative Bank Clerk", "Assistant Manager", "Field Officer"]
    },
    "bfuhs": {
      categoryId: "punjab-health",
      names: ["Staff Nurse", "Nursing Officer", "Pharmacist", "Medical Officer", "Food Safety Officer", "Emergency Medical Officer", "Lab Technician", "Radiographer", "MPHW", "ANM"]
    },
    "ssc": {
      categoryId: "central-govt",
      names: ["SSC CGL", "SSC CHSL", "SSC MTS", "SSC CPO", "SSC GD", "SSC JE", "SSC Stenographer"]
    },
    "railway": {
      categoryId: "central-govt",
      names: ["RRB NTPC", "RRB Group D", "RRB JE", "RRB ALP", "RPF Constable", "RPF SI"]
    },
    "central-banking": {
      categoryId: "central-govt",
      names: ["SBI PO", "SBI Clerk", "IBPS PO", "IBPS Clerk", "IBPS RRB", "RBI Assistant", "RBI Grade B", "LIC AAO", "LIC ADO"]
    },
    "defence": {
      categoryId: "central-govt",
      names: ["NDA", "CDS", "AFCAT", "Agniveer Army", "Agniveer Air Force", "Agniveer Navy", "CAPF AC"]
    },
    "upsc": {
      categoryId: "central-govt",
      names: ["Civil Services (IAS)", "CAPF", "EPFO", "UGC NET", "CUET"]
    }
  };

  Object.entries(examMap).forEach(([boardId, data]) => {
    data.names.forEach((name, i) => {
      const examId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      batch.set(doc(db, 'exams', examId), {
        id: examId, 
        name,
        boardId,
        categoryId: data.categoryId,
        displayOrder: i,
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
  });

  await batch.commit();
  console.log('[REBUILD] Total Architecture Synchronised Successfully.');
}
