import React from 'react';
import { HiUserGroup, HiDocumentText, HiClipboardCheck, HiCurrencyDollar, HiUserCircle, HiHome } from 'react-icons/hi';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';

const DashboardWelcome = () => {
  const { user } = useAuth();
  const { role } = useUserRole();

  // Role-based content
  const roleInfo = {
    admin: {
      title: 'Welcome, Admin!',
      desc: 'Manage users, policies, and transactions all in one place.',
      tips: 'As an admin, you have full control over the SecureNest platform. Use the quick links below to manage applications, users, policies, and more.',
      actions: [
        { icon: <HiUserGroup />, label: 'Manage Users', to: '/dashboard/manage-users' },
        { icon: <HiDocumentText />, label: 'Manage Policies', to: '/dashboard/manage-policies' },
        { icon: <HiClipboardCheck />, label: 'Manage Applications', to: '/dashboard/manage-applications' },
        { icon: <HiCurrencyDollar />, label: 'Transactions', to: '/dashboard/transactions' },
        { icon: <HiUserCircle />, label: 'Manage Agents', to: '/dashboard/manage-agents' },
      ],
    },
    agent: {
      title: 'Welcome, Agent!',
      desc: 'Track your assigned customers, manage blogs, and more.',
      tips: 'As an agent, you can view and manage your assigned customers, write blogs, and monitor your policies.',
      actions: [
        { icon: <HiUserGroup />, label: 'Assigned Customers', to: '/dashboard/assigned-customers' },
        { icon: <HiDocumentText />, label: 'My Policies', to: '/dashboard/my-policies' },
        { icon: <HiClipboardCheck />, label: 'Manage Blogs', to: '/dashboard/manage-blogs' },
        { icon: <HiCurrencyDollar />, label: 'Payment Status', to: '/dashboard/payment-status' },
        { icon: <HiClipboardCheck />, label: 'Claim Request', to: '/dashboard/claim-request' },
      ],
    },
    user: {
      title: 'Welcome!',
      desc: 'View your policies, payment status, and submit claims easily.',
      tips: 'As a valued customer, you can track your policies, check payment status, and submit claim requests from here.',
      actions: [
        { icon: <HiDocumentText />, label: 'My Policies', to: '/dashboard/my-policies' },
        { icon: <HiCurrencyDollar />, label: 'Payment Status', to: '/dashboard/payment-status' },
        { icon: <HiClipboardCheck />, label: 'Claim Request', to: '/dashboard/claim-request' },
      ],
    },
  };

  const info = roleInfo[role] || roleInfo['user'];
  const displayName = user?.displayName || user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="max-w-3xl mx-auto mt-12 text-center animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary flex items-center justify-center gap-2">
        <HiHome className="inline-block text-3xl mb-1" />
        {info.title} <span className="text-accent">{displayName}</span>
      </h1>
      <p className="text-gray-600 mb-4 text-lg">{info.desc}</p>
      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {info.actions.map((action, idx) => (
          <Link
            key={idx}
            to={action.to}
            className="flex flex-col items-center bg-white shadow-md rounded-xl p-5 w-40 hover:bg-primary/10 transition group border border-gray-100"
          >
            <span className="text-3xl text-primary mb-2 group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="font-semibold text-gray-700 group-hover:text-primary text-base">{action.label}</span>
          </Link>
        ))}
      </div>
      <div className="mt-10 bg-accent/10 border-l-4 border-accent px-6 py-4 rounded-lg inline-block">
        <span className="text-accent font-semibold">Tip:</span> {info.tips}
      </div>
    </div>
  );
};

export default DashboardWelcome; 