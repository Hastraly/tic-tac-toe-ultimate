/*
  # Add player names/pseudos

  ## Description
  Adds fields to store player pseudos/names in game rooms.

  ## Modified Tables
  - `rooms`
    - `player_x_name` (text, nullable) - Pseudo of player X
    - `player_o_name` (text, nullable) - Pseudo of player O
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rooms' AND column_name = 'player_x_name'
  ) THEN
    ALTER TABLE rooms ADD COLUMN player_x_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rooms' AND column_name = 'player_o_name'
  ) THEN
    ALTER TABLE rooms ADD COLUMN player_o_name text;
  END IF;
END $$;
