/**
 * pages/InterviewSetupPage.jsx
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Play, Briefcase, Target, HelpCircle, Layers } from 'lucide-react';
import { PageHeader, Button, Input, FormError } from '@components/common';
import useInterview from '@hooks/useInterview.js';

function InterviewSetupPage() {
  const navigate = useNavigate();
  const { startInterview, isLoading, error } = useInterview();

  const [formData, setFormData] = useState({
    title: '',
    role: '',
    difficulty: 'INTERMEDIATE',
    interviewType: 'TECHNICAL',
    questionCount: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'questionCount' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role.trim()) return;

    try {
      const session = await startInterview({
        title: formData.title || `${formData.role} Interview`,
        role: formData.role,
        difficulty: formData.difficulty,
        interviewType: formData.interviewType,
        questionCount: formData.questionCount,
      });

      if (session?.id) {
        navigate(`/interviews/session/${session.id}`);
      }
    } catch (err) {
      console.error(err);
      // Error is handled by hook and displayed via FormError
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
      <PageHeader
        title="Interview Setup"
        description="Configure your AI mock interview to match your target role."
      />

      <div className="glass-card p-6 md:p-8 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <FormError message={error} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <Input
                label="Target Role / Job Title *"
                id="role"
                name="role"
                placeholder="e.g., Senior Frontend Engineer"
                value={formData.role}
                onChange={handleChange}
                icon={Briefcase}
                required
                disabled={isLoading}
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Input
                label="Interview Title (Optional)"
                id="title"
                name="title"
                placeholder="e.g., Google Prep Round 1"
                value={formData.title}
                onChange={handleChange}
                icon={Settings}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-text-secondary mb-2">
                Difficulty
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full h-11 pl-10 pr-4 bg-surface-900 border border-surface-border rounded-xl text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="interviewType" className="block text-sm font-medium text-text-secondary mb-2">
                Interview Type
              </label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <select
                  id="interviewType"
                  name="interviewType"
                  value={formData.interviewType}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full h-11 pl-10 pr-4 bg-surface-900 border border-surface-border rounded-xl text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="TECHNICAL">Technical / Coding</option>
                  <option value="BEHAVIORAL">Behavioral / HR</option>
                  <option value="MIXED">Mixed (Technical & Behavioral)</option>
                </select>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="questionCount" className="block text-sm font-medium text-text-secondary mb-2">
                Number of Questions: {formData.questionCount}
              </label>
              <div className="flex items-center gap-4">
                <HelpCircle className="w-5 h-5 text-text-tertiary" />
                <input
                  type="range"
                  id="questionCount"
                  name="questionCount"
                  min="3"
                  max="10"
                  step="1"
                  value={formData.questionCount}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full accent-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-surface-border flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-4"
              onClick={() => navigate('/interviews')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !formData.role.trim()}
              icon={Play}
            >
              Start Interview
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InterviewSetupPage;
