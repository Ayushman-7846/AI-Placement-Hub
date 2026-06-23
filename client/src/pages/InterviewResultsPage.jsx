/**
 * pages/InterviewResultsPage.jsx
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LoadingSpinner, Button } from '@components/common';
import { ScoreCard, FeedbackCard } from '@components/interview';
import useInterview from '@hooks/useInterview.js';

function InterviewResultsPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { getSessionDetails, error } = useInterview();

  const [session, setSession] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadSession = async () => {
      try {
        const data = await getSessionDetails(sessionId);
        if (!isMounted) return;

        if (data.status !== 'COMPLETED') {
          // If the user lands here but the interview is not complete, redirect them to the session page
          navigate(`/interviews/session/${sessionId}`, { replace: true });
          return;
        }

        setSession(data);
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        // error handled by hook
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };

    if (sessionId) {
      loadSession();
    }

    return () => {
      isMounted = false;
    };
  }, [sessionId, getSessionDetails, navigate]);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-text-secondary animate-pulse">Loading results...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="glass-card p-8 border-error-500/20 bg-error-500/5">
          <h2 className="text-xl font-semibold text-error-400 mb-4">Error Loading Results</h2>
          <p className="text-text-secondary mb-6">{error || 'Session not found'}</p>
          <Button onClick={() => navigate('/interviews')}>Return to Interviews</Button>
        </div>
      </div>
    );
  }

  // Combine answers with their corresponding questions for display
  const QA_List = session.questions.map(q => {
    const answer = session.answers?.find(a => a.questionId === q.id);
    return { question: q, answer };
  });

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in space-y-8">
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/interviews')}
          className="text-text-tertiary hover:text-text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Interviews
        </Button>
      </div>

      <ScoreCard session={session} />

      <div className="space-y-8 mt-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-6">Detailed Feedback</h2>
        
        {QA_List.map((qa, index) => (
          <div key={qa.question.id} className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-800 text-text-secondary font-medium shrink-0 mt-0.5 border border-surface-border">
                {index + 1}
              </div>
              <h3 className="text-lg font-medium text-text-primary leading-relaxed">
                {qa.question.question}
              </h3>
            </div>
            
            <div className="pl-11">
              <div className="glass-card p-5 mb-4 bg-surface-900/50">
                <p className="text-sm text-text-secondary whitespace-pre-wrap">{qa.answer?.answer || 'No answer provided.'}</p>
              </div>
              
              <FeedbackCard feedback={qa.answer} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-8 border-t border-surface-border mt-12">
        <Button size="lg" onClick={() => navigate('/interviews')}>
          Back to Dashboard
        </Button>
      </div>

    </div>
  );
}

export default InterviewResultsPage;
