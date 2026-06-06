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
 * @fileOverview Precision High-Contrast Renderer v15.0.
 * Supports Markdown Tables for DI questions and KaTeX for Math.
 */
export default function MathText({ text, className }: MathTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!text || typeof text !== 'string') {
      containerRef.current.innerHTML = '';
      return;
    }

    try {
      // Logic: Detection for Markdown Tables (| column |)
      const hasTable = text.includes('|') && text.includes('--');
      
      if (hasTable) {
        containerRef.current.innerHTML = renderMarkdownTable(text);
        return;
      }

      const lines = text.split('\n');
      
      const renderedHtml = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '<div class="h-4"></div>';

        // Normalize symbols for KaTeX
        let processed = trimmed
          .replace(/×/g, '\\times')
          .replace(/÷/g, '\\div')
          .replace(/²/g, '^2')
          .replace(/³/g, '^3')
          .replace(/√\[?([^\]\s]+)\]?/g, '\\sqrt{$1}')
          .replace(/√/g, '\\sqrt');

        // Logic: Is this a pure formula or text with math?
        const isPureFormula = /^[sabcxyz\d\s\+\-\*\/\=\(\)\\\^\sqrt{}]+$/i.test(trimmed) && trimmed.includes('=');
        const hasMathSymbols = /[√\\×÷²³≤≥]/.test(trimmed) || trimmed.includes('$');

        if (isPureFormula || (hasMathSymbols && !/[a-z]{5,}/i.test(trimmed))) {
          try {
            // Support explicit $...$ or clean processed strings
            const mathContent = processed.startsWith('$') && processed.endsWith('$') 
              ? processed.slice(1, -1) 
              : processed;

            return `<div class="py-2 overflow-x-auto no-scrollbar font-sans text-lg md:text-xl text-white">${katex.renderToString(mathContent, {
              throwOnError: false,
              displayMode: false,
              trust: true
            })}</div>`;
          } catch (e) {
            return `<div class="py-2 text-white">${trimmed}</div>`;
          }
        }

        // Descriptive logic lines (e.g. "Ratio = 2 : 3")
        if (trimmed.includes('=') && !/[a-z]{12,}/i.test(trimmed)) {
          const parts = trimmed.split('=');
          return `<div class="py-2 flex flex-wrap items-baseline gap-2 text-white">
            <span class="font-bold text-inherit uppercase tracking-wide">${parts[0].trim()}</span>
            <span class="text-inherit font-black text-primary">=</span>
            <span class="font-bold text-inherit">${parts[1].trim()}</span>
          </div>`;
        }

        // Standard Bold White Text
        return `<div class="py-1 text-inherit font-[700] leading-[1.6] antialiased text-white">${trimmed}</div>`;
      }).join('');

      containerRef.current.innerHTML = renderedHtml;
    } catch (err) {
      containerRef.current.textContent = text;
    }
  }, [text]);

  return (
    <div 
      ref={containerRef} 
      className={cn("whitespace-pre-wrap leading-relaxed h-auto overflow-visible text-white", className)} 
    />
  );
}

/**
 * Utility to render markdown tables as HTML tables for DI questions.
 */
function renderMarkdownTable(rawText: string): string {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const tableRows = lines.filter(l => l.startsWith('|') && l.endsWith('|'));
  
  if (tableRows.length < 2) return rawText.replace(/\n/g, '<br/>');

  // Identify Header, Separator, and Data
  const header = tableRows[0].split('|').filter(c => c.trim().length >= 0).slice(1, -1);
  const dataRows = tableRows.slice(2).map(r => r.split('|').filter(c => c.trim().length >= 0).slice(1, -1));

  const html = `
    <div class="my-8 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
      <table class="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr class="bg-[#F97316]/10 border-b border-white/10">
            ${header.map(col => `<th class="p-4 font-black uppercase text-[11px] md:text-xs tracking-[0.1em] text-[#F97316]">${col.trim()}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${dataRows.map(row => `
            <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
              ${row.map(cell => `<td class="p-4 font-bold text-sm text-white">${cell.trim()}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="h-4"></div>
  `;

  // Return the table followed by any remaining text (like questions below the chart)
  const remainingText = lines.filter(l => !l.startsWith('|')).join('\n');
  return html + (remainingText ? `<div class="mt-4 font-[700] text-white leading-relaxed">${remainingText}</div>` : "");
}
