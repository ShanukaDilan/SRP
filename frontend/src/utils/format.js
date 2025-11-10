export function formatUserId(id) {
  const n = Number(id || 0);
  return `USR-${String(n).padStart(4, '0')}`;
}

export function formatDate(iso) {
  try {
    const d = new Date(iso);
    // Force a stable timezone to avoid SSR vs CSR hydration mismatches
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(d);
  } catch {
    return iso;
  }
}
