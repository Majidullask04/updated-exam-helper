import React, { useState } from 'react';
import { generateFlashcards } from '../services/geminiService';
import { Flashcard } from '../types';
import { Layers, Loader2, RotateCw, Plus } from 'lucide-react';

const FlashcardGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setFlashcards([]);
    setFlippedIndices([]);
    try {
      const cards = await generateFlashcards(input);
      setFlashcards(cards);
    } catch (error) {
      console.error("Flashcard generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (index: number) => {
    if (flippedIndices.includes(index)) {
      setFlippedIndices(flippedIndices.filter(i => i !== index));
    } else {
      setFlippedIndices([...flippedIndices, index]);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <Layers size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Flashcard Generator</h2>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a topic or paste text to generate cards..."
            className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="px-6 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
            Generate
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Loader2 size={40} className="animate-spin mb-4 text-orange-500" />
                <p>Creating your study deck...</p>
            </div>
        )}

        {!loading && flashcards.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                <p>No cards generated yet.</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
          {flashcards.map((card, idx) => {
            const isFlipped = flippedIndices.includes(idx);
            return (
              <div 
                key={idx} 
                className="group h-64 perspective-1000 cursor-pointer"
                onClick={() => toggleFlip(idx)}
              >
                <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : 'rotate-y-0'}`}>
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm group-hover:shadow-md transition-shadow">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Front</div>
                        <div className="text-lg font-medium text-slate-800 text-center">{card.front}</div>
                        <div className="flex justify-center text-slate-400">
                            <RotateCw size={16} />
                        </div>
                    </div>
                    
                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-sm rotate-y-180">
                         <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Back</div>
                        <div className="text-base text-center leading-relaxed">{card.back}</div>
                        <div className="flex justify-center text-slate-600">
                            <RotateCw size={16} />
                        </div>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlashcardGenerator;
