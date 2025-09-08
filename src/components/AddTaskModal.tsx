'use client';

import { Dialog } from '@headlessui/react';
import { FormEvent, useEffect, useState } from 'react';
import { createTodo, updateTodo, Priority, Todo } from '@/lib/api';
import { AxiosError, isAxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  todo?: Todo; // kalau ada berarti edit
}

export default function AddTaskModal({
  open,
  onClose,
  todo,
}: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('LOW');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // Prefill kalau edit
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setPriority(todo.priority ?? 'LOW');
      setDate(todo.date ? todo.date.split('T')[0] : '');
    } else {
      setTitle('');
      setPriority('LOW');
      setDate('');
    }
  }, [todo, open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a task title.');
      return;
    }

    setLoading(true);
    try {
      if (todo) {
        // === EDIT MODE ===
        await updateTodo(todo.id, {
          title: title.trim(),
          priority,
          date: date ? new Date(date).toISOString() : undefined,
        });
      } else {
        // === ADD MODE ===
        await createTodo({
          title: title.trim(),
          priority,
          date: date ? new Date(date).toISOString() : undefined,
        });
      }

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      onClose();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const axiosErr = err as AxiosError<{
          message?: string;
          error?: string;
        }>;
        alert(
          `Failed to save task: ${
            axiosErr.response?.data?.message ??
            axiosErr.response?.data?.error ??
            axiosErr.message
          }`
        );
      } else {
        alert(`Failed to save task: ${String(err)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className='relative z-50'>
      {/* Overlay */}
      <div className='fixed inset-0 bg-black/50' aria-hidden='true' />

      {/* Panel */}
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='w-full max-w-md rounded-2xl bg-card/80 backdrop-blur-md text-card-foreground p-6 border shadow-2xl'>
          <div className='flex justify-between items-center mb-4'>
            <Dialog.Title className='text-lg font-semibold'>
              {todo ? 'Edit Task' : 'Add Task'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className='text-2xl leading-none hover:text-red-500'
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <textarea
              placeholder='Enter your task'
              className='w-full p-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <select
              className='w-full p-3 rounded-md border bg-card/80 backdrop-blur-md text-card-foreground focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              required
            >
              <option value='LOW'>Low</option>
              <option value='MEDIUM'>Medium</option>
              <option value='HIGH'>High</option>
            </select>
            <input
              type='date'
              className='w-full p-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-700 hover:bg-blue-600 text-white py-2 rounded-md font-medium'
            >
              {loading ? 'Saving...' : todo ? 'Update Task' : 'Save Task'}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
