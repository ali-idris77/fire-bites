import { useNavigate } from "react-router-dom";
import useAuthContext from "./useAuthContext";
import useAdminAuthContext from "./useAdminAuthContext";

const useLogout = () => {
    const navigate = useNavigate()
    const {dispatch}= useAuthContext()
    const {dispatch: ad_dispatch} = useAdminAuthContext()
    const logout = ()=>{
        localStorage.removeItem('user')
        localStorage.clear()
        dispatch({type:'LOGOUT'})
        ad_dispatch({type:'LOGOUT'})
        navigate('/')
    }
    return {
        logout
    };
}
 
export default useLogout;