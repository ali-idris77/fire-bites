import { useEffect, useReducer } from "react";
import { createContext } from "react";
import useAuthContext from "../hooks/useAuthContext";
import {socket} from '../sockets/socket'

export const OrderContext = createContext()

const orderReducer = (state, action) =>{
     switch(action.type){
        case 'SET_ORDERS':
            return{
                orders:action.payload
            }
        case 'CREATE_ORDER':
                if(state.orders){
              return { orders: [action.payload, ...state.orders]}
            }else{
                return{orders: action.payload}
            }
        case 'UPDATE_ORDER':
            return {
                orders:state.orders.map(o => o._id === action.payload._id ? action.payload : o)
            }
        case 'DELETE_ORDERS':
            return{
                orders: state.orders.filter(o => o.id !== action.payload.id)
            }
        default:
            return state
     }

    }
const OrderContextProvider = ({children}) => {
    const [state , dispatch] = useReducer(orderReducer, {
        orders:[]
    })
    const {user} = useAuthContext()
     useEffect(()=>{
        if(!user) return
            fetch(`${import.meta.env.VITE_API_URL}/api/order/pers`,{
                 headers:{'Content-Type':'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                dispatch({type:'SET_ORDERS', payload:data})
            })
        },[user])
         useEffect(()=>{
                socket.on("order-update", order =>{
                    dispatch({type:'UPDATE_ORDERS', payload:order})
                })
                return ()=>{
                    socket.off("order-update")
                }
            })
    return (
        <OrderContext.Provider value={{...state, dispatch}}>
            {children}
        </OrderContext.Provider>
    );
}
 
export default OrderContextProvider;