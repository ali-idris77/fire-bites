import { useState } from "react"
import useReserveContext from '../hooks/useReserveContext'
import Swal from 'sweetalert2'
import useNotify from "../hooks/useNotify"
import Icon from "../components/Icon"

const locations = [
  {
    name: 'Firey Bites Main Branch',
    address: '12 Luxury Avenue, Lekki Phase 1, Lagos',
    phone: '+234 800 000 0000',
    email: 'hello@fireybites.com',
    hours: 'Mon - Sun • 8:00 AM - 10:00 PM',
    mapUrl: 'https://www.google.com/maps?q=lekki+phase+1+lagos&output=embed'
  }
]

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
    try{
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
  }catch(err){
      setLoad(false)
      Swal.fire({
        title:'Reservation Request Failed',
        icon:'error',
        text:'Something went wrong, try again later.'
      })
  }
  }

  return (
    <>
    <section className="con-hero">
      <div className="con-hero-content">
        <p className="eyebrow">Reach out</p>
        <h1>We’d love to hear from you</h1>
        <p>Whether you’re planning a cozy dinner, a celebration, or simply want to say hello, we’re here to welcome you.</p>
      </div>
    </section>

    <section className="con-social">
      <h2>Follow <span className="firey">Firey</span> Bites</h2>
      <p>Stay up to date with our latest dishes, offers, and special events.</p>
      <div className="social-links">
        <a href="https://instagram.com" target="_blank" rel="noreferrer"><Icon name='ig'/> Instagram</a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer"><Icon name='fb'/> Facebook</a>
        <a href="https://x.com" target="_blank" rel="noreferrer"><Icon name='x'/> X</a>
      </div>
    </section>

    <section className="locator">
      <h2>Visit <span className="firey">Us</span></h2>
      <div className="locator-grid">
        <div className="locator-card">
          {locations.map((location) => (
            <div key={location.name} className="location-block">
              <h2>{location.name}</h2>
              <p>{location.address}</p>
              <p>{location.phone}</p>
              <p>{location.email}</p>
              <p>{location.hours}</p>
            </div>
          ))}
        </div>
        <div className="map-card">
          <iframe
            title="Firey Bites location"
            src={locations[0].mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>

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
    </>
  )
}
