import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCircleNotch, faGear } from '@fortawesome/free-solid-svg-icons';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  overlay?: boolean;
  type?: 'spinner' | 'circle' | 'gear';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = false,
  overlay = false,
  type = 'spinner',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xl w-5 h-5',
    md: 'text-2xl w-6 h-6',
    lg: 'text-3xl w-8 h-8',
    xl: 'text-4xl w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-500',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  const iconMap = {
    spinner: faSpinner,
    circle: faCircleNotch,
    gear: faGear
  };

  const content = (
    <div className={`text-center ${className}`}>
      <div className="relative">
        <FontAwesomeIcon 
          icon={iconMap[type]} 
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} 
        />
        {size === 'lg' || size === 'xl' ? (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-20 animate-pulse"></div>
        ) : null}
      </div>
      {message && (
        <p className={`mt-3 text-sm font-medium ${colorClasses[color]}`}>
          {message}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4">
          {content}
        </div>
      </div>
    );
  }

  if (fullScreen) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;