'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  label?: string;
  fallback?: string;
  className?: string;
}

/**
 * @fileOverview Universal Institutional Navigation Node.
 * Features: History detection with fallback routing and high-density touch target.
 */
export default function BackButton({ 
  label = 'Back', 
  fallback = '/', 
  className = '' 
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Basic history length check
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={cn(
        "group flex items-center gap-2 h-10 md:h-12 px-2 md:px-4 rounded-xl text-slate-500 hover:text-[#0F172A] hover:bg-slate-50 transition-all active:scale-95 shrink-0",
        className
      )}
    >
      <div className="h-8 w-8 rounded-lg flex items-center justify-center border border-transparent group-hover:border-slate-200 transition-all">
        <ChevronLeft className="h-5 w-5" />
      </div>
      <span className="font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hidden sm:inline">
        {label}
      </span>
    </Button>
  );
}
