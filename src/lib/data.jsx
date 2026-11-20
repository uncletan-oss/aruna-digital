import { createContext, useContext, useEffect, useState } from 'react';

const DataCtx = createContext(null);
const OptsCtx = createContext({ siteUrl: 'https://aruna-digital.com', gaId: '' });

const TTL = 5 * 60 * 1000;

/**
 * Cache data per-URL. Di server diisi lengkap sebelum render (SSR),
 * di browser di-hydrate dari <script id="__DATA__"> lalu diisi saat navigasi.
 */
export function DataProvider({ initial, opts, children }) {
  const [store] = useState(() => {
    const m = new Map();
    for (const [k, v] of Object.entries(initial || {})) m.set(k, { v, t: Date.now() });
    return m;
  });
  return (
    <OptsCtx.Provider value={opts}>
      <DataCtx.Provider value={store}>{children}</DataCtx.Provider>
    </OptsCtx.Provider>
  );
}

export const useSiteOpts = () => useContext(OptsCtx);

function fromStore(store, url) {
  const hit = url ? store.get(url) : undefined;
  if (!hit) return null;
  return { data: hit.v, status: hit.v === null ? 'notfound' : 'ok' };
}

export function useData(url) {
  const store = useContext(DataCtx);
  const [state, setState] = useState(() => (url ? fromStore(store, url) || { status: 'loading' } : { status: 'ok' }));

  useEffect(() => {
    if (!url) return setState({ status: 'ok' });
    const hit = store.get(url);
    if (hit && Date.now() - hit.t < TTL) return setState(fromStore(store, url));
    let alive = true;
    if (!hit) setState({ status: 'loading' });
    fetch(url, { headers: { Accept: 'application/json' } })
      .then(async (r) => {
        if (r.status === 404) return null;
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((v) => {
        store.set(url, { v, t: Date.now() });
        if (alive) setState(fromStore(store, url));
      })
      .catch(() => alive && !hit && setState({ status: 'error' }));
    return () => {
      alive = false;
    };
  }, [url, store]);

  return state;
}

/** Helper POST JSON dengan pesan error yang ramah. */
export async function postJSON(url, body, method = 'POST') {
  const r = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'same-origin',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error(j.error || 'Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi.');
    err.fields = j.fields || {};
    err.status = r.status;
    throw err;
  }
  return j;
}
