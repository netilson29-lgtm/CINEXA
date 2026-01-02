import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
  
  const variants = {
    // Dynamic Brand Gradient with Glow
    primary: "bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-[0_0_20px_rgba(var(--brand-500),0.3)] hover:shadow-[0_0_30px_rgba(var(--accent-500),0.5)] border border-white/10 hover:-translate-y-0.5",
    
    // Glassmorphism Secondary
    secondary: "bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10 hover:border-white/20 shadow-lg shadow-black/20",
    
    // Subtle Danger
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40",
    
    // Ghost
    ghost: "bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {/* Shimmer effect for primary buttons */}
      {variant === 'primary' && !isLoading && !disabled && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
      )}
      
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span className="relative z-20 flex items-center gap-2">{children}</span>
    </button>
  );
};