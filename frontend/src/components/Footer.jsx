import Logo from "./Logo";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer>
        <div className="fts1">
            <Logo/>
            <div className="fts"></div>
            <div className="lin">
              <Link to='/admin/login'>Staff Login</Link>
            </div>
            <div className="dte">&copy; Firey Bites {new Date().getFullYear()}</div>
        </div>
    </footer>
  )
}
