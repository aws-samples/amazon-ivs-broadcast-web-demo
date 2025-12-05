import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import '@/lib/amplify-config';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthState();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = async (e) => {
      if (e.key === 'CognitoIdentityServiceProvider' || e.key?.includes('CognitoIdentityServiceProvider')) {
        // Auth state changed in another tab, recheck
        await checkAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for focus events to sync when switching windows
    const handleFocus = () => {
      checkAuthState();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const checkAuthState = async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser({ username: currentUser.username });

      // Try to get user attributes to determine user type
      try {
        const attributes = await fetchUserAttributes();
        const userTypeFromAttr = attributes['custom:userType'] || null;
        setUserType(userTypeFromAttr);
      } catch (attrError) {
        // Fallback to checking token if fetchUserAttributes fails
        try {
          const session = await fetchAuthSession();
          const token = session.tokens?.idToken;
          if (token?.payload) {
            const userTypeFromToken = token.payload['custom:userType'] || null;
            setUserType(userTypeFromToken);
          }
        } catch (tokenError) {
          console.warn('Could not fetch user type:', tokenError);
        }
      }
    } catch {
      setUser(null);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setError(null);
    try {
      const { isSignedIn } = await signIn({ username, password });
      if (isSignedIn) {
        await checkAuthState();
        return { success: true };
      }
      return { success: false, error: 'Sign in incomplete' };
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (username, email, password, userType) => {
    setError(null);
    try {
      const { userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            'custom:userType': userType,
          },
        },
      });
      return { 
        success: true, 
        userId, 
        nextStep,
        message: nextStep?.signUpStep === 'CONFIRM_SIGN_UP' 
          ? 'Check your email for verification.' 
          : 'Registration successful'
      };
    } catch (err) {
      const errorMessage = err.message || 'Failed to register';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut();
      setUser(null);
      setUserType(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign out';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        loading,
        error,
        login,
        register,
        logout,
        checkAuthState,
        isAuthenticated: !!user,
        isViewer: userType === 'viewer',
        isBroadcaster: userType === 'broadcaster',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
