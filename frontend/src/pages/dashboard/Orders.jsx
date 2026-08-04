import { useCallback, useEffect, useState } from "react"
import useAdminAuthContext from '../../hooks/useAdminAuthContext'
import Swal from 'sweetalert2'
import Dashload from '../../components/Dashload'
import useOrderContext from '../../hooks/useOrderContext'
import useNotify from '../../hooks/useNotify'
import { socket } from "../../sockets/socket"
import Skeleton from "../../components/Skeleton"
import Icon from "../../components/Icon"
import { formatDistanceToNow } from "date-fns"
import useToast from '../../hooks/useToast'

export default function Orders() {
  const [orders, setOrders] = useState([])
    const [load, setLoad] = useState(false)
    const [updl, setUpdl] = useState(false)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [date, setDate] = useState('')
    const [err, setErr] = useState(null)
    const {admin} = useAdminAuthContext()
    const {notify} = useNotify()
    const {succtoast, errtoast} = useToast()
    const fetchOrders = useCallback( async()=>{
          setLoad(true)
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/order`,{
            headers:{'authorization': `Bearer ${admin.token}`}
          })
          const data = await res.json()
          if(!res.ok){
            setErr('Something Went Wrong Try Again Later')
            setLoad(false)
            return
          }
          setErr(null)
          setOrders(data)
          setLoad(false)
        }, [])

     useEffect(()=>{
        fetchOrders()
        socket.on("order-create", order=>{
         fetchOrders()
        })
      },[fetchOrders])

    const filteredOrders = orders.filter(d => {
    const matchesSearch = d._id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = status ? d.status === status : true
    return matchesSearch && matchesStatus
  })

  const updateOrder = async (o, upd)=>{
        setUpdl(true)
              try{
                const res= await fetch(`${import.meta.env.VITE_API_URL}/api/order/update/${o._id}`,{
                method:'PATCH',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({status:upd}) 
              })
              const data = await res.json()
              if(res.ok){
                const newResev = orders.map(r => r._id === data._id ? data : r)
                setOrders(newResev)
                succtoast('Order updated successfully')
                notify('Order Status Update','order', `Your order ${data._id.slice(0, 10)} has been ${data.status}, Thank you for your patronage.`, data.customerEmail, null, data._id)
                setUpdl(false)
              }else{
                errtoast('Something went wrong. Try again later.')
                setUpdl(false)
              }
            }catch(err){
                console.log(err)
                errtoast('Something went wrong. Try again later.')
                setUpdl(false)
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
            </div>
            `
          })}
          <div class='lft'>
            <p>Payment status: ${o.payment.status}</p>
            <p>order status: ${o.status}</p>
            <p>${formatDistanceToNow(new Date(o.createdAt), {addSuffix:true})}</p>
            </div>
          </div>
          `
        })
        
      }
  return (
    <div className="wrapper">
      {updl && <Dashload/>}
      <h2>Orders</h2>
      <section className='filter-sect'>
      <div className="filter-div">
      <div className="search">
        <input className='search-inp' type="text" value={search}
        placeholder='search orders by customer name'
        onChange={(e)=>{
          setSearch(e.target.value)
        }}/>
      </div>
      <div className="filt" onChange={(e)=>{
         setStatus(e.target.value)
      }}>
        <select name="" id="">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="preparing">Preparing</option>
          <option value="finished">Finished</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          </select>
        </div>        
        </div>       
    </section>
    <section className="ord">
      {load ? Array.from({length: 12}).map((_, i)=>{
              return(
                <div className="skelCard" key={i}>
              <Skeleton height="1.5rem" width="50%"/>
              <Skeleton width="25%"/>
              <Skeleton width="50%"/>
              <Skeleton width="35%%"/>
              
            </div>
              )
            }) : (
        <div className="rsvdiv">
          {filteredOrders && filteredOrders.length > 0 ? filteredOrders.map(r =>{
                      return (
                          <div className="rsvcard" key={r._id} >
                              <div className="rdtl-top">
                                 <Icon name='box' className="icn" size='50' />
                              <div className="rdtl">
                                <h3>Order - {r._id.slice(0,10)}</h3>
                                <p>By: {r.customerEmail}</p>
                                <p>{r.items.length} items</p>
                                <p>Amount: ₦{r.amount}</p>
                          </div>
                          </div>
                          
                          <div className="date dated">
                            <p><strong>Payment status:</strong> <span className={`statss ${r.payment.status}`}>{r.payment.status}</span></p>
                            <p><strong>status:</strong> <span className={`statss ${r.status}`}>{r.status}</span></p>
                            {formatDistanceToNow(new Date(r.createdAt), {addSuffix:true})}
                          </div>
                           <div className="act">
                      <button onClick={()=>{
                        viewOrder(r)
                      }}>View</button>
                      <div className="btmbtn">
                      <button
                      disabled={r.status === 'finished' || r.status === 'completed'}
                       onClick={()=>{
                        const id = r._id 
                        let upd = 'finished'
                        updateOrder(r, upd)
                      }}>Finish</button>
                      <button 
                      disabled={r.status !== 'finished' || r.status === 'completed' }
                      onClick={()=>{
                        let upd = 'completed'
                        const id = r._id 
                        updateOrder(r, upd)
                      }}>Complete</button>
                      </div>
                    </div>
                          </div>
                      )
                  }) : (
            <h3 className="empty-state">No orders yeet</h3>
          )}
        </div>
      )}
    </section>
    </div>
  )
}
