import {NavLink, Outlet} from 'react-router';
import {
    HiDocumentText,
    HiUserGroup,
    HiClipboardCheck,
    HiCurrencyDollar,
    HiUserCircle, HiHome
} from 'react-icons/hi';
import {FaBars, FaTimes} from 'react-icons/fa';
import {useState} from 'react';
import useUserRole from "../hooks/useUserRole.jsx";

const DashboardLayout = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinkStyle = ({isActive}) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 
     ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-800'}`;

    const toggleMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMenu = () => {
        setMobileMenuOpen(false);
    };

    const {role} = useUserRole();

    return (
        <div className="min-h-screen bg-background text-gray-800 flex flex-col md:flex-row relative">

            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between   px-4 py-3 fixed top-0 left-0 right-0 z-20">
                <h2 className="text-xl font-bold text-primary">SecureNest Admin</h2>
                <button onClick={toggleMenu} className="text-primary text-2xl">
                    {isMobileMenuOpen ? <FaTimes/> : <FaBars/>}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={` shadow-md z-30 fixed top-0 left-0  w-64 p-4 transition-transform transform duration-300 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:block`}
            >
                <div className="text-2xl font-bold text-primary mb-6 hidden md:block text-center">
                    SecureNest Admin
                </div>

                <ul className="space-y-2 mt-12 md:mt-0">
                    {
                        role==='admin'&&
                        <>
                            <li>
                                <NavLink to="/" className={navLinkStyle} onClick={closeMenu}>
                                    <HiHome className="text-xl"/>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/manage-applications" className={navLinkStyle} onClick={closeMenu}>
                                    <HiDocumentText className="text-xl"/>
                                    Manage Applications
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/manage-users" className={navLinkStyle} onClick={closeMenu}>
                                    <HiUserGroup className="text-xl"/>
                                    Manage Users
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/manage-policies" className={navLinkStyle} onClick={closeMenu}>
                                    <HiClipboardCheck className="text-xl"/>
                                    Manage Policies
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/transactions" className={navLinkStyle} onClick={closeMenu}>
                                    <HiCurrencyDollar className="text-xl"/>
                                    Manage Transactions
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/agents" className={navLinkStyle} onClick={closeMenu}>
                                    <HiUserCircle className="text-xl"/>
                                    Manage Agents
                                </NavLink>
                            </li>
                        </>
                    }
                    {/*agent*/}
                    {role === 'agent' &&
                        <>
                            <li>
                                <NavLink to="/" className={navLinkStyle} onClick={closeMenu}>
                                    <HiHome className="text-xl"/>
                                    Home
                                </NavLink>
                            </li>
                            < li>
                                < NavLink to="/dashboard/assigned-customers" className={navLinkStyle}
                                          onClick={closeMenu}>
                                    <HiUserGroup className="text-xl"/>
                                    Assigned Customers
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/manage-blogs" className={navLinkStyle} onClick={closeMenu}>
                                    <HiClipboardCheck className="text-xl"/>
                                    Manage Blogs
                                </NavLink>
                            </li>

                        </>
                    }

                    {
                        role === 'user' &&
                        <>
                            <li>
                                <NavLink to="/" className={navLinkStyle} onClick={closeMenu}>
                                    <HiHome className="text-xl"/>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/my-policies" className={navLinkStyle} onClick={closeMenu}>
                                    <HiDocumentText className="text-xl"/>
                                    My Policies
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/payment-status" className={navLinkStyle} onClick={closeMenu}>
                                    <HiCurrencyDollar className="text-xl"/>
                                    Payment Status
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/claim-request" className={navLinkStyle} onClick={closeMenu}>
                                    <HiClipboardCheck className="text-xl"/>
                                    Claim Request Form
                                </NavLink>
                            </li>
                        </>
                    }

                </ul>
            </aside>

            {/* Content Area */
            }
            <main className="flex-1 p-6 pt-20 md:pt-6 ">
                <Outlet/>
            </main>
        </div>
    )
        ;
};

export default DashboardLayout;
