import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import 'flowbite';
import {RouterProvider} from 'react-router'
import 'aos/dist/aos.css';
import AOS from 'aos';
import AuthProvider from './contexts/AuthProvider.jsx'
import {router} from "./router/router.jsx";
import {QueryClientProvider} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/react-query";

AOS.init()
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router}/>
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>
)
