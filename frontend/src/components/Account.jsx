import { useState, useRef, useEffect } from 'react';
import { User, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../axios/axios';
import toast from 'react-hot-toast';
import { setIsLogin } from '../redux/slices/userLogin';

const AccountMenu = () => {

            const { isLogin } = useSelector(state => state.isLogin)
            const dispatch = useDispatch();
            const [open, setOpen] = useState(false);
            const navigate = useNavigate();
            const menuRef = useRef();
            const buttonRef = useRef();

            // Close dropdown if clicked outside
            useEffect(() => {
                        const handleClickOutside = (event) => {
                                    if (
                                                menuRef.current &&
                                                !menuRef.current.contains(event.target) &&
                                                !buttonRef.current.contains(event.target)
                                    ) {
                                                setOpen(false);
                                    }
                        };
                        document.addEventListener('mousedown', handleClickOutside);
                        return () => document.removeEventListener('mousedown', handleClickOutside);
            }, []);


            const logout = async () => {
                        try {
                                    const { data } = await axiosInstance.get("/auth/logout")
                                    toast.success(data.message);
                                    navigate("/login");
                                    dispatch(setIsLogin(false));

                        } catch (error) {
                                    console.log("Logout error:", error)
                        }
            }

            return (
                        <div className="relative inline-block text-left">
                                    <button
                                                ref={buttonRef}
                                                onClick={() => setOpen(!open)}
                                                className="p-2.5 rounded-xl transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transform hover:scale-105 duration-200"
                                                title="Account"
                                    >
                                                <User size={20} className="text-gray-700" />
                                    </button>

                                    {open && (
                                                <motion.div
                                                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                                            transition={{ duration: 0.2 }}
                                                            ref={menuRef}
                                                            className="absolute  right-0 mt-3 w-52 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 z-50 border border-gray-100 overflow-hidden"
                                                >
                                                            <div className=" group">
                                                                        {isLogin ? (
                                                                                    <button
                                                                                                onClick={logout}
                                                                                                className="w-full px-5 py-3 text-sm text-left text-gray-200 hover:bg-gray-400 transition-all duration-200 flex items-center gap-3 font-medium"
                                                                                    >
                                                                                                <span className="text-lg">🚪</span>
                                                                                                <span className="flex-1">Logout</span>
                                                                                                <LogOut size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                                                                                    </button>
                                                                        ) : (
                                                                                    <button
                                                                                                onClick={() => navigate('/login')}
                                                                                                className="w-full px-5 py-3 text-sm text-left text-gray-700 hover:bg-gradient-to-r dark:text-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-3 font-medium"
                                                                                    >
                                                                                                <span className="text-lg">🔑</span>
                                                                                                <span className="flex-1">Login</span>
                                                                                                <LogIn size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                                                                    </button>
                                                                        )}
                                                            </div>

                                                </motion.div>
                                    )}
                        </div>
            );
};

export default AccountMenu;