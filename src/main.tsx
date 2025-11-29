import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleSheetsProvider } from './context/GoogleSheetsContext';
import { LayoutProvider } from './context/LayoutContext';
import { RegionProvider } from './context/RegionContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <GoogleSheetsProvider>
          <LayoutProvider>
            <RegionProvider>
              <App />
            </RegionProvider>
          </LayoutProvider>
        </GoogleSheetsProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
