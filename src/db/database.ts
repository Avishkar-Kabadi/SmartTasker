import * as SQLite from 'expo-sqlite';
import { Task } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  if (db) return;
  db = await SQLite.openDatabaseAsync('smarttasker.db');
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT 'General',
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      due_date TEXT,
      due_time TEXT,
      reminder_id TEXT,
      is_recurring INTEGER DEFAULT 0,
      recurrence TEXT DEFAULT '',
      tags TEXT DEFAULT '[]',
      created_at TEXT NOT NULL,
      completed_at TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER,
      event_type TEXT,
      hour_of_day INTEGER,
      day_of_week INTEGER,
      created_at TEXT NOT NULL
    );
  `);
};

export const getDb = (): SQLite.SQLiteDatabase => {
  if (!db) throw new Error("Database not initialized");
  return db;
};

export const insertTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'>) => {
  const database = getDb();
  const now = new Date().toISOString();
  
  const result = await database.runAsync(
    `INSERT INTO tasks (
      title, description, category, priority, status, due_date, due_time, 
      reminder_id, is_recurring, recurrence, tags, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      task.title,
      task.description,
      task.category,
      task.priority,
      task.status,
      task.due_date,
      task.due_time,
      task.reminder_id,
      task.is_recurring ? 1 : 0,
      task.recurrence,
      JSON.stringify(task.tags),
      now,
      now
    ]
  );
  
  await logTaskEvent(result.lastInsertRowId, 'created');
  return result.lastInsertRowId;
};

export const getAllTasks = async (): Promise<Task[]> => {
  const database = getDb();
  const rows = await database.getAllAsync<any>(
    `SELECT * FROM tasks WHERE status != 'archived' ORDER BY due_date ASC, due_time ASC`
  );
  return rows.map(mapDbTask);
};

export const getTasksByDate = async (dateStr: string): Promise<Task[]> => {
  const database = getDb();
  const rows = await database.getAllAsync<any>(
    `SELECT * FROM tasks WHERE status != 'archived' AND due_date = ? ORDER BY priority DESC, due_time ASC`,
    [dateStr]
  );
  return rows.map(mapDbTask);
};

export const updateTask = async (id: number, updates: Partial<Task>) => {
  const database = getDb();
  const now = new Date().toISOString();
  
  const sets: string[] = [];
  const values: any[] = [];
  for (const [key, value] of Object.entries(updates)) {
    if (key === 'id' || key === 'created_at') continue;
    sets.push(`${key} = ?`);
    values.push(key === 'tags' ? JSON.stringify(value) : (typeof value === 'boolean' ? (value ? 1 : 0) : value));
  }
  
  sets.push(`updated_at = ?`);
  values.push(now);
  values.push(id);
  
  await database.runAsync(
    `UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`,
    values as any
  );
};

export const deleteTask = async (id: number) => {
  const database = getDb();
  await database.runAsync(`DELETE FROM tasks WHERE id = ?`, [id]);
  await logTaskEvent(id, 'deleted');
};

export const markComplete = async (id: number) => {
  const database = getDb();
  const now = new Date().toISOString();
  await database.runAsync(
    `UPDATE tasks SET status = 'completed', completed_at = ?, updated_at = ? WHERE id = ?`,
    [now, now, id]
  );
  await logTaskEvent(id, 'completed');
};

export const logTaskEvent = async (taskId: number, eventType: string) => {
  const database = getDb();
  const now = new Date();
  await database.runAsync(
    `INSERT INTO task_events (task_id, event_type, hour_of_day, day_of_week, created_at) VALUES (?, ?, ?, ?, ?)`,
    [taskId, eventType, now.getHours(), now.getDay(), now.toISOString()]
  );
};

export const getInsightData = async (days: number) => {
  const database = getDb();
  const now = new Date();
  const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  
  // Total tasks created in timeframe
  const totalTasksResult = await database.getFirstAsync<{count: number}>(
    `SELECT COUNT(*) as count FROM task_events WHERE event_type = 'created' AND created_at >= ?`,
    [pastDate]
  );
  
  // Completed in timeframe
  const completedResult = await database.getFirstAsync<{count: number}>(
    `SELECT COUNT(*) as count FROM task_events WHERE event_type = 'completed' AND created_at >= ?`,
    [pastDate]
  );
  
  // Weekly completions
  const weeklyData = await database.getAllAsync<{day: string, count: number}>(
    `SELECT strftime('%Y-%m-%d', created_at) as day, COUNT(*) as count 
     FROM task_events 
     WHERE event_type = 'completed' AND created_at >= ?
     GROUP BY day ORDER BY day ASC`,
    [pastDate]
  );
  
  // Category breakdown
  const categoryData = await database.getAllAsync<{category: string, count: number}>(
    `SELECT category, COUNT(*) as count 
     FROM tasks 
     WHERE status = 'completed' 
     GROUP BY category`
  );
  
  // Hourly heatmap
  const hourlyRows = await database.getAllAsync<{hour_of_day: number, count: number}>(
    `SELECT hour_of_day, COUNT(*) as count FROM task_events WHERE event_type = 'completed' GROUP BY hour_of_day`
  );
  
  const hourlyData = new Array(24).fill(0);
  hourlyRows.forEach(row => {
    hourlyData[row.hour_of_day] = row.count;
  });
  
  return {
    totalTasks: totalTasksResult?.count || 0,
    completedThisWeek: completedResult?.count || 0,
    currentStreak: 0, // Simplified for now
    weeklyData: weeklyData,
    categoryData: categoryData.map(c => ({...c, color: '#6C63FF'})), // simplified
    hourlyData
  };
};

const mapDbTask = (row: any): Task => ({
  ...row,
  is_recurring: row.is_recurring === 1,
  tags: JSON.parse(row.tags || '[]'),
});
