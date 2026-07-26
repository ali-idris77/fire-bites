import { useContext } from "react";
import { AdminAuthContext } from "../context/AdminAuthContext";

 const useAdminAuthContext = ()=>{
    const context = useContext(AdminAuthContext)
    if(!context){
        throw Error('use context in AdminAuthcontextprovder only')
    }
    return context
}
export default useAdminAuthContext