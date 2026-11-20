import { useMemo } from 'react';
import { useData } from './data.jsx';
import { site as defaults } from '../site.js';

/** Identitas situs = default di src/site.js ditimpa pengaturan dari CMS. */
export function mergeSite(s = {}) {
  s = s || {};
  return {
    ...defaults,
    email: s.email || defaults.email,
    careersEmail: s.careersEmail || defaults.careersEmail,
    phone: s.phone || defaults.phone,
    whatsapp: s.whatsapp || defaults.whatsapp,
    hours: s.hours || defaults.hours,
    heroTitle: s.heroTitle || '',
    heroLead: s.heroLead || '',
    announcement: s.announcement || '',
    address: {
      ...defaults.address,
      street: s.street || defaults.address.street,
      locality: s.locality || defaults.address.locality,
      region: s.region || defaults.address.region,
      postalCode: s.postalCode || defaults.address.postalCode,
    },
    social: {
      linkedin: s.linkedin || defaults.social.linkedin,
      instagram: s.instagram || defaults.social.instagram,
      github: s.github || defaults.social.github,
    },
  };
}

export function useSite() {
  const { data } = useData('/api/settings');
  return useMemo(() => mergeSite(data), [data]);
}
