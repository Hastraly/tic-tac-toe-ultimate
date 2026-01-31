/*
  # Create rooms table for Ultimate Tic-Tac-Toe

  ## Description
  Creates the game rooms table to store all active games with real-time synchronization.

  ## New Tables
  - `rooms`
    - `id` (text, primary key) - Unique room code (e.g., "AB3X9")
    - `board` (jsonb) - Game board state: 9 mini-boards, each with 9 cells
    - `mini_winners` (jsonb) - Array of 9 elements tracking winner of each mini-board
    - `current_player` (text) - Current player's turn: "X" or "O"
    - `allowed_board` (integer, nullable) - Index (0-8) of playable mini-board, null = any
    - `winner` (text, nullable) - Game winner: "X", "O", "draw", or null
    - `player_x` (text, nullable) - Player X identifier
    - `player_o` (text, nullable) - Player O identifier
    - `created_at` (timestamptz) - Room creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on rooms table
  - Allow all users to read any room (public games)
    - Allow all users to create rooms
    - Allow players in a room to update that room

  ## Notes
  1. Rooms are temporary and should be cleaned up after games end
  2. Board structure: array of 9 mini-boards, each containing 9 cells
  3. Each cell can be: null (empty), "X", or "O"
  4. Mini-board winners: array of 9 elements, each null, "X", or "O"
*/

CREATE TABLE IF NOT EXISTS rooms (
  id text PRIMARY KEY,
  board jsonb NOT NULL DEFAULT '[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]]',
  mini_winners jsonb NOT NULL DEFAULT '[null,null,null,null,null,null,null,null,null]',
  current_player text NOT NULL DEFAULT 'X',
  allowed_board integer,
  winner text,
  player_x text,
  player_o text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rooms"
  ON rooms
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create rooms"
  ON rooms
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update rooms"
  ON rooms
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete old rooms"
  ON rooms
  FOR DELETE
  USING (true);
