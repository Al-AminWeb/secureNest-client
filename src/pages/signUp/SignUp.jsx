import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { use } from 'react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { createUser, updateUser, setUser } = use(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const { name, photo, email, password } = data;

    try {
      const result = await createUser(email, password);
      const photoURL = photo[0] ? URL.createObjectURL(photo[0]) : '';

      await updateUser({ displayName: name, photoURL });
      setUser({ ...result.user, displayName: name, photoURL });

      Swal.fire({
        icon: 'success',
        title: 'Account created successfully!',
        showConfirmButton: false,
        timer: 1500,
      });

      reset();
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration failed',
        text: error.message,
      });
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] p-6">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between">
          {/* Left Section */}
          <div className="text-white md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Start Your Journey</h2>
            <h1 className="text-4xl md:text-5xl font-bold text-lime-300 mb-6">SecureNest</h1>
            <ul className="space-y-3 text-sm md:text-base">
              <li>🧾 Simplified Registration Process</li>
              <li>📱 Manage Policy Info On the Go</li>
              <li>🔐 Secure & Verified User Identity</li>
              <li>🎫 One Platform for All Your Insurance Needs</li>
            </ul>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create an Account</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    id="name"
                    {...register('name', { required: 'Full name is required' })}
                    className="mt-1 block w-full px-4 py-2 border rounded-md"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>

              {/* Photo */}
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
                <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    {...register('photo')}
                    className="mt-1 block w-full px-4 py-2 border rounded-md"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Enter a valid email',
                      },
                    })}
                    className="mt-1 block w-full px-4 py-2 border rounded-md"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Minimum 6 characters',
                      },
                    })}
                    className="mt-1 block w-full px-4 py-2 border rounded-md"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button type="submit" className="w-full bg-accent text-white py-2 px-4 rounded-md hover:bg-teal-600 transition">
                Register
              </button>

              <p className="text-xl text-primary text-center">Or</p>

              {/* Google */}
              <button type="button" className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100">
                <FcGoogle className="w-5 h-5" />
                Sign up with Google
              </button>

              {/* Link to Login */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <NavLink to="/signin" className="text-accent hover:underline">Sign In</NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Register;
