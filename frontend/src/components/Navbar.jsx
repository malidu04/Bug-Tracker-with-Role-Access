import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaBug } from 'react-icons/fa';
import { logout } from '../redux/actions/authActions';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-md py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center font-bold text-xl">
          <FaBug className="mr-2" />
          <span>JIRA Clone</span>
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="px-3 py-1 rounded hover:bg-white hover:bg-opacity-20 transition">
              Dashboard
            </Link>
            <Link to="/projects" className="px-3 py-1 rounded hover:bg-white hover:bg-opacity-20 transition">
              Projects
            </Link>
            <Link to="/bugs" className="px-3 py-1 rounded hover:bg-white hover:bg-opacity-20 transition">
              Bugs
            </Link>
            <span className="ml-4">Welcome, {user?.name}</span>
            <button 
              onClick={handleLogout} 
              className="ml-2 px-3 py-1 border border-white rounded hover:bg-white hover:bg-opacity-20 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-3 py-1 rounded hover:bg-white hover:bg-opacity-20 transition">
              Login
            </Link>
            <Link to="/register" className="px-3 py-1 rounded hover:bg-white hover:bg-opacity-20 transition">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;