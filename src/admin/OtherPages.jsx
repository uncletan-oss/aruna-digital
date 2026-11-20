import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api, fmtDateTime } from './api.js';
import { settingsFields } from './schemas.js';
import { FieldInput, groupFields } from './Fields.jsx';
import { useAuth, useToast } from './AdminApp.jsx';

/* ---------- Kotak masuk ---------- */
export function Messages({ onChange }) {
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [kind, setKind] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    setItems(null);
    api(`/messages${kind ? `?kind=${kind}` : ''}`).then(setItems).catch((e) => toast(e.message, 'err'));
  }, [kind, toast]);

  const unreadCount = (xs) => xs.filter((x) => !x.read).length;

  async function setRead(m, read) {
    try {
      await api(`/messages/${m._id}`, { method: 'PATCH', body: { read } });
      setItems((xs) => {
        const next = xs.map((x) => (x._id === m._id ? { ...x, read } : x));
        if (!kind) onChange?.(unreadCount(next));
        return next;
      });
    } catch (e) {
      toast(e.message, 'err');
    }
  }

  async function open(m) {
    setOpenId(openId === m._id ? null : m._id);
    if (!m.read) setRead(m, true);
  }

  async function remove(m) {
    if (!window.confirm(`Hapus pesan dari ${m.name}?`)) return;
    try {
      await api(`/messages/${m._id}`, { method: 'DELETE' });
      setItems((xs) => xs.filter((x) => x._id !== m._id));
      toast('Pesan dihapus');
    } catch (e) {
      toast(e.message, 'err');
    }
  }

  return (
    <>
      <header className="adm-head">
        <h1>Kotak masuk</h1>
        <div className="adm-seg" role="group" aria-label="Saring pesan">
          {[
            ['', 'Semua'],
            ['contact', 'Kontak'],
            ['application', 'Lamaran'],
          ].map(([v, l]) => (
            <button key={v} type="button" aria-pressed={kind === v} onClick={() => setKind(v)}>
              {l}
            </button>
          ))}
        </div>
      </header>
      {!items && <p className="adm-muted">Memuat…</p>}
      {items?.length === 0 && <div className="adm-empty">Belum ada pesan masuk.</div>}
      <ul className="adm-inbox">
        {items?.map((m) => (
          <li key={m._id} className={`adm-inbox__item${m.read ? '' : ' is-unread'}`}>
            <button type="button" className="adm-inbox__row" aria-expanded={openId === m._id} onClick={() => open(m)}>
              <span className="adm-inbox__from">{m.name}</span>
              <span className="adm-inbox__topic">
                {m.kind === 'application' ? m.topic : m.topic || 'Pesan kontak'}
                {m.company && <span className="adm-muted"> · {m.company}</span>}
              </span>
              <span className="adm-muted">{fmtDateTime(m.createdAt)}</span>
            </button>
            <AnimatePresence initial={false}>
              {openId === m._id && (
                <motion.div
                  className="adm-inbox__body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="adm-inbox__inner">
                    <dl className="adm-dl">
                      <dt>Email</dt>
                      <dd>
                        <a href={`mailto:${m.email}`}>{m.email}</a>
                      </dd>
                      {m.phone && (
                        <>
                          <dt>Telepon</dt>
                          <dd>{m.phone}</dd>
                        </>
                      )}
                      {m.budget && (
                        <>
                          <dt>Anggaran</dt>
                          <dd>{m.budget}</dd>
                        </>
                      )}
                      {m.link && (
                        <>
                          <dt>CV / portofolio</dt>
                          <dd>
                            <a href={m.link} target="_blank" rel="noopener noreferrer">
                              {m.link}
                            </a>
                          </dd>
                        </>
                      )}
                    </dl>
                    <p className="adm-inbox__msg">{m.message}</p>
                    <div className="adm-actions">
                      <a
                        className="adm-btn adm-btn--primary"
                        href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.topic || 'Pesan Anda ke Aruna Digital'}`)}`}
                      >
                        Balas via email
                      </a>
                      <button type="button" className="adm-btn" onClick={() => setRead(m, !m.read)}>
                        Tandai {m.read ? 'belum dibaca' : 'sudah dibaca'}
                      </button>
                      <button type="button" className="adm-link adm-link--danger" onClick={() => remove(m)}>
                        Hapus
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------- Newsletter ---------- */
export function Subscribers() {
  const toast = useToast();
  const [items, setItems] = useState(null);
  useEffect(() => {
    api('/subscribers').then(setItems).catch((e) => toast(e.message, 'err'));
  }, [toast]);
  async function remove(s) {
    if (!window.confirm(`Hapus ${s.email} dari daftar?`)) return;
    try {
      await api(`/subscribers/${s._id}`, { method: 'DELETE' });
      setItems((xs) => xs.filter((x) => x._id !== s._id));
      toast('Pelanggan dihapus');
    } catch (e) {
      toast(e.message, 'err');
    }
  }
  return (
    <>
      <header className="adm-head">
        <h1>Newsletter</h1>
        <a className="adm-btn" href="/api/admin/subscribers?format=csv">
          Unduh CSV
        </a>
      </header>
      {!items && <p className="adm-muted">Memuat…</p>}
      {items?.length === 0 && <div className="adm-empty">Belum ada pelanggan.</div>}
      {items?.length > 0 && (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Berlangganan sejak</th>
                <th>
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id}>
                  <td>{s.email}</td>
                  <td className="adm-muted">{fmtDateTime(s.createdAt)}</td>
                  <td className="adm-table__actions">
                    <button type="button" className="adm-link adm-link--danger" onClick={() => remove(s)}>
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

/* ---------- Pengaturan situs ---------- */
export function Settings() {
  const toast = useToast();
  const [doc, setDoc] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    api('/settings').then(setDoc).catch((e) => toast(e.message, 'err'));
  }, [toast]);
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      setDoc(await api('/settings', { method: 'PUT', body: doc }));
      toast('Pengaturan disimpan. Situs memakai nilai baru dalam beberapa menit.');
    } catch (err) {
      toast(err.message, 'err');
    } finally {
      setSaving(false);
    }
  }
  if (!doc) return <p className="adm-muted">Memuat…</p>;
  return (
    <form onSubmit={save}>
      <header className="adm-head adm-head--sticky">
        <h1>Pengaturan situs</h1>
        <button className="adm-btn adm-btn--primary" disabled={saving}>
          {saving ? 'Menyimpan…' : 'Simpan pengaturan'}
        </button>
      </header>
      <p className="adm-muted">Kolom yang dikosongkan memakai nilai bawaan dari kode (src/site.js).</p>
      {groupFields(settingsFields).map(([group, fields]) => (
        <fieldset key={group} className="adm-panel">
          <legend>{group}</legend>
          {fields.map((f) => (
            <FieldInput key={f.name} f={f} value={doc[f.name]} onChange={(v) => setDoc((d) => ({ ...d, [f.name]: v }))} />
          ))}
        </fieldset>
      ))}
    </form>
  );
}

/* ---------- Akun admin ---------- */
export function Users() {
  const toast = useToast();
  const me = useAuth();
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor' });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (me.role === 'owner') api('/users').then(setItems).catch((e) => toast(e.message, 'err'));
  }, [toast, me.role]);

  if (me.role !== 'owner') return <p>Hanya owner yang dapat mengelola akun admin.</p>;

  async function add(e) {
    e.preventDefault();
    setErrors({});
    try {
      const u = await api('/users', { method: 'POST', body: form });
      setItems((xs) => [...xs, u]);
      setForm({ name: '', email: '', password: '', role: 'editor' });
      toast(`Akun ${u.email} dibuat`);
    } catch (err) {
      setErrors(err.fields || {});
      toast(err.message, 'err');
    }
  }
  async function remove(u) {
    if (!window.confirm(`Hapus akses ${u.email}?`)) return;
    try {
      await api(`/users/${u._id}`, { method: 'DELETE' });
      setItems((xs) => xs.filter((x) => x._id !== u._id));
      toast('Akun dihapus');
    } catch (err) {
      toast(err.message, 'err');
    }
  }
  return (
    <>
      <header className="adm-head">
        <h1>Akun admin</h1>
      </header>
      <p className="adm-muted">Owner dapat mengubah pengaturan situs dan akun. Editor hanya mengelola konten dan pesan.</p>
      {items && (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Peran</th>
                <th>Terakhir masuk</th>
                <th>
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role === 'owner' ? 'Owner' : 'Editor'}</td>
                  <td className="adm-muted">{fmtDateTime(u.lastLoginAt)}</td>
                  <td className="adm-table__actions">
                    {u.email !== me.email && (
                      <button type="button" className="adm-link adm-link--danger" onClick={() => remove(u)}>
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <form className="adm-panel" onSubmit={add}>
        <h2>Tambah akun</h2>
        <FieldInput f={{ name: 'name', label: 'Nama' }} value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
        <FieldInput f={{ name: 'email', label: 'Email', required: true }} value={form.email} error={errors.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
        <div className="adm-field">
          <label htmlFor="new-pw">Kata sandi awal *</label>
          <input id="new-pw" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          <p className="adm-hint">Minimal 10 karakter. Minta pengguna menggantinya setelah masuk.</p>
          {errors.password && <p className="adm-error">{errors.password}</p>}
        </div>
        <FieldInput
          f={{ name: 'role', label: 'Peran', type: 'select', options: [['editor', 'Editor'], ['owner', 'Owner']] }}
          value={form.role}
          onChange={(v) => setForm((f) => ({ ...f, role: v }))}
        />
        <button className="adm-btn adm-btn--primary">Tambah akun</button>
      </form>
    </>
  );
}

/* ---------- Akun saya ---------- */
export function Account() {
  const toast = useToast();
  const me = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api('/password', { method: 'POST', body: { current, next } });
      setCurrent('');
      setNext('');
      toast('Kata sandi diganti');
    } catch (err) {
      toast(err.message, 'err');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <header className="adm-head">
        <h1>Akun saya</h1>
      </header>
      <p>
        Masuk sebagai <strong>{me.email}</strong> ({me.role === 'owner' ? 'Owner' : 'Editor'}).
      </p>
      <form className="adm-panel" onSubmit={submit}>
        <h2>Ganti kata sandi</h2>
        <div className="adm-field">
          <label htmlFor="pw-cur">Kata sandi saat ini</label>
          <input id="pw-cur" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div className="adm-field">
          <label htmlFor="pw-new">Kata sandi baru</label>
          <input id="pw-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
          <p className="adm-hint">Minimal 10 karakter.</p>
        </div>
        <button className="adm-btn adm-btn--primary" disabled={busy}>
          {busy ? 'Menyimpan…' : 'Ganti kata sandi'}
        </button>
      </form>
    </>
  );
}
