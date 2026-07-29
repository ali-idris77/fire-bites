import { createContext, useEffect, useReducer } from "react";
import { socket } from "../sockets/socket";

export const AuthContext = createContext()
const authReducer = (state, action)=> {
    switch (action.type) {
        case 'LOGIN':
            return{
                user: action.payload
            }
        case 'LOGOUT':
            return{
                user: null
            }
        default:
            return state;
    }
}
const initUser = JSON.parse(localStorage.getItem('user'))
const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user:initUser
    })
    const user = JSON.parse(localStorage.getItem('user'))
        useEffect(()=>{
            const verifyToken = async()=>{
                if(!user) return;
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/verify`,{
                   headers:{"Authorization":`Bearer ${user.token}`}
                })
                if (res.status === 401){
                    dispatch({type:'LOGOUT'})
                }
            }
            verifyToken()
        }, [])
    useEffect(()=>{
        if(user){
            dispatch({type:'LOGIN', payload:user})
             socket.emit("join-room", {
                    email:user.email,
                    role:'user'
            })
        }
    },[])
    return ( 
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
     );
}
 
export default AuthContextProvider;