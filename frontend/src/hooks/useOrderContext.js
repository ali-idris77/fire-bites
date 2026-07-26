import { useContext } from "react";
import { OrderContext } from "../context/OrderContext";

 const useOrderContext = ()=>{
    const context = useContext(OrderContext)
    if(!context){
        throw Error('use context in Ordercontextprovder only')
    }
    return context
}
export default useOrderContext