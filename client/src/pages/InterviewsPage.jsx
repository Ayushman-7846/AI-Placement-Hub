/**
 * pages/InterviewsPage.jsx
 *
 * Placeholder page for Phase 4 AI Mock Interviews feature.
 */

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, LoadingSpinner, FormError } from '@components/common';
import { InterviewHistoryTable, InterviewEmptyState } from '@components/interview';
import useInterview from '@hooks/useInterview.js';

function InterviewsPage() {
  const navigate = useNavigate();
  const { getSessions, error } = useInterview();
  const [sessions, setSessions] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSessions = async () => {
      try {
        const data = await getSessions();
        if (isMounted) setSessions(data);
      } catch (err) {
        console.error(err);
        // error is handled by hook
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };
    fetchSessions();
    return () => {
      isMounted = false;
    };
  }, [getSessions]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Mock Interviews" 
          description="Practice and perfect your interview skills with our AI."
        />
        <Button 
          onClick={() => navigate('/interviews/setup')}
          icon={Plus}
          className="w-full sm:w-auto shadow-lg shadow-primary-500/20"
        >
          New Interview
        </Button>
      </div>

      {error && <FormError message={error} />}

      {isInitializing ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-text-secondary animate-pulse">Loading your interview history...</p>
        </div>
      ) : sessions.length === 0 ? (
        <InterviewEmptyState />
      ) : (
        <InterviewHistoryTable sessions={sessions} />
      )}
    </div>
  );
}

export default InterviewsPage;
