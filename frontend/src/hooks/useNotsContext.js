import { useContext } from "react";
import { NotContext } from "../context/NotContext";

 const useNotsContext = ()=>{
    const context = useContext(NotContext)
    if(!context){
        throw Error('use context in Notscontextprovder only')
    }
    return context
}
export default useNotsContext