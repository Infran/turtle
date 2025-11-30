import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleSheetsProvider, LayoutProvider, RegionProvider } from '@/context';
import { ErrorBoundary } from '@/components';

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
