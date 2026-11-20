import { useEffect, useState } from 'react';
import { api } from './api.js';
import { imageUrl } from '../components/Photo.jsx';

const toDateInput = (v) => (v ? new Date(v).toISOString().slice(0, 10) : '');

function MarkdownField({ value, onChange, id }) {
  const [tab, setTab] = useState('tulis');
  const [html, setHtml] = useState('');
  useEffect(() => {
    if (tab !== 'pratinjau') return;
    api('/preview', { method: 'POST', body: { markdown: value || '' } })
      .then((r) => setHtml(r.html))
      .catch(() => setHtml('<p>Pratinjau tidak dapat dimuat.</p>'));
  }, [tab, value]);

  function wrap(before, after = before) {
    const ta = document.getElementById(id);
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const v = value || '';
    onChange(v.slice(0, s) + before + v.slice(s, e) + after + v.slice(e));
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(s + before.length, e + before.length);
    });
  }

  return (
    <div className="adm-md">
      <div className="adm-md__bar" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'tulis'} onClick={() => setTab('tulis')}>
          Tulis
        </button>
        <button type="button" role="tab" aria-selected={tab === 'pratinjau'} onClick={() => setTab('pratinjau')}>
          Pratinjau
        </button>
        {tab === 'tulis' && (
          <span className="adm-md__tools">
            <button type="button" onClick={() => wrap('**')} title="Tebal">
              <b>B</b>
            </button>
            <button type="button" onClick={() => wrap('_')} title="Miring">
              <i>I</i>
            </button>
            <button type="button" onClick={() => wrap('\n## ', '\n')} title="Subjudul">
              H2
            </button>
            <button type="button" onClick={() => wrap('\n- ', '')} title="Daftar">
              • Daftar
            </button>
            <button type="button" onClick={() => wrap('[', '](https://)')} title="Tautan">
              Tautan
            </button>
            <button type="button" onClick={() => wrap('![deskripsi gambar](', ')')} title="Gambar dari URL">
              Gambar
            </button>
          </span>
        )}
      </div>
      {tab === 'tulis' ? (
        <textarea id={id} className="adm-md__input" rows={18} value={value || ''} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <div className="adm-md__preview prose" dangerouslySetInnerHTML={{ __html: html }} />
      )}
      <p className="adm-hint">Mendukung Markdown: **tebal**, _miring_, ## subjudul, - daftar, [tautan](url).</p>
    </div>
  );
}

function ResultsField({ value = [], onChange }) {
  const rows = value.length ? value : [];
  const set = (i, k, v) => onChange(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <div className="adm-results">
      {rows.map((r, i) => (
        <div key={i} className="adm-results__row">
          <input aria-label="Angka" placeholder="87%" value={r.value || ''} onChange={(e) => set(i, 'value', e.target.value)} />
          <input aria-label="Keterangan" placeholder="lebih cepat konfirmasi" value={r.label || ''} onChange={(e) => set(i, 'label', e.target.value)} />
          <button type="button" className="adm-link" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
            Hapus
          </button>
        </div>
      ))}
      <button type="button" className="adm-btn adm-btn--sm" onClick={() => onChange([...rows, { value: '', label: '' }])}>
        Tambah hasil
      </button>
    </div>
  );
}

export function FieldInput({ f, value, onChange, error }) {
  const id = `f-${f.name}`;
  let input;
  switch (f.type) {
    case 'textarea':
      input = <textarea id={id} rows={4} maxLength={f.max} value={value || ''} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'markdown':
      input = <MarkdownField id={id} value={value} onChange={onChange} />;
      break;
    case 'number':
      input = (
        <input id={id} type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
      );
      break;
    case 'checkbox':
      return (
        <label className="adm-check">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          {f.label}
        </label>
      );
    case 'date':
      input = <input id={id} type="date" value={toDateInput(value)} onChange={(e) => onChange(e.target.value || null)} />;
      break;
    case 'list':
      input = (
        <textarea
          id={id}
          rows={4}
          value={(value || []).join('\n')}
          onChange={(e) => onChange(e.target.value.split('\n'))}
          onBlur={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
        />
      );
      break;
    case 'select':
      input = (
        <select id={id} value={value || ''} onChange={(e) => onChange(e.target.value)}>
          {f.options.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      );
      break;
    case 'color':
      input = (
        <span className="adm-color">
          <input id={id} type="color" value={value || '#2E4BD8'} onChange={(e) => onChange(e.target.value.toUpperCase())} />
          <code>{value}</code>
        </span>
      );
      break;
    case 'image':
      input = (
        <>
          <input id={id} type="url" placeholder="https://images.unsplash.com/photo-…" value={value || ''} onChange={(e) => onChange(e.target.value)} />
          {value && (
            <div className="adm-imgprev">
              <img src={imageUrl(value, 640, 360)} alt="Pratinjau foto" />
            </div>
          )}
        </>
      );
      break;
    case 'results':
      input = <ResultsField value={value} onChange={onChange} />;
      break;
    default:
      input = <input id={id} type="text" maxLength={f.max} value={value || ''} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <div className={`adm-field${error ? ' adm-field--err' : ''}`}>
      <label htmlFor={id}>
        {f.label}
        {f.required && <span aria-hidden="true"> *</span>}
        {f.max && typeof value === 'string' && (
          <span className={`adm-count${value.length > f.max ? ' is-over' : ''}`}>
            {value.length}/{f.max}
          </span>
        )}
      </label>
      {input}
      {f.hint && <p className="adm-hint">{f.hint}</p>}
      {error && <p className="adm-error">{error}</p>}
    </div>
  );
}

/** Kelompokkan field berdasarkan `group` (default: "Konten"). */
export function groupFields(fields) {
  const groups = new Map();
  for (const f of fields) {
    const g = f.group || 'Konten';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(f);
  }
  return [...groups.entries()];
}
