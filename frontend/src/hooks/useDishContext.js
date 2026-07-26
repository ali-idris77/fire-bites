import { useContext } from "react";
import { DishContext } from "../context/DishContext";

 const useDishContext = ()=>{
    const context = useContext(DishContext)
    if(!context){
        throw Error('use context in Dishcontextprovder only')
    }
    return context
}
export default useDishContext