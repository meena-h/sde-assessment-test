import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/inputs/Input';
import axiosInstance from '../../api/axiosInstance';
import { AUTH } from '../../api/apiPath';
import { UserContext } from '../../context/userContext';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [inviteToken, setInviteToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {updateUser} = useContext(UserContext);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axiosInstance.post(
                `${AUTH.REGISTER}`,
                {
                    username,
                    email,
                    full_name: fullName,
                    password,
                    invite_token: inviteToken // Passing invite token
                }
            );

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
            <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 md:w-5/12 space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
                <p className="text-center text-gray-500">Sign up to get started</p>

                <form className="space-y-4" onSubmit={handleSignUp}>
                    <Input
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    <Input
                        label="Full Name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        showPasswordToggle={true}
                    />
                    <Input
                        label="Admin Invite Token"
                        type="text"
                        value={inviteToken}
                        onChange={(e) => setInviteToken(e.target.value)}
                        placeholder="Enter invite token if you have one"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-semibold p-3 rounded-lg hover:from-green-500 hover:via-blue-600 hover:to-purple-700 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center text-gray-600 text-sm">
                    Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
                </div>
            </div>
        </AuthLayout>
    );
};

export default SignUp;
