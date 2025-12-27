import React, { useState } from 'react';
import { CalendarClock, Loader2, Clock, CalendarDays, CheckCircle2 } from 'lucide-react';
import { generateStudyPlan } from '../services/geminiService';
import { StudyTask } from '../types';

const StudyPlanner: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [days, setDays] = useState(3);
  const [hours, setHours] = useState(2);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyTask[]>([]);

  const handleGenerate = async () => {
    if (!subject) return;
    setLoading(true);
    try {
      const result = await generateStudyPlan(subject, days, hours);
      setPlan(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (plan.length > 0) {
    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col p-2">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Your Study Plan: {subject}</h2>
                    <p className="text-slate-500 text-sm">Based on {days} days, {hours} hours/day</p>
                </div>
                <button onClick={() => setPlan([])} className="text-sm text-indigo-600 hover:underline">
                    Create New Plan
                </button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto pb-4">
                {plan.map((task, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                            <span className="font-bold text-indigo-600 flex items-center gap-2">
                                <CalendarDays className="w-4 h-4" /> {task.day}
                            </span>
                            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {task.duration}
                            </span>
                        </div>
                        <ul className="space-y-2">
                            {task.topics.map((topic, tIdx) => (
                                <li key={tIdx} className="text-sm text-slate-700 flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Study Planner</h2>
            <p className="text-slate-500">Organize your time effectively</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subject / Exam Name</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Biology Final, SAT Math, History of Art"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Days Available</label>
              <input
                type="number"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hours Per Day</label>
              <input
                type="number"
                min="1"
                max="12"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value) || 1)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !subject}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : <CalendarClock />}
            Generate Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
