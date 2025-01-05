import React, { useRef, useEffect, useContext, useState } from 'react'
import { Container, Row, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './header.css'
import { AuthContext } from './../../context/AuthContext'

const nav__links = [
  {
    path: '/home',
    display: 'Home'
  },
  {
    path: '/tours',
    display: 'Tours'
  },
  {
    path: '/about',
    display: 'About'
  }
];

const Header = () => {
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const stickyHeaderFunc = () => {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky__header');
      } else {
        headerRef.current.classList.remove('sticky__header');
      }
    });
  };

  useEffect(() => {
    stickyHeaderFunc();
    return () => window.removeEventListener('scroll', stickyHeaderFunc);
  }, []);

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            {/* Logo */}
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="Travel World logo" />
              </Link>
            </div>

            {/* Main Navigation */}
            <div className={`navigation ${mobileMenuOpen ? 'show__menu' : ''}`}>
              <ul className="menu d-flex align-items-center gap-5">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={navClass => navClass.isActive ? 'active__link' : ''}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Navigation */}
            <div className="nav__right d-flex align-items-center gap-4">
              {user ? (
                <div className="d-flex align-items-center gap-3">
                  <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle className="user__dropdown">
                      <div className="user__info">
                        <i className="ri-user-line"></i>
                        <span>{user.username}</span>
                      </div>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem tag={Link} to="/profile">
                        <i className="ri-user-settings-line"></i> Profile
                      </DropdownItem>
                      <DropdownItem tag={Link} to="/bookings">
                        <i className="ri-book-mark-line"></i> My Bookings
                      </DropdownItem>
                      {user.role === 'admin' && (
                        <DropdownItem tag={Link} to="/admin">
                          <i className="ri-dashboard-line"></i> Dashboard
                        </DropdownItem>
                      )}
                      <DropdownItem divider />
                      <DropdownItem onClick={logout}>
                        <i className="ri-logout-box-line"></i> Logout
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              ) : (
                <div className="nav__btns d-flex align-items-center gap-4">
                  <Button className="btn secondary__btn">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button className="btn primary__btn">
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <div className="mobile__menu" onClick={toggleMobileMenu}>
                <i className={`ri-menu-${mobileMenuOpen ? 'fold' : 'unfold'}-line`}></i>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
