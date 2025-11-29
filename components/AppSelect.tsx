import React from 'react';
import { ChevronDown } from 'lucide-react';

// Extend SelectHTMLAttributes to accept all standard <select> props
interface AppSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  // containerClassName can be used to style the wrapping div if needed
  containerClassName?: string;
}

const AppSelect: React.FC<AppSelectProps> = ({ className, containerClassName, children, ...props }) => {
  return (
    <div className={`relative w-full ${containerClassName}`}>
      <select
        {...props}
        className={`
          w-full appearance-none rounded-lg border border-gray-300 bg-white 
          px-3 py-2.5 text-sm text-brand-textMain placeholder-gray-500 
          shadow-sm transition duration-150 ease-in-out 
          focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 
          disabled:cursor-not-allowed disabled:opacity-50 
          ${className}
        `}
      >
        {children}
      </select>
      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      />
    </div>
  );
};

export default AppSelect;
