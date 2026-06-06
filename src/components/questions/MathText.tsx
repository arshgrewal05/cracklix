
'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * @fileOverview Precision Math Renderer v5.0.
 * Hardened to handle roots, slashes, and complex derivations for PSSSB content.
 */
export default function MathText({ text, className }: MathTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        const lines = text.split('\n');
        
        const renderedLines = lines.map(line => {
          const trimmed = line.trim();
          if (!trimmed) return '<div class="h-4"></div>';

          // 1. Symbol Normalization Registry
          let processed = trimmed
            .replace(/√\[?([^\]\s]+)\]?/g, '\\sqrt{$1}') // Handles √[7056] or √7056
            .replace(/×/g, '\\times')
            .replace(/÷/g, '\\div')
            .replace(/\^2|²/g, '^2')
            .replace(/\^3|³/g, '^3')
            .replace(/≤/g, '\\leq')
            .replace(/≥/g, '\\geq');

          // 2. Identification of Mathematical Statements
          const isEquation = processed.includes('=') && /[\d\sqrt\\times\+]/.test(processed);
          const isFormula = /Area|Semi-perimeter|s=|ਖੇਤਰਫਲ|ਪਰਿਮਾਪ/i.test(processed);

          if (isEquation || isFormula || /[\\√×²³]/.test(processed)) {
            try {
              return `<div class="py-2 overflow-x-auto custom-scrollbar">${katex.renderToString(processed, {
                throwOnError: false,
                displayMode: false,
                trust: true,
                strict: false
              })}</div>`;
            } catch (e) {
              return `<div class="py-1">${trimmed}</div>`;
            }
          }
          
          return `<div class="py-1">${trimmed}</div>`;
        });

        containerRef.current.innerHTML = renderedLines.join('');
      } catch (err) {
        containerRef.current.textContent = text;
      }
    }
  }, [text]);

  return <div ref={containerRef} className={cn("whitespace-pre-wrap leading-relaxed", className)} />;
}
