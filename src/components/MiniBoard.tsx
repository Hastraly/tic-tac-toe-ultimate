import { X, Circle } from 'lucide-react';
import { Cell } from './Cell';
import type { MiniBoard as MiniBoardType, Player } from '../types';

interface MiniBoardProps {
  board: MiniBoardType;
  boardIndex: number;
  winner: Player | null;
  isAllowed: boolean;
  onCellClick: (cellIndex: number) => void;
  disabled: boolean;
}

export function MiniBoard({
  board,
  boardIndex,
  winner,
  isAllowed,
  onCellClick,
  disabled
}: MiniBoardProps) {
  if (winner) {
    return (
      <div className={`aspect-square rounded-xl flex items-center justify-center ${
        winner === 'X' ? 'bg-cyan-500/20 border-2 border-cyan-400' : 'bg-pink-500/20 border-2 border-pink-400'
      }`}>
        {winner === 'X' ? (
          <X className="text-cyan-400" size={80} strokeWidth={4} />
        ) : (
          <Circle className="text-pink-400" size={80} strokeWidth={4} />
        )}
      </div>
    );
  }

  return (
    <div className={`p-2 sm:p-3 rounded-xl border-2 transition-all ${
      isAllowed
        ? 'border-cyan-400 bg-slate-800 shadow-lg shadow-cyan-500/20'
        : 'border-slate-700 bg-slate-800/50'
    }`}>
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {board.map((cell, cellIndex) => (
          <Cell
            key={`${boardIndex}-${cellIndex}`}
            value={cell}
            onClick={() => onCellClick(cellIndex)}
            disabled={disabled || !isAllowed}
          />
        ))}
      </div>
    </div>
  );
}
