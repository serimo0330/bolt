import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  initialMinutes: number;
  onTimeUp?: () => void;
}

export const Timer: React.FC<TimerProps> = ({ initialMinutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setIsActive(false);
            if (onTimeUp) onTimeUp();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (!isActive && timeLeft !== 0) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeUp]);

  const startTimer = () => setIsActive(true);
  const stopTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getTimerColor = () => {
    if (timeLeft <= 60) return 'text-red-400 animate-pulse';
    if (timeLeft <= 300) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {timeLeft <= 60 ? (
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
            ) : (
              <Clock className="w-5 h-5 text-green-400" />
            )}
            <span className="text-green-400 font-mono text-sm">MISSION TIME</span>
          </div>
          <div className={`font-mono text-2xl font-bold ${getTimerColor()}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
        
        <div className="flex gap-2 mt-2">
          <button
            onClick={startTimer}
            disabled={isActive}
            className="px-2 py-1 text-xs bg-green-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
          >
            START
          </button>
          <button
            onClick={stopTimer}
            disabled={!isActive}
            className="px-2 py-1 text-xs bg-yellow-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-700 transition-colors"
          >
            PAUSE
          </button>
          <button
            onClick={resetTimer}
            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  );
};