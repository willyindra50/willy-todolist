import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { API, Todo } from '../lib/api';

/* -------- Types -------- */
export type ScrollResponse = {
  todos: Todo[];
  nextCursor: number | null;
  hasNextPage: boolean;
};

export type Filters = {
  order?: 'asc' | 'desc';
  completed?: 'all' | 'completed' | 'pending';
  priority?: 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH';
  sort?: string;
};

/* -------- Fetch Todos (Infinite Scroll) -------- */
export const fetchTodosScroll = async ({
  pageParam = 0,
  limit = 10,
  filters = {},
}: {
  pageParam?: number;
  limit?: number;
  filters?: Filters;
}): Promise<ScrollResponse> => {
  // lebih ketat daripada any
  const params: Record<string, string | number | boolean> = {
    nextCursor: pageParam,
    limit,
    order: filters.order ?? 'asc',
  };

  if (filters.completed && filters.completed !== 'all') {
    params.completed = filters.completed === 'completed';
  }
  if (filters.priority && filters.priority !== 'ALL') {
    params.priority = filters.priority;
  }
  if (filters.sort) params.sort = filters.sort;

  const { data } = await API.get<ScrollResponse>('/todos/scroll', { params });
  return data;
};

/* -------- useTodosInfinite -------- */
export const useTodosInfinite = (filters: Filters, limit = 10) => {
  return useInfiniteQuery<ScrollResponse>({
    queryKey: ['todos', filters, limit],
    queryFn: ({ pageParam }) =>
      fetchTodosScroll({
        pageParam: (pageParam as number) ?? 0,
        limit,
        filters,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: 0,
  });
};

/* -------- useAddTodo (Optimistic Update) -------- */
export const useAddTodo = () => {
  const qc = useQueryClient();

  return useMutation<
    Todo,
    Error,
    Partial<Todo>,
    { previous?: InfiniteData<ScrollResponse> }
  >({
    mutationFn: async (payload: Partial<Todo>) => {
      const { data } = await API.post<Todo>('/todos', payload);
      return data;
    },
    onMutate: async (newTodo) => {
      await qc.cancelQueries({ queryKey: ['todos'] });
      const previous = qc.getQueryData<InfiniteData<ScrollResponse>>(['todos']);

      qc.setQueryData<InfiniteData<ScrollResponse>>(['todos'], (old) => {
        if (!old) return old;
        const optimistic: Todo = {
          ...(newTodo as Todo),
          id: 'tmp-' + Date.now(),
        };
        return {
          ...old,
          pages: old.pages.map((p, i) =>
            i === 0 ? { ...p, todos: [optimistic, ...p.todos] } : p
          ),
        };
      });

      return { previous };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previous) qc.setQueryData(['todos'], context.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

/* -------- useToggleTodo (Optimistic Update) -------- */
export const useToggleTodo = () => {
  const qc = useQueryClient();

  return useMutation<
    Todo,
    Error,
    { id: string; patch: Partial<Todo> },
    { previous?: InfiniteData<ScrollResponse> }
  >({
    mutationFn: async ({ id, patch }) => {
      const { data } = await API.put<Todo>(`/todos/${id}`, patch);
      return data;
    },
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ['todos'] });
      const previous = qc.getQueryData<InfiniteData<ScrollResponse>>(['todos']);

      qc.setQueryData<InfiniteData<ScrollResponse>>(['todos'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            todos: p.todos.map((t) => (t.id === id ? { ...t, ...patch } : t)),
          })),
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) qc.setQueryData(['todos'], context.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

/* -------- useDeleteTodo (Optimistic Update) -------- */
export const useDeleteTodo = () => {
  const qc = useQueryClient();

  return useMutation<
    string,
    Error,
    string,
    { previous?: InfiniteData<ScrollResponse> }
  >({
    mutationFn: async (id: string) => {
      await API.delete(`/todos/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['todos'] });
      const previous = qc.getQueryData<InfiniteData<ScrollResponse>>(['todos']);

      qc.setQueryData<InfiniteData<ScrollResponse>>(['todos'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            todos: p.todos.filter((t) => t.id !== id),
          })),
        };
      });

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) qc.setQueryData(['todos'], context.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};
