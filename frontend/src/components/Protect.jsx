import useAuthContext from "../hooks/useAuthContext"
import { Navigate } from "react-router-dom"

const Protect = ({children}) =>{
    const {user} = useAuthContext()
    if(!user){
        return <Navigate to='/login' replace/>
    }
    return children
}

export default Protect