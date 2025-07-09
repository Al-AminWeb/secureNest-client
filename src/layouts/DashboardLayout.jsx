import { NavLink, Outlet } from 'react-router';
import { HiDocumentText, HiUserGroup, HiClipboardCheck, HiCurrencyDollar, HiUserCircle } from 'react-icons/hi';
import { useState } from 'react';

const DashboardLayout = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const navLinkStyle = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 
     ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-800'}`;

    return (
        <div className="min-h-screen bg-background text-gray-800 flex flex-col md:flex-row">

            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white shadow-md z-10 fixed md:static top-0 md:h-screen p-4">
                <div className="text-2xl font-bold text-primary mb-6 text-center">SecureNest Admin</div>
                <ul className="space-y-2">
                    <li>
                        <NavLink to="/dashboard/applications" className={navLinkStyle}>
                            <HiDocumentText className="text-xl" />
                            Manage Applications
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/users" className={navLinkStyle}>
                            <HiUserGroup className="text-xl" />
                            Manage Users
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="manage-policies" className={navLinkStyle}>
                            <HiClipboardCheck className="text-xl" />
                            Manage Policies
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/transactions" className={navLinkStyle}>
                            <HiCurrencyDollar className="text-xl" />
                            Manage Transactions
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/agents" className={navLinkStyle}>
                            <HiUserCircle className="text-xl" />
                            Manage Agents
                        </NavLink>
                    </li>
                </ul>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-6 mt-20 md:mt-0 md:ml-64 bg-background">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
