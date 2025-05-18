import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Import i18n configuration first
import './i18n/i18n'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
