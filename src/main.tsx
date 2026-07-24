import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { releaseAll } from './storage/url'
import './index.css'

void navigator.storage?.persist?.()
window.addEventListener('pagehide', releaseAll)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
