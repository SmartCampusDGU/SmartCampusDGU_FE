export function getFilenameFromContentDisposition(headerValue: string | null): string | null {
  if (!headerValue) return null;

  const match = headerValue.match(/filename="(.+?)"/);
  return match?.[1] ?? null;
}