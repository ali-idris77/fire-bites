import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import useLogout from '../hooks/useLogout'
import useAdminAuthContext from '../hooks/useAdminAuthContext';
import useNotsContext from '../hooks/useNotsContext';

export default function DashHead({ toggleSidebar }) {
  const { logout } = useLogout();
  const { admin } = useAdminAuthContext();
  const { nots } = useNotsContext();
  const navigate = useNavigate();
  
  const unreadCount = nots?.filter((n) => !n.isRead).length || 0;
  const initials = admin?.user ? admin.user.split('@')[0].slice(0, 1).toUpperCase() : 'JD';

  return (
    <header className="dash-head">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <Icon name='menu' />
      </button>
      <div className="h-profile-div">
        <span className="notif-spn dsh" onClick={() => navigate('/notifications')}>
          <Icon name='notif'/>
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </span>
        <div className="avatar">
          {initials}
        </div>
        <button onClick={() => logout()}><Icon name='logout' /></button>
      </div>
    </header>
  )
}
