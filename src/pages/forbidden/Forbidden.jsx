import { Link } from 'react-router';
import { FaLock, FaHome } from 'react-icons/fa';

const Forbidden = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <FaLock className="text-red-500 text-5xl" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">403 - Access Denied</h1>
                <h2 className="text-xl text-gray-600 mb-6">SecureNest Insurance</h2>

                <p className="text-gray-600 mb-8">
                    You don't have permission to access this page. Please contact your administrator
                    or return to the home page.
                </p>

                <div className="flex flex-col space-y-4">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        <FaHome />
                        Back to Home
                    </Link>

                    <Link
                        to="/contact"
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        Contact Support
                    </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        SecureNest Insurance &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;