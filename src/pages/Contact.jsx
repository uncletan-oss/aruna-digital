import Seo from '../components/Seo.jsx';
import { PageHead } from '../components/ui.jsx';
import { Field, FormShell, useForm } from '../components/Form.jsx';
import { useSite } from '../lib/useSite.js';
import { useSiteOpts } from '../lib/data.jsx';
import { photos } from '../site.js';

const budgets = ['Di bawah Rp250 juta', 'Rp250–750 juta', 'Rp750 juta–2 miliar', 'Di atas Rp2 miliar', 'Belum tahu'];

export default function Contact({ data = [] }) {
  const site = useSite();
  const { siteUrl } = useSiteOpts();
  const form = useForm(
    '/api/contact',
    { name: '', email: '', company: '', phone: '', topic: '', budget: '', message: '', website: '' },
    {
      event: 'generate_lead',
      mailto: (v) => ({
        to: site.email,
        subject: `Diskusi proyek${v.company ? ` — ${v.company}` : ''}`,
        body: `${v.message}\n\nNama: ${v.name}\nPerusahaan: ${v.company}\nTelepon: ${v.phone}\nLayanan: ${v.topic}\nAnggaran: ${v.budget}`,
      }),
    }
  );
  const topics = [...data.map((s) => s.title), 'Lainnya'];
  const tel = site.phone.replace(/\s/g, '');

  return (
    <>
      <Seo
        title="Kontak"
        description={`Hubungi ${site.name}: ${site.email}, ${site.phone}. Kantor di ${site.address.locality}. Balasan pertama dalam satu hari kerja.`}
        breadcrumbs={[{ name: 'Kontak', path: '/kontak' }]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            url: `${siteUrl}/kontak`,
            mainEntity: {
              '@type': 'Organization',
              name: site.name,
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: site.phone,
                email: site.email,
                contactType: 'sales',
                availableLanguage: ['id', 'en'],
              },
            },
          },
        ]}
      />
      <PageHead
        title="Ceritakan apa yang ingin Anda bangun."
        lead="Isi formulir di bawah, atau hubungi langsung. Balasan pertama dari kami dalam satu hari kerja."
        crumbs={[{ name: 'Kontak', path: '/kontak' }]}
        image={photos.contact}
      />

      <div className="wrap contact">
        <FormShell
          form={form}
          submitLabel="Kirim pesan"
          sendingLabel="Mengirim…"
          sentTitle="Pesan terkirim"
          sentText={`Terima kasih. Kami akan membalas ke email Anda dalam satu hari kerja. Untuk hal mendesak, hubungi ${site.phone}.`}
        >
          <div className="form__grid">
            <Field id="name" label="Nama" required autoComplete="name" {...form.bind('name')} />
            <Field id="email" label="Email kerja" type="email" required autoComplete="email" {...form.bind('email')} />
            <Field id="company" label="Perusahaan" autoComplete="organization" {...form.bind('company')} />
            <Field id="phone" label="Telepon / WhatsApp" type="tel" autoComplete="tel" {...form.bind('phone')} />
            <Field id="topic" as="select" label="Layanan yang dibutuhkan" options={topics} {...form.bind('topic')} />
            <Field id="budget" as="select" label="Perkiraan anggaran" options={budgets} {...form.bind('budget')} />
          </div>
          <Field
            id="message"
            as="textarea"
            rows={6}
            required
            label="Ceritakan proyeknya"
            hint="Apa masalahnya, siapa penggunanya, dan kapan targetnya."
            {...form.bind('message')}
          />
        </FormShell>

        <aside className="contact__side">
          <div>
            <h2 className="side__h">Email</h2>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div>
            <h2 className="side__h">Telepon</h2>
            <a href={`tel:${tel}`}>{site.phone}</a>
            <br />
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
              Chat via WhatsApp
            </a>
          </div>
          <div>
            <h2 className="side__h">Kantor</h2>
            <address>
              {site.address.street}
              <br />
              {site.address.locality}, {site.address.region} {site.address.postalCode}
            </address>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${site.address.street}, ${site.address.locality}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buka di Google Maps
            </a>
          </div>
          <div>
            <h2 className="side__h">Jam kerja</h2>
            <p>{site.hours}</p>
          </div>
        </aside>
      </div>
      <div className="section--tight" />
    </>
  );
}
