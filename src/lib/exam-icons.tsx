
import { Shield, GraduationCap, Scale, Zap, Stethoscope, Landmark, BookOpen, Activity, Cpu } from "lucide-react"

/**
 * @fileOverview Institutional Authority Icon Registry.
 * FIXED: Added high-fidelity SVG fallbacks for failing government domains (Police, PSPCL, PSTCL).
 */

export const getAuthorityIcon = (id: string = "", abbrev: string = "") => {
  const key = (abbrev || id || "").toLowerCase();
  
  if (key.includes('psssb')) return <PsssbIcon />;
  if (key.includes('police')) return <PoliceIcon />;
  if (key.includes('ppsc')) return <PpscIcon />;
  if (key.includes('teaching') || key.includes('cadre') || key.includes('pstet')) return <TeachingIcon />;
  if (key.includes('pspcl')) return <PspclIcon />;
  if (key.includes('pstcl')) return <PstclIcon />;
  if (key.includes('power')) return <PowerIcon />;
  if (key.includes('court') || key.includes('justice') || key.includes('sssc')) return <JusticeIcon />;
  if (key.includes('bank')) return <BankIcon />;
  if (key.includes('army')) return <Shield className="h-full w-full text-green-800" />;
  if (key.includes('health') || key.includes('med')) return <MedIcon />;
  
  return <Activity className="h-full w-full text-slate-300" />;
}

export const PsssbIcon = () => (
  <div className="p-1 w-full h-full flex items-center justify-center">
    <Landmark className="h-full w-full text-amber-600" />
  </div>
)

export const PpscIcon = () => (
  <div className="p-1 w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M12 3v19M5 8h14M15 13H9M12 8c0-3 3-5 3-5M12 8c0-3-3-5-3-5" />
    </svg>
  </div>
)

export const PoliceIcon = () => (
  <div className="p-1 w-full h-full flex items-center justify-center">
    <Shield className="h-full w-full text-[#1E3A8A] fill-[#1E3A8A]/10" />
  </div>
)

export const TeachingIcon = () => (
  <div className="p-1 w-full h-full flex items-center justify-center">
    <div className="relative h-full w-full flex items-center justify-center">
      <BookOpen className="h-4/5 w-4/5 text-[#F97316]" />
      <div className="absolute top-1 right-1 h-2 w-2 bg-[#F97316] rounded-full border border-white" />
    </div>
  </div>
)

export const PspclIcon = () => (
  <div className="p-1 w-full h-full flex items-center justify-center">
    <Zap className="h-full w-full text-blue-500 fill-blue-500/10" />
  </div>
)

export const PstclIcon = () => (
  <div className="p-1 w-full h-full flex items-center justify-center">
    <Cpu className="h-full w-full text-emerald-600" />
  </div>
)

export const JusticeIcon = () => (
  <div className="p-1 w-full h-full flex items-center justify-center">
    <Scale className="h-full w-full text-[#475569]" />
  </div>
)

export const PowerIcon = () => (
  <div className="p-1 w-full h-full flex items-center justify-center">
    <Zap className="h-full w-full text-[#1E3A8A] fill-[#F97316]" />
  </div>
)

export const MedIcon = () => (
  <div className="p-1 w-full h-full flex items-center justify-center">
    <div className="bg-[#1E3A8A]/5 rounded-full p-1 h-full w-full flex items-center justify-center">
      <Stethoscope className="h-full w-full text-[#1E3A8A]" />
    </div>
  </div>
)

export const BankIcon = () => (
  <div className="p-1 w-full h-full flex items-center justify-center">
    <Landmark className="h-full w-full text-[#0B1F3A]" />
  </div>
)
