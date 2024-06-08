import { createBrowserRouter } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = isAuthenticated()?createBrowserRouter([MainRoutes]):createBrowserRouter([LoginRoutes]);

const isAuthenticated=()=>{
    const token=localStorage.getItem('authToken')
    if(token){
        return true
    }
    return false
}

export default router;
