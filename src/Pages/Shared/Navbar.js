import React from 'react';
import LeftNav from '../../Pages/Shared/LeftNav';
import { useAuth } from '../../Store/AuthStore';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <div className="navbar px-4 py-2 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-6">
                <LeftNav />
                <h1 className="text-3xl font-bold">ChitChat</h1>
            </div>

            {user && (
                <div className="flex items-center space-x-4 text-white">
                    {/* Desktop Profile Info */}
                    <div className="hidden md:block">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-green-400">Online</p>
                    </div>

                    {/* Desktop Profile Picture */}
                    <div className="w-14 h-14 rounded-full ring ring-white ring-offset-base-100 ring-offset-2 overflow-hidden hidden md:block">
                        <img
                            src={`${process.env.REACT_APP_BACKEND_URL}/${user.profilePicture}`}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Mobile Profile Info and Picture */}
                    <div className="md:hidden dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar w-14 h-14 rounded-full overflow-hidden"
                        >
                            <img
                                src={`${process.env.REACT_APP_BACKEND_URL}/${user.profilePicture}`}
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <p className="font-semibold">{user.name}</p>
                            </li>
                            <li><p className="text-sm text-green-400">Online</p></li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;