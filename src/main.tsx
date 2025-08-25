import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './routes/routes.tsx'
import { Toaster } from 'sonner'
import { store } from './redux/store.ts'
import { Provider as ReduxProvider } from 'react-redux'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </ReduxProvider>
  </StrictMode>,
)
