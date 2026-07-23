import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './audio/AudioPlayer.tsx'
import GetFiles from './features/FileRetrieval/GetFiles.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GetFiles />
  </StrictMode>,
)
