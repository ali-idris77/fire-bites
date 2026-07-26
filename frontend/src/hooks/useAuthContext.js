import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

 const useAuthContext = ()=>{
    const context = useContext(AuthContext)
    if(!context){
        throw Error('use context in Authcontextprovder only')
    }
    return context
}
export default useAuthContext