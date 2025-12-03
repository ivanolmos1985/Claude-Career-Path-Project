# Create Online Users Tracking Table

## Purpose
Track which users are currently logged in/online in the system.

## SQL Script

Copy and execute this in Supabase SQL Editor:

```sql
-- Create online_users table to track active sessions
CREATE TABLE IF NOT EXISTS online_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_online_users_last_activity ON online_users(last_activity DESC);

-- Enable Row Level Security
ALTER TABLE online_users ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read online users list
CREATE POLICY "Anyone can view online users"
  ON online_users
  FOR SELECT
  USING (true);

-- Policy: Only the user can insert/update their own session
CREATE POLICY "Users can manage their own session"
  ON online_users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own session"
  ON online_users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can delete their own session on logout
CREATE POLICY "Users can delete their own session"
  ON online_users
  FOR DELETE
  USING (auth.uid() = id);

-- Function to mark user as offline when session expires
-- (This will help clean up inactive sessions)
CREATE OR REPLACE FUNCTION cleanup_inactive_users()
RETURNS void AS $$
BEGIN
  DELETE FROM online_users
  WHERE last_activity < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION cleanup_inactive_users() TO authenticated;
```

## What This Creates

1. **online_users table**: Tracks users currently logged in
   - `id`: User ID (from auth.users)
   - `email`: User email
   - `full_name`: User's full name
   - `last_activity`: Timestamp of last activity (updated frequently)
   - `created_at`: When user logged in
   - `updated_at`: When session was last updated

2. **Indexes**: For faster queries

3. **RLS Policies**:
   - Everyone can READ the online users list (needed for displaying avatars)
   - Users can only INSERT/UPDATE their own session

4. **Cleanup Function**: Removes sessions inactive for more than 1 hour

## How It Works

1. When user logs in → INSERT into online_users
2. Every action in the app → UPDATE last_activity timestamp
3. When user logs out → DELETE from online_users
4. App displays only users in online_users table
5. (Optional) Scheduled job cleans up sessions > 1 hour old

## Status
Execute this in Supabase SQL Editor before deploying the code changes.
