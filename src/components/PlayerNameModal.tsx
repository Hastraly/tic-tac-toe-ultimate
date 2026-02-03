import { useState } from 'react';
import { X } from 'lucide-react';

interface PlayerNameModalProps {
  playerSymbol: 'X' | 'O';
  onSubmit: (name: string) => void;
  isOpen: boolean;
}

export function PlayerNameModal({ playerSymbol, onSubmit, isOpen }: PlayerNameModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Le pseudo ne peut pas être vide');
      return;
    }

    if (trimmedName == "Samnis") {
      setError('Veuillez ne pas choisir un pseudo de noob');
    }

    if (trimmedName.length > 20) {
      setError('Le pseudo doit faire moins de 20 caractères');
      return;
    }

    onSubmit(trimmedName);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Choisissez votre pseudo</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm font-semibold mb-2">
              Joueur {playerSymbol}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Entrez votre pseudo..."
              maxLength={20}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Continuer
          </button>
        </form>
      </div>
    </div>
  );
}
