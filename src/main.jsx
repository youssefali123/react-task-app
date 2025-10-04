import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import  { Toaster } from 'react-hot-toast'
// import './index.css'
import App from './App.jsx'
import CountContextProvider from './contexts/CountContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <CountContextProvider>
    
        {/* <App /> */}
        <Toaster position="top-right" reverseOrder={false} />
          <App />
  
    </CountContextProvider>
  </StrictMode>,
)
