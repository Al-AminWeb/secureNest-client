import { useNavigate } from 'react-router';

const Error404 = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full text-center">
                
                <h1 className="text-4xl font-bold text-primary mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600 mb-8">
                    Oops! The page you are looking for does not exist or has been moved.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default Error404; 