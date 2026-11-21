import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, fmtDateTime } from './api.js';
import { schemas } from './schemas.js';
import { FieldInput, groupFields } from './Fields.jsx';
import { useToast } from './AdminApp.jsx';

export function ContentList() {
  const { resource } = useParams();
  const schema = schemas[resource];
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setItems(null);
    setError('');
    api(`/content/${resource}`).then(setItems).catch((e) => setError(e.message));
  }, [resource]);

  const shown = useMemo(
    () => (items || []).filter((i) => !q || JSON.stringify([i.title, i.client, i.slug]).toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );

  if (!schema) return <p>Jenis konten tidak dikenal.</p>;

  async function togglePublish(item) {
    try {
      const updated = await api(`/content/${resource}/${item._id}`, { method: 'PUT', body: { published: !item.published } });
      setItems((xs) => xs.map((x) => (x._id === item._id ? { ...x, published: updated.published } : x)));
      toast(updated.published ? 'Ditayangkan' : 'Disembunyikan dari situs');
    } catch (e) {
      toast(e.message, 'err');
    }
  }

  async function remove(item) {
    if (!window.confirm(`Hapus ${schema.singular} “${item.title}”? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await api(`/content/${resource}/${item._id}`, { method: 'DELETE' });
      setItems((xs) => xs.filter((x) => x._id !== item._id));
      toast(`${schema.singular[0].toUpperCase() + schema.singular.slice(1)} dihapus`);
    } catch (e) {
      toast(e.message, 'err');
    }
  }

  return (
    <>
      <header className="adm-head">
        <h1>{schema.label}</h1>
        <Link className="adm-btn adm-btn--primary" to={`/admin/konten/${resource}/baru`}>
          Tambah {schema.singular}
        </Link>
      </header>
      <input className="adm-search" type="search" placeholder={`Cari ${schema.singular}…`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari" />
      {error && <p className="adm-error">{error}</p>}
      {!items && !error && <p className="adm-muted">Memuat…</p>}
      {items && shown.length === 0 && (
        <div className="adm-empty">
          <p>Belum ada {schema.singular}{q ? ' yang cocok' : ''}.</p>
          {!q && (
            <Link className="adm-btn adm-btn--primary" to={`/admin/konten/${resource}/baru`}>
              Tambah {schema.singular} pertama
            </Link>
          )}
        </div>
      )}
      {shown.length > 0 && (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                {schema.columns.map((c) => (
                  <th key={c.name}>{c.label}</th>
                ))}
                <th>Status</th>
                <th>Diubah</th>
                <th>
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((item) => (
                <tr key={item._id}>
                  {schema.columns.map((c, i) => (
                    <td key={c.name}>
                      {i === 0 ? (
                        <Link to={`/admin/konten/${resource}/${item._id}`} className="adm-table__title">
                          {item[c.name]}
                        </Link>
                      ) : c.type === 'bool' ? (
                        item[c.name] ? 'Ya' : '—'
                      ) : c.type === 'date' ? (
                        fmtDateTime(item[c.name])
                      ) : (
                        item[c.name] ?? '—'
                      )}
                    </td>
                  ))}
                  <td>
                    <button type="button" className={`adm-pill${item.published ? ' is-on' : ''}`} onClick={() => togglePublish(item)}>
                      {item.published ? 'Tayang' : 'Draf'}
                    </button>
                  </td>
                  <td className="adm-muted">{fmtDateTime(item.updatedAt)}</td>
                  <td className="adm-table__actions">
                    {item.published && (
                      <a href={schema.publicPage || `${schema.publicPath}${item.slug}`} target="_blank" rel="noreferrer" className="adm-link">
                        Lihat
                      </a>
                    )}
                    <button type="button" className="adm-link adm-link--danger" onClick={() => remove(item)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export function ContentEditor() {
  const { resource, id } = useParams();
  const isNew = id === 'baru';
  const schema = schemas[resource];
  const navigate = useNavigate();
  const toast = useToast();
  const [doc, setDoc] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loadErr, setLoadErr] = useState('');

  useEffect(() => {
    if (!schema) return;
    if (isNew) {
      setDoc(Object.fromEntries(schema.fields.filter((f) => f.default !== undefined).map((f) => [f.name, f.default])));
    } else {
      api(`/content/${resource}/${id}`).then(setDoc).catch((e) => setLoadErr(e.message));
    }
    setDirty(false);
  }, [resource, id, isNew, schema]);

  useEffect(() => {
    if (!dirty) return;
    const h = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  if (!schema) return <p>Jenis konten tidak dikenal.</p>;
  if (loadErr) return <p className="adm-error">{loadErr}</p>;
  if (!doc) return <p className="adm-muted">Memuat…</p>;

  const set = (name, v) => {
    setDoc((d) => ({ ...d, [name]: v }));
    setDirty(true);
  };

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const saved = isNew
        ? await api(`/content/${resource}`, { method: 'POST', body: doc })
        : await api(`/content/${resource}/${id}`, { method: 'PUT', body: doc });
      setDirty(false);
      toast(isNew ? `${schema.label}: ${schema.singular} dibuat` : 'Perubahan disimpan');
      if (isNew) navigate(`/admin/konten/${resource}/${saved._id}`, { replace: true });
      else setDoc(saved);
    } catch (err) {
      setErrors(err.fields || {});
      toast(err.message, 'err');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="adm-editor">
      <header className="adm-head adm-head--sticky">
        <div>
          <Link to={`/admin/konten/${resource}`} className="adm-link">
            {schema.label}
          </Link>
          <h1>{isNew ? `${schema.singular[0].toUpperCase() + schema.singular.slice(1)} baru` : doc.title || 'Tanpa judul'}</h1>
        </div>
        <div className="adm-actions">
          {dirty && <span className="adm-muted">Belum disimpan</span>}
          {!isNew && doc.published && (
            <a className="adm-btn" href={schema.publicPage || `${schema.publicPath}${doc.slug}`} target="_blank" rel="noreferrer">
              Lihat di situs
            </a>
          )}
          <button className="adm-btn adm-btn--primary" disabled={saving}>
            {saving ? 'Menyimpan…' : isNew ? 'Buat' : 'Simpan perubahan'}
          </button>
        </div>
      </header>

      {groupFields(schema.fields).map(([group, fields]) => (
        <fieldset key={group} className="adm-panel">
          <legend>{group}</legend>
          {group === 'SEO' && (
            <div className="adm-serp" aria-label="Pratinjau hasil Google">
              <p className="adm-serp__url">aruna-digital.com{schema.publicPath}{doc.slug || '…'}</p>
              <p className="adm-serp__title">{(doc.seoTitle || doc.title || 'Judul halaman') + ' — Aruna Digital'}</p>
              <p className="adm-serp__desc">{doc.seoDescription || doc.summary || doc.excerpt || 'Deskripsi halaman akan muncul di sini.'}</p>
            </div>
          )}
          {fields.map((f) => (
            <FieldInput key={f.name} f={f} value={doc[f.name]} onChange={(v) => set(f.name, v)} error={errors[f.name]} />
          ))}
        </fieldset>
      ))}
    </form>
  );
}
