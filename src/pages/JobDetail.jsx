import Seo from '../components/Seo.jsx';
import { PageHead, Prose } from '../components/ui.jsx';
import { Field, FormShell, useForm } from '../components/Form.jsx';
import { useSiteOpts } from '../lib/data.jsx';
import { site, photos } from '../site.js';
import { imageUrl } from '../components/Photo.jsx';
import { TYPE_LABEL } from './Careers.jsx';

export default function JobDetail({ data: j }) {
  const { siteUrl } = useSiteOpts();
  const form = useForm(
    `/api/jobs/${j.slug}/apply`,
    { name: '', email: '', phone: '', link: '', message: '', website: '' },
    {
      event: 'job_application',
      mailto: (v) => ({
        to: site.careersEmail,
        subject: `Lamaran: ${j.title} — ${v.name}`,
        body: `${v.message}\n\nNama: ${v.name}\nEmail: ${v.email}\nTelepon: ${v.phone}\nCV/portofolio: ${v.link}`,
      }),
    }
  );
  const crumbs = [
    { name: 'Karier', path: '/karier' },
    { name: j.title, path: `/karier/${j.slug}` },
  ];
  const posted = new Date(j.createdAt || Date.now());
  const validThrough = j.validThrough ? new Date(j.validThrough) : new Date(posted.getTime() + 90 * 864e5);

  return (
    <>
      <Seo
        title={j.seoTitle || `Lowongan ${j.title}`}
        description={j.seoDescription || j.summary}
        image={j.image ? imageUrl(j.image, 1200, 630) : undefined}
        breadcrumbs={crumbs}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            title: j.title,
            description: j.bodyHtml || j.summary,
            datePosted: posted.toISOString(),
            validThrough: validThrough.toISOString(),
            employmentType: j.employmentType,
            hiringOrganization: { '@type': 'Organization', name: site.name, sameAs: siteUrl, logo: `${siteUrl}/icon-512.png` },
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                streetAddress: site.address.street,
                addressLocality: site.address.locality,
                addressRegion: site.address.region,
                postalCode: site.address.postalCode,
                addressCountry: 'ID',
              },
            },
            ...(j.remote ? { jobLocationType: 'TELECOMMUTE', applicantLocationRequirements: { '@type': 'Country', name: 'Indonesia' } } : {}),
            directApply: true,
          },
        ]}
      />
      <PageHead
        title={j.title}
        lead={j.summary}
        crumbs={crumbs}
        image={{ src: j.image || photos.careers.src, alt: j.imageAlt || photos.careers.alt, credit: j.image ? j.imageCredit : photos.careers.credit }}
      >
        <p className="pagehead__meta">
          {[j.department, j.location, TYPE_LABEL[j.employmentType], j.remote ? 'Bisa remote' : null].filter(Boolean).join(', ')}
        </p>
      </PageHead>

      <div className="wrap detail">
        <div className="detail__main">
          <Prose html={j.bodyHtml} />
        </div>
        <aside className="detail__side detail__side--form" id="lamar">
          <h2 className="side__h">Lamar posisi ini</h2>
          <FormShell
            form={form}
            submitLabel="Kirim lamaran"
            sendingLabel="Mengirim lamaran…"
            sentTitle="Lamaran terkirim"
            sentText="Terima kasih. Tim kami meninjau setiap lamaran dan akan menghubungi Anda dalam lima hari kerja."
          >
            <Field id="name" label="Nama lengkap" required autoComplete="name" {...form.bind('name')} />
            <Field id="email" label="Email" type="email" required autoComplete="email" {...form.bind('email')} />
            <Field id="phone" label="Nomor telepon" type="tel" autoComplete="tel" {...form.bind('phone')} />
            <Field
              id="link"
              label="Tautan CV atau portofolio"
              type="url"
              required
              placeholder="https://"
              hint="Google Drive, LinkedIn, GitHub, atau situs pribadi. Pastikan bisa dibuka publik."
              {...form.bind('link')}
            />
            <Field
              id="message"
              as="textarea"
              rows={5}
              label="Kenapa Anda tertarik?"
              required
              {...form.bind('message')}
            />
          </FormShell>
        </aside>
      </div>
      <div className="section--tight" />
    </>
  );
}
