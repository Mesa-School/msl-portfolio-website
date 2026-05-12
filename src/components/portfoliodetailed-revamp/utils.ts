export const stripTodo = (text: string | undefined): string =>
  text ? text.replace(/^\[TODO:[^\]]*\]\s*/, '').trim() : '';

export const isPresent = (v: string | null | undefined): v is string => {
  if (!v) return false;
  const trimmed = v.trim();
  return trimmed.length > 0 && trimmed !== '-';
};
