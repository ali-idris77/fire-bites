import { useState, useEffect, useRef } from 'react';
//import Cropper from 'cropperjs';
//import 'cropperjs/dist/cropper.css';
//import { toast } from 'react-toastify';
import useAdminAuthContext from '../../../hooks/useAdminAuthContext';
import ProfileNav from '../../../components/ProfileNav';
//import Wallet from './Wallet';
//import Appearance from './Appearance';
import Security from './Security';
import Legal from './Legal';
//import Loading from '../../components/Loading';
import Dashload from '../../../components/Dashload'

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  // Hardcoded profile data
  // const [editMode, setEditMode] = useState(false);
  // const [tempProfile, setTempProfile] = useState(null);
  // const [skillInputs, setSkillInputs] = useState(['']);
  // const [avatarPreview, setAvatarPreview] = useState('');
  // const [rawAvatar, setRawAvatar] = useState('');
  // const [cropper, setCropper] = useState(null);
  // //const cropperRef = useRef(null);
  const [active, setActive] = useState('profile')
  
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

  
  if(isLoading){
    return <Dashload/>
  }

  return (
    <div className="wrapper profile-wrapper page-fade">
      <ProfileNav active={active} setActive={setActive}/>

      {active === 'profile' && (
        <div className="profile-tab">
          <h2>Profile</h2>
          <div className="profile-info nice">
            <p><strong>Name:</strong> {profile?.fullname || 'Not set yet'}</p>
            <p><strong>Email:</strong> {profile?.email || 'Not set yet'}</p>
            <p><strong>Phone:</strong> {profile?.phone || 'Not set yet'}</p>
            <p><strong>Level:</strong> {profile?.level || 'Not set yet'}</p>
            <button className='ghost-btn' >Request Profile Edit</button>
          </div>
        </div>
      )}

      {/* {active === 'wallet' && <Wallet profile={profile} setProfile={setProfile}/>} 
      {active === 'app' && <Appearance profile={profile} setProfile={setProfile}/>}  */}
      {active === 'sec' && <Security profile={profile} setProfile={setProfile}/>} 
      {active === 'lgl' && <Legal profile={profile} setProfile={setProfile}/>} 

    </div>
  );
}
