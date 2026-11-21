import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import Seo from '../components/Seo.jsx';
import Avatar from '../components/Avatar.jsx';
import { PageHead, CtaBand } from '../components/ui.jsx';
import { Reveal, CountUp } from '../components/Motion.jsx';
import { useSiteOpts } from '../lib/data.jsx';
import { site, photos } from '../site.js';

function MemberCard({ m, large = false }) {
  return (
    <article className={`member${large ? ' member--lead' : ''}`}>
      <Avatar name={m.name} photo={m.photo} size={large ? 'lg' : 'md'} />
      <div className="member__body">
        <h3 className="member__name">{m.name}</h3>
        <p className="member__role">{m.role}</p>
        {m.bio && <p className="member__bio">{m.bio}</p>}
        {m.linkedin && (
          <a className="member__link" href={m.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn<span className="sr-only"> {m.name}</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function Team({ data }) {
  const { siteUrl } = useSiteOpts();
  const { members = [], departments = [] } = data || {};
  const [dept, setDept] = useState('');
  const leaders = members.filter((m) => m.leadership);
  const rest = members.filter((m) => !m.leadership);
  const shown = dept ? rest.filter((m) => m.department === dept) : rest;
  const depts = departments.filter((d) => rest.some((m) => m.department === d));

  return (
    <>
      <Seo
        title="Tim"
        description={`Kenali tim ${site.name}: engineer, desainer, data scientist, dan spesialis keamanan di Jakarta.`}
        breadcrumbs={[{ name: 'Tim', path: '/tim' }]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: site.name,
            url: siteUrl,
            employee: members.map((m) => ({ '@type': 'Person', name: m.name, jobTitle: m.role })),
          },
        ]}
      />
      <PageHead
        title="Orang-orang di balik setiap rilis"
        lead="Tim lintas disiplin yang bekerja bersama dari discovery sampai produk berjalan — dan tetap ada setelahnya."
        crumbs={[{ name: 'Tim', path: '/tim' }]}
        image={photos.studio}
      />

      <section className="wrap stats-row" aria-label="Tim dalam angka">
        <div>
          <p className="stats-row__n">
            <CountUp value={members.length} />
          </p>
          <p className="stats-row__l">anggota tim</p>
        </div>
        <div>
          <p className="stats-row__n">
            <CountUp value={departments.length} />
          </p>
          <p className="stats-row__l">disiplin keahlian</p>
        </div>
        <div>
          <p className="stats-row__n">
            <CountUp value={new Date().getFullYear() - Number(site.founded)} suffix="+" />
          </p>
          <p className="stats-row__l">tahun membangun produk</p>
        </div>
      </section>

      {leaders.length > 0 && (
        <section className="section section--tight" aria-labelledby="h-lead">
          <div className="wrap">
            <h2 id="h-lead" className="h2">
              Kepemimpinan
            </h2>
            <div className="team-grid team-grid--lead">
              {leaders.map((m, i) => (
                <Reveal key={m._id || m.name} delay={i * 0.08}>
                  <MemberCard m={m} large />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--tight section--paper" aria-labelledby="h-tim">
        <div className="wrap">
          <div className="section__head">
            <h2 id="h-tim" className="h2">
              Tim inti
            </h2>
            {depts.length > 1 && (
              <LayoutGroup id="team-filter">
                <div className="filters filters--inline" role="group" aria-label="Saring berdasarkan divisi">
                  {['', ...depts].map((d) => (
                    <button
                      key={d || 'all'}
                      type="button"
                      className={`filters__btn${dept === d ? ' is-active' : ''}`}
                      aria-pressed={dept === d}
                      onClick={() => setDept(d)}
                    >
                      {dept === d && <motion.span layoutId="team-pill" className="filters__pill" />}
                      <span className="filters__label">{d || 'Semua'}</span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            )}
          </div>
          <motion.div layout className="team-grid">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((m) => (
                <motion.div
                  key={m._id || m.name}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <MemberCard m={m} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <CtaBand title="Ingin bergabung dengan tim ini?" text="Kami selalu mencari orang yang senang merilis dan peduli pada detail." to="/karier" label="Lihat lowongan" />
    </>
  );
}
