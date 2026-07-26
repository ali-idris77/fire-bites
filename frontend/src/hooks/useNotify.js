import useAdminAuthContext from './useAdminAuthContext'
import useAuthContext from './useAuthContext'
import useNotsContext from './useNotsContext'

export default function useNotify() {
    const {nots, dispatch} = useNotsContext()
    const {user} = useAuthContext()
    const {admin} = useAdminAuthContext()
    const notify = async (title, type, message, meantFor,reserv=null , reason=null)=>{
       try{
         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/nots/create`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${user ? user.token : admin.token}`
            },
            body: JSON.stringify({title, type, message, meantFor,reserv, reason})
        })
        const data = await res.json()
       }catch(err){
        console.log(err)
       }
    }
    return{
        notify
    }
}
