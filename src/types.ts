export type Player = 'X' | 'O';
export type Cell = Player | null;
export type MiniBoard = Cell[];
export type Board = MiniBoard[];
export type MiniWinners = (Player | null)[];

export interface Room {
  id: string;
  board: Board;
  mini_winners: MiniWinners;
  current_player: Player;
  allowed_board: number | null;
  winner: Player | 'draw' | null;
  player_x: string | null;
  player_o: string | null;
  draw_proposed_by: Player | null;
  forfeit_by: Player | null;
  created_at: string;
  updated_at: string;
}

export interface Move {
  boardIndex: number;
  cellIndex: number;
}
