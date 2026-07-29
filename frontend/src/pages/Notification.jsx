import BackBtn from '../components/BackBtn'
import useNotsContext from '../hooks/useNotsContext'
import {formatDistanceToNow} from 'date-fns'
import Swal from 'sweetalert2'
export default function Notification() {
    const {nots, dispatch} = useNotsContext()
    const popup = async(d)=>{
        Swal.fire({ 
            title: d.title || 'No title',
            html: `<p>${d.message || 'No message'}</p>`,
            icon: d.type || 'info'
        }).then(()=>{
            fetch(`${import.meta.env.VITE_API_URL}/api/nots/update/${d._id}`,{
                method:'PATCH',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({isRead : true})
            }).then( res=> res.json())
            .then(data =>{
                dispatch({type:'UPDATE_NOT', payload:data})
            })
        })
    } 
   const fnots = nots.filter(n => !n.isRead)
  return (
    <>
    <BackBtn/>
    <section className="nots-list">
        <h2>Notifications</h2>
        {fnots && fnots.length > 0 ? fnots.map(n => (
          <div className={`not-div ${n.type}`} key={n._id} onClick={()=>{
            popup(n)
          }}>
            <p>{n.title || 'No title'}</p>
            <small>{formatDistanceToNow(new Date(n?.createdAt || Date.now()), {addSuffix:true})}</small>
          </div>
          
        )) : <h3 className='empty-state'>
            No Unread Notifications Yet.
        </h3>}
    </section>
    </>
  )
}
