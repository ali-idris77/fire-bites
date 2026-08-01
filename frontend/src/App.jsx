import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Menu from './pages/food/Menu'
import FoodDetail from './pages/food/FoodDetail'
import FoodForm from './pages/food/FoodForm'
import DashBoardLayout from './layouts/DashBoardLayout'
import Overview from './pages/dashboard/Overview'
import Dishes from './pages/dashboard/Dishes'
import Orders from './pages/dashboard/Orders'
import Analytics from './pages/dashboard/Analytics'
import Profile from './pages/dashboard/profile/Profile'
import Users from './pages/dashboard/Users'
import Reservation from './pages/dashboard/Reservation'
import Cart from './pages/Cart'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import AdminLogin from './pages/auth/AdminLogin'
import Protect from './components/Protect'
import ProtectAdmin from './components/ProtectAdmin'
import Unauthorized from './pages/admin/Unauthorized'
import InitRedirect from './components/InitRedirect'
import Notification from './pages/Notification'
import UserProfile from './pages/Profile'
import StaffAuth from './pages/dashboard/StaffAuth'
import FoodEdit from './pages/dashboard/FoodEdit'
import DishGrid from './pages/dashboard/DishGrid'
import UserGrid from './pages/dashboard/UserGrid'
import PaymentFailed from './pages/PaymentFailed'
import NotFound from './pages/NotFound'

import { useEffect } from 'react'
import { socket } from './sockets/socket'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element={<RootLayout/>}>
      <Route index element={
        <InitRedirect>
          <Home/>
        </InitRedirect>}/>
      <Route path='about' element={<About/>} />
      <Route path='menu' element={<Menu/>}/>
      <Route path='signup' element={<Signup/>} />
      <Route path='login' element={<Login/>} />
      <Route path='admin/login' element={<AdminLogin/>} />
      <Route path='unauthorized'element={<Unauthorized/>} />
      <Route path='payment_failed'element={<PaymentFailed/>} />
      <Route path='contact' element={<Contact/>}/>
      <Route path='bag' element={<Protect>
      <Cart/>
      </Protect>} />
      <Route path='profile' element={<Protect>
      <UserProfile/>
      </Protect>} />
      <Route path='notifications' element={<Notification/>} />
    </Route>
    <Route path='dashboard' element={
      <ProtectAdmin level={1}>
      <DashBoardLayout/>
      </ProtectAdmin>
      }>
      <Route index element={<Overview/>}/>
      <Route path='dishes' element={
        <ProtectAdmin level={2}>
        <Dishes/>
        </ProtectAdmin>}>
        <Route index element={
          <ProtectAdmin level={2}>
            <DishGrid/>
          </ProtectAdmin>
        }/>
        <Route path='edit/:id' element={
        <ProtectAdmin level={2}>
        <FoodEdit/>
        </ProtectAdmin>}/>
        </Route>
        <Route path='dishes/create' element={
          <ProtectAdmin level={2}>
          <FoodForm/>
          </ProtectAdmin>
          }/>
      <Route path='orders' element={<Orders/>}/>
      <Route path='analytics' element={
        <ProtectAdmin level={3}>
        <Analytics/>
        </ProtectAdmin>}/>
      <Route path='profile' element={<Profile/>}/>
      <Route path='users' element={
        <ProtectAdmin level={4}>
        <Users/>
        </ProtectAdmin>} 
        >
          <Route index element={
          <ProtectAdmin level={4}>
            <UserGrid/>
          </ProtectAdmin>
        }/>
      <Route path='create' element={
        <ProtectAdmin level={4}>
        <StaffAuth/>
        </ProtectAdmin>} 
        />
        </Route>
      <Route path='reservations' element={
        <ProtectAdmin level={1}>
          <Reservation/>
        </ProtectAdmin>
} 
        />
    </Route>
    <Route path='*' element={<NotFound/>}/>
    </>
  )
)

function App() {
  useEffect(()=>{
    socket.connect();
    return ()=>{
      socket.disconnect();
    }
  }, [])
  return (
    <RouterProvider router={router}/>
  )
}

export default App
