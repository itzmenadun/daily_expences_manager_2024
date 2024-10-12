import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface Expense {
  id?: number;
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface ExpenseDB extends DBSchema {
  expenses: {
    key: number;
    value: Expense;
    indexes: { 'by-date': string };
  };
}

let db: IDBPDatabase<ExpenseDB>;

export async function openDatabase() {
  if (!db) {
    db = await openDB<ExpenseDB>('ExpenseDB', 1, {
      upgrade(db) {
        const store = db.createObjectStore('expenses', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-date', 'date');
      },
    });
  }
  return db;
}

export async function addExpense(expense: Omit<Expense, 'id'>): Promise<number> {
  const db = await openDatabase();
  return db.add('expenses', expense);
}

export async function getExpenses(): Promise<Expense[]> {
  const db = await openDatabase();
  return db.getAllFromIndex('expenses', 'by-date');
}

export async function updateExpense(expense: Expense): Promise<void> {
  const db = await openDatabase();
  await db.put('expenses', expense);
}

export async function deleteExpense(id: number): Promise<void> {
  const db = await openDatabase();
  await db.delete('expenses', id);
}