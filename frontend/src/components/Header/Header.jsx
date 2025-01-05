import React, { useRef, useEffect, useState, useContext } from 'react';
import { Container, Row, Button } from 'reactstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png';
import './header.css';

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
    setDropdownOpen(false);
  };

  const navigateToProfile = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  const navigateToBookings = () => {
    navigate('/bookings');
    setDropdownOpen(false);
  };

  const handleClickOutside = (e) => {
    if (dropdownOpen && !e.target.closest('.user__info')) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current?.classList.add('sticky__header');
      } else {
        headerRef.current?.classList.remove('sticky__header');
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className='header' ref={headerRef}>
      <Container>
        <Row>
          <div className='nav__wrapper d-flex align-items-center justify-content-between'>
            <div className='logo'>
              <Link to='/'>
                <img src={logo} alt='Travel World' />
              </Link>
            </div>

            <div className={`navigation ${mobileMenuOpen ? 'show__menu' : ''}`} ref={menuRef}>
              <ul className='menu d-flex align-items-center gap-5'>
                <li className='nav__item'>
                  <NavLink 
                    to='/' 
                    className={({isActive}) => isActive ? 'active__link' : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </NavLink>
                </li>
                <li className='nav__item'>
                  <NavLink 
                    to='/tours' 
                    className={({isActive}) => isActive ? 'active__link' : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tours
                  </NavLink>
                </li>
                <li className='nav__item'>
                  <NavLink 
                    to='/about' 
                    className={({isActive}) => isActive ? 'active__link' : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className='nav__right d-flex align-items-center gap-4'>
              {user ? (
                <div className='user__info'>
                  <div className='user__dropdown-toggle' onClick={toggleDropdown}>
                    <i className='ri-user-line'></i>
                    <span>{user.username}</span>
                  </div>
                  {dropdownOpen && (
                    <div className='dropdown-menu'>
                      <div className='dropdown-item' onClick={navigateToProfile}>
                        <i className='ri-user-settings-line'></i>
                        Profile
                      </div>
                      <div className='dropdown-item' onClick={navigateToBookings}>
                        <i className='ri-calendar-check-line'></i>
                        My Bookings
                      </div>
                      <div className='dropdown-item' onClick={logout}>
                        <i className='ri-logout-box-line'></i>
                        Logout
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Button className='btn secondary__btn'>
                    <Link to='/login'>Login</Link>
                  </Button>
                  <Button className='btn primary__btn'>
                    <Link to='/register'>Register</Link>
                  </Button>
                </>
              )}
              <span className='mobile__menu' onClick={toggleMobileMenu}>
                <i className='ri-menu-line'></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
