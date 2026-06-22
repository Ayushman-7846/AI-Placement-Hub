/**
 * pages/InterviewsPage.jsx
 *
 * Placeholder page for Phase 4 AI Mock Interviews feature.
 */

import { Target } from 'lucide-react';
import { PageHeader, EmptyState } from '@components/common';

function InterviewsPage() {
  return (
    <>
      <PageHeader 
        title="Mock Interviews" 
        description="Practice and perfect your interview skills with our AI."
      />
      <EmptyState
        icon={Target}
        title="AI Mock Interviews"
        description="Coming in Phase 4. You will be able to practice realistic interviews tailored to your target role and get instant, actionable feedback."
      />
    </>
  );
}

export default InterviewsPage;
