const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure database file exists in the server directory
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
function initDb() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create profiles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id TEXT PRIMARY KEY,
      name TEXT,
      avatarId TEXT,
      slogan TEXT,
      points INTEGER DEFAULT 50,
      subscriptionTier TEXT DEFAULT 'free',
      isLoggedIn BOOLEAN DEFAULT 1,
      hasTakenTest BOOLEAN DEFAULT 0,
      weightedScore TEXT,
      testMatchScore TEXT,
      riasecTitle TEXT,
      careerPersona TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create reports table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully.');
}

initDb();

module.exports = db;
