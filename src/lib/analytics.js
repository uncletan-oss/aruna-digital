/** Google Analytics 4 opsional — aktif bila GA_MEASUREMENT_ID diisi di environment. */
let gaId = '';

export function initAnalytics(id) {
  if (!id || typeof window === 'undefined' || window.gtag) return;
  gaId = id;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { send_page_view: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

export function trackPageView(path) {
  if (!gaId || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', { page_path: path, page_location: window.location.href, page_title: document.title });
}

export function trackEvent(name, params = {}) {
  if (!gaId || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}
