/**
 * components/interview/InterviewHistoryTable.jsx
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@components/common';

function getScoreColor(score) {
  if (score >= 90) return 'text-success-400';
  if (score >= 75) return 'text-primary-400';
  if (score >= 60) return 'text-warning-400';
  return 'text-error-400';
}

function InterviewHistoryTable({ sessions = [] }) {
  const navigate = useNavigate();

  // Future proofing: This component is structured to support pagination props 
  // (e.g. currentPage, totalPages, onPageChange) in the future.

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-border bg-surface-800/30">
              <th className="px-6 py-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Role & Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider hidden sm:table-cell">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider text-center">Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {sessions.map((session) => (
              <tr 
                key={session.id} 
                className="hover:bg-surface-800/30 transition-colors group cursor-pointer"
                onClick={() => navigate(session.status === 'COMPLETED' ? `/interviews/results/${session.id}` : `/interviews/session/${session.id}`)}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-primary group-hover:text-primary-400 transition-colors line-clamp-1">
                      {session.role}
                    </span>
                    <span className="text-xs text-text-tertiary flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 hidden sm:table-cell">
                  {session.status === 'COMPLETED' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-success-500/10 text-success-400 text-xs font-medium border border-success-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-warning-500/10 text-warning-400 text-xs font-medium border border-warning-500/20">
                      <Clock className="w-3.5 h-3.5" />
                      In Progress
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  {session.status === 'COMPLETED' && session.overallScore !== null ? (
                    <span className={`text-lg font-bold ${getScoreColor(session.overallScore)}`}>
                      {session.overallScore}
                    </span>
                  ) : (
                    <span className="text-text-tertiary text-sm">-</span>
                  )}
                </td>

                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-text-secondary group-hover:text-primary-400 group-hover:bg-primary-500/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(session.status === 'COMPLETED' ? `/interviews/results/${session.id}` : `/interviews/session/${session.id}`);
                    }}
                  >
                    {session.status === 'COMPLETED' ? 'View Results' : 'Resume'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Future Pagination Controls Placeholder */}
      {/* 
      <div className="px-6 py-4 border-t border-surface-border flex items-center justify-between">
        <span className="text-sm text-text-tertiary">Showing 1 to 10 of 24 entries</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div> 
      */}
    </div>
  );
}

export default InterviewHistoryTable;
