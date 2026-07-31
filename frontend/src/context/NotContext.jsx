import { useEffect, useReducer } from "react";
import useAuthContext from "../hooks/useAuthContext";
import { createContext } from "react";
import {socket} from '../sockets/socket'
import useAdminAuthContext from "../hooks/useAdminAuthContext";

export const NotContext = createContext()

const NotReducer = (state, action) =>{
     switch(action.type){
        case 'SET_NOTS':
            return{
                nots:action.payload
            }
        case 'CREATE_NOT':
                if(state.nots){
              return { nots: [action.payload, ...state.nots]}
            }else{
                return{nots: action.payload}
            }
        case 'UPDATE_NOT':
            return {
                nots:state.nots.map(o => o._id === action.payload._id ? action.payload : o)
            }
        case 'DELETE_NOTS':
            return{
                nots: state.nots.filter(o => o._id !== action.payload.id)
            }
        default:
            return state
     }

    }
const NotContextProvider = ({children}) => {
    const [state , dispatch] = useReducer(NotReducer, {
        nots:[]
    })
    const {user} = useAuthContext()
    const {admin} = useAdminAuthContext()
    useEffect(()=>{
         if(!user && !admin) return
             fetch(`${import.meta.env.VITE_API_URL}/api/nots/${user? user.email : admin.level >= 4 ? 'mgt' : 'admin'}`,{
                  headers:{'Content-Type':'application/json',
                     'Authorization': `Bearer ${user? user.token : admin.token}`
                 }
             })
             .then(res => res.json())
             .then(data => {
                 dispatch({type:'SET_NOTS', payload:data})
             })
         },[user])
    useEffect(()=>{
        socket.on("notification", notification =>{
            dispatch({type:'CREATE_NOT', payload:notification})
        })
        return ()=>{
            socket.off("notification")
        }
    })
    return (
        <NotContext.Provider value={{...state, dispatch}}>
            {children}
        </NotContext.Provider>
    );
}
 
export default NotContextProvider;