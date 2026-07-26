import { Link, Outlet } from "react-router-dom";
import {useState} from 'react'
import Sidenav from "../components/Sidenav";
import Icon from "../components/Icon";
import DashHead from "../components/DashHead";

export default function DashBoardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="dashlayout">
    <Sidenav isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
     {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
    <main>
      <DashHead toggleSidebar={()=>{setSidebarOpen(!sidebarOpen)}}/>
        <Outlet/>
    </main>
    </div>
  )
}
