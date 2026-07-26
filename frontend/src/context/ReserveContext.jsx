import { createContext, useEffect, useReducer, useState } from "react";
import useAuthContext from '../hooks/useAuthContext'
import {socket} from '../sockets/socket'

export const ReserveContext = createContext()

const reserveReducer = (state, action)=>{
    switch(action.type){
        case 'SET_reserve':
            return{
                reserves:action.payload
            }
        case 'ADD_reserve':
           if(state.reserves){
              return { reserves: [action.payload, ...state.reserves]}
            }else{
                return{reserves: action.payload}
            }
        case 'UPD_reserve':
            return{
                reserves:state.reserves.map(i => i._id === action.payload._id ? action.payload : i)
            }
        case 'DEL_reserve':
            return{
                reserves:state.reserves.filter(i => i._id !== action.payload._id)
            }
        default:
            return state
    }
}   

const ReserveContextProvider = ({children})=>{
    const {user} = useAuthContext()
    const [state, dispatch] = useReducer(reserveReducer, {reserves: []})
    const [reserveLoading, setReserveLoading] = useState(true)
    useEffect(()=>{
    const fetchReserve = async()=>{

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reserve/${user.email}`,{
            headers:{"authorization":`Bearer ${user.token}`}
        })
        const data = await res.json()
        if(res.ok){
            dispatch({type:'SET_reserve', payload:data})
            setReserveLoading(false)
        }
    }
        if(user){
            fetchReserve()
        }
    },[])
     useEffect(()=>{
                socket.on("reserve-update", reserve =>{
                    dispatch({type:'UPD_reserve', payload:reserve})
                })
                return ()=>{
                    socket.off("reserve-update")
                }
            })
    return (
        <ReserveContext.Provider value={{...state ,dispatch ,reserveLoading}}>
            {children}
        </ReserveContext.Provider>
    )
}

export default ReserveContextProvider