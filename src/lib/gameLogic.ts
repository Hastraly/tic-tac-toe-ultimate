import type { Board, MiniBoard, MiniWinners, Player, Move } from '../types';

export function checkMiniWinner(miniBoard: MiniBoard): Player | null {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      miniBoard[a] &&
      miniBoard[a] === miniBoard[b] &&
      miniBoard[a] === miniBoard[c]
    ) {
      return miniBoard[a];
    }
  }

  return null;
}

export function checkMainWinner(miniWinners: MiniWinners): Player | 'draw' | null {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      miniWinners[a] &&
      miniWinners[a] === miniWinners[b] &&
      miniWinners[a] === miniWinners[c]
    ) {
      return miniWinners[a];
    }
  }

  const allFilled = miniWinners.every(w => w !== null);
  if (allFilled) {
    return 'draw';
  }

  return null;
}

export function isMiniboardFull(miniBoard: MiniBoard): boolean {
  return miniBoard.every(cell => cell !== null);
}

export function isValidMove(
  board: Board,
  miniWinners: MiniWinners,
  allowedBoard: number | null,
  move: Move
): boolean {
  const { boardIndex, cellIndex } = move;

  if (miniWinners[boardIndex] !== null) {
    return false;
  }

  if (board[boardIndex][cellIndex] !== null) {
    return false;
  }

  if (allowedBoard !== null && boardIndex !== allowedBoard) {
    return false;
  }

  return true;
}

export function calculateNextAllowedBoard(
  cellIndex: number,
  miniWinners: MiniWinners,
  board: Board
): number | null {
  if (miniWinners[cellIndex] !== null || isMiniboardFull(board[cellIndex])) {
    return null;
  }
  return cellIndex;
}

export function generateRoomId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function createEmptyBoard(): Board {
  return Array(9).fill(null).map(() => Array(9).fill(null));
}

export function createEmptyMiniWinners(): MiniWinners {
  return Array(9).fill(null);
}
