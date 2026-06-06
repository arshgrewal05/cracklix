
'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * @fileOverview Exam-Grade Math Renderer v2.0.
 * Standardizes math symbols and renders LaTeX formulas with zero broken glyphs.
 */
export default function MathText({ text, className }: MathTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        // Clean common math characters to ensure compatibility
        const cleanText = text
          .replace(/−/g, '-')
          .replace(/×/g, '\\times ')
          .replace(/÷/g, '\\div ')
          .replace(/√/g, '\\sqrt ');

        // Identify LaTeX blocks or render entire text as standard markup
        // Supporting both $...$ and plain text with math symbols
        const parts = cleanText.split(/(\$.*?\$)/g);
        
        containerRef.current.innerHTML = parts.map(part => {
          if (part.startsWith('$') && part.endsWith('$')) {
            const math = part.slice(1, -1);
            return katex.renderToString(math, {
              throwOnError: false,
              displayMode: false
            });
          }
          
          // For non-LaTeX parts, we still want to ensure nice formatting
          return part.replace(/\n/g, '<br/>');
        }).join('');
        
      } catch (err) {
        console.error("KaTeX Rendering Audit Failed:", err);
        containerRef.current.textContent = text;
      }
    }
  }, [text]);

  return <div ref={containerRef} className={cn("whitespace-pre-wrap", className)} />;
}
