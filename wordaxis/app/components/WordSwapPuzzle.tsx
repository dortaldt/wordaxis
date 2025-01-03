'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, HelpCircle, X } from 'lucide-react';

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

  const positionClasses: Record<Position, string> = {
    'top': 'top-4 left-1/2 -translate-x-1/2',
    'left': 'top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2',
    'right': 'top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2',
    'bottom-left': 'bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2',
    'bottom-right': 'bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2',
    'side': 'top-1/2 right-4 -translate-y-1/2'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      {/* Rest of the JSX remains the same */}
    </div>
  );
};

export default WordSwapPuzzle;