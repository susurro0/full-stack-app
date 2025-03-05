import sqlite3 from "sqlite3";

const isTest = process.env.NODE_ENV === "test";
const db = new sqlite3.Database(isTest ? ":memory:" : "./contacts.db", (err) => {
    if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL,
      phoneNumber TEXT NOT NULL,
      age INTEGER NOT NULL
    )
  `);
});

export default db;
