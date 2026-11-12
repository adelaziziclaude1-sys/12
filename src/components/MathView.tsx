import React, { useMemo } from 'react';
import katex from 'katex';

interface MathProps {
  math: string;
  className?: string;
}

/**
 * Isolated Inline Math component with strict LTR isolation
 */
export const InlineMath: React.FC<MathProps> = ({ math, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: false,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return `<code class="font-mono text-amber-400">${math}</code>`;
    }
  }, [math]);

  return (
    <span
      dir="ltr"
      className={`math-inline font-serif text-amber-200/95 dark:text-amber-300/90 mx-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * Isolated Block Math component with dedicated horizontal scroll and LTR container
 */
export const BlockMath: React.FC<MathProps> = ({ math, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: true,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return `<pre class="font-mono text-amber-400 p-2">${math}</pre>`;
    }
  }, [math]);

  return (
    <div
      dir="ltr"
      className={`math-block my-3 px-4 py-3 rounded-xl bg-slate-900/80 dark:bg-slate-950/80 border border-slate-800/80 shadow-inner overflow-x-auto text-amber-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * English mathematical term insulated with <bdi> tag to prevent BiDi inversion
 */
export const EnglishTerm: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <bdi
      dir="ltr"
      className={`inline-block font-mono text-xs px-2 py-0.5 rounded bg-slate-800/80 text-emerald-300 border border-slate-700/60 mx-1 align-baseline ${className}`}
    >
      {children}
    </bdi>
  );
};
