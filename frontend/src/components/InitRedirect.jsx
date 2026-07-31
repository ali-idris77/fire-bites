import { useNavigate } from "react-router-dom"
import useAdminAuthContext from "../hooks/useAdminAuthContext"
import useAuthContext from "../hooks/useAuthContext"
import { useEffect, useState } from "react"

export default function InitRedirect({children}) {
    const {user} = useAuthContext()
    const {admin} = useAdminAuthContext()
    const [hashed, setHashed] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        if(user && !hashed){
            setHashed(true)
        navigate('/menu', {replace:true})
    }else if(admin && !hashed){
        setHashed(true)
        navigate('/dashboard', {replace:true})
    }
    }, [user, admin, hashed])
  return children
}
