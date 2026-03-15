import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import logo from '../assets/logo.png';

export default function NavBar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="nav">
      <Link to="/" className="brand">
        <img className="brandLogo" src={logo} alt="Logo" />
        <span className="brandText">FORUM APP BY LS</span>
      </Link>

      <nav className="navLinks">
        <NavLink to="/" end>Threads</NavLink>
        <NavLink to="/leaderboards">Leaderboards</NavLink>
        {user ? <NavLink to="/new">Buat Thread</NavLink> : null}
      </nav>

      <div className="navRight">
        {user ? (
          <div className="userBox">
            <img className="avatar" src={user.avatar} alt={user.name} />
            <span className="userName">{user.name}</span>
            <button className="btn" type="button" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <div className="authLinks">
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </div>
        )}
      </div>
    </header>
  );
}