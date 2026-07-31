import {useState, useEffect} from 'react'
import useAuthContext from '../../hooks/useAuthContext'
import useReserveContext from '../../hooks/useReserveContext'
import Skeleton from '../../components/Skeleton'
import useToast from '../../hooks/useToast'
import Swal from 'sweetalert2'
import Dashload from '../../components/Dashload'
import useNotify from "../../hooks/useNotify"


export default function Reservation() {
    const {reserves, dispatch ,reserveLoading} = useReserveContext()
    const [total, setTotal] = useState('')
    const {user} = useAuthContext()
    const [updl, setUpdl] = useState(false)
    const {notify} = useNotify()
    const {succtoast, errtoast} = useToast()
    
    
  const updResrv = async (id, upd)=>{
    setUpdl(true)
    try{
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reserve/update/${id}`,{
      method:'PATCH',
      headers:{'Content-Type':'application/json',
        'authorization':`Bearer ${admin.token}`
      },
      body:JSON.stringify({status: 'cancelled'})
    })
    const data = await res.json()
    if(res.ok){
      dispatch({type:'UPD_reserve', payload:data})
      setUpdl(false)
      succtoast('Reservation cancelleed changed successfully')
      notify('Reservation', 'reserve', `The reservation for ${new Date(data.reservationDate).toDateString()} at ${new Date(data.reservationDate).toTimeString()} by ${data.customerName} has been cancelled`, "admin", data._id)
      return
    }
    setUpdl(false)
  }catch(err){
    console.log(err)
    setUpdl(false)
    errtoast('Something wennt wrong. Try again later.')
  }
}


    
  return (
    <>
    <section className="reserve">   
       <h2>Your Reservations</h2> 
        <div className="rsvdiv">
        {
        reserveLoading ?
        Array.from({length: 12}).map((_, i)=>{
        return(
          <div className="skelCard">
        <Skeleton height="1.5rem" width="50%"/>
        <Skeleton width="25%"/>
        <Skeleton width="50%"/>
        <Skeleton width="35%%"/>
      </div>
        )
      })
        : reserves && reserves.length > 0 ? reserves.map(r =>{
            return (
                <div className="rsvcard" key={r._id}>
                    <div className="rdtl">
                      <h3>Reservation</h3>
                    <p>guests : <span>{r.guests}</span></p>
                    <p className="phn">Phone : <span>{r.phone}</span></p>
                    <p >Status : <span className={`sts ${r.status}`}>{r.status}</span></p>
                      </div>
                      <div className="dttt">
                        <button
                        disabled={r.status === 'completed' || r.status === 'rejected' || r.status === 'no-show'}
                        onClick={()=>{
                        const id = r._id 
                        updResrv(id)
                      }}>cancel reservation</button>
                      <div className="tmdt">
                    <p>Date : <span>{new Date(r.reservationDate).toDateString()}</span></p>
                    <p>Time : <span>{new Date(r.reservationDate).toTimeString().split('GMT')[0]}</span></p>
                    </div>
                    </div>
                </div>
            )
        }) : <h3 className='empty-state'>no resevation yet</h3>}
        </div>
    </section>
    </>
  )
}
