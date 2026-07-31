import {useState, useEffect, useRef} from 'react'
import {useSearchParams} from 'react-router-dom'
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
   const [searchParams] = useSearchParams()
   const {user} = useAuthContext()
   const cartRef = useRef(null)
   const orderRef = useRef(null)
   const reservationRef = useRef(null)

    const moveInd = (element)=>{
        setLeft(element.offsetLeft)
        setWidth(element.offsetWidth)
    }

    useEffect(()=>{
        const tab = searchParams.get('tab')
        if(tab === 'reservation'){
            setActive('reservation')
        }else if(tab === 'order'){
            setActive('order')
        }
    }, [searchParams])

    useEffect(()=>{
        let activeRef;
        switch(active){
            case 'cart':
                activeRef = cartRef.current
                break;
            case 'reservation':
                activeRef = reservationRef.current
                break;
            case 'order':
                activeRef = orderRef.current
                break;
        }
        moveInd(activeRef)
    }, [active])
    
  return (
    <>
    <div className="active-bar">
        <span 
        ref={cartRef}
        className={active === 'cart' && 'active'} onClick={(e)=>{
            moveInd(e.currentTarget)
            setActive('cart')
        }}>Cart</span>
        <span
        ref={reservationRef}
        className={active === 'reservation' && 'active'} onClick={(e)=>{
            moveInd(e.currentTarget)
            setActive('reservation')
        }}>Reservation</span>
        <span
        ref={orderRef}
        className={active === 'order' && 'active'} onClick={(e)=>{
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
