import React, { useState } from 'react';
import { Building2, LogOut, RotateCcw, User as UserIcon, CheckCircle2, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import api from '../api/client.js';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset all hostel database collections to default demo state?')) {
      return;
    }
    setResetting(true);
    try {
      const res = await api.post('/seed/reset');
      if (res.data.success) {
        setResetMessage('Demo data restored!');
        setTimeout(() => {
          setResetMessage(null);
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Left Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-inner font-bold shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white truncate">SMART HOSTEL</span>
                <span className="hidden sm:inline text-[11px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded whitespace-nowrap">
                  GTU B.E. Sem 5
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block truncate">
                Gujarat Technological University · Campus Residence System
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {resetMessage ? (
              <span className="hidden md:flex items-center text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {resetMessage}
              </span>
            ) : (
              <button
                onClick={handleResetDemoData}
                disabled={resetting}
                title="Reset database to demo seed data"
                className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                <span>{resetting ? 'Resetting...' : 'Reset Demo Data'}</span>
              </button>
            )}

            {/* User Info */}
            <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2 sm:px-3 py-1.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-left hidden sm:block min-w-0">
                <div className="text-xs font-semibold text-white leading-tight truncate max-w-[120px] lg:max-w-none">{user?.name}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider truncate">
                  {user?.role === 'admin' ? 'Warden' : `Student`}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Sign Out"
              className="flex items-center space-x-1 sm:space-x-1.5 text-xs text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 px-2 sm:px-3 py-1.5 rounded-md transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
