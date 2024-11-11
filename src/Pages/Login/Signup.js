import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Store/AuthStore';
import toast from 'react-hot-toast';

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signup, error } = useAuth();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target); // Capture form data as FormData
        try {
            await signup(formData);
            toast.success("Signed up successfully!");
            navigate('/'); // Navigate to home or other route on success
        } catch (error) {
            toast.error(error.message || "Signup failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='h-[600px] flex justify-center items-center'>
            <div className='w-96 p-7'>
                <h2 className='text-xl text-center'>Sign Up</h2>
                <form onSubmit={handleSignup}>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input input-bordered w-full max-w-xs"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="input input-bordered w-full max-w-xs"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">Mobile</label>
                        <input
                            type="text"
                            name="mobile"
                            className="input input-bordered w-full max-w-xs"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input input-bordered w-full max-w-xs"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">Profile Picture</label>
                        <input
                            type="file"
                            name="profilePicture"
                            accept="image/*"
                            className="input input-bordered w-full max-w-xs"
                            disabled={loading}
                        />
                    </div>
                    <button
                        className='btn btn-accent w-full mt-4'
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                {error && <p className="text-red-500">{error}</p>}
                <p>Already have an account? <Link className='text-secondary' to="/login">Please Login</Link></p>
            </div>
        </div>
    );
};

export default Signup;