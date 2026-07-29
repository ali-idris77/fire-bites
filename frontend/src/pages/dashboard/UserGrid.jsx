import { useEffect, useState } from "react"
import useAdminAuthContext from '../../hooks/useAdminAuthContext'
import useToast from '../../hooks/useToast'
import Dashload from '../../components/Dashload'
import Swal from 'sweetalert2'
import { Link } from "react-router-dom"
import useNotify from "../../hooks/useNotify"
import { socket } from "../../sockets/socket"
import Skeleton from "../../components/Skeleton"

export default function UserGrid() {
      const [load, setLoad] = useState(false)
      const [staffs, setStaffs] = useState([])
      const [cust, setCust] = useState([])
      const [updl, setUpdl] = useState(false)
      const [search, setSearch] = useState('')
      const [csearch, setcSearch] = useState('')
      const [status, setStatus] = useState('')
      const [level, setLevel] = useState('')
      const [srch, setSrch] = useState('')
      const [err, setErr] = useState(null)
      const {admin} = useAdminAuthContext()
      const {errtoast, succtoast} = useToast()
      const {notify} = useNotify()

      const lvls = ['intern', 'Junior Staff', 'Senior Staff', 'Manager']
      useEffect(()=>{
        const fetchUsers = async()=>{
          setLoad(true)
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/users`,{
          headers:{'authorization':`Bearer ${admin.token}`}})
          const data = await res.json()
          if(res.ok){
            setErr(null)
            setLoad(false)
            setStaffs(data.staffs)
            setCust(data.customers)
          }else{
            setErr('something went wrong')
            setLoad(false)
          }
        }

        fetchUsers()
        socket.on("new-user", usr=>{
          fetchUsers(



            
          )
        })
        return ()=>{
          socket.off("new-user")
        }
      },[])
    const stf = staffs.filter(s => s.level !== 5)
    const filteredStaffs = stf.filter(d => {
    const query = {
      search: search.trim().toLowerCase(),
      status,
      level
     }
    if(query.search && ![d.fullname, d.email].some(txt => txt?.toLowerCase().includes(query.search))) return false
    if(query.level && d.level !== Number(query.level)) return false
    return true
  })

  const filteredCust = cust.filter(d => {
    const query = {
      search: csearch.trim().toLowerCase()
     }
    if(query.search && !d.email.toLowerCase().includes(query.search)) return false
    return true
  })
  const editSwal = async (u)=>{
    console.log(u)
    const result = await Swal.fire({
      title:'Edit Staff Info',
      html:`
      <div class='form-control'>      
      <label>Staff's Fullname</label>
      <input type='text' placeholder='Fullname Of Staff' id='nme' value='${u.fullname}' />
      </div>
      <div class='form-control'>
      <label>Staff's Phone</label>
      <input type='text' placeholder='Staff Phone Number' id='phn' value='${u.phone}' />
      </div>
      `,
      confirmButtonText:'Edit Staff',
      showCancelButton:true,
      allowOutsideClick:false,
      focusConfirm:false,
      preConfirm(){
        return {
          fullname: document.getElementById('nme').value,
          phone: document.getElementById('phn').value
        }
      }
    })
    if(result.isConfirmed){
      console.log(result.value)
      try{
      setUpdl(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${u._id}`,{
        method:'PATCH',
        headers:{
            'Content-Type':'application/json',
            'authorization':`Bearer ${admin.token}`},
        body:JSON.stringify(result.value)    
          })
    const data = await res.json()
    if(res.ok){
      setUpdl(false)
    const newStf = staffs.map(s => s._id === data._id ? data : s)
    setStaffs(newStf)
    succtoast('Staff Edited Successfully')
  }else{
    setUpdl(false)
    errtoast('Something went wrong. Try again later.')
  }
  }catch(err){
    setUpdl(false)
    console.log(err)
  }
    }
  }

  const editUser = async(id, value, type)=>{
    try{
      setUpdl(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${id}`,{
        method:'PATCH',
        headers:{
            'Content-Type':'application/json',
            'authorization':`Bearer ${admin.token}`},
        body:JSON.stringify(value)    
          })
    const data = await res.json()
    if(res.ok){
      setUpdl(false)
    const newStf = staffs.map(s => s._id === data._id ? data : s)
    setStaffs(newStf)
    succtoast('Staff Edited Successfully')
    switch(type){
      case 'promote':
        notify('Promotion', 'announcement', `Congratulations ${data.fullname} you have been promoted to ${lvls[data.level - 1]}, keep it up.`, data.email)
        break;
      case 'demote':
        notify('Demotion', 'announcement', `${data.fullname} you have been demoted to ${lvls[data.level - 1]}`, data.email)
        break;
      case 'suspend':
        notify('Suspension', 'announcement', `${data.fullname} you have been suspended by ${admin.user.split('@')[0]}`, data.email)
        break;
      case 'unsuspend':
        notify('unSuspension', 'announcement', `${data.fullname} you have been unsuspended by ${admin.user.split('@')[0]}`, data.email)
        break;
      default:
        return true
    }
  }
  }catch(err){
    setUpdl(false)
    console.log(err)
    errtoast('Something went wrong. Try again later.')
  }
  }
  const viewSwal = (u)=>{
    Swal.fire({
      title:'View Staff',
      html:`
      <div class='vswl'>
       <div class="info">
                <h4>Full Name : <span>${u.fullname}</span></h4>
                <h4>Email : <span>${u.email}</span></h4>
                <h4>Phone : <span>${u.phone}</span></h4>
        </div>
        <div class="info t2">
                <h4>Level : <span>${lvls[u.level - 1]}</span></h4>
                <h4>Status : <span>${u.isSuspended ? 'Suspended' : 'Active'}</span></h4>
                <h4>Date Joined : <span>${new Date(u.createdAt).toDateString()}</span></h4>
        </div>
              </div>        
      `
})
  }
  const mgnStaff = async (u)=>{
    Swal.fire({
      title:'Manage Staff',
      html:`
      <div class='btd'>
      <button id='pmt'>Promote</button>
      <button id='dmt'>Demote</button>
      <button id='ssp'>Suspend</button>
      <button id='fre'>Fire</button>
      </div>
      `,
      showCloseButton:true,
      showConfirmButton:false,
      allowOutsideClick:false,
      didOpen(){
        if(u.level === 4){
        document.getElementById('pmt').disabled = true
        }else if(u.level === 1){
          document.getElementById('dmt').dsabled = true
        }
        document.getElementById('pmt').addEventListener('click',()=>{
          Swal.close()
          const newLvl = Number(u.level + 1)
          editUser(u._id, {level:newLvl}, 'promote')
        })
        document.getElementById('dmt').addEventListener('click',()=>{
          Swal.close()
          const newLvl = Number(u.level - 1)
          editUser(u._id, {level:newLvl}, 'demote')
        })
        if(u.isSuspended){
           document.getElementById('ssp').textContent('Unsuspend')
           document.getElementById('ssp').addEventListener('click',()=>{
            Swal.close()
           editUser(u._id, {isSuspended:false}, 'suspend')
        })
          }
        document.getElementById('ssp').addEventListener('click',()=>{
          Swal.close()
          editUser(u._id, {isSuspended:true}, 'unsuspend')
        })
        document.getElementById('fre').addEventListener('click',async ()=>{
          Swal.close()
          try{
      setUpdl(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user//${u._id}`,{
        method:'DELETE',
        headers:{
            'authorization':`Bearer ${admin.token}`},
        })
      if(res.ok){
        setUpdl(false)
      const newStf = staffs.filter(s => s._id !== u._id )
      setStaffs(newStf)
      }
      }catch(err){
        setUpdl(false)
        console.log(err)
      }
          })
        }
    })
  }

  return (
    <>
      {updl && <Dashload/>}
      <div className="staff">
        <section className='filter-sect'>
          <h2>Staffs</h2>
      <div className="filter-div">
      <div className="search">
        <input className='search-inp' type="text" value={search}
        placeholder='search orders by customer name'
        onChange={(e)=>{
          setSearch(e.target.value)
        }}/>
      </div>
      <div className="filt" onChange={(e)=>{
        console.log(e.target.value)
         setLevel(e.target.value)
      }}>
        <select name="" id="">
          <option value="">All</option>
          <option value={1}>Intern</option>
          <option value={2}>Juniot Staffs</option>
          <option value={3}>Senior Staffs</option>
          <option value={4}>Manager level</option>
          </select>
        </div>        
        </div>       
    </section>
    <section className="stfs">
      <div className="bts">
      <Link to='/dashboard/users/create'><button>Add Staff</button></Link>
      <button>Bulk Add</button>
      </div>
      {
        load ? Array.from({length: 5}).map((_, i)=>{
                return(
                  <div className="skelCard">
                <Skeleton height="1.5rem" width="50%"/>
                <Skeleton width="25%"/>
                <Skeleton width="50%"/>
                <Skeleton width="35%%"/>
                
              </div>)}) :
        <div className="rsvdiv usr">
         {filteredStaffs && filteredStaffs.length > 0 ? filteredStaffs.map(s =>{
            return(
            <div className="usr-card" key={s._id}>
              <div className="info">
                <h4>Full Name : <span>{s.fullname}</span></h4>
                <h4>Email : <span>{s.email}</span></h4>
                <h4>Phone : <span>{s.phone}</span></h4>
              </div>
              <div className="info t2">
                <h4>Level : <span>{lvls[s.level - 1]}</span></h4>
                <h4>Status : <span>{s.isSuspended ? 'Suspended' : 'Active'}</span></h4>
                <h4>Date Joined : <span>{new Date(s.createdAt).toDateString()}</span></h4>
              </div>
              <div className="action">
                <div className="inact"><button onClick={()=>{
                  viewSwal(s)
                }}>View</button></div>
                <div className="inact"><button onClick={()=>{
                  editSwal(s)
                }}>Edit</button></div>
                <div className="inact"><button onClick={()=>{
                  mgnStaff(s)
                }}>Manage</button></div>
              </div>
            </div>)
          }) :
          <h3 className="empty-state">No Staffs Employed Yet...</h3>}
        </div>
        }
    </section>
      </div>
      <div className="cust">
      <section className='filter-sect'>
          <h2>Customers</h2>
      <div className="filter-div">
      <div className="search">
        <input className='search-inp' type="text" value={csearch}
        placeholder='search orders by customer name'
        onChange={(e)=>{
          setcSearch(e.target.value)
        }}/>
      </div>
        </div>       
    </section>
    <section className="cust">
      {
        load ? Array.from({length: 5}).map((_, i)=>{
                return(
                  <div className="skelCard">
                <Skeleton height="1.5rem" width="50%"/>
                <Skeleton width="25%"/>
                <Skeleton width="50%"/>
                <Skeleton width="35%%"/>
                
              </div>)}) :
        (<div className="rsvdiv">
          {filteredCust && filteredCust.length > 0 ? filteredCust.map(s =>{
            return(<div className="usr-card" key={s._id}>
              <div className="info">
                <h4>Email : <span>{s.email}</span></h4>
                <h4>Phone : <span>{s.phone}</span></h4>
              </div>
              <div className="info">
                <h4>Date Joined : <span>{new Date(s.createdAt).toDateString()}</span></h4>
              </div>
              
            </div>)
          }) :
          (<h3 className="empty-state">No customer data yet Yet...</h3>)}
        </div>)
      }
    </section>
      </div>
    </>
  )
}
