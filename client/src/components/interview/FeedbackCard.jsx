/**
 * components/interview/FeedbackCard.jsx
 */

import React from 'react';
import { CheckCircle, XCircle, Lightbulb, MessageSquare, Award } from 'lucide-react';

function FeedbackCard({ feedback }) {
  if (!feedback) return null;

  const { score, strengths, weaknesses, suggestions, feedback: generalFeedback } = feedback;

  return (
    <div className="glass-card overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-surface-800/50 p-6 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-primary-400" />
          <h3 className="text-lg font-semibold text-text-primary">Evaluation Result</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-tertiary">Score:</span>
          <span className={`text-2xl font-bold ${
            score >= 80 ? 'text-success-400' : 
            score >= 60 ? 'text-warning-400' : 
            'text-error-400'
          }`}>
            {score}/100
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* General Feedback */}
        {generalFeedback && (
          <div className="flex gap-4">
            <MessageSquare className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">Overall Feedback</h4>
              <p className="text-text-secondary leading-relaxed">{generalFeedback}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths */}
          {strengths?.length > 0 && (
            <div className="flex gap-4 bg-success-500/5 p-4 rounded-xl border border-success-500/10">
              <CheckCircle className="w-5 h-5 text-success-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-success-300 uppercase tracking-wider mb-3">Strengths</h4>
                <ul className="space-y-2">
                  {strengths.map((item, idx) => (
                    <li key={idx} className="text-text-secondary text-sm leading-relaxed flex items-start gap-2">
                      <span className="text-success-500 mt-1.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Weaknesses */}
          {weaknesses?.length > 0 && (
            <div className="flex gap-4 bg-error-500/5 p-4 rounded-xl border border-error-500/10">
              <XCircle className="w-5 h-5 text-error-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-error-300 uppercase tracking-wider mb-3">Areas to Improve</h4>
                <ul className="space-y-2">
                  {weaknesses.map((item, idx) => (
                    <li key={idx} className="text-text-secondary text-sm leading-relaxed flex items-start gap-2">
                      <span className="text-error-500 mt-1.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {suggestions?.length > 0 && (
          <div className="flex gap-4 bg-warning-500/5 p-4 rounded-xl border border-warning-500/10">
            <Lightbulb className="w-5 h-5 text-warning-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-warning-300 uppercase tracking-wider mb-3">Actionable Suggestions</h4>
              <ul className="space-y-2">
                {suggestions.map((item, idx) => (
                  <li key={idx} className="text-text-secondary text-sm leading-relaxed flex items-start gap-2">
                    <span className="text-warning-500 mt-1.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackCard;
