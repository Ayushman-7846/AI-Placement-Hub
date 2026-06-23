/**
 * components/interview/QuestionCard.jsx
 */

import React from 'react';
import { HelpCircle } from 'lucide-react';

function QuestionCard({ question, type }) {
  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
      
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex mt-1 p-2 rounded-lg bg-primary-500/10 text-primary-400">
          <HelpCircle className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <div className="mb-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface-800 text-text-tertiary text-xs font-medium tracking-wide uppercase border border-surface-border">
              {type?.replace('_', ' ') || 'Question'}
            </span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-semibold text-text-primary leading-relaxed">
            {question}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
