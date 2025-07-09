import { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react'; // assuming you're using Lucide icons
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
                        <div

                                    className="relative sm:inline-block text-left  ">
                                    <button
                                                ref={buttonRef}
                                                onClick={() => setOpen(!open)}
                                                className="p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                                title="account"
                                    >
                                                <User size={18} />
                                    </button>

                                    {open && (
                                                <motion.div
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            ref={menuRef}
                                                            className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 z-50"
                                                >
                                                            <div className="py-1">


                                                                        {isLogin ? <button onClick={logout}
                                                                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                                                        >
                                                                                    🚪 Logout
                                                                        </button> : <button
                                                                                    onClick={() => navigate("/login")}
                                                                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                                                        >
                                                                                    🔑 Login
                                                                        </button>}
                                                            </div>
                                                </motion.div>
                                    )}
                        </div>
            );
};

export default AccountMenu;
