import {useState, useEffect} from 'react'
import useCartContext from '../../hooks/useCartContext'
import useOrderContext from '../../hooks/useOrderContext'
import useAuthContext from '../../hooks/useAuthContext'
import useReserveContext from '../../hooks/useReserveContext'
import Skeleton from '../../components/Skeleton'
import {formatDistanceToNow} from 'date-fns'
import Icon from '../../components/Icon'
import Swal from 'sweetalert2'
import useToast from '../../hooks/useToast'
import Dashload from '../../components/Dashload'
import useNotify from '../../hooks/useNotify'
export default function Order() {
    const {orders, dispatch, orderLoading } = useOrderContext()
    const {fetching, setFetching} = useState(false)
    const {user} = useAuthContext()
    const {notify} = useNotify()
    const {succtoast, errtoast} = useToast()
    const updateOrder = async (o, upd)=>{
      setFetching(true)
      try{
        const res= await fetch(`${import.meta.env.VITE_API_URL}/api/order/update/${o._id}`,{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({status:upd}) 
      })
      const data = await res.json()
      if(res.ok){
        dispatch({type:'UPDATE_ORDER', payload:data})
        notify('Order Status Update','order', `The order ${data._id.slice(0, 10)} has been ${data.status}.`, "admin", null, data._id)
                succtoast('Order updated successfully')
        setFetching(false)
      }else{
        errtoast('Something went wrong. Try again later.')
        setFetching(false)
      }
    }catch(err){
        console.log(err)
        errtoast('Something went wrong. Try again later.')
        setFetching(false)
      }
    }
    const viewOrder = async (o)=>{
       Swal.fire({
        title:`Order - ${o._id.slice(0,10)}`,
        html:`
        <div class='itm-col'>
        ${o.items.map(i => {
          return `<div class='itm-card'>
          <div class='itm-thmb'>
          <img src='${import.meta.env.VITE_API_URL}/api/uploads/dishes/${i.dish.image.url}' />
          </div>
          <div class='dtl'>
          <p>${i.dish.name}</p>
          <div class='udl'>
            <p>₦${i.dish.discountPercentage ? i.dish.discountPrice : i.dish.price}</p>
            <p>Quantity: ${i.quantity}</p>
          </div>
          </div>
          </div>`
        })}
        </div>
        `,
          showDenyButton:true,
          denyButtonText:'Cancel Order'
        }).then(res => {
          if(res.isDenied){
          Swal.fire({
            title:'Cancel Order?',
            text:'Are you sure you want to cancel this order?',
            cancelButtonText:'Yes'
          }).then(res => {
            if(res.isConfirmed){
              updateOrder(o, 'cancelled')
            }
          })
        }
      })
      
    }
  return (
    <> 
    {fetching && <Dashload/>}
    <section className="order">
      <h2>Your Orders</h2>
        <div className="rsvdiv">
        {orderLoading ? 
        Array.from({length: 6}).map((_, i)=>{
                return(
            <div className="skelCard" key={i}>
                <Skeleton height="1.5rem" width="50%"/>
                <Skeleton width="25%"/>
                <Skeleton width="50%"/>
                <Skeleton width="35%%"/>
              </div>
                )
              })
        : orders && orders.length > 0 ? orders.map(r =>{
            return (
                <div className="rsvcard" key={r._id} onClick={()=>{
                  viewOrder(r)
                }}>
                    <div className="rdtl-top">
                       <Icon name='box' size='50' />
                    <div className="rdtl">
                      <h3>Order - {r._id.slice(0,10)}</h3>
                      <p>{r.items.length} items</p>
                      <p>Amount: ₦{r.amount}</p>
                </div>
                </div>
                
                <div className="date">
                  <p><strong>Payment status:</strong> <span className={`statss ${r.payment.status}`}>{r.payment.status}</span></p>
                  <p><strong>status:</strong> <span className={`statss ${r.status}`}>{r.status}</span></p>
                  {formatDistanceToNow(r.createdAt)}
                </div>
                </div>
            )
        }) : <h3 className='empty-state'>no orders yet</h3>}
        </div>
    </section>
    </>
  )
}
