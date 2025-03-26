import React from "react";

const Button = ({ onClick, children, variant = "primary", disabled = false }) => {
  const baseStyles = "px-6 py-2 rounded-md font-semibold transition-all duration-300 shadow-md";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? "cursor-not-allowed" : "hover:scale-105"}`}
    >
      {children}
    </button>
  );
};

export default Button;
