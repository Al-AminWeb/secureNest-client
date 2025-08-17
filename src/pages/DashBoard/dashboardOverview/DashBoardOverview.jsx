import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import {
    HiUserGroup, HiDocumentText, HiClipboardCheck,
    HiCurrencyDollar, HiUserCircle, HiHome,
    HiTrendingUp, HiCollection, HiChartBar
} from 'react-icons/hi';
import useAuth from "../../../hooks/useAuth.jsx";
import useUserRole from "../../../hooks/useUserRole.jsx";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";

ChartJS.register(...registerables);

const DashboardOverview = () => {
    const { user } = useAuth();
    const { role } = useUserRole();
    const axiosSecure = useAxiosSecure();

    // Fetch dashboard stats
    const { data: stats } = useQuery({
        queryKey: ['dashboardStats', role, user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/dashboard/stats?role=${role}&email=${user?.email}`
            );
            return res.data;
        }
    });

    // Fetch chart data
    const { data: chartData } = useQuery({
        queryKey: ['dashboardCharts', role, user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/dashboard/chart-data?role=${role}&email=${user?.email}`
            );
            return res.data;
        }
    });

    // Admin Charts
    const AdminCharts = () => (
        <>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Applications Over Time</h3>
                <div className="h-80">
                    <Line
                        data={{
                            labels: chartData?.applicationsOverTime?.map(item => item._id) || [],
                            datasets: [{
                                label: 'Applications',
                                data: chartData?.applicationsOverTime?.map(item => item.count) || [],
                                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                                borderColor: 'rgba(59, 130, 246, 1)',
                                borderWidth: 1
                            }]
                        }}
                        options={{ responsive: true, maintainAspectRatio: false }}
                    />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Policy Types Distribution</h3>
                <div className="h-80">
                    <Pie
                        data={{
                            labels: chartData?.policyTypes?.map(item => item._id) || [],
                            datasets: [{
                                data: chartData?.policyTypes?.map(item => item.count) || [],
                                backgroundColor: [
                                    'rgba(16, 185, 129, 0.5)',
                                    'rgba(245, 158, 11, 0.5)',
                                    'rgba(239, 68, 68, 0.5)',
                                    'rgba(139, 92, 246, 0.5)'
                                ],
                                borderWidth: 1
                            }]
                        }}
                        options={{ responsive: true, maintainAspectRatio: false }}
                    />
                </div>
            </div>
        </>
    );

    // Agent Charts
    const AgentCharts = () => (
        <div className="bg-white p-6 rounded-lg shadow col-span-2">
            <h3 className="text-lg font-semibold mb-4">My Applications Over Time</h3>
            <div className="h-80">
                <Bar
                    data={{
                        labels: chartData?.applicationsOverTime?.map(item => item._id) || [],
                        datasets: [{
                            label: 'Applications',
                            data: chartData?.applicationsOverTime?.map(item => item.count) || [],
                            backgroundColor: 'rgba(99, 102, 241, 0.5)',
                            borderColor: 'rgba(99, 102, 241, 1)',
                            borderWidth: 1
                        }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                />
            </div>
        </div>
    );

    // User Charts
    const UserCharts = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">My Policy Types</h3>
            <div className="h-80">
                <Pie
                    data={{
                        labels: chartData?.myPolicyTypes?.map(item => item._id) || [],
                        datasets: [{
                            data: chartData?.myPolicyTypes?.map(item => item.count) || [],
                            backgroundColor: [
                                'rgba(16, 185, 129, 0.5)',
                                'rgba(245, 158, 11, 0.5)',
                                'rgba(239, 68, 68, 0.5)'
                            ],
                            borderWidth: 1
                        }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                />
            </div>
        </div>
    );

    // StatCard component
    const StatCard = ({ icon, title, value, change }) => (
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-500 mr-4">
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <div className="flex items-center">
                    <p className="text-2xl font-bold mr-2">{value || 0}</p>
                    {change && (
                        <span className="text-green-500 text-sm flex items-center">
              <HiTrendingUp className="mr-1" /> {change}
            </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {role === 'admin' && (
                    <>
                        <StatCard
                            icon={<HiUserGroup className="text-3xl" />}
                            title="Total Users"
                            value={stats?.totalUsers}
                            change="+12%"
                        />
                        <StatCard
                            icon={<HiDocumentText className="text-3xl" />}
                            title="Active Policies"
                            value={stats?.totalPolicies}
                        />
                        <StatCard
                            icon={<HiClipboardCheck className="text-3xl" />}
                            title="Pending Applications"
                            value={stats?.pendingApplications}
                        />
                        <StatCard
                            icon={<HiCurrencyDollar className="text-3xl" />}
                            title="Total Revenue"
                            value={stats?.totalRevenue?.[0]?.total ? `৳${(stats.totalRevenue[0].total / 100).toLocaleString()}` : '৳0'}
                        />
                    </>
                )}

                {role === 'agent' && (
                    <>
                        <StatCard
                            icon={<HiUserGroup className="text-3xl" />}
                            title="Assigned Customers"
                            value={stats?.assignedCustomers}
                        />
                        <StatCard
                            icon={<HiDocumentText className="text-3xl" />}
                            title="My Applications"
                            value={stats?.myApplications}
                        />
                        <StatCard
                            icon={<HiCurrencyDollar className="text-3xl" />}
                            title="Total Commission"
                            value={stats?.myCommission?.[0]?.total ? `৳${(stats.myCommission[0].total / 100).toLocaleString()}` : '৳0'}
                        />
                    </>
                )}

                {role === 'user' && (
                    <>
                        <StatCard
                            icon={<HiDocumentText className="text-3xl" />}
                            title="My Active Policies"
                            value={stats?.myPolicies}
                        />
                        <StatCard
                            icon={<HiCurrencyDollar className="text-3xl" />}
                            title="Pending Payments"
                            value={stats?.pendingPayments}
                        />
                    </>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {role === 'admin' && <AdminCharts />}
                {role === 'agent' && <AgentCharts />}
                {role === 'user' && <UserCharts />}
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                {/* Add recent activity list here */}
            </div>
        </div>
    );
};

export default DashboardOverview;