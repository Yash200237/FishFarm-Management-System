import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeModeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthProviderContext.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeModeProvider>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
          <App />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeModeProvider>
    </BrowserRouter>
  </StrictMode>,
)
