import Icon from "./Icon";
import Logo from "./Logo";
import { NavLink } from "react-router-dom";

export default function Sidenav({ isOpen, setIsOpen }) {
  return (
        <nav className={`side-nav ${isOpen ? 'open' : ''}`}>
        <Logo/>
        <ul>
            <NavLink to='/dashboard' end  onClick={() => setIsOpen(false)}><Icon name='overview'/> Overview</NavLink>
            <NavLink to='/dashboard/dishes' onClick={() => setIsOpen(false)}><Icon name='dishes'/> Dishes</NavLink>
            <NavLink to='/dashboard/reservations' onClick={() => setIsOpen(false)}><Icon name='reserves'/> Reservations</NavLink>
            <NavLink to='/dashboard/users' onClick={() => setIsOpen(false)}><Icon name='staff'/> Staff & Users</NavLink>
            <NavLink to='/dashboard/orders' onClick={() => setIsOpen(false)}><Icon name='orders'/> Orders</NavLink>
            <NavLink to='/dashboard/analytics' onClick={() => setIsOpen(false)}><Icon name='analytics'/> Analytics</NavLink>
            <NavLink to='/dashboard/profile' onClick={() => setIsOpen(false)}><Icon name='profile'/> Profile</NavLink>
        </ul>
        </nav>
  )
}
