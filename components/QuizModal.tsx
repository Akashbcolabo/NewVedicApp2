import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion } from '../types';
import { XIcon, CheckCircleIcon, ArrowRightIcon, LoaderIcon } from '../constants';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
  onComplete: (score: number, totalQuestions: number) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | undefined>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setShowResults(true);
    onComplete(calculatedScore, quiz.questions.length);
  };

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[80]" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="quiz-results-title">
        <div className="bg-dark-surface text-white rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h2 id="quiz-results-title" className="text-xl font-bold text-brand-orange">Quiz Results</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-700 rounded-full" aria-label="Close results">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-3" />
            <p className="text-2xl font-semibold">You Scored</p>
            <p className="text-4xl font-bold text-brand-orange my-2">{score} / {quiz.questions.length}</p>
            <p className="text-gray-300 mb-6">
              {score > quiz.questions.length / 2 ? "Great job!" : "Keep practicing!"}
            </p>
            <button
              onClick={onClose}
              className="w-full bg-brand-orange hover:bg-opacity-90 transition-colors text-white rounded-lg py-2.5 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[80]">
            <div className="bg-dark-surface text-white rounded-xl p-6 w-full max-w-md shadow-2xl text-center">
                <LoaderIcon className="w-8 h-8 animate-spin mx-auto mb-3 text-brand-orange" />
                <p className="text-gray-300">Loading quiz...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[80]" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="quiz-title">
      <div className="bg-dark-surface text-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 id="quiz-title" className="text-lg font-semibold text-brand-orange truncate pr-2" title={quiz.title}>{quiz.title} ({quiz.difficulty})</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-700 rounded-full flex-shrink-0" aria-label="Close quiz">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 -mr-2 mb-4 scrollbar-hide">
          <p className="text-sm text-gray-400 mb-1">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
          <p className="text-base sm:text-lg text-gray-100 mb-5 min-h-[4em]">{currentQuestion.text}</p>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-150 text-sm sm:text-base
                  ${selectedAnswers[currentQuestion.id] === index 
                    ? 'bg-brand-orange border-brand-orange text-white font-medium ring-2 ring-brand-orange ring-offset-2 ring-offset-dark-surface' 
                    : 'bg-dark-surface-alt border-gray-700 hover:border-brand-orange text-gray-300 hover:text-white'}`}
                aria-pressed={selectedAnswers[currentQuestion.id] === index}
              >
                <span className={`font-mono mr-2 ${selectedAnswers[currentQuestion.id] === index ? 'text-white' : 'text-brand-orange'}`}>{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center">
          <button 
            onClick={handlePrevQuestion} 
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Previous
          </button>
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button 
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-opacity-90 flex items-center gap-1.5 text-sm"
            >
              Next <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSubmitQuiz}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-1.5 text-sm"
            >
             <CheckCircleIcon className="w-4 h-4" /> Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
