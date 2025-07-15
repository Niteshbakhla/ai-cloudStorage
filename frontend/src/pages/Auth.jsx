import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from "framer-motion";

import axiosInstance from '../axios/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import GoogleAuthBtn from '../components/GoogleAuthBtn';

export default function AuthPage() {
            const [isLogin, setIsLogin] = useState(true);
            const [showPassword, setShowPassword] = useState(false);
            const navigate = useNavigate();
            const [formData, setFormData] = useState({
                        name: '',
                        email: '',
                        password: '',
            });

            const handleInputChange = (e) => {
                        setFormData({
                                    ...formData,
                                    [e.target.name]: e.target.value
                        });
            };

            const handleAuth = async () => {
                        try {
                                    const { data } = await axiosInstance.post(`/auth${isLogin ? "/login" : "/register"}`, formData);
                                    toast.success(data.message)
                                    if (isLogin) navigate("/")
                                    else setIsLogin(!isLogin)
                                    setFormData({ email: "", password: "", name: "" })
                        } catch (error) {
                                    toast.error(error.response?.data.message || "Something went wrong")
                                    console.error("auth error", error.message);
                                    console.log(error)
                                    setFormData({ email: "", password: "", name: "" })
                        }
            }


            const toggleMode = () => {
                        setIsLogin(!isLogin);
                        setFormData({ name: '', email: '', password: '' });
                        setShowPassword(false);
            };

            return (
                        <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}

                                    className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                                    {/* Main container */}
                                    <div className="w-full max-w-md">
                                                {/* Card */}
                                                <div className="bg-white rounded-lg shadow-lg p-8">
                                                            {/* Header */}
                                                            <div className="text-center mb-8">
                                                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                                                                                    <User className="w-6 h-6 text-gray-600" />
                                                                        </div>
                                                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                                                                    {isLogin ? 'Sign In' : 'Create Account'}
                                                                        </h1>
                                                                        <p className="text-gray-600">
                                                                                    {isLogin ? 'Welcome back! Please sign in to your account' : 'Please fill in the information below'}
                                                                        </p>
                                                            </div>

                                                            {/* Form */}
                                                            <div className="space-y-6">
                                                                        {/* Name field (only for register) */}
                                                                        {!isLogin && (
                                                                                    <div className="transform transition-all duration-300 ease-in-out">
                                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                                            Full Name
                                                                                                </label>
                                                                                                <div className="relative">
                                                                                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                                                                            <input
                                                                                                                        type="text"
                                                                                                                        name="name"
                                                                                                                        value={formData.name}
                                                                                                                        onChange={handleInputChange}
                                                                                                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                                                                                        placeholder="Enter your full name"
                                                                                                                        required={!isLogin}
                                                                                                            />
                                                                                                </div>
                                                                                    </div>
                                                                        )}

                                                                        {/* Email field */}
                                                                        <div>
                                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                                Email Address
                                                                                    </label>
                                                                                    <div className="relative">
                                                                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                                                                <input
                                                                                                            type="email"
                                                                                                            name="email"
                                                                                                            value={formData.email}
                                                                                                            onChange={handleInputChange}
                                                                                                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                                                                            placeholder="Enter your email address"
                                                                                                            required
                                                                                                />
                                                                                    </div>
                                                                        </div>

                                                                        {/* Password field */}
                                                                        <div>
                                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                                Password
                                                                                    </label>
                                                                                    <div className="relative">
                                                                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                                                                <input
                                                                                                            type={showPassword ? "text" : "password"}
                                                                                                            name="password"
                                                                                                            value={formData.password}
                                                                                                            onChange={handleInputChange}
                                                                                                            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                                                                            placeholder="Enter your password"
                                                                                                            required
                                                                                                />
                                                                                                <button
                                                                                                            type="button"
                                                                                                            onClick={() => setShowPassword(!showPassword)}
                                                                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                                                                                >
                                                                                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                                                                </button>
                                                                                    </div>
                                                                        </div>

                                                                        {/* Forgot password link (only for login) */}
                                                                        {isLogin && (
                                                                                    <div className="text-right">
                                                                                                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm transition-colors duration-200">
                                                                                                            Forgot your password?
                                                                                                </a>
                                                                                    </div>
                                                                        )}

                                                                        {/* Submit button */}
                                                                        <button
                                                                                    type="button"
                                                                                    onClick={handleAuth}
                                                                                    className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                                                        >
                                                                                    {isLogin ? 'Sign In' : 'Create Account'}
                                                                        </button>
                                                            </div>
                                                            <GoogleAuthBtn />

                                                            {/* Divider */}
                                                            <div className="my-8 flex items-center">
                                                                        <div className="flex-grow border-t border-gray-300"></div>
                                                                        <span className="px-4 text-gray-500 text-sm">or</span>
                                                                        <div className="flex-grow border-t border-gray-300"></div>
                                                            </div>

                                                            {/* Toggle between login/register */}
                                                            <div className="text-center">
                                                                        <p className="text-gray-600 mb-4">
                                                                                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                                                                        </p>
                                                                        <button
                                                                                    type="button"
                                                                                    onClick={toggleMode}
                                                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                                                        >
                                                                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                                                                    {isLogin ? 'Create Account' : 'Back to Sign In'}
                                                                        </button>
                                                            </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="text-center mt-6">
                                                            <p className="text-gray-500 text-sm">
                                                                        By continuing, you agree to our Terms of Service and Privacy Policy
                                                            </p>
                                                </div>
                                    </div>
                        </motion.div>
            );
}