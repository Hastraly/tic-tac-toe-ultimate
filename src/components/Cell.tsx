import { X, Circle } from 'lucide-react';
import type { Cell as CellType } from '../types';

interface CellProps {
  value: CellType;
  onClick: () => void;
  disabled: boolean;
  size?: 'small' | 'large';
}

export function Cell({ value, onClick, disabled, size = 'small' }: CellProps) {
  const isSizeConstraint = size === 'large';
  const sizeClasses = isSizeConstraint
    ? 'w-20 h-20 sm:w-24 sm:h-24'
    : 'w-full h-full min-h-0 min-w-0';

  const iconSize = size === 'large' ? 48 : 20;

  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={`${sizeClasses} bg-slate-700 hover:bg-slate-600 disabled:hover:bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center transition-all ${
        !disabled && value === null ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'
      }`}
    >
      {value === 'X' && <X className="text-cyan-400" size={iconSize} strokeWidth={3} />}
      {value === 'O' && <Circle className="text-pink-400" size={iconSize} strokeWidth={3} />}
    </button>
  );
}
