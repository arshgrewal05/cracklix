
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
 * @fileOverview Precision Math Renderer v4.0.
 * Hardened to handle root symbols and complex multi-line derivations beautifully.
 */
export default function MathText({ text, className }: MathTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        const lines = text.split('\n');
        
        const renderedLines = lines.map(line => {
          if (!line.trim()) return '<div class="h-4"></div>';

          // 1. Standardize and Wrap Math Symbols for LaTeX
          let processedLine = line
            .replace(/√\[?([^\]]+)\]?/g, '\\sqrt{$1}') // Handles √[data] or √data
            .replace(/√(\d+)/g, '\\sqrt{$1}')          // Handles √7056
            .replace(/×/g, '\\times')
            .replace(/÷/g, '\\div')
            .replace(/\^2|²/g, '^2')
            .replace(/\^3|³/g, '^3')
            .replace(/≤/g, '\\leq')
            .replace(/≥/g, '\\geq');

          // 2. Identify if line is purely mathematical or contains specific triggers
          const hasSignificantMath = /[\\√×÷²³≤≥^]/.test(processedLine) || 
                                     (/[=]/.test(processedLine) && /\d/.test(processedLine));

          if (hasSignificantMath) {
            try {
              // Wrap in display mode if it starts with a key variable like s= or Area=
              const isDerivation = /^(s|Area|Area of triangle|ਖੇਤਰਫਲ|ਅੱਧ-ਪਰਿਮਾਪ)\s*=/i.test(line);
              
              return `<div class="${isDerivation ? 'py-2 overflow-x-auto' : 'py-1'}">${katex.renderToString(processedLine, {
                throwOnError: false,
                displayMode: false,
                trust: true,
                strict: false
              })}</div>`;
            } catch (e) {
              return `<div>${line}</div>`;
            }
          }
          
          return `<div>${line}</div>`;
        });

        containerRef.current.innerHTML = renderedLines.join('');
      } catch (err) {
        containerRef.current.textContent = text;
      }
    }
  }, [text]);

  return <div ref={containerRef} className={cn("whitespace-pre-wrap leading-relaxed", className)} />;
}
