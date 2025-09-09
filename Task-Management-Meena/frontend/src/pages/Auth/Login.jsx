// src/pages/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout.jsx';
import Input from '../../components/inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { AUTH } from '../../utils/apiPath.js';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {updateUser} = useContext(UserContext);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // prevent page reload
        setLoading(true);
        setError('');

        try {
           const response = await axiosInstance.post(AUTH.LOGIN, { email, password });


            const { token, role } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                updateUser(response.data);
                if (role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/user/dashboard');
                }
            } else {
                setError('Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.error || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 md:w-4/12 space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
                <p className="text-center text-gray-500">Sign in to continue to your account</p>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        showPasswordToggle={true}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white font-semibold p-3 rounded-lg hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="text-center text-gray-600 text-sm">
                    Don't have an account? <a href="/signUp" className="text-indigo-600 hover:underline">Sign up</a>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Login;
