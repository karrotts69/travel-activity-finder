import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Explicitly type rootElement as HTMLElement | null
const rootElement: HTMLElement | null = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
createRoot(rootElement).render(<App />);