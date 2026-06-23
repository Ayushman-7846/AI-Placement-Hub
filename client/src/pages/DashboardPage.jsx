/**
 * pages/DashboardPage.jsx
 *
 * Professional SaaS Dashboard
 *
 * Route: /dashboard
 * Access: Protected (ProtectedRoute)
 */

import React, { useEffect, useState } from 'react';
import { Target, FileText, HelpCircle, TrendingUp, CalendarDays, Award, Star, Flame, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth.js';
import { PageHeader, Button } from '@components/common';
import { StatCard, FeatureCard } from '@components/dashboard';
import { InterviewHistoryTable } from '@components/interview';
import useInterview from '@hooks/useInterview.js';

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getSessions } = useInterview();
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchRecent = async () => {
      try {
        const data = await getSessions();
        if (isMounted) {
          // Keep only the 3 most recent sessions
          setRecentSessions(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch recent sessions:', error);
      }
    };
    fetchRecent();
    return () => {
      isMounted = false;
    };
  }, [getSessions]);

  // Placeholder metrics (Phase 3 Mock Data)
  const stats = [
    { title: 'Interviews Completed', value: '12', icon: Target, trend: { value: 15, label: 'vs last month' } },
    { title: 'Average Score', value: '85/100', icon: Award, trend: { value: 5, label: 'improvement' } },
    { title: 'Questions Practiced', value: '148', icon: HelpCircle, trend: { value: 24, label: 'this week' } },
    { title: 'Current Streak', value: '3 Days', icon: Flame, trend: { value: 0, label: 'keep it up!' } },
  ];

  const features = [
    { 
      title: 'Start Mock Interview', 
      description: 'Practice with an AI interviewer tailored to your target role.', 
      icon: Target, 
      to: '/interviews/setup',
      disabled: false
    },
    { 
      title: 'Analyze Resume', 
      description: 'Get ATS-friendly feedback and scoring on your resume.', 
      icon: FileText, 
      to: '/resume-analyzer',
      disabled: false
    },
    { 
      title: 'Generate Questions', 
      description: 'Create custom question sets for specific companies and roles.', 
      icon: HelpCircle, 
      to: '/question-generator',
      disabled: false
    },
    { 
      title: 'View Progress', 
      description: 'Check your analytics and performance over time.', 
      icon: TrendingUp, 
      to: '/progress',
      disabled: false
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-8">
      
      {/* ── Welcome Header ─────────────────────────────────────────── */}
      <PageHeader 
        title={
          <span>
            Welcome back, <span className="gradient-text">{firstName}</span> 👋
          </span>
        }
        description="Here's a summary of your interview preparation progress."
      >
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-border text-text-secondary text-sm">
          <CalendarDays className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </PageHeader>

      {/* ── Statistics Summary ─────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      {/* ── Quick Actions / Features ───────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </section>

      {/* ── Recent Activity ────────────────────────────────────────── */}
      <section className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Recent Interviews</h2>
          {recentSessions.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/interviews')} className="text-text-secondary hover:text-primary-400">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
        
        {recentSessions.length > 0 ? (
          <InterviewHistoryTable sessions={recentSessions} />
        ) : (
          <div className="glass-card p-8 text-center border-dashed">
            <Star className="w-10 h-10 text-primary-500/40 mx-auto mb-3" />
            <h3 className="text-text-primary font-medium mb-1">No recent activity</h3>
            <p className="text-sm text-text-tertiary">Your latest interview sessions will appear here.</p>
          </div>
        )}
      </section>

    </div>
  );
}

export default DashboardPage;
