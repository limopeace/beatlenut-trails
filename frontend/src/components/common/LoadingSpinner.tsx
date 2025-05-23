import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const content = (
    <div className={`text-center ${className}`}>
      <FontAwesomeIcon 
        icon={faSpinner} 
        className={`text-blue-600 ${sizeClasses[size]} animate-spin`} 
      />
      {message && <p className="mt-2 text-gray-600">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;