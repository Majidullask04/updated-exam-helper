import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { StudyTask } from '../types';
import { Calendar, Loader2, Clock, BookOpen } from 'lucide-react';

const StudyPlanner: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [days, setDays] = useState(7);
  const [hours, setHours] = useState(2);
  const [plan, setPlan] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!subject.trim()) return;
    setLoading(true);
    try {
      const generatedPlan = await generateStudyPlan(subject, days, hours);
      setPlan(generatedPlan);
    } catch (error) {
      console.error("Plan generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Calendar size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Plan Settings</h2>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject / Exam</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Biology Finals"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Days</label>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Hours/Day</label>
                        <input
                            type="number"
                            min="1"
                            max="12"
                            value={hours}
                            onChange={(e) => setHours(Number(e.target.value))}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !subject.trim()}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-blue-200"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Plan"}
                </button>
            </div>
        </div>

        {/* Plan Output */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px] lg:h-auto">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                 <h2 className="text-lg font-bold text-slate-800">Your Study Schedule</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
                {plan.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Calendar size={48} className="mb-4 text-slate-200" />
                        <p>Enter details to generate your personalized plan.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {plan.map((task, idx) => (
                            <div key={idx} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                                <div className="flex-shrink-0 w-16 flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-lg h-16">
                                    <span className="text-xs font-bold uppercase">Day</span>
                                    <span className="text-xl font-bold">{idx + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                                        <Clock size={12} /> {task.duration}
                                    </div>
                                    <div className="space-y-1">
                                        {task.topics.map((t, i) => (
                                            <div key={i} className="flex items-start gap-2 text-slate-700">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
                                                <span className="text-sm font-medium">{t}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
