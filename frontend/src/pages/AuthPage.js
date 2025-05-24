import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the path the user was trying to access before being redirected to auth
  const from = location.state?.from?.pathname || '/';

  const handleAuthSuccess = () => {
    // Redirect the user back to the page they were trying to access
    navigate(from, { replace: true });
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {isLoginView ? (
          <LoginForm onToggleForm={toggleView} onSuccess={handleAuthSuccess} />
        ) : (
          <SignupForm onToggleForm={toggleView} onSuccess={handleAuthSuccess} />
        )}
      </div>
    </div>
  );
};

export default AuthPage; 