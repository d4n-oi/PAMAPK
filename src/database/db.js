import * as SQLite from 'expo-sqlite';

export const initDB = async () => {
  
  const db = await SQLite.openDatabaseAsync('pato.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS diario (
      id INTEGER PRIMARY KEY NOT NULL, 
      data TEXT NOT NULL, 
      humor TEXT NOT NULL, 
      texto TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS jogo (
      id INTEGER PRIMARY KEY NOT NULL, 
      cliques INTEGER NOT NULL
    );
  `);

  return db;
};