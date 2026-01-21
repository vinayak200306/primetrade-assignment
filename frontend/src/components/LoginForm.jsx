import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email address';

    if (!formData.password) newErrors.password = 'Password is required';
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
    setErrors({});
    try {
      const res = await api.post('/api/auth/login', formData);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          'Login failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-10 border border-white/20">
        {/* Heading */}
        <div className="mb-8">
          <motion.h1
            initial={{ backgroundPosition: '0% 50%' }}
            animate={{ backgroundPosition: '100% 50%' }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-slate-900 via-slate-500 to-slate-900 bg-[length:200%_200%] bg-clip-text text-transparent"
          >
            Welcome back
          </motion.h1>
          <p className="text-slate-600 text-lg">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Error */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
          >
            {errors.submit}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:outline-none transition ${
                errors.email
                  ? 'border-red-400 bg-red-50'
                  : 'border-slate-200'
              }`}
              placeholder="you@company.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:outline-none transition ${
                errors.password
                  ? 'border-red-400 bg-red-50'
                  : 'border-slate-200'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-center text-sm text-slate-600">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-slate-900 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;
