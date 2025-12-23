import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found!');
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (error) {
  console.error('Error rendering app:', error);
  // Gunakan createRoot untuk render error message tanpa innerHTML
  const errorRoot = createRoot(rootElement);
  errorRoot.render(
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'red' }}>Error Loading Application</h1>
      <p>{error.message}</p>
      <p>Please check the browser console for more details.</p>
    </div>
  );
}