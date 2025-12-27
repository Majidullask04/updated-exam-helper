import React, { useState } from 'react';
import { BrainCircuit, CheckCircle, XCircle, RefreshCw, Loader2, ArrowRight } from 'lucide-react';
import { generateQuiz } from '../services/geminiService';
import { Quiz } from '../types';

const QuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setQuiz(null);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    
    try {
      const generatedQuiz = await generateQuiz(topic, difficulty);
      setQuiz(generatedQuiz);
    } catch (err) {
        console.error(err);
      setError("Failed to generate quiz. Please try a different topic or try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null || showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === quiz?.questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuiz(null);
    setTopic('');
    setQuizCompleted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-in fade-in duration-500">
        <Loader2 className="w-12 h-12 mb-4 animate-spin text-indigo-600" />
        <h3 className="text-lg font-medium text-slate-800">Generating your quiz...</h3>
        <p className="text-sm">Analyzing "{topic}" to create challenging questions.</p>
      </div>
    );
  }

  if (quizCompleted && quiz) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-8 bg-white rounded-2xl shadow-lg border border-slate-100 text-center animate-in zoom-in-95 duration-300">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
          <BrainCircuit className="w-10 h-10 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
        <p className="text-slate-500 mb-8">You scored</p>
        
        <div className="text-6xl font-black text-indigo-600 mb-8">
          {Math.round((score / quiz.questions.length) * 100)}%
        </div>
        
        <p className="text-lg text-slate-700 mb-8">
          You got <span className="font-bold">{score}</span> out of <span className="font-bold">{quiz.questions.length}</span> questions correct.
        </p>
        
        <button
          onClick={resetQuiz}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw className="w-5 h-5" />
          Create New Quiz
        </button>
      </div>
    );
  }

  if (quiz) {
    const question = quiz.questions[currentQuestionIndex];
    
    return (
      <div className="max-w-3xl mx-auto h-full flex flex-col">
        <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 truncate pr-4">{quiz.title}</h2>
            <span className="text-sm font-medium px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                {currentQuestionIndex + 1} / {quiz.questions.length}
            </span>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 md:p-8 border-b border-slate-100">
                <h3 className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed">
                    {question.question}
                </h3>
            </div>

            <div className="p-6 md:p-8 space-y-3 bg-slate-50/50 flex-1 overflow-y-auto">
                {question.options.map((option, idx) => {
                    let optionClass = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50";
                    let icon = null;

                    if (showExplanation) {
                        if (idx === question.correctAnswerIndex) {
                            optionClass = "border-green-500 bg-green-50 text-green-800";
                            icon = <CheckCircle className="w-5 h-5 text-green-600" />;
                        } else if (idx === selectedOption) {
                            optionClass = "border-red-500 bg-red-50 text-red-800";
                            icon = <XCircle className="w-5 h-5 text-red-600" />;
                        } else {
                            optionClass = "border-slate-200 opacity-50";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={showExplanation}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${optionClass}`}
                        >
                            <span className="font-medium">{option}</span>
                            {icon}
                        </button>
                    );
                })}

                {showExplanation && (
                    <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl animate-in slide-in-from-bottom-2">
                        <h4 className="font-semibold text-indigo-900 mb-1 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" /> Explanation
                        </h4>
                        <p className="text-indigo-800 text-sm leading-relaxed">
                            {question.explanation}
                        </p>
                    </div>
                )}
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
                <button
                    onClick={nextQuestion}
                    disabled={!showExplanation}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                    {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Quiz Generator</h2>
            <p className="text-slate-500">Test your knowledge on any subject</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Topic or Subject</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, Linear Algebra, World War II"
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`
                    py-3 px-4 rounded-xl border text-sm font-medium transition-all
                    ${difficulty === level 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'}
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
          >
            Generate Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;
