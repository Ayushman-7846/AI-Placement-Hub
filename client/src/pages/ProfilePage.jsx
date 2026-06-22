/**
 * pages/ProfilePage.jsx
 *
 * User Profile Page (Phase 3 Layout)
 *
 * Route: /profile
 * Access: Protected (ProtectedRoute)
 */

import { User, Mail, Shield, Calendar, Clock } from 'lucide-react';
import useAuth from '@hooks/useAuth.js';
import { PageHeader, UserAvatar } from '@components/common';

const formatDate = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function ProfilePage() {
  const { user } = useAuth();

  const INFO_ROWS = [
    {
      label: 'Full Name',
      value: user?.name,
      icon: User,
    },
    {
      label: 'Email Address',
      value: user?.email,
      icon: Mail,
    },
    {
      label: 'Account Role',
      value: user?.role,
      icon: Shield,
      badge: true,
    },
    {
      label: 'Member Since',
      value: formatDate(user?.created_at),
      icon: Calendar,
    },
    {
      label: 'Last Updated',
      value: formatDate(user?.updated_at),
      icon: Clock,
    },
  ];

  return (
    <div className="max-w-4xl animate-fade-in pb-8">
      
      <PageHeader 
        title="My Profile" 
        description="Manage your account settings and preferences."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Summary */}
        <div className="md:col-span-1">
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <UserAvatar user={user} size="xl" className="shadow-lg" />
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-success-500 border-4 border-surface-800" />
            </div>
            
            <h2 className="text-xl font-bold text-text-primary mb-1">
              {user?.name ?? 'Loading…'}
            </h2>
            <p className="text-text-secondary text-sm mb-4">{user?.email}</p>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/15 text-primary-300 border border-primary-500/30 w-fit">
              <Shield className="w-3 h-3" />
              {user?.role ?? 'USER'}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2">
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-5 border-b border-surface-border bg-surface-800/50">
              <h3 className="text-base font-semibold text-text-primary">Account Information</h3>
              <p className="text-xs text-text-tertiary mt-1">Your personal and contact details.</p>
            </div>

            <div className="divide-y divide-surface-border">
              {INFO_ROWS.map(({ label, value, icon: Icon, badge }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-surface-800/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-700/50 flex items-center justify-center text-text-secondary flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-tertiary mb-1 uppercase tracking-wider">{label}</p>
                    {badge ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-700 text-text-primary border border-surface-border">
                        {value ?? '—'}
                      </span>
                    ) : (
                      <p className="text-sm text-text-primary font-medium truncate">
                        {value ?? '—'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-6 py-4 bg-surface-800/30 border-t border-surface-border">
              <p className="text-xs text-text-tertiary flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50" />
                Profile editing will be available in Phase 4.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ProfilePage;
