import { createContext, useEffect, useReducer } from "react";
import {socket} from '../sockets/socket'
export const AdminAuthContext = createContext()
const AdminAuthReducer = (state, action)=> {
    switch (action.type) {
        case 'LOGIN':
            return{
                admin: action.payload
            }
        case 'LOGOUT':
            return{
                admin: null
            }
        default:
            return state;
    }
}
const initAdmin = JSON.parse(localStorage.getItem('admin'))
console.log(initAdmin)
const AdminAuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AdminAuthReducer, {
        admin:initAdmin
    })
    const admin = JSON.parse(localStorage.getItem('admin'))
    useEffect(()=>{
        const verifyToken = async()=>{
            if(!admin) return;
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/verify-admin`,{
               headers:{"Authorization":`Bearer ${admin.token}`}
            })
            if (res.status === 401){
                dispatch({type:'LOGOUT'})
            }
        }
        verifyToken()
    }, [])
    useEffect(()=>{
        if(admin){
            dispatch({type:'LOGIN', payload:admin})
             socket.emit("join-room", {
                email:admin.user,
                role:'admin'
        })
        }
    },[])
    return ( 
        <AdminAuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AdminAuthContext.Provider>
     );
}
 
export default AdminAuthContextProvider;