import axios from 'axios';

export const API = axios.create({
  baseURL: 'https://betodolist-main-production.up.railway.app',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'api-key': '0ICVyrNhPL56Oss58qv-_y42PhSQvYcPm6Vz26j4bNw',
  },
  timeout: 10000,
});

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  date?: string; // ISO string
  priority?: Priority;
}

/**
 * Create a todo
 */
export async function createTodo(data: {
  title: string;
  date?: string;
  priority?: Priority;
}) {
  const payload: Record<string, unknown> = {
    title: data.title,
    completed: false,
  };
  if (data.priority) payload.priority = data.priority;
  if (data.date) payload.date = data.date;

  const res = await API.post('/todos', payload);
  return res.data as Todo;
}

/**
 * Update a todo
 */
export async function updateTodo(
  id: string,
  data: {
    title?: string;
    date?: string;
    priority?: Priority;
    completed?: boolean;
  }
) {
  const payload: Record<string, unknown> = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.priority !== undefined) payload.priority = data.priority;
  if (data.date !== undefined) payload.date = data.date;
  if (data.completed !== undefined) payload.completed = data.completed;

  const res = await API.put(`/todos/${id}`, payload);
  return res.data as Todo;
}

/**
 * Get todos (paginated)
 */
export async function getTodos(limit = 10, page = 1) {
  const res = await API.get(`/todos?limit=${limit}&page=${page}`);
  return res.data as { todos: Todo[]; total: number };
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string) {
  const res = await API.delete(`/todos/${id}`);
  return res.data;
}
