/**
 * components/common/PageHeader.jsx
 *
 * Reusable page header component with title, description, and optional children.
 */

function PageHeader({ title, description, children, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">{title}</h1>
        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
