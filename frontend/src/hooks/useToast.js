import Swal from "sweetalert2";

const useToast = ()=> {
    const toast = Swal.mixin({
        toast:true,
        position:'top-right',
        timer:3000,
        iconColor:'#f0f0f0',
        color:'#f0f0f0',
        showConfirmButton:false,
        timerProgressBar:true
    })
    const succtoast = (text)=>{
        toast.fire({
            title:text,
            icon:'success',
            background:'#37f871e8'
        })
    }
    const errtoast = (text)=>{
        toast.fire({
            title:text,
            icon:'error',
            background:'#fa1616a6'
        })
    }
    return { toast , errtoast, succtoast}
}
export default useToast