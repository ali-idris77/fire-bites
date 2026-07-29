import {useState, useEffect, useRef} from 'react'
import useCartContext from '../hooks/useCartContext'
import useOrderContext from '../hooks/useOrderContext'
import useAuthContext from '../hooks/useAuthContext'
import useReserveContext from '../hooks/useReserveContext'
import Skeleton from '../components/Skeleton'
import CartItm from './cart/CartItm'
import Reservation from './cart/Reservation'
import Order from './cart/Order'
export default function Cart() {
   const [active, setActive] = useState('cart')
   const [width, setWidth] = useState(0)
   const [left, setLeft] = useState(0)
   const {user} = useAuthContext()
   const cartRef = useRef(null)

    const moveInd = (element)=>{
        setLeft(element.offsetLeft)
        setWidth(element.offsetWidth)
    }

    useEffect(()=>{
        moveInd(cartRef.current)
    }, [])
    
  return (
    <>
    <div className="active-bar">
        <span 
        ref={cartRef}
        className={active === 'cart' && 'active'} onClick={(e)=>{
            moveInd(e.currentTarget)
            setActive('cart')
        }}>Cart</span><span className={active === 'reservation' && 'active'} onClick={(e)=>{
            moveInd(e.currentTarget)
            setActive('reservation')
        }}>Reservation</span><span className={active === 'order' && 'active'} onClick={(e)=>{
            moveInd(e.currentTarget)
            setActive('order')
        }}>Order</span>
        <div className="crttb-ind" style={{
        width:width,
        left:left
        }}></div>
    </div>
    {active === 'cart' && <CartItm/>}
    {active === 'reservation' && <Reservation/>}
    {active === 'order' && <Order/>}
    </>
  )
}
