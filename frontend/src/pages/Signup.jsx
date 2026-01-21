import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SignupForm from '../components/SignupForm';

const Signup = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-100 flex items-center justify-center px-6">
      
      {/* ===== Same animated light background ===== */}
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
        
        {/* LEFT — Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="hidden lg:block"
        >
          <h1 className="text-4xl font-bold leading-tight mb-5 text-slate-900">
            Build clarity.<br />
            Execute faster.<br />
            Stay aligned.
          </h1>

          <p className="text-slate-600 max-w-md mb-7">
            PrimeTrade TODO demonstrates scalable frontend architecture,
            secure authentication, and clean CRUD-based workflows.
          </p>

          <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-6 max-w-sm shadow-sm">
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Modern React + Tailwind UI
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                JWT-secured authentication
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                Scalable backend integration
              </li>
            </ul>
          </div>
        </motion.div>

        {/* RIGHT — Signup card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center lg:justify-end w-full"
        >
          <SignupForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
