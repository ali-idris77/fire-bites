import { useNavigate } from "react-router-dom"
import useAdminAuthContext from "../hooks/useAdminAuthContext"
import useAuthContext from "../hooks/useAuthContext"
import { useEffect } from "react"

export default function InitRedirect({children}) {
    const {user} = useAuthContext()
    const {admin} = useAdminAuthContext()
    const navigate = useNavigate()
    useEffect(()=>{
        if(user){
        navigate('/menu', {replace:true})
    }else if(admin){
        navigate('/dashboard', {replace:true})
    }
    }, [])
  return children
}
