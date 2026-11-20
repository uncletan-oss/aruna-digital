import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { DataProvider } from './lib/data.jsx';

export { planRoute } from './routes.jsx';

export function render(url, initialData, opts) {
  const helmetContext = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <DataProvider initial={initialData} opts={opts}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </DataProvider>
    </HelmetProvider>
  );
  return { html, helmet: helmetContext.helmet };
}
