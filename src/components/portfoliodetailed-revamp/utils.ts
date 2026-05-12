export const stripTodo = (text: string | undefined): string =>
  text ? text.replace(/^\[TODO:[^\]]*\]\s*/, '').trim() : '';

export const isPresent = (v: string | null | undefined): v is string => {
  if (!v) return false;
  const trimmed = v.trim();
  return trimmed.length > 0 && trimmed !== '-';
};

export type ParsedMetric = {
  prefix: string;
  number: number | null;
  suffix: string;
  hasGrouping: boolean;
};

export const parseMetricValue = (value: string): ParsedMetric => {
  const match = value.match(/^(\D*)([\d,.]+)(.*)$/);
  if (!match) return { prefix: '', number: null, suffix: value, hasGrouping: false };
  const prefix = match[1];
  const rawNum = match[2];
  const numStr = rawNum.replace(/,/g, '');
  const num = parseFloat(numStr);
  const suffix = match[3];
  return {
    prefix,
    number: isNaN(num) ? null : num,
    suffix,
    hasGrouping: rawNum.includes(','),
  };
};
