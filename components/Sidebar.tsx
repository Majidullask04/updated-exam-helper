import React from 'react';
import { View } from '../types';
import { MessageSquare, CheckSquare, Layers, Calendar, GraduationCap } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { view: View.CHAT, label: 'AI Tutor', icon: <MessageSquare size={20} /> },
    { view: View.QUIZ, label: 'Quiz Generator', icon: <CheckSquare size={20} /> },
    { view: View.FLASHCARDS, label: 'Flashcards', icon: <Layers size={20} /> },
    { view: View.PLANNER, label: 'Study Planner', icon: <Calendar size={20} /> },
  ];

  return (
    <div className="w-full md:w-64 bg-slate-900 text-white flex md:flex-col justify-between md:justify-start flex-shrink-0 z-20">
      <div className="p-4 md:p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <GraduationCap size={20} />
        </div>
        <h1 className="text-xl font-bold hidden md:block">Examaid Pro</h1>
      </div>
      
      <nav className="flex md:flex-col w-full overflow-x-auto md:overflow-visible p-2 md:p-4 gap-2">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`
              flex items-center gap-3 p-3 rounded-xl transition-all whitespace-nowrap
              ${currentView === item.view 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'}
            `}
          >
            {item.icon}
            <span className="font-medium hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="hidden md:block mt-auto p-4 md:p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-2">Study Streak</p>
          <div className="flex items-end gap-1 h-8">
            <div className="w-1/5 bg-emerald-500/20 h-[40%] rounded-t-sm"></div>
            <div className="w-1/5 bg-emerald-500/40 h-[60%] rounded-t-sm"></div>
            <div className="w-1/5 bg-emerald-500/60 h-[30%] rounded-t-sm"></div>
            <div className="w-1/5 bg-emerald-500/80 h-[80%] rounded-t-sm"></div>
            <div className="w-1/5 bg-emerald-500 h-[100%] rounded-t-sm"></div>
          </div>
          <p className="text-right text-xs text-emerald-400 font-bold mt-1">5 Days 🔥</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
