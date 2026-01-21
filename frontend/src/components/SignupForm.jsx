import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous errors
    try {
      const response = await api.post('/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle different error types
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.response) {
        // Server responded with error
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
          // Handle validation errors
          const validationErrors = {};
          error.response.data.errors.forEach((err) => {
            if (err.param) {
              validationErrors[err.param] = err.msg;
            }
          });
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
          }
          errorMessage = error.response.data.errors[0]?.msg || errorMessage;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Unable to connect to server. Please check your connection.';
      }
      
      setErrors({
        submit: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-white/20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Create account</h1>
          <p className="text-slate-600 text-lg">Get started with your free account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {errors.submit}
            </motion.div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all bg-slate-50 ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all bg-slate-50 ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all bg-slate-50 ${
                errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all bg-slate-50 ${
                errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-slate-200'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-slate-900 font-semibold hover:text-slate-700 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SignupForm;

