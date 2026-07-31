import { NavLink,Link } from "react-router-dom"
import Logo from "./Logo"
import Icon from "./Icon"
import { useState } from "react"
import useAuthContext from "../hooks/useAuthContext"
import useAdminAuthContext from "../hooks/useAdminAuthContext"
import useLogout from "../hooks/useLogout"
import useNotsContext from '../hooks/useNotsContext'
import { useNavigate } from "react-router-dom"

export default function Header() {
  const [drop , setDrop] = useState(false)
  const {user} = useAuthContext()
  const {admin} = useAdminAuthContext()
  const {logout} = useLogout()
  const { nots } = useNotsContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const tglOpn = ()=>{
    setOpen(!open)
  }
  const unreadCount = nots?.filter((n) => !n.isRead).length || 0;
  return (
    <header>
      <nav className={open ? 'open' : ''}>
        <span className="spn">
          <span onClick={()=>{
            tglOpn()
          }}>
        <Icon name="menu" className="mnubtn"/>
        </span>
        <Logo/>
        </span>
        <ul className={open ? 'open' : ''}>
        <NavLink to='/' onClick={()=>{
            tglOpn()
          }}>Home</NavLink>
        <NavLink to='/about' onClick={()=>{
            tglOpn()
          }}>About</NavLink>
        <NavLink to='/menu' onClick={()=>{
            tglOpn()
          }}>Menu</NavLink>
        <NavLink to='/contact' onClick={()=>{
            tglOpn()
          }}>Contact</NavLink>
        </ul>
        <div className="socials"> 
          {!admin && <><Link to='/bag'><Icon name="bag" /></Link> </>}
          { user || admin ? 
          (
            <>
            <span className="notif-spn" onClick={() => navigate('/notifications')}>
                <Icon name='notif'/>
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </span>
            <div className="avatar pointer" onClick={()=>{
              if(!user)return
              navigate('/profile')
            }}>
              {user? user?.email?.slice(0,1).toUpperCase() : admin?.user?.slice(0,1).toUpperCase()}
            </div>
            <span onClick={()=>{
              logout()
            }}>
            <Icon className="pointer" name="logout"/>
            </span>
            </>
          )
          : (<div className="drop">
            <span 
            // onMouseEnter={()=>{setDrop(true)}} 
            // onMouseLeave={setDrop(false)} 
            onClick={()=>{
              if(drop) setDrop(false)
                else setDrop(true)
            }}
            ><div className="droptop">
              <Icon name="user" /><span className={`droparrow ${drop ? 'open' : ''}`}>▿</span>
             </div>
            </span>
            <div className={`dropchild ${drop ? 'open' : ''}`}
              onClick={()=>{
                setDrop(false)
              }}
            >
              <Link to='/signup'><button>Signup</button></Link>
              <Link to='/login'><button className="lgn">Login</button></Link>            
            </div>
          </div>)}
        </div>
      </nav>
    </header>
  )
}
