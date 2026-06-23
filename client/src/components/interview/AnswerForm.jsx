/**
 * components/interview/AnswerForm.jsx
 */

import React, { useState } from 'react';
import { Button } from '@components/common';
import { Send } from 'lucide-react';

function AnswerForm({ onSubmit, isSubmitting }) {
  const [answer, setAnswer] = useState('');
  
  // Clear answer field when moving to the next question (which unmounts/remounts or changes onSubmit context ideally, 
  // but let's expose a way or just clear on submit if successful).
  // The parent will control rendering to reset state if a new question appears.

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || isSubmitting) return;
    onSubmit(answer);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 animate-fade-in">
      <div className="mb-4 flex justify-between items-end">
        <label htmlFor="answer-input" className="block text-sm font-medium text-text-secondary">
          Your Answer
        </label>
        <span className={`text-xs ${answer.length < 50 ? 'text-error-400' : 'text-success-400'}`}>
          {answer.length} characters {answer.length < 50 && '(Too short)'}
        </span>
      </div>
      
      <div className="relative">
        <textarea
          id="answer-input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isSubmitting}
          className="w-full min-h-[200px] p-4 bg-surface-900 border border-surface-border rounded-xl text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-y disabled:opacity-50 disabled:cursor-not-allowed font-sans text-base leading-relaxed"
          placeholder="Type your comprehensive answer here... Try to provide specific examples and structure your thoughts clearly."
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          type="submit" 
          isLoading={isSubmitting} 
          disabled={!answer.trim() || answer.length < 10 || isSubmitting}
          icon={Send}
        >
          {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
        </Button>
      </div>
    </form>
  );
}

export default AnswerForm;
