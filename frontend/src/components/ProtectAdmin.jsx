import useAdminAuthContext from "../hooks/useAdminAuthContext"
import { Navigate } from "react-router-dom"
import useAuthContext from "../hooks/useAuthContext"

const ProtectAdmin = ({children, level = 1}) =>{
    const {admin} = useAdminAuthContext()
    const {user} = useAuthContext()
    if( user ){
        return <Navigate to='/unauthorized' replace/>
    }
    if(!admin ){
        return <Navigate to='/admin/login' replace/>
    }
    if(admin < level ){
        return <Navigate to='/unauthorized' replace/>
    }
    return children
}

export default ProtectAdmin