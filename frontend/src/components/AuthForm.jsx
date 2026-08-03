import { useState } from "react"
import useAuthContext from "../hooks/useAuthContext"
import useAdminAuthContext from "../hooks/useAdminAuthContext"
import { Link, useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"

export default function AuthForm({endpoint, fr='customer', type='login'}) {
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState(null)
    const {user, dispatch} = useAuthContext()
    const {admin, dispatch: a_dispatch} = useAdminAuthContext()
    const navigate = useNavigate()
    const handleSubmit = async ()=>{
        setFetching(true)   
        try{
            const res = await fetch(endpoint, {
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email, phone, password
                })
            })
            const data = await res.json()
            if(!res.ok){
                setFetching(false)
                setError(data.error)
            }
            if(res.ok){
                if(fr === 'admin'){
                    a_dispatch({type:'LOGIN', payload:data})
                    localStorage.setItem('admin', JSON.stringify(data))
                }else{ dispatch({type:'LOGIN', payload:data})
                localStorage.setItem('user', JSON.stringify(data))}
                setFetching(false)
                setError(null)
                if(!data.isStaff){
                    navigate('/menu')
                }else{
                    navigate('/dashboard')
                }
            }
        }catch(err){
            console.log(err)   
        }
    }
    const handleGoogleSubmit = async (response)=>{
        try{
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/google`, {
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({
                token: response.credential }) 
        });
        const data = await res.json()
        if(res.ok){
                dispatch({type:'LOGIN', payload:data})
                localStorage.setItem('user', JSON.stringify(data))
                setFetching(false)
                setError(null)
                navigate('/menu')
            }
        }catch(err){
            console.log(err)
        }}
  return(
        <form onSubmit={
            (e)=>{
                e.preventDefault()
                handleSubmit()
            }
        }>
           {fr === 'customer' && <div className="form-action">
             <GoogleLogin onSuccess={handleGoogleSubmit}
            onError={()=>{
            }}/>
           </div>}
            <div className="form-action">
                <label htmlFor="em">Email </label>
                <input type="text" id="em" onChange={(e)=>{
                    setEmail(e.target.value)
                }} />
            </div>
            { type ==='signup' && (
            <div className="form-action">
                <label htmlFor="ph">Phone Number </label>
                <input type="tel" id="ph" onChange={(e)=>{
                    setPhone(e.target.value)
                }} />
            </div>
            )}
            <div className="form-action">
                <label htmlFor="pw">Password</label>
                <input type="password" id="pw" onChange={(e)=>{
                    setPassword(e.target.value)
                }} />
            </div>
            <button>{fetching ? 'Submitting' : 'Submit'}</button>
            {error && <p className="error">{error}</p>}
            {fr === 'customer' && <p className="linker">{ type === 'signup' ? <>Already have an account? <Link to='/login'>login instead</Link></> : <>Don't have an account? <Link to='/login'>signup instead</Link></> }</p>}
        </form>
  )
}
