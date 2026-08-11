import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  icon = null,
  animateHover = true,
  fullWidth = false
}) => {
  const baseStyles = "font-bold rounded-full transition-all duration-300 flex items-center justify-center";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    outline: "bg-transparent border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:bg-opacity-10",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
  };
  
  const sizeStyles = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };
  
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const hoverAnimation = animateHover && !disabled ? "transform hover:scale-105" : "";
  const widthStyle = fullWidth ? "w-full" : "";
  
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${hoverAnimation} ${widthStyle} ${className}`;
  
  return (
    <button
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button; 