
import { Navigate } from "react-router-dom"
import AppRoutes from "./router/AppRoutes"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setIsLogin } from "./redux/slices/userLogin"
import axiosInstance from "./axios/axios"
import axios from "axios"

const App = () => {
  const { isLogin } = useSelector(state => state.isLogin);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await axios.get("https://ai-cloudstorage.onrender.com/api/v1/auth/me", { withCredentials: true });
        dispatch(setIsLogin(data.success));
      } catch (error) {
        console.error("auth me error", error)
      }

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