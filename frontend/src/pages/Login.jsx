import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-100 flex items-center justify-center px-6">
      
      {/* ===== Soft animated light background ===== */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-1/3 -left-1/3 w-[700px] h-[700px] rounded-full bg-slate-300/40 blur-[160px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/3 -right-1/3 w-[700px] h-[700px] rounded-full bg-slate-200/60 blur-[160px]"
          animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ===== Main layout ===== */}
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-14 items-center">
        
        {/* LEFT — Value proposition */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="hidden lg:block"
        >
          <h1 className="text-4xl font-bold leading-tight mb-5 text-slate-900">
            Focused task management<br />
            built for modern teams
          </h1>

          <p className="text-slate-600 max-w-md mb-7">
            PrimeTrade TODO demonstrates secure authentication,
            clean UI, and scalable frontend–backend integration.
          </p>

          <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-6 max-w-sm shadow-sm">
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Full CRUD task workflow
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Search & status filtering
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                JWT-secured dashboard
              </li>
            </ul>
          </div>
        </motion.div>

        {/* RIGHT — Login card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center lg:justify-end w-full"
        >
          <div className="w-full max-w-md">
            
            {/* HR demo banner */}
            <div className="mb-4 bg-slate-900 text-white rounded-xl px-4 py-3 text-xs text-center shadow">
              Note: <b>Create an account to access</b>👇
            </div>

            <LoginForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
