import { useState } from 'react';
import { useAuth } from '@/providers/AuthContext';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function AuthForm({ mode = 'login', onSwitchMode, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'viewer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(formData.username, formData.password);
        if (result.success) {
          onSuccess?.();
        } else {
          setError(result.error || 'Login failed. Please check your credentials.');
        }
      } else {
        // Validation for signup
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          setLoading(false);
          return;
        }

        const result = await register(
          formData.username,
          formData.email,
          formData.password,
          formData.userType
        );

        if (result.success) {
          // If confirmation is required, show message
          if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
            setError('Please check your email for a verification code.');
            setTimeout(() => {
              onSuccess?.();
            }, 2000);
          } else {
            onSuccess?.();
          }
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* top banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-nyu-primary-600 via-nyu-primary-500 to-nyu-secondary-700">
          <h2 className="text-2xl font-semibold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-white/90 mt-1">
            {mode === 'login'
              ? 'Sign in to continue to NYU Sports Live'
              : 'Sign up to watch or broadcast live streams'}
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

        <div className="space-y-5">
        {/* USERNAME */}
        <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-800 mb-1">
            Username
            </label>
            <Input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
        </div>

        {/* SIGNUP-ONLY FIELDS */}
        {mode === 'signup' && (
            <>
            {/* EMAIL */}
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                Email
                </label>
                <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>

            {/* ACCOUNT TYPE */}
            <div>
                <label htmlFor="userType" className="block text-sm font-semibold text-gray-800 mb-1">
                Account Type
                </label>
                <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                <option value="viewer">Viewer</option>
                <option value="broadcaster">Broadcaster</option>
                </select>
            </div>
            </>
        )}

        {/* PASSWORD */}
        <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
            Password
            </label>
            <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder={mode === 'login' ? 'Enter your password' : 'Create a password (min. 8 characters)'}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
        </div>

        {/* CONFIRM PASSWORD */}
        {mode === 'signup' && (
            <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-1">
                Confirm Password
            </label>
            <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            </div>
        )}
        </div>
        <div>
      <Button
        type="primary"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </Button>
</div>
          <div className="mt-4 text-center text-sm">
            <span className="text-nyu-neutral-600">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-nyu-primary-500 font-medium hover:text-nyu-primary-600 underline ml-1"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}