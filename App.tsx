import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import QuizGenerator from './components/QuizGenerator';
import FlashcardGenerator from './components/FlashcardGenerator';
import StudyPlanner from './components/StudyPlanner';
import { View } from './types';

function App() {
  const [currentView, setCurrentView] = useState<View>(View.CHAT);

  const renderView = () => {
    switch (currentView) {
      case View.CHAT:
        return <ChatInterface />;
      case View.QUIZ:
        return <QuizGenerator />;
      case View.FLASHCARDS:
        return <FlashcardGenerator />;
      case View.PLANNER:
        return <StudyPlanner />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 p-4 md:p-6 overflow-hidden h-[calc(100vh-80px)] md:h-screen">
        <div className="h-full max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;
