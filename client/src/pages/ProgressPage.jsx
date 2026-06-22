/**
 * pages/ProgressPage.jsx
 *
 * Placeholder page for Phase 4 Progress Tracker feature.
 */

import { TrendingUp } from 'lucide-react';
import { PageHeader, EmptyState } from '@components/common';

function ProgressPage() {
  return (
    <>
      <PageHeader 
        title="Progress Tracker" 
        description="Monitor your improvement and interview readiness over time."
      />
      <EmptyState
        icon={TrendingUp}
        title="Progress Tracker"
        description="Coming in Phase 4. View detailed analytics, historical performance charts, and your overall readiness score."
      />
    </>
  );
}

export default ProgressPage;
