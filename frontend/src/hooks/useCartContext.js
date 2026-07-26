import { useContext } from "react"
import { cartContext } from "../context/CartContext"

const useCartContext = ()=>{
    const context = useContext(cartContext)
    if(!context){
        throw Error('can only use context in use cart context')
    }
    return context
}
export default useCartContext