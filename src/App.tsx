import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import { RouteErrorElement } from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { translations } from './i18n/translations';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Incomes = lazy(() => import('./pages/Incomes'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Settings = lazy(() => import('./pages/Settings'));

// Helper to get loading text
const getLoadingText = (): string => {
  const savedRegion = localStorage.getItem('region');
  const lang = savedRegion === 'US' ? 'en-US' : 'pt-BR';
  return (translations[lang] as Record<string, string>)['general.loading'] || 'Loading...';
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorElement />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div className="p-8">{getLoadingText()}</div>}>
            <Home />
          </Suspense>
        ),
        errorElement: <RouteErrorElement />,
      },
      {
        path: 'incomes',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="p-8">{getLoadingText()}</div>}>
              <Incomes />
            </Suspense>
          </ProtectedRoute>
        ),
        errorElement: <RouteErrorElement />,
      },
      {
        path: 'expenses',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="p-8">{getLoadingText()}</div>}>
              <Expenses />
            </Suspense>
          </ProtectedRoute>
        ),
        errorElement: <RouteErrorElement />,
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="p-8">{getLoadingText()}</div>}>
              <Settings />
            </Suspense>
          </ProtectedRoute>
        ),
        errorElement: <RouteErrorElement />,
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<div className="p-8">{getLoadingText()}</div>}>
            <About />
          </Suspense>
        ),
        errorElement: <RouteErrorElement />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
