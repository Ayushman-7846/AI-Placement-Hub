/**
 * pages/ResumeAnalyzerPage.jsx
 *
 * Placeholder page for Phase 4 Resume Analyzer feature.
 */

import { FileText } from 'lucide-react';
import { PageHeader, EmptyState } from '@components/common';

function ResumeAnalyzerPage() {
  return (
    <>
      <PageHeader 
        title="Resume Analyzer" 
        description="Get intelligent feedback on your resume to pass ATS screens."
      />
      <EmptyState
        icon={FileText}
        title="Resume Analyzer"
        description="Coming in Phase 4. Upload your resume to receive a detailed AI analysis, score, and suggestions for improvement."
      />
    </>
  );
}

export default ResumeAnalyzerPage;
