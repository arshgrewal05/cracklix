import { Firestore, doc, serverTimestamp, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Official Institutional Registry Seeder v53.0.
 * RESTRUCTURED: Moved SSC and UPSC to a dedicated Central Government category.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[REBUILD] Synchronizing High-Fidelity Registry...');
  const batch = writeBatch(db);

  // 1. CANONICAL MASTER CATEGORIES (Expanded to 8)
  const categories = [
    { 
      id: "punjab-government-exams", 
      title: "Punjab Government Exams", 
      description: "Recruitments through PPSC, PSSSB and Punjab Police.", 
      displayOrder: 1,
      iconUrl: "/logos/categories/punjab-government-exams.png"
    },
    { 
      id: "central-government-exams", 
      title: "Central Government Exams", 
      description: "National recruitments through SSC, UPSC, and Central Boards.", 
      displayOrder: 2,
      iconUrl: "/logos/categories/punjab-government-exams.png" // Using state logo as placeholder for consistency
    },
    { 
      id: "punjab-teaching-exams", 
      title: "Punjab Teaching Exams", 
      description: "Teacher recruitments for Master Cadre, ETT, PSTET and CTET.", 
      displayOrder: 3,
      iconUrl: "/logos/categories/punjab-teaching-exams.png"
    },
    { 
      id: "punjab-technical-exams", 
      title: "Punjab Technical Exams", 
      description: "Engineering posts in PSPCL, PSTCL and Technical Cadres.", 
      displayOrder: 4,
      iconUrl: "/logos/punjab-technical-exams.png"
    },
    { 
      id: "banking-exams", 
      title: "Banking Exams", 
      description: "Recruitments for PSCB, DCCB and State Cooperative Banks.", 
      displayOrder: 5,
      iconUrl: "/logos/categories/banking-exams.png"
    },
    { 
      id: "punjab-health-exams", 
      title: "Punjab Health Exams", 
      description: "Medical and nursing posts under BFUHS and Health Department.", 
      displayOrder: 6,
      iconUrl: "/logos/categories/punjab-health-exams.png"
    },
    { 
      id: "judiciary-exams", 
      title: "Judiciary Exams", 
      description: "Legal and judicial services including Civil Judge recruitments.", 
      displayOrder: 7,
      iconUrl: "/logos/categories/judiciary-exams.png"
    },
    { 
      id: "high-court-exams", 
      title: "High Court Exams", 
      description: "Clerical and support staff recruitments for Punjab & Haryana High Court.", 
      displayOrder: 8,
      iconUrl: "/logos/high-court.png"
    }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. AUTHORITY BOARDS (Branding Nodes)
  const boards = [
    // Punjab Government
    { id: "ppsc", abbreviation: "PPSC", name: "Punjab Public Service Commission", categoryId: "punjab-government-exams", displayOrder: 1, iconUrl: "/logos/boards/ppsc.png" },
    { id: "psssb", abbreviation: "PSSSB", name: "Punjab Subordinate Services Selection Board", categoryId: "punjab-government-exams", displayOrder: 2, iconUrl: "/logos/boards/psssb.png" },
    { id: "punjab-police", abbreviation: "Punjab Police", name: "State Police Recruitment", categoryId: "punjab-government-exams", displayOrder: 3, iconUrl: "/logos/boards/punjab-police.png" },
    
    // Central Government (MIGRATED)
    { id: "ssc", abbreviation: "SSC", name: "Staff Selection Commission", categoryId: "central-government-exams", displayOrder: 1, iconUrl: "/logos/boards/ssc.png" },
    { id: "upsc", abbreviation: "UPSC", name: "Union Public Service Commission", categoryId: "central-government-exams", displayOrder: 2, iconUrl: "/logos/boards/upsc.png" },

    // Teaching
    { id: "pstet", abbreviation: "PSTET", name: "Punjab State Teacher Eligibility Test", categoryId: "punjab-teaching-exams", displayOrder: 1, iconUrl: "/logos/boards/pstet.png" },
    { id: "erb", abbreviation: "ERB", name: "Education Recruitment Board Punjab", categoryId: "punjab-teaching-exams", displayOrder: 2, iconUrl: "/logos/boards/education-board.png" },
    
    // Technical
    { id: "pspcl", abbreviation: "PSPCL", name: "Punjab State Power Corporation Ltd", categoryId: "punjab-technical-exams", displayOrder: 1, iconUrl: "/logos/boards/pspcl.png" },
    { id: "pstcl", abbreviation: "PSTCL", name: "Punjab State Transmission Corporation Ltd", categoryId: "punjab-technical-exams", displayOrder: 2, iconUrl: "/logos/boards/pstcl.png" },
    { id: "rrb", abbreviation: "RRB", name: "Railway Recruitment Board", categoryId: "punjab-technical-exams", displayOrder: 3, iconUrl: "/logos/boards/rrb.png" },
    
    // Banking
    { id: "pscb", abbreviation: "PSCB", name: "Punjab State Cooperative Bank", categoryId: "banking-exams", displayOrder: 1, iconUrl: "/logos/boards/pscb.png" },
    { id: "ibps", abbreviation: "IBPS", name: "Institute of Banking Personnel Selection", categoryId: "banking-exams", displayOrder: 2, iconUrl: "/logos/boards/ibps.png" },
    
    // Health
    { id: "bfuhs", abbreviation: "BFUHS", name: "Baba Farid University of Health Sciences", categoryId: "punjab-health-exams", displayOrder: 1, iconUrl: "/logos/boards/bfuhs.png" },
    
    // High Court
    { id: "phhc", abbreviation: "PHHC", name: "Punjab & Haryana High Court", categoryId: "high-court-exams", displayOrder: 1, iconUrl: "/logos/boards/high-court.png" }
  ];

  for (const board of boards) {
    batch.set(doc(db, 'boards', board.id), { ...board, updatedAt: serverTimestamp() }, { merge: true });
  }

  await batch.commit();
  console.log('[SUCCESS] Registry Synchronized with migrated Central nodes.');
}
