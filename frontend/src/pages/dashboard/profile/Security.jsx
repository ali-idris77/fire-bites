import { useState } from 'react';
//import {toast} from 'react-toastify'
import useAdminAuthContext from '../../../hooks/useAdminAuthContext'

export default function Security({profile}) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const {admin} = useAdminAuthContext()
  const email = admin.user
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('')
    if (newPass.length < 8) return setMessage('Password must be at least 8 characters.');
    if (newPass !== confirm) return setMessage('Passwords do not match.');
    fetch(`${import.meta.env.VITE_API_URL}/api/user/password`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ email, current, newPass })
    }).then(res=>{
      if(res.ok){
        setCurrent(''); setNewPass(''); setConfirm('');
        // toast.success('Password changed successfully')
      }
      return res.json()   
}).then(data =>{
  if(data.error){
    setMessage(data.error)
  }
})

  };

  return (
    <div className="profile-tab security-page">
      <div className="illustration">🔐</div>
      <h2>Security</h2>
      <p>Review your security settings and protect your account.</p>

      <form onSubmit={handleSubmit} className="security-form">
        <label>Current Password<input type="password" value={current} onChange={e => setCurrent(e.target.value)} /></label>
        <label>New Password<input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} /></label>
        <label>Confirm Password<input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} /></label>
        <button type="submit" className="primary">Update Password</button>
        {message && <p className='hint'>{message}</p>}
      </form>
      

      <div className="security-extra">
        <strong>Two-factor authentication: </strong> not configured (future enhancement)
      </div>
    </div>
  );
}

