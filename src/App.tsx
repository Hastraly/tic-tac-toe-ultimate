import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { GameRoom } from './components/GameRoom';

function App() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  if (currentRoom) {
    return <GameRoom roomId={currentRoom} onLeave={() => setCurrentRoom(null)} />;
  }

  return <HomePage onJoinRoom={setCurrentRoom} />;
}

export default App;
