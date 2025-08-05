import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {axiosInstance} from '../../utils/axiosUtil.js';
import { adminLoginStart, adminLoginSuccess, adminLoginFailure } from '../../features/auth/authSlice';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(adminLoginStart());
        setError('');

        try {
            const response = await axiosInstance.post('/admin/admin-login', {
                email,
                password
            });

            // Verify admin role from response
            if (response.data.role !== 'admin') {
                throw new Error('Access denied. Admin privileges required.');
            }

            dispatch(adminLoginSuccess(response.data));
            
            // Redirect to admin dashboard
            navigate('/admin');
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Admin login failed';
            setError(errorMessage);
            dispatch(adminLoginFailure(errorMessage));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Portal</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login as Admin
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;