/**
 * components/dashboard/FeatureCard.jsx
 *
 * Reusable feature card for dashboard quick actions.
 */

import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  to, 
  disabled = false,
  className = ''
}) {
  const CardWrapper = disabled ? 'div' : Link;
  const wrapperProps = disabled ? {} : { to };

  return (
    <CardWrapper
      {...wrapperProps}
      className={`glass-card p-6 flex flex-col h-full group relative overflow-hidden ${
        disabled 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:border-primary-500/40 hover:bg-surface-800/80 transition-all duration-300'
      } ${className}`}
    >
      {/* Background decoration gradient */}
      {!disabled && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          disabled ? 'bg-surface-700/50 text-text-tertiary' : 'bg-primary-500/10 text-primary-400'
        }`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        
        {!disabled && (
          <div className="w-8 h-8 rounded-full bg-surface-700/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight className="w-4 h-4 text-text-secondary" />
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary mb-6 flex-grow">{description}</p>

      {disabled && (
        <div className="mt-auto">
          <span className="inline-flex items-center text-xs font-medium text-text-tertiary bg-surface-700/50 px-2.5 py-1 rounded-md">
            Coming Soon
          </span>
        </div>
      )}
    </CardWrapper>
  );
}

export default FeatureCard;
