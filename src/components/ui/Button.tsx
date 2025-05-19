import React from 'react';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'secondary', className = '' }) => {
    const baseStyles = "flex-1 px-2 py-1 text-white rounded-md transition-colors border focus:outline-none focus:ring-2";

    const variantStyles = {
        primary: "bg-cyan-600 hover:bg-cyan-500 border-cyan-500 focus:ring-cyan-400",
        secondary: "bg-zinc-600 hover:bg-zinc-500 border-zinc-500 focus:ring-zinc-400"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;