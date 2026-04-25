import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import * as db from '../db/database';
import { scheduleTaskReminder, cancelReminder } from '../utils/notificationScheduler';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const all = await db.getAllTasks();
      setTasks(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'reminder_id'>) => {
    try {
      const tempTask = { ...taskData, reminder_id: null, id: -1, created_at: '', updated_at: '', completed_at: null } as Task;
      
      const reminderId = await scheduleTaskReminder(tempTask);
      
      const insertedId = await db.insertTask({
        ...taskData,
        reminder_id: reminderId
      });
      
      await fetchTasks();
      return insertedId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      await db.updateTask(id, updates);
      
      if (updates.due_date || updates.due_time) {
        const task = tasks.find(t => t.id === id);
        if (task) {
           const updatedTask = { ...task, ...updates };
           const reminderId = await scheduleTaskReminder(updatedTask);
           if (reminderId) {
             await db.updateTask(id, { reminder_id: reminderId });
           }
        }
      }
      
      await fetchTasks();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const completeTask = async (id: number) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task?.reminder_id) {
        await cancelReminder(task.reminder_id);
      }
      await db.markComplete(id);
      
      if (task?.is_recurring) {
        // Simple recurrence scheduling logic (next day)
        const date = task.due_date ? new Date(task.due_date) : new Date();
        if (task.recurrence === 'daily') date.setDate(date.getDate() + 1);
        if (task.recurrence === 'weekly') date.setDate(date.getDate() + 7);
        if (task.recurrence === 'monthly') date.setMonth(date.getMonth() + 1);
        
        const nextDateStr = date.toISOString().split('T')[0];
        
        await addTask({
          title: task.title,
          description: task.description,
          category: task.category,
          priority: task.priority,
          status: 'pending',
          due_date: nextDateStr,
          due_time: task.due_time,
          is_recurring: true,
          recurrence: task.recurrence,
          tags: task.tags,
        });
      }
      
      await fetchTasks();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const removeTask = async (id: number) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task?.reminder_id) {
        await cancelReminder(task.reminder_id);
      }
      await db.deleteTask(id);
      await fetchTasks();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  return { tasks, loading, fetchTasks, addTask, updateTask, completeTask, removeTask };
};
