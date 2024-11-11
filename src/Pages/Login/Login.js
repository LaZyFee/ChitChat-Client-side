import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Store/AuthStore';
import toast from 'react-hot-toast';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            await login(email, password);
            console.log(email, password);
            toast.success("Logged in successfully!");
            navigate('/'); // Navigate on success
        } catch (error) {
            toast.error(error.message || "Login failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='h-[600px] flex justify-center items-center'>
            <div className='w-96 p-7'>
                <h2 className='text-xl text-center'>Login</h2>
                <form onSubmit={handleSubmit}>
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
                        <label className="label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input input-bordered w-full max-w-xs"
                            disabled={loading}
                            required
                        />
                    </div>
                    <button
                        className='btn btn-accent w-full mt-4'
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {error && <p className="text-red-500">{error}</p>}
                <p>Don't have an account? <Link className='text-secondary' to="/signup">Sign Up</Link></p>
            </div>
        </div>
    );
};

export default Login;
