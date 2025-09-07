import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';

// Create a single, shared database instance
export const db = new Database('database.sqlite');

const SCHEMA_SQL = `
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'member',
    company TEXT,
    location TEXT,
    home_address TEXT,
    bio TEXT,
    website_url TEXT,
    profile_photo TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    telegram_url TEXT,
    hobbies TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS user_expertise (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    technology TEXT NOT NULL,
    expertise_level INTEGER NOT NULL CHECK(expertise_level BETWEEN 1 AND 10),
    years_experience INTEGER NOT NULL CHECK(years_experience >= 0),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

export function initializeDatabase() {
  try {
    console.log('Initializing database...');
    db.exec(SCHEMA_SQL);
    console.log('Database schema created');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@akash.network';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const stmt = db.prepare('SELECT * FROM admin_users WHERE email = ?');
    const adminExists = stmt.get(adminEmail);

    if (!adminExists) {
      const passwordHash = bcrypt.hashSync(adminPassword, 10);
      const insertStmt = db.prepare('INSERT INTO admin_users (name, email, password_hash) VALUES (?, ?, ?)');
      insertStmt.run('Admin', adminEmail, passwordHash);
      console.log('Default admin user created with email:', adminEmail);
    } else {
      console.log('Admin user already exists for email:', adminEmail);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Initialize database on import
initializeDatabase();

