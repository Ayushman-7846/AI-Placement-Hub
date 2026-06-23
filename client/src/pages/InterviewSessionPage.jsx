/**
 * pages/InterviewSessionPage.jsx
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle } from 'lucide-react';
import { LoadingSpinner, Button, FormError } from '@components/common';
import { ProgressBar, QuestionCard, AnswerForm, FeedbackCard } from '@components/interview';
import useInterview from '@hooks/useInterview.js';

function InterviewSessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { getSessionDetails, submitAnswer, completeInterview, error } = useInterview();

  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Initialize session
  useEffect(() => {
    let isMounted = true;
    
    const loadSession = async () => {
      try {
        const data = await getSessionDetails(sessionId);
        if (!isMounted) return;

        if (data.status === 'COMPLETED') {
          navigate(`/interviews/results/${sessionId}`, { replace: true });
          return;
        }

        setSession(data);
        
        // Find next unanswered question
        const answeredCount = data.answers?.length || 0;
        if (answeredCount < data.questions.length) {
          setCurrentQuestionIndex(answeredCount);
        } else {
          // If all answered but status is not completed, show the last question's feedback
          // and allow completion
          setCurrentQuestionIndex(data.questions.length - 1);
          if (data.answers && data.answers.length > 0) {
            setCurrentFeedback(data.answers[data.questions.length - 1]);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        // error state is handled by hook
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

  // Navigation Guard (Before Unload)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (session && session.status === 'IN_PROGRESS') {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session]);

  const handleAnswerSubmit = async (answerText) => {
    if (!session || !session.questions[currentQuestionIndex]) return;
    
    setIsSubmittingLocal(true);
    setSubmitError(null);
    try {
      const questionId = session.questions[currentQuestionIndex].id;
      const feedback = await submitAnswer(sessionId, { questionId, answer: answerText });
      
      setCurrentFeedback(feedback);
      
      // Update local session state to include the new answer
      setSession(prev => ({
        ...prev,
        answers: [...(prev.answers || []), feedback]
      }));

    } catch (err) {
      setSubmitError(err.message || 'Failed to submit answer');
    } finally {
      setIsSubmittingLocal(false);
    }
  };

  const handleNextOrComplete = async () => {
    if (!session) return;
    setSubmitError(null);

    const isLastQuestion = currentQuestionIndex === session.questions.length - 1;

    if (isLastQuestion) {
      try {
        setIsSubmittingLocal(true);
        await completeInterview(sessionId);
        navigate(`/interviews/results/${sessionId}`, { replace: true });
      } catch (err) {
        setSubmitError(err.message || 'Failed to complete interview');
        setIsSubmittingLocal(false);
      }
    } else {
      // Move to next question
      setCurrentFeedback(null);
      setCurrentQuestionIndex(prev => prev + 1);
      
      // If we somehow already have an answer for the next question (e.g. state sync issue), 
      // load its feedback. In a perfect flow, this shouldn't happen.
      const nextAnswer = session.answers?.find(a => a.questionId === session.questions[currentQuestionIndex + 1]?.id);
      if (nextAnswer) {
        setCurrentFeedback(nextAnswer);
      }
    }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-text-secondary animate-pulse">Loading session data...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="glass-card p-8 border-error-500/20 bg-error-500/5">
          <h2 className="text-xl font-semibold text-error-400 mb-4">Error Loading Interview</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button onClick={() => navigate('/interviews')}>Return to Interviews</Button>
        </div>
      </div>
    );
  }

  if (!session || !session.questions || session.questions.length === 0) return null;

  const currentQuestion = session.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === session.questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in space-y-6">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{session.title}</h1>
          <p className="text-text-tertiary text-sm mt-1">
            {session.role} • {session.difficulty}
          </p>
        </div>
      </div>

      <div className="glass-card p-6 mb-6">
        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={session.questions.length} 
        />
      </div>

      {submitError && <FormError message={submitError} />}

      <QuestionCard 
        question={currentQuestion.question} 
        type={currentQuestion.questionType} 
      />

      {!currentFeedback ? (
        <AnswerForm 
          onSubmit={handleAnswerSubmit} 
          isSubmitting={isSubmittingLocal} 
          key={currentQuestion.id} // Re-mount when question changes
        />
      ) : (
        <div className="space-y-6 animate-fade-in-up">
          <FeedbackCard feedback={currentFeedback} />
          
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleNextOrComplete}
              disabled={isSubmittingLocal}
              isLoading={isSubmittingLocal}
              icon={isLastQuestion ? CheckCircle : ChevronRight}
              size="lg"
              className="w-full sm:w-auto"
            >
              {isLastQuestion ? 'Complete Interview' : 'Next Question'}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}

export default InterviewSessionPage;
