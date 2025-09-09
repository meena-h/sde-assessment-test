// src/components/inputs/Input.jsx
import React, { useState } from 'react';

const Input = ({ label, type = "text", value, onChange, placeholder, showPasswordToggle = false }) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = showPasswordToggle && showPassword ? "text" : type;

    return (
        <div className="relative">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <input
                type={inputType}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
            {showPasswordToggle && type === "password" && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            )}
        </div>
    );
};

export default Input;
