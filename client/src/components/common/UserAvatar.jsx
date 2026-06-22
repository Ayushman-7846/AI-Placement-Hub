/**
 * components/common/UserAvatar.jsx
 *
 * Reusable component for displaying user initials and role badge.
 */

const getInitials = (name = '') => {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
};

function UserAvatar({ user, size = 'md', className = '' }) {
  const initials = getInitials(user?.name);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs rounded-lg',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-14 h-14 text-xl rounded-2xl',
    xl: 'w-24 h-24 text-3xl rounded-3xl'
  };

  return (
    <div
      className={`bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold shadow-glow-sm flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
}

export default UserAvatar;
