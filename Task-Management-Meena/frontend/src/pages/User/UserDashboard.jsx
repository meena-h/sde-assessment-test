import React from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';


const UserDashboard = () => {
    useUserAuth();

    const { user } = useContext(UserContext);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user.full_name}!</h1>
            <p className="text-gray-600">This is your user dashboard.</p>
            <div className="mt-6 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Your Info:</h2>
                <ul className="space-y-2">
                    <li><strong>Email:</strong> {user.email}</li>
                    <li><strong>Username:</strong> {user.username}</li>
                    <li><strong>Role:</strong> {user.role}</li>
                    <li><strong>Profile URL:</strong> <a href={user.profile_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Profile</a></li>
                </ul>
            </div>
        </div>
    );
};

export default UserDashboard;



