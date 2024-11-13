import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Pages/Shared/Navbar';
import Inbox from '../Pages/LeftNavPages/Inbox';
import useSelectedUserStore from '../Store/SelectedUserStore';

const Main = () => {
    const location = useLocation();
    const { selectedUser, setSelectedUser } = useSelectedUserStore();

    return (
        <div className="min-h-screen">
            <Navbar />
            {location.pathname === '/' || location.pathname === '/messages' ? (
                <Inbox selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            ) : (
                <Outlet />
            )}
        </div>
    );
};

export default Main;
