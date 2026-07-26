import { useState } from "react"
import useAuthContext from "../../hooks/useAuthContext"
import useAdminAuthContext from "../../hooks/useAdminAuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function StaffAuth() {
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [level, setLevel] = useState(1)
    const [password, setPassword] = useState('')
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState(null)
    const {admin} = useAdminAuthContext()
    const navigate = useNavigate()
    const handleSubmit = async ()=>{
        console.log( fullname, email, phone, password, level)
        setFetching(true)   
        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/signup`, {
                method:'POST',
                headers:{'Content-Type': 'application/json',
                    'authorization':`Bearer ${admin.token}`
                },
                body: JSON.stringify({
                    fullname, email, phone, level:Number(level), password
                })
            })
            const data = await res.json()
            if(!res.ok){
                setFetching(false)
                setError(data.error)
            }
            if(res.ok){
                navigate('/dashboard/users')
            }
        }catch(err){
            console.log(err)   
        }
    }

  return(
    <div className="staffform">
    <h2>Create Staff Account</h2>
        <form className="" onSubmit={
            (e)=>{
                e.preventDefault()
                handleSubmit()
            }
        }>
            <div className="form-action">
                <label htmlFor="em">Full Name </label>
                <input type="text" id="em" value={fullname} onChange={(e)=>{
                    setFullname(e.target.value)
                }} />
            </div>
            <div className="form-action">
                <label htmlFor="em">Email </label>
                <input type="text" id="em" value={email} onChange={(e)=>{
                    setEmail(e.target.value)
                }} />
            </div>
            <div className="form-action">
                <label htmlFor="ph">Phone Number </label>
                <input type="tel" id="ph" value={phone} onChange={(e)=>{
                    setPhone(e.target.value)
                }} />
            </div>
            <div className="form-action">
                <label htmlFor="ph">Phone Number </label>
               <select name="" id="" value={level} onChange={(e)=>{
                setLevel(e.target.value)
               }}>
                <option value={1}>Intern</option>
                <option value={2}>Juniot Staffs</option>
                <option value={3}>Senior Staffs</option>
                <option value={4}>Manager level</option>
               </select>
            </div>
            <div className="form-action">
                <label htmlFor="pw">Password</label>
                <input type="password" id="pw" value={password} onChange={(e)=>{
                    setPassword(e.target.value)
                }} />
            </div>
            <button>{fetching ? 'Submitting' : 'Submit'}</button>
            {error && <p className="error">{error}</p>}
           </form>
    </div>
  )
}
