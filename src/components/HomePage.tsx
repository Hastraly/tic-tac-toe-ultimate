import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { generateRoomId, createEmptyBoard, createEmptyMiniWinners } from '../lib/gameLogic';
import { Grid3x3, HelpCircle } from 'lucide-react';

interface HomePageProps {
  onJoinRoom: (roomId: string) => void;
}

export function HomePage({ onJoinRoom }: HomePageProps) {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRules, setShowRules] = useState(false);

  const createRoom = async () => {
    setLoading(true);
    setError('');

    try {
      const roomId = generateRoomId();
      const { error: insertError } = await supabase.from('rooms').insert({
        id: roomId,
        board: createEmptyBoard(),
        mini_winners: createEmptyMiniWinners(),
        current_player: 'X',
        allowed_board: null,
        winner: null,
      });

      if (insertError) throw insertError;

      onJoinRoom(roomId);
    } catch (err) {
      setError('Erreur lors de la création de la partie');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Veuillez entrer un code de partie');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomCode.toUpperCase())
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!data) {
        setError('Partie non trouvée');
        return;
      }

      onJoinRoom(roomCode.toUpperCase());
    } catch (err) {
      setError('Erreur lors de la connexion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Grid3x3 className="w-16 h-16 text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">Morpion Ultime</h1>
          <p className="text-slate-400">Jouez en ligne avec un ami</p>
        </div>

        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          <button
            onClick={createRoom}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-white font-semibold py-4 rounded-xl transition-colors mb-6 text-lg"
          >
            {loading ? 'Création...' : 'Créer une partie'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800 text-slate-400">ou</span>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Code de la partie"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center text-lg font-mono"
              maxLength={5}
            />
            <button
              onClick={joinRoom}
              disabled={loading}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Connexion...' : 'Rejoindre'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowRules(!showRules)}
          className="mt-6 w-full flex items-center justify-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          <span>{showRules ? 'Masquer' : 'Voir'} les règles</span>
        </button>
<p className="mt-3 text-center text-xs text-slate-500">
  Créé par <span className="text-slate-400 font-medium">Hastraly</span>
</p>
        {showRules && (
          <div className="mt-4 bg-slate-800 rounded-xl p-6 border border-slate-700 text-slate-300 text-sm space-y-3">
            <h3 className="font-bold text-white text-base mb-2">Comment jouer ?</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>Le plateau est composé de 9 mini-morpions</li>
              <li>Votre coup détermine où l'adversaire doit jouer ensuite</li>
              <li>Si le mini-plateau est gagné ou plein, jeu libre</li>
              <li>Gagnez 3 mini-plateaux alignés pour remporter la partie</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
