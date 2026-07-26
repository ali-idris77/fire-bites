import Swal from 'sweetalert2'

const useAuthSwal = async () => {
    const {value} = await Swal.fire({
        title:'We Need A little Information From You',
        html:`<div className='form-action'>
        <label htmlFor='sw-eml'>Email</label>
        <input type='email' id='sw-eml'>
        </div>
        <div className='form-action'>
        <label htmlFor='sw-phn'>Phone</label>
        <input type='tel' id='sw-phn'>
        </div>`,
        confirmButtonText:'Submit',
        confirmButtonColor:'#eb2f00',
        preConfirm: ()=>{
            const email = document.getElementById('sw-eml').value
            const phone = document.getElementById('sw-phn').value
            if(!email){
                Swal.showValidationMessage("Email is required")
                return false
            }
            if(!phone){
                Swal.showValidationMessage("Phone number is required")
                return false
            }
            return {
                email,
                phone
            }
        }
    });
    return {value}
}
 
export default useAuthSwal;