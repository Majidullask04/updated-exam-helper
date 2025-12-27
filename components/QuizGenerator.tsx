import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Quiz, QuizQuestion } from '../types';
import { CheckCircle, XCircle, Brain, RefreshCw, Trophy, Loader2, ArrowRight } from 'lucide-react';

const QuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setQuiz(null);
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    
    try {
      const generatedQuiz = await generateQuiz(topic, difficulty);
      setQuiz(generatedQuiz);
    } catch (error) {
      console.error("Quiz generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return; 
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === quiz?.questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Generating your quiz...</p>
        <p className="text-slate-400 text-sm mt-2">Crafting questions about "{topic}"</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="h-full flex flex-col p-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-y-auto">
        <div className="max-w-xl mx-auto w-full">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Quiz Generator</h2>
                <p className="text-slate-500 mt-2">Test your knowledge on any subject. AI will generate questions for you.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Photosynthesis, World War II, Calculus..."
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Easy', 'Medium', 'Hard'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                                    difficulty === level 
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={!topic.trim()}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                >
                    Generate Quiz
                </button>
            </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <Trophy className="w-16 h-16 text-yellow-500 mb-6" />
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Complete!</h2>
        <p className="text-xl text-slate-600 mb-8">You scored <span className="font-bold text-indigo-600">{score}</span> out of <span className="font-bold">{quiz.questions.length}</span></p>
        <button
            onClick={() => setQuiz(null)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
            <RefreshCw size={20} />
            Try Another Topic
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestionIndex];

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{quiz.title}</span>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium text-slate-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            </div>
        </div>
        <div className="text-sm font-bold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200">
            Score: {score}
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <h3 className="text-xl font-semibold text-slate-800 mb-8 leading-relaxed">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === question.correctAnswerIndex;
            let buttonClass = "border-slate-200 hover:bg-slate-50 text-slate-700";
            
            if (selectedAnswer !== null) {
                if (isCorrect) buttonClass = "border-emerald-500 bg-emerald-50 text-emerald-700";
                else if (isSelected) buttonClass = "border-red-500 bg-red-50 text-red-700";
                else buttonClass = "border-slate-100 text-slate-400 opacity-50";
            } else if (isSelected) {
                buttonClass = "border-indigo-600 bg-indigo-50 text-indigo-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 text-left border rounded-xl transition-all font-medium flex justify-between items-center group ${buttonClass}`}
              >
                <span>{option}</span>
                {selectedAnswer !== null && isCorrect && <CheckCircle size={20} className="text-emerald-500" />}
                {selectedAnswer !== null && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
              </button>
            );
          })}
        </div>

        {showExplanation && (
             <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl animate-in fade-in slide-in-from-bottom-4">
                <p className="font-semibold text-indigo-900 mb-1">Explanation:</p>
                <p className="text-indigo-700 text-sm leading-relaxed">{question.explanation}</p>
                <button 
                    onClick={handleNextQuestion}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors ml-auto"
                >
                    {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
                    <ArrowRight size={16} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;
