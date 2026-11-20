import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useEffect } from 'react';
import { routes } from './routes.jsx';
import { useData } from './lib/data.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import PageTransition from './components/PageTransition.jsx';
import NotFound from './pages/NotFound.jsx';
import { PageLoading, PageError } from './components/States.jsx';
import { trackPageView } from './lib/analytics.js';

function DataRoute({ route }) {
  const params = useParams();
  const location = useLocation();
  const url = route.data?.({ params, search: location.search }) || null;
  const { data, status } = useData(url);
  if (status === 'loading') return <PageLoading />;
  if (status === 'notfound') return <NotFound />;
  if (status === 'error') return <PageError />;
  const { Component } = route;
  return <Component data={data} />;
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  // Kunci transisi: pindah halaman memicu tirai, ganti filter (?tag=) tidak.
  const pageKey = location.pathname;

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  if (isAdmin) {
    return (
      <Routes>
        {routes
          .filter((r) => r.bare)
          .map((r) => (
            <Route key={r.path} path={r.path} element={<r.Component />} />
          ))}
      </Routes>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#konten">
        Lewati ke konten
      </a>
      <Header />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <PageTransition key={pageKey}>
          <Routes location={location}>
            {routes
              .filter((r) => !r.bare)
              .map((r) => (
                <Route key={r.path} path={r.path} element={<DataRoute route={r} />} />
              ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
      <Footer />
    </MotionConfig>
  );
}
