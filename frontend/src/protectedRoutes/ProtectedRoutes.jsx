import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {

            const navigate = useNavigate();

            useEffect(() => {
                        // console.log(isLogin)
                        // if (!isLogin) return navigate("/login")
            }, [])
            return (
                        children
            )
}

export default ProtectedRoutes      