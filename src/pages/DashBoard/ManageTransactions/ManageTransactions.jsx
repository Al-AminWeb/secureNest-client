import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ManageTransactions = () => {
    const axiosSecure = useAxiosSecure();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filterEmail, setFilterEmail] = useState('');
    const [filterPolicy, setFilterPolicy] = useState('');
    const [totalIncome, setTotalIncome] = useState(0);

    const { data: transactions = [], isLoading, refetch } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/payment-history/all');
            return res.data.data;
        }
    });

    useEffect(() => {
        // Calculate total income whenever transactions change
        if (transactions.length > 0) {
            const total = transactions.reduce((sum, transaction) => {
                return sum + transaction.amount;
            }, 0);
            setTotalIncome(total);
        }
    }, [transactions]);

    // Prepare data for the chart (group by date)
    const prepareChartData = () => {
        const chartData = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.paymentDate).toLocaleDateString();
            if (!chartData[date]) {
                chartData[date] = 0;
            }
            chartData[date] += transaction.amount;
        });

        return Object.entries(chartData).map(([date, amount]) => ({
            date,
            amount
        }));
    };

    const filteredTransactions = transactions.filter(transaction => {
        // Date filter
        if (startDate && endDate) {
            const paymentDate = new Date(transaction.paymentDate);
            if (paymentDate < startDate || paymentDate > endDate) {
                return false;
            }
        }

        // Email filter
        if (filterEmail && (!transaction.user?.email ||
            !transaction.user.email.toLowerCase().includes(filterEmail.toLowerCase()))) {
            return false;
        }

        // Policy filter
        return !(filterPolicy && (!transaction.policyName ||
            !transaction.policyName.toLowerCase().includes(filterPolicy.toLowerCase())));
    });

    const chartData = prepareChartData();

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Manage Transactions</h1>

            {/* Stats Card */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-lg font-semibold mb-2">Total Income</h2>
                <p className="text-3xl font-bold text-green-600">৳{totalIncome.toFixed(2)}</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Date Range</label>
                        <div className="flex gap-2">
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Start Date"
                                className="border rounded p-2 w-full"
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="End Date"
                                className="border rounded p-2 w-full"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">User Email</label>
                        <input
                            type="text"
                            placeholder="Filter by email"
                            value={filterEmail}
                            onChange={(e) => setFilterEmail(e.target.value)}
                            className="border rounded p-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Policy Name</label>
                        <input
                            type="text"
                            placeholder="Filter by policy"
                            value={filterPolicy}
                            onChange={(e) => setFilterPolicy(e.target.value)}
                            className="border rounded p-2 w-full"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setStartDate(null);
                                setEndDate(null);
                                setFilterEmail('');
                                setFilterPolicy('');
                            }}
                            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Income Overview</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`৳${value}`, 'Amount']} />
                            <Legend />
                            <Bar dataKey="amount" name="Daily Income" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Transaction ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Policy Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">
                                    Loading transactions...
                                </td>
                            </tr>
                        ) : filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((transaction) => (
                                <tr key={transaction._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.paymentId.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.user?.email || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.policyName || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ৳{transaction.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(transaction.paymentDate).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                transaction.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {transaction.status}
                                            </span>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageTransactions;