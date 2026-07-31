import { useState, useEffect, useRef } from 'react';
import useAuthContext from '../hooks/useAuthContext';
import ProfileNav from '../components/ProfileNav';
import Dashload from '../components/Dashload'
import { errtoast, succtoast } from '../hooks/useToast'
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [active, setActive] = useState('profile')
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState(null);
  
  const {user} = useAuthContext()
  
  useEffect(()=>{
    if(!user) return
    setIsLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/user/profile-user`,
      {
        headers:{"authorization":`Bearer ${user.token}`}
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

  const handleEditSave = async () => {
    const updatedProfile = {
      ...tempProfile,
      profile: {
        ...tempProfile?.profile
      }
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile-update/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedProfile)
      });
      if (!res.ok) {
        console.log('erred')
        return;
      }
      const data = await res.json();
      setProfile(data);
      setTempProfile(data);
      succtoast('Profile saved successfully.');
    } catch (error) {
      console.error('Profile update failed', error);
      errtoast('Profile update failed. Please try again.');
    } finally {
      setEditMode(false);
    }
  };

  const handleEditCancel = () => {
    setTempProfile({ ...profile });
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempProfile({ ...tempProfile, profile:{...tempProfile?.profile,[name]: value} });
  };

  
  if(isLoading){
    return <Dashload/>
  }

  return (
    <div className="wrapper profile-wrapper page-fade">
      <div className="profile-tab">
          <h2>Profile</h2>
          <div className="profile-info nice">
            <p><strong>Name:</strong> {profile?.address || 'Not set yet'}</p>
            <p><strong>Email:</strong> {profile?.email || 'Not set yet'}</p>
            <p><strong>Phone:</strong> {profile?.phone || 'Not set yet'}</p>
           <button className='ghost-btn' onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>

          {editMode && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Edit Profile</h3>
                <form>
                 <label>
                    Phone:
                    <input
                      type="tel"
                      name="phone"
                      value={tempProfile?.profile?.phone || ''}
                      onChange={handleInputChange}
                    />
                  </label>
                   <label>
                    Address:
                    <input
                      type="text"
                      name="address"
                      value={tempProfile?.profile.address || ''}
                      onChange={handleInputChange}
                    />
                  </label>
                  
                  <button type="button" onClick={handleEditSave}>Save</button>
                  <button type="button" onClick={handleEditCancel}>Cancel</button>
                </form>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
