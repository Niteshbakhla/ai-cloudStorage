
import {  Navigate } from "react-router-dom"
import AppRoutes from "./router/AppRoutes"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setIsLogin } from "./redux/slices/userLogin"
import axiosInstance from "./axios/axios"

const App = () => {
  const { isLogin } = useSelector(state => state.isLogin);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMe = async () => {
      const { data } = await axiosInstance.get("/auth/me");
      dispatch(setIsLogin(data.success));

    }
    fetchMe()
  }, [isLogin])

  useEffect(() => {
    console.log(isLogin)
    if (!isLogin) <Navigate to="/login" />
  }, [])
  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App    