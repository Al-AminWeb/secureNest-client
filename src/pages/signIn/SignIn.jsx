import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc';
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth.jsx";
import useAxios from "../../hooks/useAxios.jsx";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn,signInWithGoogle } = useAuth();
  const axiosInstance = useAxios();
  const handleGoogleSignIn = ()=>{
    signInWithGoogle()
        .then(async (result)=>{
          const user = result.user;
          const userInfo = {
            name:user.name,
            email:user.email,
            role:'user',
            createdAt:new Date().toISOString(),
            lastLogIn:new Date().toISOString(),
          }
          const res = await axiosInstance.post('/users',userInfo)
          console.log(res.data.data)

          console.log(result);
        })
    .catch((error)=>{
      console.log(error);
    })
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await signIn(data.email, data.password);

      if (result.user) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome back, ${result.user.displayName || 'User'}!`,
          timer: 1500,
          showConfirmButton: false,
        });

        // setTimeout(() => {
        //   navigate(from, { replace: true });
        // }, 1600);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
    }
  };
  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] p-6">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between">
          {/* Left Section */}
          <div className="text-white md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">New Online Platform</h2>
            <h1 className="text-4xl md:text-5xl font-bold text-lime-300 mb-6">SecureNest</h1>
            <ul className="space-y-3 text-sm md:text-base">
              <li>Anywhere, Anytime; Enjoy New Services -</li>
              <li>🔐 Easy Log In Experience</li>
              <li>📋 Multiple Policy Information at Once</li>
              <li>📄 All Certificates and Payment History in One Place</li>
            </ul>
          </div>

          {/* Right Section - Login Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Hello there!</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Username (Email)
                </label>
                <input
                    type="email"
                    id="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                />
                {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-600 hover:text-accent"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
                {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end text-sm">
                <NavLink to="/forgot-password" className="text-accent hover:underline">
                  Forgot Password?
                </NavLink>
              </div>

              {/* Submit */}
              <button
                  type="submit"
                  className="w-full bg-accent text-white py-2 px-4 rounded-md hover:bg-teal-600 transition"
              >
                Log In
              </button>

              <p className="text-xl text-primary text-center">Or</p>

              {/* Google Sign-in */}
              <div>
                <button onClick={handleGoogleSignIn}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  <FcGoogle className="w-5 h-5" />
                  Sign in with Google
                </button>
              </div>

              {/* Link to Register */}
              <p className="text-center text-sm text-gray-600">
                New to SecureNest?{' '}
                <NavLink to="/signup" className="text-accent hover:underline">
                  Register
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
  );
};

export default SignIn;
