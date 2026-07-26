import { useState } from "react"
import useReserveContext from '../hooks/useReserveContext'
import Swal from 'sweetalert2'
import useNotify from "../hooks/useNotify"

export default function Contact() {

  const {dispatch} = useReserveContext()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [tel, setTel] = useState('')
  const [guests, setGuests] = useState(1)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [sprq, setSprq] = useState('')
  const [load, setLoad] = useState(false)
  const [err, setErr] = useState(null)
  const {notify} = useNotify()
  const handleSubmit = async ()=>{
    setLoad(true)
    const reservationDate = new Date(`${date}T${time}`)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reserve/create`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        customerName:name, email, phone:tel, guests, reservationDate, specialRequest:sprq
      })
    })
    const data = await res.json()
    if(!res.ok){
      setErr(data.error)
      setLoad(false)
      return
    }
      setErr(null)
      dispatch({type:'ADD_reserve', payload:data})
      notify('New Reservation', 'reserve', `A new reservation was made by ${name}, please do check it`, 'admin', data._id)
      setLoad(false)
      Swal.fire({
        title:'Reservation Request Sent',
        icon:'success',
        text:'Request sent successfully'
      })
    setName('')
    setEmail('')
    setTel('')
    setGuests(1)
    setDate('')
    setTime('')
    setSprq('')
  }

  return (
    <>
    <section className="con-hero"></section>
    <section className="rserve">
      <h2>Make A Reservation With Us</h2>
      <form onSubmit={(e)=>{
        e.preventDefault()
        handleSubmit()
      }}>
        <div className="form-action">
          <label htmlFor="">Name</label>
          <input type="text" placeholder='Your Name Here' value={name} onChange={(e)=>{
            setName(e.target.value)
          }} />
          </div>
        <div className="form-action">
          <label htmlFor="">Email</label>
          <input type="email" placeholder='Your Email Here' value={email} onChange={(e)=>{
            setEmail(e.target.value)
          }} />
          </div>
        <div className="form-action">
          <label htmlFor="">Phone Number </label>
          <input type="tel" placeholder="Your Number Here" value={tel} onChange={(e)=>{
            setTel(e.target.value)
          }} />
          </div>
        <div className="form-action">
          <label htmlFor="">No. Of Guests</label>
          <input type="number" placeholder="How Many People Are You Reserving For" value={guests} onChange={(e)=>{
            setGuests(e.target.value)
          }} />
          </div>
        <div className="form-action">
          <label htmlFor="">Reservation Date</label>
          <input type="date" placeholder="What Day Are You Reserving" value={date} onChange={(e)=>{
            setDate(e.target.value)
          }} />
          </div>
        <div className="form-action">
          <label htmlFor="">Reservation Time</label>
          <input type="time" placeholder="What Time" value={time} onChange={(e)=>{
            setTime(e.target.value)
          }} />
          </div>
        <div className="form-action">
          <label htmlFor="">Special Requests</label>
          <textarea name="" id="" placeholder="Any Special Requests?"value={sprq} onChange={(e)=>{
            setSprq(e.target.value)
          }} ></textarea>
          </div>
          <button>{load?'Reserving...':'Reserve'}</button>
          {err && <p className="error">{err}</p>}
      </form>
    </section>
    <section className="contact"></section>
    <section className="locator"></section>
    <section className="con-social"></section>
    </>
  )
}
