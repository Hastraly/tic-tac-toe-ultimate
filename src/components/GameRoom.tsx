import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MiniBoard } from './MiniBoard';
import type { Room, Move } from '../types';
import {
  isValidMove,
  checkMiniWinner,
  checkMainWinner,
  calculateNextAllowedBoard
} from '../lib/gameLogic';
import { Copy, Check, Home, X, Circle } from 'lucide-react';

interface GameRoomProps {
  roomId: string;
  onLeave: () => void;
}

export function GameRoom({ roomId, onLeave }: GameRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadRoom();
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          setRoom(payload.new as Room);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const loadRoom = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!data) {
        setError('Partie non trouvée');
        return;
      }

      setRoom(data as Room);
    } catch (err) {
      setError('Erreur de chargement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const makeMove = async (move: Move) => {
    if (!room || room.winner) return;

    if (!isValidMove(room.board, room.mini_winners, room.allowed_board, move)) {
      return;
    }

    const newBoard = room.board.map((mb, i) =>
      i === move.boardIndex
        ? mb.map((cell, j) => j === move.cellIndex ? room.current_player : cell)
        : mb
    );

    const miniWinner = checkMiniWinner(newBoard[move.boardIndex]);
    const newMiniWinners = [...room.mini_winners];
    if (miniWinner) {
      newMiniWinners[move.boardIndex] = miniWinner;
    }

    const mainWinner = checkMainWinner(newMiniWinners);
    const nextAllowedBoard = calculateNextAllowedBoard(move.cellIndex, newMiniWinners, newBoard);
    const nextPlayer = room.current_player === 'X' ? 'O' : 'X';

    try {
      const { error: updateError } = await supabase
        .from('rooms')
        .update({
          board: newBoard,
          mini_winners: newMiniWinners,
          current_player: nextPlayer,
          allowed_board: nextAllowedBoard,
          winner: mainWinner,
          updated_at: new Date().toISOString(),
        })
        .eq('id', roomId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Erreur lors du coup:', err);
    }
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetGame = async () => {
    try {
      await supabase.from('rooms').delete().eq('id', roomId);
      onLeave();
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error || 'Partie introuvable'}</div>
          <button
            onClick={onLeave}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onLeave}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Accueil</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <span className="text-slate-400 text-sm">Code: </span>
              <span className="text-white font-mono font-bold">{roomId}</span>
            </div>
            <button
              onClick={copyRoomLink}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg border border-slate-700 transition-colors"
              title="Copier le code"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                room.current_player === 'X' ? 'bg-cyan-500/20 border border-cyan-400' : 'bg-slate-700'
              }`}>
                <X className="text-cyan-400" size={24} strokeWidth={3} />
                <span className="text-white font-semibold">Joueur X</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                room.current_player === 'O' ? 'bg-pink-500/20 border border-pink-400' : 'bg-slate-700'
              }`}>
                <Circle className="text-pink-400" size={24} strokeWidth={3} />
                <span className="text-white font-semibold">Joueur O</span>
              </div>
            </div>

            {room.winner && (
              <button
                onClick={resetGame}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Nouvelle partie
              </button>
            )}
          </div>

          {room.winner && (
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-white">
                {room.winner === 'draw'
                  ? 'Match nul !'
                  : `Le joueur ${room.winner} a gagné !`}
              </div>
            </div>
          )}

          {!room.winner && (
            <div className="mt-4 text-center text-slate-400">
              {room.allowed_board === null
                ? 'Vous pouvez jouer sur n\'importe quel plateau'
                : `Vous devez jouer sur le plateau surligné`}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {room.board.map((miniBoard, boardIndex) => (
            <MiniBoard
              key={boardIndex}
              board={miniBoard}
              boardIndex={boardIndex}
              winner={room.mini_winners[boardIndex]}
              isAllowed={room.allowed_board === null || room.allowed_board === boardIndex}
              onCellClick={(cellIndex) => makeMove({ boardIndex, cellIndex })}
              disabled={!!room.winner}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
