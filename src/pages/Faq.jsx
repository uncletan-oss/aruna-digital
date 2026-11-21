import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Seo from '../components/Seo.jsx';
import { PageHead } from '../components/ui.jsx';
import { photos } from '../site.js';

function Item({ q, a, id }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq__item${open ? ' is-open' : ''}`}>
      <h3 className="faq__q">
        <button type="button" aria-expanded={open} aria-controls={`${id}-a`} id={`${id}-q`} onClick={() => setOpen((v) => !v)}>
          <span>{q}</span>
          <span className="faq__icon" aria-hidden="true" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            className="faq__a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Jawaban tetap ada di HTML untuk mesin pencari & tanpa JavaScript */}
      <noscript>
        <p>{a}</p>
      </noscript>
    </div>
  );
}

export default function Faq({ data = [] }) {
  const groups = data.reduce((acc, f) => {
    (acc[f.category || 'Umum'] ||= []).push(f);
    return acc;
  }, {});
  return (
    <>
      <Seo
        title="Pertanyaan umum"
        description="Jawaban atas pertanyaan yang sering diajukan tentang biaya, durasi proyek, kepemilikan kode, keamanan, dan dukungan setelah rilis."
        breadcrumbs={[{ name: 'FAQ', path: '/faq' }]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: data.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          },
        ]}
      />
      <PageHead
        title="Pertanyaan umum"
        lead="Hal-hal yang biasanya ditanyakan sebelum memulai proyek bersama kami."
        crumbs={[{ name: 'FAQ', path: '/faq' }]}
        image={photos.partnership}
      />
      <div className="wrap faq">
        {Object.entries(groups).map(([cat, items]) => (
          <section key={cat} className="faq__group" aria-labelledby={`faq-${cat}`}>
            <h2 id={`faq-${cat}`} className="faq__cat">
              {cat}
            </h2>
            <div className="faq__list">
              {items.map((f, i) => (
                <Item key={f._id || f.question} id={`faq-${cat}-${i}`.replace(/\s+/g, '-')} q={f.question} a={f.answer} />
              ))}
            </div>
          </section>
        ))}
        <aside className="faq__more">
          <h2 className="h3">Pertanyaan Anda belum terjawab?</h2>
          <p>Tim kami membalas dalam satu hari kerja.</p>
          <Link to="/kontak" className="btn">
            Hubungi kami
          </Link>
        </aside>
      </div>
      <div className="section--tight" />
    </>
  );
}
