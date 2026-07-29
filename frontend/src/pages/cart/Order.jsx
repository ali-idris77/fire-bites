import {useState, useEffect} from 'react'
import useCartContext from '../../hooks/useCartContext'
import useOrderContext from '../../hooks/useOrderContext'
import useAuthContext from '../../hooks/useAuthContext'
import useReserveContext from '../../hooks/useReserveContext'
import Skeleton from '../../components/Skeleton'

export default function Order() {
    const {order, dispatch, orderLoading } = useOrderContext()
    const {user} = useAuthContext()
    
  return (
    <> 
    <section className="order">
      <h2>Your Orders</h2>
        <div className="rsvdiv">
        {orderLoading ? 
        Array.from({length: 6}).map((_, i)=>{
                return(
            <div className="skelCard">
                <Skeleton height="1.5rem" width="50%"/>
                <Skeleton width="25%"/>
                <Skeleton width="50%"/>
                <Skeleton width="35%%"/>
              </div>
                )
              })
        : order && order.length > 0 ? order.map(r =>{
            return (
                <div className="rsvcard" key={r._id}>
                    <div className="rdtl">
                      <h3>Order</h3>
                </div>
                </div>
            )
        }) : <h3 className='empty-state'>no orders yet</h3>}
        </div>
    </section>
    </>
  )
}
