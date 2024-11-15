import { createBrowserRouter } from 'react-router-dom';
import Main from '../../Layouts/Main';
import Login from '../../Pages/Login/Login';
import Signup from '../../Pages/Login/Signup';
import Profile from '../../Pages/LeftNavPages/Profile';
import Setting from '../../Pages/LeftNavPages/Setting';
import Inbox from '../../Pages/LeftNavPages/Inbox';
import ProtectedRoute from '../PrivateRoute/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute>
            <Main />
        </ProtectedRoute>,
        children: [

            { path: 'messages', element: <Inbox /> },
            { path: 'profile', element: <Profile /> },
            { path: 'setting', element: <Setting /> },
        ],
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signup',
        element: <Signup />
    },
]);
