import { useSearchParams } from 'react-router-dom';
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo.jsx';
import { PageHead, ProjectTile, CtaBand } from '../components/ui.jsx';
import { Empty } from '../components/States.jsx';
import { photos } from '../site.js';

export default function Projects({ data }) {
  const { items = [], industries = [] } = data || {};
  const [params, setParams] = useSearchParams();
  const active = params.get('industri') || '';
  const shown = active ? items.filter((p) => p.industry === active) : items;

  const pick = (v) => {
    const next = new URLSearchParams(params);
    if (v) next.set('industri', v);
    else next.delete('industri');
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <>
      <Seo
        title="Portofolio & studi kasus"
        description="Studi kasus Aruna Digital di logistik, jasa keuangan, kesehatan, agrikultur, dan pendidikan — masalah, solusi, dan hasil terukur."
        breadcrumbs={[{ name: 'Portofolio', path: '/portofolio' }]}
      />
      <PageHead
        title="Portofolio"
        lead="Setiap proyek dimulai dari masalah bisnis yang nyata dan diukur dari hasilnya setelah rilis."
        crumbs={[{ name: 'Portofolio', path: '/portofolio' }]}
        image={photos.portfolio}
      >
        {industries.length > 1 && (
          <LayoutGroup>
            <div className="filters" role="group" aria-label="Saring berdasarkan industri">
              {['', ...industries].map((ind) => (
                <button
                  key={ind || 'all'}
                  type="button"
                  className={`filters__btn${active === ind ? ' is-active' : ''}`}
                  aria-pressed={active === ind}
                  onClick={() => pick(ind)}
                >
                  {active === ind && <motion.span layoutId="filter-pill" className="filters__pill" />}
                  <span className="filters__label">{ind || 'Semua'}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        )}
      </PageHead>

      <section className="wrap">
        {shown.length === 0 ? (
          <Empty title="Belum ada studi kasus di industri ini.">Pilih industri lain, atau lihat semua proyek.</Empty>
        ) : (
          <motion.div layout className="work-grid work-grid--index">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                  className={i === 0 ? 'span-2' : ''}
                >
                  <ProjectTile p={p} large={i === 0} headingLevel={2} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
      <CtaBand title="Proyek Anda bisa jadi studi kasus berikutnya." />
    </>
  );
}
