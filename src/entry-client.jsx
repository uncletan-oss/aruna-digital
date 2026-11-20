import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { DataProvider, setRuntime } from './lib/data.jsx';
import { initAnalytics } from './lib/analytics.js';
import '@fontsource-variable/plus-jakarta-sans/wght.css';
import '@fontsource/instrument-serif/400.css';
import './styles/global.css';

const el = document.getElementById('__DATA__');
const boot = el ? JSON.parse(el.textContent) : { data: {}, opts: {} };
const opts = { siteUrl: 'https://aruna-digital.com', gaId: '', ...boot.opts };

setRuntime(opts);
initAnalytics(opts.gaId);

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

const tree = (
  <HelmetProvider>
    <DataProvider initial={boot.data} opts={opts}>
      <BrowserRouter basename={opts.basename || undefined}>
        <App />
      </BrowserRouter>
    </DataProvider>
  </HelmetProvider>
);

const root = document.getElementById('root');
// Di GitHub Pages, HTML untuk "/wawasan?tag=x" adalah HTML "/wawasan" tanpa filter,
// jadi render ulang (bukan hydrate) agar tidak terjadi hydration mismatch.
const canHydrate = root.hasChildNodes() && !(opts.static && window.location.search);
if (canHydrate) hydrateRoot(root, tree);
else createRoot(root).render(tree);
