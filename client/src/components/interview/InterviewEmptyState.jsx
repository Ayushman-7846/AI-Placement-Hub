/**
 * components/interview/InterviewEmptyState.jsx
 */

import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common';

function InterviewEmptyState() {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-12 text-center border-dashed animate-fade-in-up">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 text-primary-400 mb-6 mx-auto">
        <Target className="w-8 h-8" />
      </div>
      
      <h3 className="text-xl font-semibold text-text-primary mb-3">No Interviews Yet</h3>
      
      <p className="text-text-secondary max-w-md mx-auto mb-8">
        Start practicing for your dream job with our AI interviewer. Get tailored questions and instant, actionable feedback.
      </p>

      <Button 
        onClick={() => navigate('/interviews/setup')}
        icon={ArrowRight}
        className="mx-auto shadow-lg shadow-primary-500/20"
      >
        Start Your First Interview
      </Button>
    </div>
  );
}

export default InterviewEmptyState;
