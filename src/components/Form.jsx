import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { postJSON } from '../lib/data.jsx';
import { trackEvent } from '../lib/analytics.js';

export function Field({ id, label, hint, error, as = 'input', options, ...props }) {
  const El = as;
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {!props.required && <span className="field__opt"> (opsional)</span>}
      </label>
      {as === 'select' ? (
        <select id={id} name={id} aria-invalid={!!error} aria-describedby={describedBy} {...props}>
          <option value="">Pilih salah satu</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <El id={id} name={id} aria-invalid={!!error} aria-describedby={describedBy} {...props} />
      )}
      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="field__err">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Formulir generik: kirim JSON ke `endpoint`, tampilkan error per-field,
 * dan ganti dengan pesan konfirmasi setelah terkirim.
 */
export function useForm(endpoint, initial, { event, mailto } = {}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const bind = (name) => ({
    value: values[name] ?? '',
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
    error: errors[name],
  });

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrors({});
    setMessage('');
    try {
      await postJSON(endpoint, values);
      setStatus('sent');
      if (event) trackEvent(event);
    } catch (err) {
      // Mode statis (GitHub Pages): tidak ada server — lanjutkan lewat aplikasi email.
      if (err.static && mailto) {
        const { to, subject, body } = mailto(values);
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus('mailto');
        return;
      }
      setErrors(err.fields || {});
      setMessage(err.message);
      setStatus('error');
    }
  }

  return { values, bind, onSubmit, status, message, reset: () => (setValues(initial), setStatus('idle')) };
}

export function FormShell({ form, sentTitle, sentText, children, submitLabel, sendingLabel }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {form.status === 'mailto' ? (
        <motion.div key="mailto" className="form-sent" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="form-sent__title">Lanjutkan di aplikasi email</h2>
          <p>Kami sudah menyiapkan email berisi pesan Anda. Periksa aplikasi email yang terbuka, lalu tekan Kirim.</p>
          <button type="button" className="btn btn--ghost" onClick={form.reset}>
            Kembali ke formulir
          </button>
        </motion.div>
      ) : form.status === 'sent' ? (
        <motion.div
          key="sent"
          className="form-sent"
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
            <motion.circle
              cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }}
            />
            <motion.path
              d="M15 24.5l6 6 12-13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.45 }}
            />
          </svg>
          <h2 className="form-sent__title">{sentTitle}</h2>
          <p>{sentText}</p>
          <button type="button" className="btn btn--ghost" onClick={form.reset}>
            Kirim pesan lain
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" className="form" onSubmit={form.onSubmit} noValidate exit={{ opacity: 0, y: -12 }}>
          {children}
          {/* honeypot anti-spam: disembunyikan dari manusia */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.bind('website').value}
              onChange={form.bind('website').onChange}
            />
          </div>
          {form.status === 'error' && (
            <p className="form__error" role="alert">
              {form.message}
            </p>
          )}
          <button className="btn btn--lg" type="submit" disabled={form.status === 'sending'}>
            {form.status === 'sending' ? sendingLabel : submitLabel}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
