/** Klien API admin. Melempar Error dengan .status dan .fields. */
export async function api(path, { method = 'GET', body } = {}) {
  const r = await fetch(`/api/admin${path}`, {
    method,
    credentials: 'same-origin',
    headers: { Accept: 'application/json', ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error(j.error || `Permintaan gagal (${r.status}). Coba lagi.`);
    err.status = r.status;
    err.fields = j.fields || {};
    if (r.status === 401 && path !== '/login' && path !== '/me') window.dispatchEvent(new Event('admin:unauthorized'));
    throw err;
  }
  return j;
}

export const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
      })
    : '—';
