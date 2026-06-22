/**
 * components/dashboard/StatCard.jsx
 *
 * Reusable stat card for the dashboard.
 */

function StatCard({ title, value, icon: Icon, trend, className = '' }) {
  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;
  const trendColor = isPositive ? 'text-success-500' : isNegative ? 'text-error-500' : 'text-text-tertiary';

  return (
    <div className={`glass-card p-6 flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-text-secondary">{title}</span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-surface-700/50 flex items-center justify-center text-primary-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-text-primary">{value}</span>
        {trend && (
          <span className={`text-xs font-medium mb-1 ${trendColor}`}>
            {isPositive ? '+' : ''}{trend.value}% {trend.label && <span className="text-text-tertiary font-normal ml-1">{trend.label}</span>}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
