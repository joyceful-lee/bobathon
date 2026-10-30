CREATE TABLE IF NOT EXISTS drinks (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id text NOT NULL,
 recipe jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS drinks_user_created_idx ON drinks(user_id,created_at DESC);
CREATE TABLE IF NOT EXISTS orders (
 id uuid PRIMARY KEY, code text UNIQUE NOT NULL, user_id text,
 recipe jsonb NOT NULL, total numeric(8,2) NOT NULL CHECK(total>=0),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_created_idx ON orders(created_at DESC);
CREATE TABLE IF NOT EXISTS admins (user_id text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS admin_emails (email text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now());
