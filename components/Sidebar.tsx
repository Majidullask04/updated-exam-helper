import React from 'react';
import { View } from '../types';
import { LayoutDashboard, MessageSquareText, BrainCircuit, Layers, CalendarClock, BookOpenCheck } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen }) => {
  const navItems = [
    { view: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { view: View.CHAT, label: 'AI Tutor', icon: MessageSquareText },
    { view: View.QUIZ, label: 'Quiz Generator', icon: BrainCircuit },
    { view: View.FLASHCARDS, label: 'Flashcards', icon: Layers },
    { view: View.PLANNER, label: 'Study Planner', icon: CalendarClock },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-16 border-b border-slate-700">
          <BookOpenCheck className="w-8 h-8 text-indigo-400 mr-2" />
          <h1 className="text-xl font-bold tracking-wider">Examaid Pro</h1>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setView(item.view);
                setIsOpen(false);
              }}
              className={`
                flex items-center w-full px-4 py-3 rounded-lg transition-colors
                ${currentView === item.view 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-800">
          <div className="flex items-center text-sm text-slate-400">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            Gemini AI Connected
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
