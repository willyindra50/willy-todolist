'use client';

import React from 'react';
import dayjs from 'dayjs';
import { Todo } from '../lib/api';
import { useToggleTodo, useDeleteTodo } from '../hooks/useTodos';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const priorityColor = (p?: string) => {
  if (!p) return 'bg-gray-500';
  if (p === 'LOW') return 'bg-green-500';
  if (p === 'MEDIUM') return 'bg-yellow-400';
  if (p === 'HIGH') return 'bg-pink-500';
  return 'bg-gray-500';
};

type TodoCardProps = {
  todo: Todo;
  onEdit?: (todo: Todo) => void; // 👈 optional, supaya gak error kalau gak dipass
};

const TodoCard: React.FC<TodoCardProps> = ({ todo, onEdit }) => {
  const toggleMutation = useToggleTodo();
  const deleteMutation = useDeleteTodo();

  // ✅ Toggle Completed
  const onToggle = () => {
    toggleMutation.mutate(
      { id: todo.id, patch: { completed: !todo.completed } },
      {
        onError: () => toast.error('Gagal update status'),
      }
    );
  };

  // ✅ Delete Todo
  const onDelete = () => {
    deleteMutation.mutate(todo.id, {
      onSuccess: () => toast.success('Task dihapus'),
      onError: () => toast.error('Gagal hapus'),
    });
  };

  return (
    <div
      className='
        flex items-center justify-between 
        bg-white/20 dark:bg-gray-800/20 
        backdrop-blur-md 
        text-card-foreground 
        border border-white/30 dark:border-gray-700/30
        rounded-xl p-4 
        shadow-lg hover:shadow-xl 
        transition-all
      '
    >
      {/* Kiri: checkbox + info */}
      <div className='flex items-start gap-4'>
        <input
          type='checkbox'
          checked={!!todo.completed}
          onChange={onToggle}
          className='w-5 h-5 rounded-md border-input text-blue-600 focus:ring-2 focus:ring-blue-500'
        />
        <div>
          <div
            className={`text-sm font-semibold ${
              todo.completed ? 'line-through opacity-60' : ''
            }`}
          >
            {todo.title}
          </div>
          <div className='mt-2 flex items-center gap-3 text-xs text-muted-foreground'>
            <div>
              {todo.date ? dayjs(todo.date).format('MMM D, YYYY') : '-'}
            </div>
            <div
              className={`px-2 py-1 rounded-full text-white text-[11px] ${priorityColor(
                todo.priority
              )}`}
            >
              {todo.priority ?? 'NONE'}
            </div>
          </div>
        </div>
      </div>

      {/* Kanan: menu dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label='options'
            className='p-2 rounded hover:bg-accent transition-colors'
          >
            ⋮
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='
            w-40 rounded-2xl 
            bg-white/20 dark:bg-gray-800/20 
            backdrop-blur-md 
            text-card-foreground 
            p-2 
            border border-white/30 dark:border-gray-700/30 
            shadow-2xl
          '
        >
          <DropdownMenuItem
            onClick={() => onEdit?.(todo)} // 👈 aman walau onEdit gak dipass
            className='cursor-pointer'
          >
            ✏️ Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className='cursor-pointer text-red-500 focus:text-red-600'
          >
            🗑️ Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TodoCard;
