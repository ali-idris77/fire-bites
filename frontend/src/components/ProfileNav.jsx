import {useState} from 'react'
import Icon from './Icon'
const ProfileNav = ({active, setActive}) => {
    const [open, setOpen] = useState(false)
    const tabs = [
      {key:'profile', label:'Profile', icon:'user'},
      {key:'sec', label:'Security', icon:'guard'},
      {key:'lgl', label:'Legal', icon:'legal'}
    ];
    return ( 
        <>   
        <div className="heda">
        <button className='slide-btn'onClick={()=>{
                        setOpen(true)
                    }}>
            <Icon name='slider'/>
        </button>
        </div>
         <div className={`profile-nav ${open ? 'open' : ''}`}>
            <nav>
                <ul>
                    <button className='close-btn' onClick={()=>{
                        setOpen(false)
                    }}>&times;</button>
                    {tabs.map(tab => (
                        <li key={tab.key} className={active === tab.key ? 'active': ''}>
                            <button type="button" onClick={() => {setActive(tab.key)
                                setOpen(false)
                            }}><Icon name={tab.icon}/> {tab.label}</button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
        </>
     );
}
 
export default ProfileNav;