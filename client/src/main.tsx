
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import './App.css'

import AppRouter from './AppRouter'
import { AuthProvider } from './features/authentication/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
)
