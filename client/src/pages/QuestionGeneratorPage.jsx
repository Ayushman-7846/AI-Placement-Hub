/**
 * pages/QuestionGeneratorPage.jsx
 *
 * Placeholder page for Phase 4 Question Generator feature.
 */

import { HelpCircle } from 'lucide-react';
import { PageHeader, EmptyState } from '@components/common';

function QuestionGeneratorPage() {
  return (
    <>
      <PageHeader 
        title="Question Generator" 
        description="Generate tailored questions for any role."
      />
      <EmptyState
        icon={HelpCircle}
        title="Question Generator"
        description="Coming in Phase 4. Instantly generate behavioral and technical questions specific to the job you are applying for."
      />
    </>
  );
}

export default QuestionGeneratorPage;
