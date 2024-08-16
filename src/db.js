'use strict';
import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('articles.db');

async function openDb() {
    return db;
}

async function initializeDb() {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT,
            summary TEXT,
            tags TEXT
        );
    `);
    return db;
}


export { openDb, initializeDb };
