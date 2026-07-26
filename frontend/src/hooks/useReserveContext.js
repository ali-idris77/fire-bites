import { useContext } from "react";
import { ReserveContext } from "../context/ReserveContext";

 const useReserveContext = ()=>{
    const context = useContext(ReserveContext)
    if(!context){
        throw Error('use context in reservecontextprovder only')
    }
    return context
}
export default useReserveContext