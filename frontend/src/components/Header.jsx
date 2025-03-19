import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUsername('');
    navigate('/login'); 
  };

  return (
    <header className="bg-blue-600 text-white shadow-md py-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6">
        <div className="flex items-center space-x-6">
          <Link to="/">
            <h1 className="text-2xl font-bold">Task Distributor</h1>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/agent-management" className="hover:text-blue-300 transition-all">
                  Agent Management
                </Link>
              </li>
              <li>
                <Link to="/task-management" className="hover:text-blue-300 transition-all">
                  Task Management
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <nav>
          <ul className="flex space-x-6">
            {username ? (
              <>
                <li className="text-white cursor-pointer font-semibold">
                  Hello, {username}!
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-red-300 transition-all"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-blue-300 transition-all">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-blue-300 transition-all">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
