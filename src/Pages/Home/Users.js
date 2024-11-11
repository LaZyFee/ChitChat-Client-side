import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { BsPersonAdd } from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { LuListFilter } from "react-icons/lu";
import UserListModal from '../../Components/Modals/UserListModal';
import CreateGroupModal from '../../Components/Modals/CreateGroupModal';
import FilterModal from '../../Components/Modals/FilterModal';
import useUserStore from '../../Store/UserStore';

const Users = ({ selectedUser, setSelectedUser }) => {
    const users = useUserStore((state) => state.users);
    const fetchUsers = useUserStore((state) => state.fetchUsers);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Search and filter users based on searchTerm
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

    // Toggle modals
    const toggleFilterModal = () => setIsFilterModalOpen(prev => !prev);
    const toggleCreateGroupModal = () => setIsCreateGroupModalOpen(prev => !prev);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        document.getElementById('user_list_modal')?.close(); // Close UserListModal if open
    };

    return (
        <div className="lg:w-1/3 p-2 h-screen w-screen">
            <div className="flex items-center space-x-4 shadow-xl my-5 justify-between">
                <h1 className="text-2xl font-bold">Chats</h1>
                <div className="flex items-center space-x-4">
                    <button className="text-pink-500" onClick={() => document.getElementById('user_list_modal')?.showModal()}>
                        <BsPersonAdd className="text-3xl" />
                    </button>
                    <button className="text-pink-500" onClick={toggleCreateGroupModal}>
                        <AiOutlineUsergroupAdd className="text-3xl" />
                    </button>
                    <button className="text-pink-500" onClick={toggleFilterModal}>
                        <LuListFilter className="text-3xl" />
                    </button>
                </div>
            </div>

            {/* Search bar */}
            <div className="my-5">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name, email, contact here..."
                    className="input input-bordered w-full"
                />
            </div>

            {/* User list */}
            <ul>
                {filteredUsers.map((user) => (
                    <li
                        key={user._id}
                        className={`flex items-center space-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md ${selectedUser?._id === user._id ? 'lg:bg-gray-700' : ''}`}
                        onClick={() => setSelectedUser(user)}
                    >
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${user.profilePicture}`} alt=".." className="w-16 h-16 rounded-badge" />
                        <div className="flex-1">
                            <p className="font-semibold text-green-500 my-1">{user.name}</p>
                            <p className="text-sm text-gray-400">No messages yet</p>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modals */}
            <UserListModal users={filteredUsers} onUserClick={handleUserClick} />

            {isCreateGroupModalOpen && (
                <CreateGroupModal
                    users={filteredUsers}
                    onClose={toggleCreateGroupModal}
                />
            )}

            {isFilterModalOpen && (
                <FilterModal onClose={toggleFilterModal} />
            )}
        </div>
    );
};

export default Users;
