import Link from "next/link"

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = "", variant = 'dark' }: LogoProps) {
  const isLight = variant === 'light';
  
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 100 100"
          className={`h-full w-full ${isLight ? 'text-white' : 'text-[#0B1F3A]'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          {/* Refined C Shape */}
          <path 
            d="M80 25 C 60 5, 20 20, 20 50 C 20 80, 60 95, 80 75" 
            strokeLinecap="round" 
          />
          {/* Inset Punjab Outline Simplified */}
          <path 
            d="M45 40 L55 45 L60 60 L50 70 L40 60 Z" 
            className={isLight ? 'text-white/40' : 'text-[#0B1F3A]/20'}
            fill="currentColor"
            stroke="none"
          />
          {/* Refined Victory Check */}
          <path
            d="M40 50 L50 60 L75 35"
            className="text-[#F59E0B]"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-headline text-2xl font-bold tracking-tight">
          <span className={isLight ? 'text-white' : 'text-[#0B1F3A]'}>Crack</span>
          <span className="text-[#1E5EFF]">lix</span>
        </span>
        <span className={`text-[9px] uppercase tracking-widest font-medium ${isLight ? 'text-white/60' : 'text-muted-foreground'}`}>
          Institutional Trust
        </span>
      </div>
    </Link>
  )
}