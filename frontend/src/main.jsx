import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DishContextProvider from './context/DishContext.jsx'
import AuthContextProvider from './context/AuthContext.jsx'
import CartContextProvider from './context/CartContext.jsx'
import NotContextProvider from './context/NotContext.jsx'
import ReserveContextProvider from './context/ReserveContext.jsx'
import OrderContextProvider from './context/OrderContext.jsx'
import AdminAuthContextProvider from './context/AdminAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AdminAuthContextProvider>
    <AuthContextProvider>
      <DishContextProvider>
        <CartContextProvider>
          <NotContextProvider>
            <ReserveContextProvider>
              <OrderContextProvider>
                <App />
              </OrderContextProvider>
            </ReserveContextProvider>
          </NotContextProvider>
        </CartContextProvider>
      </DishContextProvider>
    </AuthContextProvider>
  </AdminAuthContextProvider>
  </StrictMode>,
)
