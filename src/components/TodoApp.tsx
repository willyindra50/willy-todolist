'use client';

import { useState, useRef, useEffect } from 'react';
import TodoCard from '@/components/TodoCard';
import ThemeToggle from '@/components/ThemeToggle';
import { useTodosInfinite } from '@/hooks/useTodos';
import AddTaskModal from '@/components/AddTaskModal';
import { Button } from '@/components/ui/button';
import type { Todo } from '@/lib/api';

export default function TodoApp() {
  const [activeTab, setActiveTab] = useState<
    'today' | 'upcoming' | 'completed'
  >('today');
  const [openModal, setOpenModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByPriority, setSortByPriority] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // ✅ Ambil 10 todos per page
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTodosInfinite({}, 10);

  // Ref buat infinite scroll
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver → auto load more
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const target = loadMoreRef.current; // ✅ simpan ref ke variabel lokal
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target); // ✅ pakai variabel, bukan loadMoreRef.current
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <p className='text-center py-10'>Loading...</p>;
  if (isError)
    return (
      <p className='text-center py-10 text-red-500'>Failed to load todos.</p>
    );

  const todos = data?.pages.flatMap((page) => page.todos) ?? [];

  // === FILTER SESUAI TAB ===
  const todayStr = new Date().toISOString().split('T')[0];
  let filteredTodos = todos.filter((todo) => {
    if (activeTab === 'today') {
      return todo.date?.startsWith(todayStr) && !todo.completed;
    }
    if (activeTab === 'upcoming') {
      if (selectedDate)
        return todo.date?.startsWith(selectedDate) && !todo.completed;
      return todo.date && todo.date > todayStr && !todo.completed;
    }
    if (activeTab === 'completed') return todo.completed;
    return true;
  });

  // === FILTER SEARCH ===
  if (searchTerm.trim() !== '') {
    filteredTodos = filteredTodos.filter((todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // === SORT BY PRIORITY ===
  if (sortByPriority) {
    const order = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    filteredTodos = [...filteredTodos].sort((a, b) => {
      const pa = order[a.priority as keyof typeof order] ?? 4;
      const pb = order[b.priority as keyof typeof order] ?? 4;
      return pa - pb;
    });
  }

  return (
    <div className='min-h-screen bg-background text-foreground px-4'>
      <div className='max-w-2xl mx-auto py-10'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-2xl font-bold'>What’s on Your Plan Today?</h1>
            <p className='text-muted-foreground text-neutral-400'>
              Your productivity starts now.
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Search & Filter */}
        <div className='flex gap-2 mb-6'>
          <input
            type='text'
            placeholder='Search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='flex-1 px-4 py-2 rounded-md border bg-background'
          />
          <Button
            variant={sortByPriority ? 'default' : 'outline'}
            onClick={() => setSortByPriority((prev) => !prev)}
            className='h-[44px] px-4'
          >
            Priority
          </Button>
        </div>

        {/* Tabs */}
        <div className='mb-6'>
          <div
            className='
              flex items-center gap-2 justify-between
              bg-white/20 dark:bg-gray-800/20
              backdrop-blur-md
              text-card-foreground
              border border-white/30 dark:border-gray-700/30
              rounded-xl p-2
              shadow-lg
              transition-all
            '
          >
            <Button
              variant={activeTab === 'today' ? 'default' : 'ghost'}
              className={`flex-1 rounded-lg ${
                activeTab === 'today'
                  ? 'bg-blue-700 hover:bg-blue-600 text-white shadow-md'
                  : 'text-foreground'
              }`}
              onClick={() => {
                setActiveTab('today');
                setSelectedDate(null);
              }}
            >
              Today
            </Button>

            <Button
              variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
              className={`flex-1 rounded-lg ${
                activeTab === 'upcoming'
                  ? 'bg-blue-700 hover:bg-blue-600 text-white shadow-md'
                  : 'text-foreground'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </Button>

            <Button
              variant={activeTab === 'completed' ? 'default' : 'ghost'}
              className={`flex-1 rounded-lg ${
                activeTab === 'completed'
                  ? 'bg-blue-700 hover:bg-blue-600 text-white shadow-md'
                  : 'text-foreground'
              }`}
              onClick={() => {
                setActiveTab('completed');
                setSelectedDate(null);
              }}
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Section Header */}
        <div className='mb-6'>
          {activeTab === 'today' && (
            <div>
              <h2 className='text-xl font-semibold flex items-center gap-2'>
                Today{' '}
                <span className='text-sm bg-gray-700 text-white px-2 py-0.5 rounded-full'>
                  {filteredTodos.length} Item
                </span>
              </h2>
              <p className='text-sm text-muted-foreground'>
                {new Date().toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div>
              <div className='flex justify-between items-center'>
                <div>
                  <h2 className='text-xl font-semibold flex items-center gap-2'>
                    Upcoming{' '}
                    <span className='text-sm bg-gray-700 text-white px-2 py-0.5 rounded-full'>
                      {filteredTodos.length} Item
                    </span>
                  </h2>
                  <p className='text-sm text-muted-foreground'>
                    {selectedDate
                      ? new Date(selectedDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Pick a date below'}
                  </p>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setSelectedDate(todayStr)}
                >
                  Today →
                </Button>
              </div>

              {/* Mini Calendar */}
              <div className='flex gap-4 mt-4 overflow-x-auto text-sm'>
                {Array.from({ length: 14 }).map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  const dateStr = d.toISOString().split('T')[0];
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`px-3 py-1 rounded-lg ${
                        selectedDate === dateStr
                          ? 'bg-blue-700 text-white'
                          : 'hover:bg-gray-700/40'
                      }`}
                    >
                      <div>
                        {d.toLocaleDateString(undefined, { weekday: 'short' })}
                      </div>
                      <div>{d.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'completed' && (
            <div>
              <h2 className='text-xl font-semibold flex items-center gap-2'>
                ✅ Completed{' '}
                <span className='text-sm bg-gray-700 text-white px-2 py-0.5 rounded-full'>
                  {filteredTodos.length} Item
                </span>
              </h2>
            </div>
          )}
        </div>

        {/* Todo List */}
        <div className='space-y-3'>
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onEdit={(t) => {
                  setEditingTodo(t);
                  setOpenModal(true);
                }}
              />
            ))
          ) : (
            <p className='text-center text-neutral-400'>No todos found.</p>
          )}
        </div>

        {/* Infinite Scroll Loader */}
        <div
          ref={loadMoreRef}
          className='h-10 flex items-center justify-center'
        >
          {isFetchingNextPage && <p>Loading more...</p>}
        </div>

        {/* Add Task */}
        <div className='mt-6 flex justify-center'>
          <Button
            onClick={() => {
              setEditingTodo(null);
              setOpenModal(true);
            }}
            className='w-[300px] h-[48px] bg-blue-700 hover:bg-blue-600 text-white'
          >
            + Add Task
          </Button>
        </div>
      </div>

      {/* Modal Add/Edit */}
      <AddTaskModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingTodo(null);
        }}
        todo={editingTodo ?? undefined}
      />
    </div>
  );
}
