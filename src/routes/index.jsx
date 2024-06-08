import { createBrowserRouter } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTING RENDER ||============================== //
const isAuthenticated=()=>{
    const token=localStorage.getItem('authToken')
    if(token){
        return true
    }
    return false
}

const router = isAuthenticated()?createBrowserRouter([MainRoutes]):createBrowserRouter([LoginRoutes]);



export default router;
