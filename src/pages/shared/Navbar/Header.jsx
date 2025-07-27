import { useContext, useState } from 'react';
import { NavLink } from 'react-router';
import { AuthContext } from '../../../contexts/AuthContext.jsx';
import logo from '../../../assets/logo (3).png';

const Header = () => {
    const { user, logOut } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-background border-b shadow-sm dark:bg-gray-900">
            <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4">
                {/* Logo */}
                <NavLink to="/" className="flex items-center space-x-2">
                    <img src={logo} className="h-8" alt="Logo" />
                </NavLink>

                {/* Profile + Toggle */}
                <div className="flex items-center gap-4 md:order-2">
                    {user ? (
                        <div className="relative group">
                            <button className="flex items-center text-sm rounded-full focus:ring-2 focus:ring-accent">
                                <img
                                    src={user.photoURL || '/default-avatar.png'}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                            </button>
                            <div className="absolute right-0 mt-2 hidden group-hover:block bg-white dark:bg-gray-700 shadow rounded-lg z-50 w-48">
                                <div className="px-4 py-3 border-b dark:border-gray-600">
                                    <p className="text-sm text-gray-800 dark:text-white">
                                        {user.displayName || 'User'}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-300">
                                        {user.email}
                                    </p>
                                </div>
                                <ul className="py-2">
                                    <li>
                                        <NavLink
                                            to="/dashboard"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-accent hover:text-white"
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-accent hover:text-white"
                                        >
                                            Profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <button
                                            onClick={logOut}
                                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-accent hover:text-white"
                                        >
                                            Logout
                                        </button>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    ) : (
                        <>
                            <NavLink
                                to="/signin"
                                className="text-sm font-medium text-gray-700 dark:text-white hover:text-accent"
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className="text-sm font-medium text-gray-700 dark:text-white hover:text-accent"
                            >
                                Register
                            </NavLink>
                        </>
                    )}

                    {/* Hamburger */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <div
                    className={`w-full md:w-auto md:flex md:items-center md:order-1 transition-all duration-300 ease-in-out ${
                        isOpen ? 'block' : 'hidden'
                    }`}
                >
                    <ul className="flex flex-col md:flex-row md:space-x-6 font-medium p-4 md:p-0 mt-4 border md:border-0 rounded-lg md:mt-0 bg-white md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `block py-2 px-3 rounded ${
                                        isActive ? 'text-accent' : 'text-gray-700 dark:text-white'
                                    } hover:text-accent`
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/all-policies"
                                className={({ isActive }) =>
                                    `block py-2 px-3 rounded ${
                                        isActive ? 'text-accent' : 'text-gray-700 dark:text-white'
                                    } hover:text-accent`
                                }
                            >
                                All Policies
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/agents"
                                className={({ isActive }) =>
                                    `block py-2 px-3 rounded ${
                                        isActive ? 'text-accent' : 'text-gray-700 dark:text-white'
                                    } hover:text-accent`
                                }
                            >
                                Agents
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/faq"
                                className={({ isActive }) =>
                                    `block py-2 px-3 rounded ${
                                        isActive ? 'text-accent' : 'text-gray-700 dark:text-white'
                                    } hover:text-accent`
                                }
                            >
                                FAQs
                            </NavLink>
                        </li>
                        {user && (
                            <>
                                <li>
                                    <NavLink
                                        to="/dashboard"
                                        className={({ isActive }) =>
                                            `block py-2 px-3 rounded ${
                                                isActive ? 'text-accent' : 'text-gray-700 dark:text-white'
                                            } hover:text-accent`
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/become-agent"
                                        className={({ isActive }) =>
                                            `block py-2 px-3 rounded ${
                                                isActive ? 'text-accent' : 'text-gray-700 dark:text-white'
                                            } hover:text-accent`
                                        }
                                    >
                                        Become an Agent
                                    </NavLink>
                                </li>

                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
