import NoPageFound from "../pages/NoPageFound";
import Signup from "../pages/Signup";
import MainLayout from "../layouts/MainLayout";
import GoogleDriveClone from "../pages/Clone";
import AuthPage from "../pages/Auth";
import ProtectedRoutes from "../protectedRoutes/ProtectedRoutes";
import AuthSuccess from "../pages/AuthSuccess";
import { FileCard } from "../pages/Check";


const routeConfig = [
            {
                        path: '/',
                        element: <MainLayout />,
                        children: [
                                    { index: true, element: <ProtectedRoutes> <GoogleDriveClone /> </ProtectedRoutes> },
                                    { path: "login", element: <AuthPage /> }, // 👈 this handles route "/"
                                    { path: 'signup', element: <Signup /> },
                                    { path: '*', element: <NoPageFound /> },
                                    { path: "/auth-success", elemen: <AuthSuccess /> },
                                    { path: "/check", element: <FileCard /> }
                        ],
            },
];


export default routeConfig;