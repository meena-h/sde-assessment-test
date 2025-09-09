// src/components/AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: "url('https://plus.unsplash.com/premium_photo-1705010662508-f6f146dce66d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
            }}
        >
            {children}
        </div>
    );
};

export default AuthLayout;
