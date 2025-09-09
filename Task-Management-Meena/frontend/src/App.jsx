import React, { useContext } from 'react';
import { UserContext } from '../src/context/userContext.jsx';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Dashboard from './pages/Admin/Dashboard';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';
import UserDashboard from './pages/User/UserDashboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';
import PrivateRoute from './routes/PrivateRoute';
import { UserProvider } from './context/userContext';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signUp" element={<SignUp />} />

                    <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/tasks" element={<ManageTasks />} />
                        <Route path="/admin/create-task" element={<CreateTask />} />
                        <Route path="/admin/users" element={<ManageUsers />} />
                    </Route>

                    <Route element={<PrivateRoute allowedRoles={['user']} />}>
                        <Route path="/user/dashboard" element={<UserDashboard />} />
                        <Route path="/user/tasks" element={<MyTasks />} />
                        <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
                    </Route>

                    <Route path="/" element={<Root />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;

const Root = () => {
    const { user, loading } = React.useContext(UserContext);

    if (loading) return <div>Loading...</div>;
    if (!user) {
        return <Navigate to="/login" />;
    }

    return user.role === "admin"
        ? <Navigate to="/admin/dashboard" />
        : <Navigate to="/user/dashboard" />;
};
