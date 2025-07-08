import { useContext } from 'react';
import { NavLink } from 'react-router';
import {AuthContext} from "../../contexts/AuthContext.jsx";
import logo from '../../assets/logo (3).png'


const Header = () => {
    const { user, logOut } = useContext(AuthContext);

    return (
        <nav className=" border-gray-200 shadow-sm dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={logo} className="h-8" alt="Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          </span>
                </NavLink>

                {/* Profile + Hamburger Toggle */}
                <div className="flex items-center md:order-2 space-x-3">
                    {user ? (
                        <>
                            {/* Profile Avatar */}
                            <div className="relative group">
                                <button
                                    type="button"
                                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                    id="user-menu-button"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="w-8 h-8 rounded-full"
                                        src={user.photoURL || '/default-avatar.png'}
                                        alt="user"
                                    />
                                </button>
                                {/* Dropdown */}
                                <div className="absolute z-50 hidden group-hover:block right-0 mt-2 w-48 rounded-lg shadow bg-white dark:bg-gray-700">
                                    <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      {user.displayName || 'User'}
                    </span>
                                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {user.email}
                    </span>
                                    </div>
                                    <ul className="py-2">
                                        <li>
                                            <NavLink
                                                to="/dashboard"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                                            >
                                                Dashboard
                                            </NavLink>
                                        </li>
                                        <li>
                                            <button
                                                onClick={logOut}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/signin"
                                className="text-sm font-medium text-gray-700 hover:underline dark:text-white"
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className="text-sm font-medium text-gray-700 hover:underline dark:text-white"
                            >
                                Register
                            </NavLink>
                        </>
                    )}

                    {/* Mobile toggle button */}
                    <button
                        data-collapse-toggle="navbar-links"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
                        aria-controls="navbar-links"
                        aria-expanded="false"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <div className="hidden w-full md:flex md:w-auto md:order-1" id="navbar-links">
                    <ul className="flex flex-col md:flex-row md:space-x-8 font-medium p-4 md:p-0 mt-4 border rounded-lg md:border-0 md:mt-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent">
                        <li>
                            <NavLink to="/" className="block py-2 px-3 text-gray-700 hover:text-accent dark:text-white">
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/all-policies" className="block py-2 px-3 text-gray-700 hover:text-accent dark:text-white">
                                All Policies
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/agents" className="block py-2 px-3 text-gray-700 hover:text-accent dark:text-white">
                                Agents
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/faqs" className="block py-2 px-3 text-gray-700 hover:text-accent dark:text-white">
                                FAQs
                            </NavLink>
                        </li>
                        {user && (
                            <li>
                                <NavLink to="/dashboard" className="block py-2 px-3 text-gray-700 hover:text-accent dark:text-white">
                                    Dashboard
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
