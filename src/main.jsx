import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'flowbite';
import { RouterProvider } from 'react-router'

import AuthProvider from './contexts/AuthProvider.jsx'
import {router} from "./router/router.jsx";



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
