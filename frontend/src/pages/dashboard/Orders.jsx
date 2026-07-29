import { useCallback, useEffect, useState } from "react"
import useAdminAuthContext from '../../hooks/useAdminAuthContext'
import Swal from 'sweetalert2'
import Dashload from '../../components/Dashload'
import useOrderContext from '../../hooks/useOrderContext'
import useNotify from '../../hooks/useNotify'
import { socket } from "../../sockets/socket"
import Skeleton from "../../components/Skeleton"

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
    const fetchOrders = useCallback( async()=>{
          setLoad(true)
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/order`,{
            headers:{'authorization': `Bearer ${admin.token}`}
          })
          const data = await res.json()
          console.log(data)
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
    const query = {
      search: search.trim().toLowerCase(),
      status
     }
    if(query.search && !d.email.toLowerCase().includes(query.search)) return false
    if(query.status && d.status !== query.status) return false
    return true
  })

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
        console.log(e.target.value)
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
      
    {/* <div className="filt" onChange={(e)=>{
        console.log(e.target.value)
         set(e.target.value)
      }}>
        <select name="" id="">
          <option value="">All</option>
          <option value="new">New</option>
          <option value="special">Special</option>
        </select>
        </div>  */}
        </div>       
    </section>
    <section className="ord">
      {load ? Array.from({length: 12}).map((_, i)=>{
              return(
                <div className="skelCard">
              <Skeleton height="1.5rem" width="50%"/>
              <Skeleton width="25%"/>
              <Skeleton width="50%"/>
              <Skeleton width="35%%"/>
              
            </div>
              )
            }) : (
        <div className="rsvdiv">
          {orders && orders.length > 0 ? orders.map(o =>{
            <div className="" key={o._id}></div>
          }) : (
            <h3 className="empty-state">No orders yeet</h3>
          )}
        </div>
      )}
    </section>
    </div>
  )
}
