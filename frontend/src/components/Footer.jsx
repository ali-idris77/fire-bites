import Logo from "./Logo";
import { Link } from "react-router-dom";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Logo />
          <p>Serving bold flavors, warm hospitality, and memorable bites in every visit.</p>
        </div>

        <div className="footer-links">
          <h3>Explore</h3>
          <nav>
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-contact">
          <h3>Visit us</h3>
          <a href="mailto:hello@fireybites.com">hello@fireybites.com</a>
          <a href="tel:+2348000000000">+234 800 000 0000</a>
          <Link to="/admin/login">Staff Login</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} Firey Bites</span>
        <span>Crafted for comfort, flavor, and community.</span>
      </div>
    </footer>
  );
}
