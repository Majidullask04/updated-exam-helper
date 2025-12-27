import React, { useState } from 'react';
import { Layers, Loader2, RefreshCw, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { generateFlashcards } from '../services/geminiService';
import { Flashcard } from '../types';

const FlashcardGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setFlashcards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    
    try {
      const cards = await generateFlashcards(input);
      setFlashcards(cards);
    } catch (err) {
        console.error(err);
      setError("Could not generate flashcards. Try simplifying your text.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const reset = () => {
    setFlashcards([]);
    setInput('');
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-in fade-in">
        <Loader2 className="w-12 h-12 mb-4 animate-spin text-indigo-600" />
        <p className="text-lg font-medium">Synthesizing concepts...</p>
      </div>
    );
  }

  if (flashcards.length > 0) {
    return (
      <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center p-4">
        <div className="w-full flex justify-between items-center mb-6">
           <button onClick={reset} className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
             <RotateCcw className="w-4 h-4" /> New Set
           </button>
           <span className="text-sm font-semibold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
             Card {currentIndex + 1} of {flashcards.length}
           </span>
        </div>

        <div className="relative w-full max-w-2xl aspect-[3/2] perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`w-full h-full relative preserve-3d transition-transform duration-500 ease-out-back ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8 text-center hover:shadow-2xl transition-shadow">
                    <span className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Question / Term</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                        {flashcards[currentIndex].front}
                    </h3>
                    <p className="absolute bottom-6 text-slate-400 text-sm animate-pulse">Click to flip</p>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center text-white">
                    <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold mb-4">Answer / Definition</span>
                    <p className="text-xl md:text-2xl leading-relaxed font-medium">
                        {flashcards[currentIndex].back}
                    </p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
            <button 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
                onClick={handleNext} 
                disabled={currentIndex === flashcards.length - 1}
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Flashcard Maker</h2>
            <p className="text-slate-500">Convert notes into study cards instantly</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Paste your notes or enter a topic
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., The French Revolution was a period of radical political and societal change in France that began with the Estates General of 1789 and ended with..."
              className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!input.trim()}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Generate Flashcards
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardGenerator;
