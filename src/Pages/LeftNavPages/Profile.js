import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../Store/AuthStore';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [imagePreview, setImagePreview] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [hover, setHover] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [name, setName] = useState(user.name);

    // Close modal when clicking outside of it
    const handleOutsideClick = (e) => {
        if (e.target.id === 'modalOverlay') {
            setShowModal(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            // Add event listener when modal is open
            document.addEventListener('click', handleOutsideClick);

            return () => {
                // Cleanup the event listener when the modal is closed
                document.removeEventListener('click', handleOutsideClick);
            };
        }
    }, [showModal]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!currentPassword) {
            toast.error('Please enter your current password to make changes.');
            return;
        }

        const hasNameChanged = name !== user.name;
        const hasNewPassword = newPassword.length > 0;
        const hasProfilePictureChanged = profilePicture !== null;

        if (!hasNameChanged && !hasNewPassword && !hasProfilePictureChanged) {
            toast.error('No changes detected.');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('currentPassword', currentPassword);

            if (hasNameChanged) {
                formData.append('name', name);
            }

            if (hasNewPassword) {
                formData.append('newPassword', newPassword);
            }

            if (hasProfilePictureChanged) {
                formData.append('profilePicture', profilePicture);
            }

            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/auth/update-user/${user._id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Profile updated successfully!');
                const updatedUser = { ...user, name, profilePicture: response.data.user.profilePicture };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setCurrentPassword('');
                setNewPassword('');
                setProfilePicture(null);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('There was an error updating your profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewImage = () => {
        setShowModal(true);
        setShowMenu(false);
    };

    const handleRemoveImage = async () => {
        try {
            // Send request to remove image
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/auth/update-user/${user._id}`,
                { removeImage: true },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // Confirm response and then update frontend state
            if (response.status === 200) {
                // Update state and Zustand
                setProfilePicture(null);
                setImagePreview(null);
                setUser({ ...user, profilePicture: null });
                toast.success('Profile picture removed.');
            } else {
                toast.error('Error removing profile picture.');
            }
        } catch (error) {
            toast.error('Error removing profile picture.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="hero max-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold whitespace-nowrap">Update Profile</h1>
                </div>
                <div className="card w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body" onSubmit={handleFormSubmit}>
                        <div
                            className="relative form-control flex flex-col items-center"
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                        >
                            <img
                                src={imagePreview || `${process.env.REACT_APP_BACKEND_URL}/${user.profilePicture}`}
                                alt="Profile"
                                className="rounded-full w-40 h-40 object-cover mb-4"
                            />
                            {hover && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
                                    onClick={() => setShowMenu(!showMenu)}
                                >
                                    <span className="text-white">✏️</span>
                                </div>
                            )}
                            {showMenu && (
                                <div className="absolute top-32 bg-gray-800 text-white rounded-lg shadow-lg">
                                    <ul className="py-2">
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={handleViewImage}>
                                            View Image
                                        </li>
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={() => document.getElementById('fileInput').click()}>
                                            Change Image
                                        </li>
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={handleRemoveImage}>
                                            Remove Image
                                        </li>
                                    </ul>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                id="fileInput"
                                style={{ display: 'none' }}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                defaultValue={user.email}
                                className="input input-bordered"
                                readOnly
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Phone Number</span>
                            </label>
                            <input
                                type="tel"
                                defaultValue={user.mobile}
                                className="input input-bordered"
                                readOnly
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Current Password</span>
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">New Password</span>
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input input-bordered"
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'UPDATE'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showModal && (
                <div id="modalOverlay" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
                    <div className="relative">
                        <img
                            src={imagePreview || `${process.env.REACT_APP_BACKEND_URL}/${user.profilePicture}`}
                            alt="Profile"
                            className="rounded-lg max-w-md w-full"
                        />
                        <button
                            className="absolute top-2 right-2 bg-white text-black rounded-full px-3 py-1"
                            onClick={() => setShowModal(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
