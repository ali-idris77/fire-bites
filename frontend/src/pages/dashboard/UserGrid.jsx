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
      const [bulkLoading, setBulkLoading] = useState(false)
      const {admin} = useAdminAuthContext()
      const {errtoast, succtoast} = useToast()
      const {notify} = useNotify()

      const lvls = ['intern', 'Junior Staff', 'Senior Staff', 'Manager']

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

      const downloadBlob = (content, filename, type='text/csv') => {
        const blob = new Blob([content], { type })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      }

      const createReportCsv = (report) => {
        const rows = []
        rows.push('Category,fullname,email,level,tempPassword,row,reason,message')
        report.created.forEach(item => {
          rows.push(`created,${item.fullname || ''},${item.email || ''},${item.level || ''},${item.tempPassword || ''},,,`)
        })
        report.skipped.forEach(item => {
          rows.push(`skipped,,,,,${item.row || ''},${item.reason || ''},`)
        })
        report.errors.forEach(item => {
          rows.push(`error,,,,,${item.row || ''},,${item.message || ''}`)
        })
        return rows.join('\n')
      }

      const downloadTemplate = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/bulk/download-template`, {
            method: 'POST',
            headers: { 'authorization': `Bearer ${admin.token}` }
          })
          if (!res.ok) throw new Error('Template download failed')
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'staff-template.csv'
          document.body.appendChild(link)
          link.click()
          link.remove()
          URL.revokeObjectURL(url)
        } catch (error) {
          errtoast(error.message || 'Could not download template')
        }
      }

      const handleBulkUpload = async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/bulk/upload`, {
          method: 'POST',
          headers: { 'authorization': `Bearer ${admin.token}` },
          body: formData
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Bulk upload failed')
        }
        return data
      }

      const bulkAddSwal = async () => {
        await Swal.fire({
          title: 'Bulk Staff Import',
          html: `
            <p>Download the template, fill it in, then upload the completed CSV/XLSX file.</p>
            <div class='swal2-input'>
              <button type='button' id='downloadTemplate' class='swal2-confirm swal2-styled'>Download template</button>
              <button type='button' id='selectFile' class='swal2-confirm swal2-styled'>Select file</button>
              <input type='file' id='bulkFile' accept='.csv,.xls,.xlsx' style='display:none' />
              <div id='bulkFileName' style='margin-top:12px; font-size:0.95rem; color:#444;'></div>
            </div>
          `,
          showCloseButton: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            const fileInput = document.getElementById('bulkFile')
            const fileName = document.getElementById('bulkFileName')
            document.getElementById('downloadTemplate').addEventListener('click', downloadTemplate)
            document.getElementById('selectFile').addEventListener('click', () => fileInput.click())
            fileInput.addEventListener('change', async (event) => {
              const file = event.target.files[0]
              if (!file) return
              fileName.textContent = `Selected: ${file.name}`
              try {
                setBulkLoading(true)
                const uploaded = await handleBulkUpload(file)
                setBulkLoading(false)
                const reportCsv = createReportCsv(uploaded.report)
                downloadBlob(reportCsv, 'staff-upload-report.csv')
                succtoast('Bulk upload finished; report downloaded.')
                fetchUsers()
                Swal.close()
              } catch (error) {
                setBulkLoading(false)
                errtoast(error.message || 'Bulk upload failed')
              }
            })
          }
        })
      }

        const bulkButton = () => (
          <button onClick={bulkAddSwal} disabled={bulkLoading}>
            {bulkLoading ? 'Uploading...' : 'Bulk Add'}
          </button>
        )

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
          fetchUsers()
        })
      return ()=>{  
        socket.off("new-user")
      }
      }, [])
        const editSwal = async (u) => {
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
          document.getElementById('dmt').disabled = true
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

  const filteredStaffs = staffs.filter(s => {
    const matchesSearch = s.fullname.toLowerCase().includes(search.toLowerCase())
    const matchesLevel = level ? s.level === Number(level) : true
    return matchesSearch && matchesLevel
  })
  const filteredCust = cust.filter(c => {
    const matchesSearch = c.email.toLowerCase().includes(csearch.toLowerCase())
    return matchesSearch
  })
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
      {bulkButton()}
      </div>
      {
        load ? Array.from({length: 5}).map((_, i)=>{
                return(
                  <div className="skelCard" key={i}>
                <Skeleton height="1.5rem" width="50%"/>
                <Skeleton width="25%"/>
                <Skeleton width="50%"/>
                <Skeleton width="35%%"/>
                
              </div>)}) :
        <div className="rsvdiv usr stagger">
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
                  <div className="skelCard" key={i}>
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
