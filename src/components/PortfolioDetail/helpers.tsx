import { ReactNode } from 'react';

type MarkdownOptions = {
  paragraphClassName?: string;
  lineClassName?: string;
};

const stripInlineStyles = (html: string): string =>
  html.replace(/\s*(style|color|font-size|font-family)\s*=\s*"[^"]*"/gi, '')
      .replace(/\s*(style|color|font-size|font-family)\s*=\s*'[^']*'/gi, '');

export const renderMarkdownText = (
  text?: unknown,
  options: MarkdownOptions = {}
): ReactNode => {
  if (!text) return null;

  const normalized =
    typeof text === 'string'
      ? text
      : Array.isArray(text)
        ? text.filter((item): item is string => typeof item === 'string').join('\n\n')
        : '';

  if (!normalized.trim()) return null;

  const {
    paragraphClassName = 'mb-4 last:mb-0',
    lineClassName = 'mb-2 last:mb-0 leading-relaxed',
  } = options;

  return normalized.split('\n\n').map((paragraph, idx) => {
    const trimmed = paragraph.trim();
    if (!trimmed) return null;

    return (
      <div key={idx} className={paragraphClassName}>
        {trimmed.split('\n').map((line, lineIdx) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return null;

          return (
            <div
              key={lineIdx}
              className={lineClassName}
              dangerouslySetInnerHTML={{ __html: stripInlineStyles(trimmedLine) }}
            />
          );
        })}
      </div>
    );
  });
};

export const formatCurrency = (value: string | number | null | undefined) => {
  if (!value && value !== 0) return '—';
  const num = typeof value === 'number' ? value : parseFloat(value.replace(/,/g, ''));
  if (isNaN(num)) return typeof value === 'string' ? value : '—';
  return `₹${num.toLocaleString('en-IN')}`;
};

