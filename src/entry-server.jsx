import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { DataProvider, setRuntime } from './lib/data.jsx';

export { planRoute } from './routes.jsx';

export function render(url, initialData, opts) {
  setRuntime(opts);
  const basename = (opts.basename || '').replace(/\/$/, '');
  const helmetContext = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <DataProvider initial={initialData} opts={opts}>
        <StaticRouter basename={basename || undefined} location={basename + url}>
          <App />
        </StaticRouter>
      </DataProvider>
    </HelmetProvider>
  );
  return { html, helmet: helmetContext.helmet };
}
