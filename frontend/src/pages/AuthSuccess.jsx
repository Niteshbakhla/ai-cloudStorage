// src/pages/AuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
            const navigate = useNavigate();

            useEffect(() => {
                        const token = new URLSearchParams(window.location.search).get('token');

                        if (token) {
                                    localStorage.setItem('token', token);
                                    navigate('/profile'); // Redirect to profile or dashboard
                        } else {
                                    navigate('/'); // Or show an error
                        }
            }, [navigate]);

            return <p className="text-center mt-10">Logging you in...</p>;
};

export default AuthSuccess;
