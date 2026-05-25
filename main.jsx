import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { LanguageProvider } from './context/LanguageContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
)

