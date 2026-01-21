import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';

import { ThemeProvider } from './context/ThemeProvider.jsx';
import App from './components/App.jsx';
import './style.css';
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
