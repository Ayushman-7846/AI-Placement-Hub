/**
 * layouts/TopNavbar.jsx
 *
 * Top navigation bar for the dashboard layout.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, Settings, User } from 'lucide-react';
import useAuth from '@hooks/useAuth.js';
import { UserAvatar } from '@components/common';

function TopNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch {
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-surface-900/80 backdrop-blur-md border-b border-surface-border h-16 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left section: Mobile menu toggle */}
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right section: Actions and Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications (Placeholder) */}
        <button className="relative p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error-500 border-2 border-surface-900" />
        </button>

        <div className="h-6 w-px bg-surface-border mx-1 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-surface-800 transition-colors border border-transparent hover:border-surface-border"
          >
            <UserAvatar user={user} size="sm" />
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-sm font-medium text-text-primary leading-none mb-1">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
              <span className="text-xs text-text-tertiary leading-none capitalize">
                {user?.role?.toLowerCase() || 'user'}
              </span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              {/* Overlay for closing */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileOpen(false)} 
              />
              
              <div className="absolute right-0 mt-2 w-56 bg-surface-900 border border-surface-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-surface-border flex flex-col gap-1">
                  <span className="text-sm font-semibold text-text-primary">{user?.name}</span>
                  <span className="text-xs text-text-tertiary truncate">{user?.email}</span>
                </div>
                
                <div className="p-2">
                  <Link 
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-800 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <button 
                    disabled
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-tertiary opacity-50 cursor-not-allowed rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Preferences
                  </button>
                </div>
                
                <div className="p-2 border-t border-surface-border">
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-400 hover:bg-error-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
