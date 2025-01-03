/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';


interface Word {
  id: number;
  text: string;
  position: Position;
  correctPosition: Position;
}

type Position = 'top' | 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'side';
type GameSet = 1 | 2;

interface Toast {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const WordSets: Record<GameSet, Omit<Word, 'position'>[]> = {
  1: [
    { id: 1, text: 'Noisy', correctPosition: 'top' },
    { id: 2, text: 'Puppy', correctPosition: 'left' },
    { id: 3, text: 'Toddler', correctPosition: 'right' },
    { id: 4, text: 'Squicky', correctPosition: 'bottom-left' },
    { id: 5, text: 'Diaper', correctPosition: 'bottom-right' },
    { id: 6, text: 'Stinky', correctPosition: 'side' }
  ],
  2: [
    { id: 1, text: 'Loved', correctPosition: 'top' },
    { id: 2, text: 'Nelly Furtado', correctPosition: 'left' },
    { id: 3, text: 'Michael Jackson', correctPosition: 'right' },
    { id: 4, text: 'Christina Aguilera', correctPosition: 'bottom-left' },
    { id: 5, text: 'Kim Kardashian', correctPosition: 'bottom-right' },
    { id: 6, text: 'Famous', correctPosition: 'side' }
  ]
};

const WordSwapPuzzle: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showNextGamePrompt, setShowNextGamePrompt] = useState(false);
  const [currentSet, setCurrentSet] = useState<GameSet>(1);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const initializeWords = (setNumber: GameSet): Word[] => {
    const positions: Position[] = ['left', 'right', 'bottom-left', 'bottom-right', 'side'];
    let shuffledPositions: Position[];
    do {
      shuffledPositions = [...positions].sort(() => Math.random() - 0.5) as Position[];
    } while (shuffledPositions.some((pos, i) => pos === WordSets[setNumber][i + 1].correctPosition));

    return WordSets[setNumber].map((word, i) => ({
      ...word,
      position: i === 0 ? 'top' : shuffledPositions[i - 1]
    }));
  };

  const [words, setWords] = useState<Word[]>(() => initializeWords(1));

  const showToast = (message: string, type: Toast['type']) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const startNextGame = () => {
    if (currentSet === 1) {
      setCurrentSet(2);
      setWords(initializeWords(2));
      setLives(3);
      setGameOver(false);
      setSelectedWord(null);
      setShowNextGamePrompt(false);
      showToast('Starting celebrity edition!', 'success');
    } else {
      localStorage.setItem('wordaxisLastPlayed', new Date().toDateString());
      setGameOver(true);
      showToast('Come back tomorrow for new puzzles!', 'success');
    }
  };

  const handleWordClick = (clickedWord: Word) => {
    if (gameOver || clickedWord.position === 'top') return;
    
    if (!selectedWord) {
      setSelectedWord(clickedWord);
    } else {
      const newWords = words.map(word => {
        if (word.id === selectedWord.id) {
          return { ...word, position: clickedWord.position };
        }
        if (word.id === clickedWord.id) {
          return { ...word, position: selectedWord.position };
        }
        return word;
      });
      setWords(newWords);
      setSelectedWord(null);
    }
  };

  const handleDoneClick = () => {
    const allCorrect = words.every(word => word.position === word.correctPosition);
    if (allCorrect) {
      setGameOver(true);
      showToast('🎉 Congratulations! You solved the puzzle!', 'success');
      setTimeout(() => setShowNextGamePrompt(true), 1500);
    } else {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives === 0) {
          setGameOver(true);
          showToast('Game Over!', 'error');
          setTimeout(() => setShowNextGamePrompt(true), 1500);
        } else {
          showToast(`Wrong arrangement! ${newLives} ${newLives === 1 ? 'try' : 'tries'} left`, 'warning');
        }
        return newLives;
      });
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-8">
        <button 
          onClick={() => setShowInstructions(true)}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <HelpCircle className="w-6 h-6 text-purple-500" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">WORDAXIS</h1>
        <div className="w-10" />
      </div>

      {/* Game Board */}
      <div className="relative w-96 h-96 mb-8">
        {/* Axes */}
        <div className="absolute inset-0">
          {/* Vertical Line */}
          <div className="absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 to-purple-600 -translate-x-1/2" />
          {/* Horizontal Line */}
          <div className="absolute top-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 -translate-y-1/2" />
          
          {/* Labels */}
          <div className="absolute left-1/3 top-1/2 -translate-y-1/2">
            <span className="px-1 bg-slate-100 text-purple-600 font-medium">Less</span>
          </div>
          <div className="absolute right-1/3 top-1/2 -translate-y-1/2">
            <span className="px-1 bg-slate-100 text-purple-600 font-medium">More</span>
          </div>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
            <span className="px-1 bg-slate-100 text-purple-600 font-medium">More</span>
          </div>
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2">
            <span className="px-1 bg-slate-100 text-purple-600 font-medium">Less</span>
          </div>

          {/* Arrows */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8L4 16L4 0L16 8Z" fill="rgb(168, 85, 247)" />
            </svg>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0L16 12L0 12L8 0Z" fill="rgb(168, 85, 247)" />
            </svg>
          </div>
        </div>

        {/* Word Tiles */}
        {words.map(word => {
          const isAxis = word.position === 'top' || word.position === 'side';
          const positionClasses = {
            'top': 'top-4 left-1/2 -translate-x-1/2',
            'left': 'top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2',
            'right': 'top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2',
            'bottom-left': 'bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2',
            'bottom-right': 'bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2',
            'side': 'top-1/2 right-4 -translate-y-1/2',
          }[word.position];

          return (
            <div
              key={word.id}
              onClick={() => word.position !== 'top' && handleWordClick(word)}
              className={`
                absolute w-20 h-20 
                ${positionClasses}
                ${isAxis ? 'border-2 border-purple-500' : ''}
                rounded-lg overflow-hidden
                ${word.position === 'top' ? 'cursor-default' : 'cursor-pointer'}
                transition-all duration-200
                ${selectedWord?.id === word.id ? 'ring-4 ring-white shadow-xl scale-105 z-10' : 'hover:scale-105'}
              `}
            >
              <div className={`
                w-full h-full 
                flex items-center justify-center 
                text-white font-medium text-center px-1
                ${word.position === 'top' 
                  ? 'bg-gradient-to-br from-slate-500 to-slate-600' 
                  : 'bg-gradient-to-br from-slate-600 to-slate-700'}
              `}>
                {word.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lives */}
      <div className="flex gap-2 mb-4">
        {Array(lives).fill('❤️').map((heart, i) => (
          <span key={i} className="text-2xl">{heart}</span>
        ))}
      </div>

      {/* Check Button */}
      <button 
        onClick={handleDoneClick}
        disabled={gameOver}
        className={`
          w-full max-w-xs py-3 rounded-full 
          bg-gradient-to-r from-purple-500 to-purple-600 
          text-white font-medium 
          transition-opacity
          ${gameOver ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
        `}
      >
        Check
      </button>

      {/* Next Game Prompt Modal */}
      {showNextGamePrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full relative shadow-xl text-center">
            <h2 className="text-xl font-bold mb-4 text-slate-900">
              {currentSet === 1 ? "Ready for the Celebrity Edition?" : "You've completed all puzzles!"}
            </h2>
            
            <p className="text-slate-700 mb-6">
              {currentSet === 1 
                ? "Try matching celebrities with their characteristics!" 
                : "Come back tomorrow for new challenges!"}
            </p>

            <button 
              onClick={startNextGame}
              className="w-full bg-purple-500 text-white rounded-lg py-3 font-medium hover:bg-purple-600 transition-colors"
            >
              {currentSet === 1 ? "Start Celebrity Edition" : "Done"}
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`
          fixed top-4 left-1/2 transform -translate-x-1/2 z-50
          px-4 py-2 rounded-lg shadow-lg
          ${toast.type === 'success' ? 'bg-green-500' : 
            toast.type === 'error' ? 'bg-red-500' : 
            'bg-yellow-500'} 
          text-white font-medium
        `}>
          {toast.message}
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full relative shadow-xl">
            <button 
              onClick={() => setShowInstructions(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-4 text-slate-900">How to Play</h2>
            
            <div className="space-y-4 text-slate-700">
              <div>
                <p className="font-medium mb-2">Game Goal:</p>
                <p>Arrange the words along the axes to create logical connections. Words should relate to their neighbors in meaningful ways.</p>
              </div>

              <div>
                <p className="font-medium mb-2">Rules:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Click two words to swap their positions</li>
                  <li>Words should form meaningful relationships</li>
                  <li>Click "Done" when you think you've solved it</li>
                  <li>You have 3 attempts to find the correct arrangement</li>
                </ul>
              </div>
            </div>

            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full bg-purple-500 text-white rounded-lg py-3 mt-6 font-medium hover:bg-purple-600 transition-colors"
            >
              Start Playing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordSwapPuzzle;