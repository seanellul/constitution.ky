import React from 'react';
import { glossary } from '@/data/glossary';
import GlossaryTooltip from '@/components/GlossaryTooltip';

// Build a single regex from all glossary terms, sorted longest-first for greedy matching
const sortedTerms = [...glossary].sort((a, b) => b.term.length - a.term.length);
const escapedTerms = sortedTerms.map((t) =>
  t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
);
const combinedPattern = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

// Map from lowercase term to glossary entry for quick lookup
const termMap = new Map(glossary.map((t) => [t.term.toLowerCase(), t]));

/**
 * Takes plain text and returns React nodes with the first occurrence of each
 * glossary term wrapped in a <GlossaryTooltip>.
 */
export function highlightGlossaryTerms(text: string): React.ReactNode[] {
  const matched = new Set<string>();
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  // Reset regex state
  combinedPattern.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = combinedPattern.exec(text)) !== null) {
    const termLower = match[0].toLowerCase();

    // Only highlight the first occurrence of each term
    if (matched.has(termLower)) continue;
    matched.add(termLower);

    const entry = termMap.get(termLower);
    if (!entry) continue;

    // Push preceding text
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <GlossaryTooltip key={`glossary-${match.index}`} term={entry.term} definition={entry.definition}>
        {match[0]}
      </GlossaryTooltip>
    );

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}
