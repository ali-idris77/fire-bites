import {createContext, useReducer, useEffect, useState} from 'react'


export const DishContext = createContext()
//reducer
const dishReducer = (state, action)=>{
    switch(action.type){
        case 'SET_DISHES':
            // console.log('set state', action.payload)
            return {
                dishes:action.payload
            }
        case 'CREATE_DISH':
            return {
                dishes:[action.payload, ...state?.dishes]
            }
        case 'DELETE_DISH':
            return {
                dishes: state.dishes.filter(d => d._id !== action.payload._id)
            }
        case 'UPDATE_DISH':
            return {
                dishes: state.dishes.map(d => d._id === action.payload._id ? action.payload : d)
            }
        default:
            return state
    }
} 

const DishContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(dishReducer, {
        dishes:[]
    })
    const [dishLoading, setDishLoading] = useState(true)
    useEffect(()=>{
        const fetchDishes = async ()=>{
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dish`)
          const data = await res.json()
          if(res.ok){
            //console.log('state data', data)
            dispatch({type:'SET_DISHES', payload:data})
            setDishLoading(false)
            //console.log('state', state)
          }
        }
    
        fetchDishes()
        
    }, [])
    // console.log('state 2', state)
    return (
        <DishContext.Provider value={{...state, dispatch, dishLoading}} onLoad={()=>{
            
        }}>
            {children}
        </DishContext.Provider>
    )
    
}

export default DishContextProvider;