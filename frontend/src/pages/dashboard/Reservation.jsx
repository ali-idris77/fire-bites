import { useCallback, useEffect, useState } from "react"
import useAdminAuthContext from '../../hooks/useAdminAuthContext'
import useToast from '../../hooks/useToast'
import Swal from 'sweetalert2'
import Dashload from '../../components/Dashload'
import { socket } from "../../sockets/socket"
import useNotify from "../../hooks/useNotify"
import Skeleton from "../../components/Skeleton"
export default function Reservation() {
  const [resev, setResev] = useState([])
  const [load, setLoad] = useState(false)
  const [updl, setUpdl] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [date, setDate] = useState('')
  const [err, setErr] = useState(null)
  const {admin} = useAdminAuthContext()
  const {notify} = useNotify()
  const {succtoast, errtoast} = useToast()
  const viewReserve = (r)=>{
    Swal.fire({
      title:`Reservation By ${r.customerName}`,
      html:`  <div class='swal rdtl'>
                    <p>Guests : <span>${r.guests}</span></p>
                    <p class="phn">Phone : <span>${r.phone}</span></p>
                    <p >Email : <span >${r.email}</span></p>
                    <p >Special request : <span >${r.specialRequest}</span></p>
                    <p >Status : <span class="sts ${r.status}">${r.status}</span></p>
                    <p>Date : <span>${new Date(r.reservationDate).toDateString()}</span></p>
                    <p>Time : <span>${new Date(r.reservationDate).toTimeString().split('GMT')[0]}</span></p>
                    </div>     
      `,
    })
  }

  const updResrv = async (id, upd)=>{
    setUpdl(true)
    try{
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reserve/update/${id}`,{
      method:'PATCH',
      headers:{'Content-Type':'application/json',
        'authorization':`Bearer ${admin.token}`
      },
      body:JSON.stringify({status: upd})
    })
    const data = await res.json()
    if(res.ok){
      const newResev = resev.map(r => r._id === data._id ? data : r)
      (newResev)
      setResev(newResev)
      setUpdl(false)
      succtoast('Status changed successfully')
      if(upd === 'no-show'){
        notify('Reservation', 'reserve', `Your reservation for ${new Date(data.reservationDate).toDateString()} at ${new Date(data.reservationDate).toTimeString()} has been cancelled because you didn't show`, data.email, data._id)
      }else{
        notify('Reservation', 'reserve', `Your reservation for ${new Date(data.reservationDate).toDateString()} at ${new Date(data.reservationDate).toTimeString()} has been ${upd}`, data.email, data._id)
      }
      return
    }
    setUpdl(false)
  }catch(err){
    console.log(err)
    setUpdl(false)
    errtoast('Something wennt wrong. Try again later.')
  }
}

  const fetchReserve = useCallback(async()=>{
      setLoad(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reserve`,{
        headers:{'authorization': `Bearer ${admin.token}`}
      })
      const data = await res.json()
      if(!res.ok){
        setErr('Something Went Wrong Try Again Later')
        setLoad(false)
        return
      }
      setErr(null)
      setResev(data)
      setLoad(false)
    }, [])

  useEffect(()=>{
    fetchReserve()

 socket.on("reserve-create", (rsv)=>{
    fetchReserve()
    })

    return ()=>{
      socket.off("reserve-create")
    }
  }, [])
  const filteredResrvs = resev.filter(d => {
    const query = {
      search: search.trim().toLowerCase(),
      status
     }
    if(query.search && !d.customerName.toLowerCase().includes(query.search)) return false
    if(query.status && d.status !== query.status) return false
    return true
  })

  return (
    <div className="wrapper">
      {updl && <Dashload/>}
      <h2>Reservations</h2>
      <section className='filter-sect'>
      <div className="filter-div">
      <div className="search">
        <input className='search-inp' type="text" value={search}
        placeholder='search reservations by customer name'
        onChange={(e)=>{
          setSearch(e.target.value)
        }}/>
      </div>
      <div className="filt" onChange={(e)=>{
        (e.target.value)
         setStatus(e.target.value)
      }}>
        <select name="" id="">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rejected">Rejected</option>
          <option value="no-show">No show</option>
        </select>
        </div>        
        </div>       
    </section>
    <section className="rsv"><div className="rsvdiv">

      {load ? Array.from({length: 12}).map((_, i)=>{
        return(
          <div className="skelCard">
        <Skeleton height="1.5rem" width="50%"/>
        <Skeleton width="25%"/>
        <Skeleton width="50%"/>
        <Skeleton width="35%%"/>
        
      </div>
        )
      }) : 
        filteredResrvs && filteredResrvs.length>0 ? filteredResrvs.map(r => {
            return(
              <div className="rsvcard" key={r._id}>
                    <div className="rdtl">
                      <h3>Reservation By {r.customerName}</h3>
                    <p>guests : <span>{r.guests}</span></p>
                    <p className="phn">Phone : <span>{r.phone}</span></p>
                    <p >Status : <span className={`sts ${r.status}`}>{r.status}</span></p>
                      </div>
                      <div className="tmdt">
                    <p>Date : <span>{new Date(r.reservationDate).toDateString()}</span></p>
                    <p>Time : <span>{new Date(r.reservationDate).toTimeString().split('GMT')[0]}</span></p>
                    </div>
                    <div className="act">
                      <button onClick={()=>{
                        viewReserve(r)
                      }}>View</button>
                      <div className="btmbtn">
                      <button
                      disabled={r.status === 'completed' || r.status === 'rejected' || r.status === 'no-show'}
                       onClick={()=>{
                        const id = r._id 
                        let upd = r.status ==='pending' ? 'confirmed' : 'completed'
                        updResrv(id, upd)
                      }}>{r.status=== 'pending' ? 'Confirm' : 'Complete'}</button>
                      <button 
                      disabled={r.status === 'completed' || r.status === 'rejected' || r.status === 'no-show'}
                      onClick={()=>{
                        let upd = r.status ==='pending' ? 'rejected' : 'no-show'
                        const id = r._id 
                        updResrv(id, upd)
                      }}>{r.status=== 'pending' ? 'Reject' : 'No show'}</button>
                      </div>
                    </div>
                  </div>
            )
          }) : <h3 className="empty-state">No resevations present yet</h3>}
      </div>
    </section>
    </div>
  )
}
