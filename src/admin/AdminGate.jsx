import { lazy, Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { runtime } from '../lib/data.jsx';

// Panel admin hanya dirender di browser dan dimuat terpisah (code-splitting),
// sehingga tidak menambah ukuran bundle situs publik.
const AdminApp = lazy(() => import('./AdminApp.jsx'));

export default function AdminGate() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <>
      <Helmet>
        <title>CMS — Aruna Digital</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {runtime.static ? (
        <div className="adm-boot">CMS aktif setelah situs di-deploy ke Cloud Run dengan MongoDB.</div>
      ) : mounted ? (
        <Suspense fallback={<div className="adm-boot">Memuat CMS…</div>}>
          <AdminApp />
        </Suspense>
      ) : (
        <div className="adm-boot">Memuat CMS…</div>
      )}
    </>
  );
}
