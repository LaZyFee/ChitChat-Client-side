import React from 'react';
import Users from '../Home/Users';
import Chat from '../Home/Chat';

import { useIsMobile } from '../../Hooks/useIsMobile';

const Inbox = ({ selectedUser, setSelectedUser }) => {
    const isMobile = useIsMobile();

    return (
        <div className="h-screen text-white">
            {!isMobile ? (
                <div className="flex h-full">
                    <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                    <Chat selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                </div>
            ) : (
                <div className="h-full">
                    {!selectedUser ? (
                        <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                    ) : (
                        <Chat selectedUser={selectedUser} setSelectedUser={setSelectedUser} setShowChatOnMobile={setSelectedUser} />
                    )}
                </div>
            )}
        </div>
    );
};

export default Inbox;
