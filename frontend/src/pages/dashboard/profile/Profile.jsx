import { useState, useEffect, useRef } from 'react';
import useAdminAuthContext from '../../../hooks/useAdminAuthContext';
import ProfileNav from '../../../components/ProfileNav';
import Security from './Security';
import Legal from './Legal';
import Dashload from '../../../components/Dashload'
import useNotify from '../../../hooks/useNotify';
import Swal from 'sweetalert2';
import Skeleton from '../../../components/Skeleton'

export default function Profile() {
  const [profile, setProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [active, setActive] = useState('profile')
  const {notify} = useNotify()
  
  const {admin} = useAdminAuthContext()
  useEffect(()=>{
    if(!admin) return
    setIsLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`,
      {
        headers:{"authorization":`Bearer ${admin.token}`}
      }
    )
    .then(res => res.json())
    .then(data => {
      setProfile(data)
      setIsLoading(false)
      
    }).catch(err =>{
      setIsLoading(false)
      console.log(err)
    })
  }, [])

  return (
    <div className="wrapper profile-wrapper page-fade">
      <ProfileNav active={active} setActive={setActive}/>

      { isLoading ? <div className="profile-info">
              <Skeleton  height='1.2rem' width='60%'/>
              <Skeleton height='1.2rem' width='65%'/>
              <Skeleton height='1.2rem' width='40%'/>
              <Skeleton height='2.rem' width='4rem' radius='20px'/>
            </div> : active === 'profile' && 
        <div className="profile-tab">
          <h2>Profile</h2>
          <div className="profile-info nice">
            <p><strong>Name:</strong> {profile?.fullname || 'Not set yet'}</p>
            <p><strong>Email:</strong> {profile?.email || 'Not set yet'}</p>
            <p><strong>Phone:</strong> {profile?.phone || 'Not set yet'}</p>
            <p><strong>Level:</strong> {profile?.level || 'Not set yet'}</p>
            <button className='ghost-btn' onClick={()=>{
              notify('Profile Change Request', 'announcement', `${profile?.fullname} wants to request a profile edit`,'mgt')
            }}>Request Profile Edit</button>
          </div>
        </div>
      }

      {active === 'sec' && <Security profile={profile} setProfile={setProfile}/>} 
      {active === 'lgl' && <Legal profile={profile} setProfile={setProfile}/>} 

    </div>
  );
}
