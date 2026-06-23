/**
 * components/interview/ScoreCard.jsx
 */

import React from 'react';
import { Trophy, Target, Clock, Zap } from 'lucide-react';

function getPerformanceLevel(score) {
  if (score >= 90) return { label: 'Excellent', color: 'text-success-400', bg: 'bg-success-400/10', border: 'border-success-400/20' };
  if (score >= 75) return { label: 'Good', color: 'text-primary-400', bg: 'bg-primary-400/10', border: 'border-primary-400/20' };
  if (score >= 60) return { label: 'Average', color: 'text-warning-400', bg: 'bg-warning-400/10', border: 'border-warning-400/20' };
  return { label: 'Needs Improvement', color: 'text-error-400', bg: 'bg-error-400/10', border: 'border-error-400/20' };
}

function ScoreCard({ session }) {
  if (!session) return null;

  const { overallScore, role, difficulty, questions } = session;
  const level = getPerformanceLevel(overallScore);

  return (
    <div className="glass-card p-8 md:p-10 relative overflow-hidden text-center">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
      
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-800 border-2 border-surface-border mb-6">
        <Trophy className={`w-10 h-10 ${level.color}`} />
      </div>

      <h2 className="text-3xl font-bold text-text-primary mb-2">
        Interview Completed
      </h2>
      
      <p className="text-text-secondary mb-8 max-w-md mx-auto">
        You have successfully completed your mock interview for the <span className="text-text-primary font-medium">{role}</span> role.
      </p>

      <div className="flex flex-col items-center mb-8">
        <div className="text-sm font-medium text-text-tertiary uppercase tracking-widest mb-2">Overall Score</div>
        <div className={`text-6xl font-extrabold ${level.color} mb-3`}>
          {overallScore}<span className="text-3xl text-text-tertiary">/100</span>
        </div>
        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border ${level.bg} ${level.color} ${level.border}`}>
          {level.label}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-surface-border/50">
        <div className="flex flex-col items-center p-4 bg-surface-900/50 rounded-xl">
          <Target className="w-5 h-5 text-text-tertiary mb-2" />
          <span className="text-xs text-text-tertiary mb-1">Role</span>
          <span className="text-sm font-medium text-text-primary text-center line-clamp-1">{role}</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-surface-900/50 rounded-xl">
          <Zap className="w-5 h-5 text-text-tertiary mb-2" />
          <span className="text-xs text-text-tertiary mb-1">Difficulty</span>
          <span className="text-sm font-medium text-text-primary capitalize">{difficulty}</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-surface-900/50 rounded-xl">
          <HelpCircleIcon className="w-5 h-5 text-text-tertiary mb-2" />
          <span className="text-xs text-text-tertiary mb-1">Questions</span>
          <span className="text-sm font-medium text-text-primary">{questions?.length || 0}</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-surface-900/50 rounded-xl">
          <Clock className="w-5 h-5 text-text-tertiary mb-2" />
          <span className="text-xs text-text-tertiary mb-1">Status</span>
          <span className="text-sm font-medium text-success-400">Completed</span>
        </div>
      </div>
    </div>
  );
}

// Temporary icon for internal use in ScoreCard
function HelpCircleIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );
}

export default ScoreCard;
