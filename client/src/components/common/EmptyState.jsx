/**
 * components/common/EmptyState.jsx
 *
 * Reusable empty state for placeholder features or empty lists.
 */



function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className = '' 
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center border border-dashed border-surface-border rounded-2xl bg-surface-800/30 ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-primary-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}

export default EmptyState;
