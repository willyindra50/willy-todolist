export type Todo = {
  id: number;
  title: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
};
