'use client';

import React, { useState } from 'react';
import { useAddTodo } from '../hooks/useTodos';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const AddTodoForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<string>(() => dayjs().format('YYYY-MM-DD'));
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const add = useAddTodo();

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) {
      toast.error('Title kosong');
      return;
    }
    add.mutate(
      { title, date: dayjs(date).toISOString(), completed: false, priority },
      {
        onSuccess: () => {
          toast.success('Task ditambahkan');
          setTitle('');
          onClose?.();
        },
        onError: () => toast.error('Gagal menambah'),
      }
    );
  };

  return (
    <form onSubmit={submit} className='space-y-4'>
      <input
        type='text'
        placeholder='Task title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='w-full rounded-lg border px-4 py-2 bg-[#071021] text-white'
      />
      <div className='flex gap-2'>
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='rounded-lg px-3 py-2'
        />
        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')
          }
          className='rounded-lg px-3 py-2'
        >
          <option value='LOW'>Low</option>
          <option value='MEDIUM'>Medium</option>
          <option value='HIGH'>High</option>
        </select>
      </div>
      <div className='flex gap-2 justify-end'>
        <button
          type='button'
          onClick={onClose}
          className='px-4 py-2 rounded-md border'
        >
          Cancel
        </button>
        <button type='submit' className='px-4 py-2 rounded-md bg-blue-600'>
          + Add Task
        </button>
      </div>
    </form>
  );
};

export default AddTodoForm;
