import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-text">{t.navbar.brand}</span>
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">{t.navbar.home}</Link>
          </li>
          <li className="navbar-item">
            <Link to="/tarihce" className="navbar-link">{t.navbar.history}</Link>
          </li>
          <li className="navbar-item">
            <Link to="/tarifler" className="navbar-link">{t.navbar.recipes}</Link>
          </li>
          <li className="navbar-item">
            <button
              className="lang-toggle"
              onClick={toggleLanguage}
              aria-label={language === 'tr' ? 'Switch to English' : "Türkçe'ye geç"}
            >
              {language === 'tr' ? 'EN' : 'TR'}
            </button>
          </li>
          <li className="navbar-item">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? t.navbar.switchToDark : t.navbar.switchToLight}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
