import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import QuizGenerator from './components/QuizGenerator';
import FlashcardGenerator from './components/FlashcardGenerator';
import StudyPlanner from './components/StudyPlanner';
import { View } from './types';
import { Menu, BookOpen, Star, Zap, GraduationCap } from 'lucide-react';

const Dashboard: React.FC<{ setView: (v: View) => void }> = ({ setView }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 py-8">
        <div className="inline-block p-4 bg-indigo-100 rounded-full mb-2">
            <GraduationCap className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
          Master Your Exams with <span className="text-indigo-600">AI</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Examaid Pro transforms your study materials into interactive quizzes, flashcards, and personalized study plans instantly.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <button 
          onClick={() => setView(View.CHAT)}
          className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">AI Tutor Chat</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Get instant answers, clear explanations, and homework help from your personal 24/7 tutor.
            </p>
          </div>
        </button>

        <button 
          onClick={() => setView(View.QUIZ)}
          className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Quizzes</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Generate multiple-choice quizzes on any topic instantly to test your knowledge gaps.
            </p>
          </div>
        </button>

        <button 
          onClick={() => setView(View.FLASHCARDS)}
          className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-200">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Instant Flashcards</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Turn your raw notes into structured flashcards for effective spaced repetition study.
            </p>
          </div>
        </button>
      </div>
      
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
                <h3 className="text-2xl font-bold mb-2">Need a plan?</h3>
                <p className="text-slate-300">Let AI structure your study schedule for the upcoming exams.</p>
            </div>
            <button 
                onClick={() => setView(View.PLANNER)}
                className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
                Create Schedule
            </button>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-emerald-600 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard setView={setCurrentView} />;
      case View.CHAT:
        return <ChatInterface />;
      case View.QUIZ:
        return <QuizGenerator />;
      case View.FLASHCARDS:
        return <FlashcardGenerator />;
      case View.PLANNER:
        return <StudyPlanner />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-slate-800">Examaid Pro</span>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
