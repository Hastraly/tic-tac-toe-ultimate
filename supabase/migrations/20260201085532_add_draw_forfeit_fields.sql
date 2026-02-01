/*
  # Add draw proposal and forfeit fields

  ## Description
  Adds fields to track draw proposals and forfeit actions in game rooms.

  ## Modified Tables
  - `rooms`
    - `draw_proposed_by` (text, nullable) - Which player proposed draw ("X" or "O")
    - `forfeit_by` (text, nullable) - Which player forfeited ("X" or "O")
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rooms' AND column_name = 'draw_proposed_by'
  ) THEN
    ALTER TABLE rooms ADD COLUMN draw_proposed_by text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rooms' AND column_name = 'forfeit_by'
  ) THEN
    ALTER TABLE rooms ADD COLUMN forfeit_by text;
  END IF;
END $$;
