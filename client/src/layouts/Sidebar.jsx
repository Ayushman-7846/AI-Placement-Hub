/**
 * layouts/Sidebar.jsx
 *
 * Professional SaaS sidebar navigation.
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  FileText, 
  HelpCircle, 
  TrendingUp, 
  User,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Mock Interviews', icon: Target, path: '/interviews' },
  { label: 'Resume Analyzer', icon: FileText, path: '/resume-analyzer' },
  { label: 'Question Generator', icon: HelpCircle, path: '/question-generator' },
  { label: 'Progress Tracker', icon: TrendingUp, path: '/progress' },
  { label: 'Profile', icon: User, path: '/profile' }
];

function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-surface-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-surface-900 border-r border-surface-border transition-all duration-300 flex flex-col ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Header / Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-surface-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-text-primary text-sm whitespace-nowrap">AI Placement Hub</span>
            )}
          </div>
          
          {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-800 transition-colors"
          >
            {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-primary-500/10 text-primary-400 font-medium' 
                  : 'text-text-secondary hover:bg-surface-800 hover:text-text-primary'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-colors ${
                /* This class structure isn't perfect for group-hover without complex setup, 
                   but standard Tailwind classes handle it well enough below */
                ''
              }`} />
              
              {!isCollapsed && (
                <span className="truncate">{label}</span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-surface-800 text-text-primary text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-surface-border">
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-surface-border">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-xl bg-surface-800/50 border border-surface-border`}>
            <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center shrink-0">
               <span className="text-xs font-bold text-text-tertiary">v1.0</span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-text-secondary truncate">Phase 3</p>
                <p className="text-[10px] text-text-tertiary truncate">Dashboard Build</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
