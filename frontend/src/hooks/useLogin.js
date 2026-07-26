import { useState } from "react"
import useAuthContext from "../hooks/useAuthContext"
export const useLogin = ()=>{
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const {user, dispatch} = useAuthContext()


    const login = async (email, password)=>{
        setIsLoading(true)
        setError(null) 
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/customer/login`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({email, password})
        })
        const data = await res.json()
        if(!res.ok){
            setIsLoading(false)
            setError(data.error)
        }
        if(res.ok){
            dispatch({type:'LOGIN', payload:data})
            localStorage.setItem('user', JSON.stringify(data))
            setIsLoading(false)
            setError(null)
        }
    }
    return {login, isLoading, error}
}