import React, { useState } from 'react';
import { XIcon, SendIcon, AlertTriangleIcon, FlagIcon } from '../constants'; 
import { ReportReason, ReportSubmission } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseId: string;
  vedaTitle: string;
  onSubmitReport: (submission: ReportSubmission) => void;
}

const reportReasons: { id: ReportReason; label: string }[] = [
  { id: 'incorrect_sanskrit', label: 'Incorrect Sanskrit Text' },
  { id: 'incorrect_translation', label: 'Incorrect Translation' },
  { id: 'offensive_content', label: 'Offensive or Inappropriate Content' },
  { id: 'technical_issue', label: 'Technical Issue with Display' },
  { id: 'other', label: 'Other (Please specify)' },
];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, verseId, vedaTitle, onSubmitReport }) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedReason) {
      setError('Please select a reason for your report.');
      return;
    }
    if (selectedReason === 'other' && !feedback.trim()) {
      setError('Please provide details if you selected "Other".');
      return;
    }
    setError(null);
    onSubmitReport({
      verseId,
      reason: selectedReason,
      feedback,
      timestamp: new Date().toISOString(),
    });
    // Reset state for next time
    setSelectedReason('');
    setFeedback('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[110]" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div 
        className="bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary rounded-xl p-5 sm:p-6 w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FlagIcon className="w-6 h-6 text-brand-orange" />
            <h2 id="report-modal-title" className="text-lg sm:text-xl font-semibold text-brand-orange">
              Report Issue with Mantra
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-light-text-primary dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close report modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pr-1 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You are reporting an issue with verse <strong className="text-brand-orange">{verseId}</strong> from <strong className="text-brand-orange">{vedaTitle}</strong>.
          </p>

          <div>
            <label htmlFor="reportReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason for report:
            </label>
            <select
              id="reportReason"
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value as ReportReason | '')}
              className="w-full bg-light-surface-alt dark:bg-dark-surface-alt border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
            >
              <option value="" disabled>Select a reason...</option>
              {reportReasons.map(reason => (
                <option key={reason.id} value={reason.id}>{reason.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Feedback (Optional, required if "Other"):
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please provide more details..."
              rows={4}
              className="w-full bg-light-surface-alt dark:bg-dark-surface-alt border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700/50 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangleIcon className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-brand-orange hover:bg-opacity-90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <SendIcon className="w-4 h-4" />
            Send Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;