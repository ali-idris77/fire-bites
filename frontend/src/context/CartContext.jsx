import { createContext, useEffect, useReducer, useState } from "react";
import useAuthContext from '../hooks/useAuthContext'


export const cartContext = createContext()

const cartReducer = (state, action)=>{
    switch(action.type){
        case 'SET_CART':
            return{
                items:action.payload
            }
        case 'ADD_CART':
            if(state.items){
              return { items: [action.payload, ...state.items]}
            }else{
                return{items: action.payload}
            }
        case 'UPD_CART':
            return{
                items:state.items.map(i => i._id === action.payload._id ? action.payload : i)
            }
        case 'DEL_CART':
            return{
                items:state.items.filter(i => i._id !== action.payload._id)
            }
        case 'CLEAR_CART':
            return{
                items:[]
            }
        default:
            return state
    }
}   

const CartContextProvider = ({children})=>{
    const {user} = useAuthContext()
    const [state, dispatch] = useReducer(cartReducer, {items: []})
    const [cartLoading, setCartLoading] = useState(true)
    useEffect(()=>{
    const fetchCart = async()=>{

    
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/`,{
            headers:{"Authorization":`Bearer ${user.token}`}
        })
        const data = await res.json()
        if(res.ok){
            dispatch({type:'SET_CART', payload:data?.[0]?.items ?? []})
            setCartLoading(false)
        }else{
            console.log(data)
            setCartLoading(false)
        }
    }
        if(user){
            fetchCart()
        }
    },[])
    console.log('st', state)
    return (
        <cartContext.Provider value={{...state ,dispatch ,cartLoading}}>
            {children}
        </cartContext.Provider>
    )
}

export default CartContextProvider