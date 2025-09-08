import React, { useRef, useEffect } from 'react';
import { useTodosInfinite } from '../hooks/useTodos';
import TodoCard from './TodoCard';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Spinner from './Spinner';

const TodoList: React.FC = () => {
  const rawFilters = useSelector((s: RootState) => s.filters);

  // map "active" → "pending" agar sesuai dengan Filters type
  const filters = {
    ...rawFilters,
    completed:
      rawFilters.completed === 'active'
        ? 'pending'
        : (rawFilters.completed as 'all' | 'completed' | 'pending' | undefined),
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useTodosInfinite(filters, 10);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        });
      },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (status === 'pending') {
    return <div className='py-8'>Loading skeleton...</div>;
  }

  if (status === 'error') {
    return <div className='py-8'>Error fetching todos.</div>;
  }

  const allTodos = data?.pages.flatMap((p) => p.todos) ?? [];

  return (
    <div className='space-y-4'>
      {allTodos.length === 0 ? (
        <div className='text-center py-8'>No tasks. Try add some!</div>
      ) : (
        allTodos.map((t) => <TodoCard key={t.id} todo={t} />)
      )}

      <div ref={sentinelRef} className='h-6' />

      {isFetchingNextPage && (
        <div className='flex justify-center py-4'>
          <Spinner />
        </div>
      )}

      {!hasNextPage && allTodos.length > 0 && (
        <div className='text-center py-4 text-sm text-muted-foreground'>
          No more tasks
        </div>
      )}
    </div>
  );
};

export default TodoList;
