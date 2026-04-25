import * as Notifications from 'expo-notifications';
import { Task } from '../types';

export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleTaskReminder = async (task: Task, offsetMinutes: number = 30) => {
  if (task.reminder_id) {
    await Notifications.cancelScheduledNotificationAsync(task.reminder_id);
  }

  let reminderDate = new Date();
  if (task.due_date) {
    const [year, month, day] = task.due_date.split('-').map(Number);
    
    if (task.due_time) {
      const [hours, minutes] = task.due_time.split(':').map(Number);
      reminderDate = new Date(year, month - 1, day, hours, minutes);
      reminderDate.setMinutes(reminderDate.getMinutes() - offsetMinutes);
    } else {
      // Default to 9:00 AM on due date
      reminderDate = new Date(year, month - 1, day, 9, 0, 0);
    }
  } else {
    return null; // Can't schedule without date
  }

  if (reminderDate.getTime() < Date.now()) {
    return null; // Date is in past
  }

  const trigger: Notifications.NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: reminderDate,
  };

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: `⏰ ${task.title}`,
      body: task.description || `Your task is due soon.`,
      sound: true,
      badge: 1,
      data: { taskId: task.id },
    },
    trigger,
  });

  return identifier;
};

export const cancelReminder = async (identifier: string) => {
  await Notifications.cancelScheduledNotificationAsync(identifier);
};

export const scheduleBirthdayReminder = async (dobString: string, name: string) => {
  const [year, month, day] = dobString.split('-').map(Number);
  
  const today = new Date();
  let nextBirthday = new Date(today.getFullYear(), month - 1, day, 9, 0, 0);
  
  if (nextBirthday.getTime() < today.getTime()) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  const trigger: Notifications.NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: nextBirthday,
  };

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: `🎉 Happy Birthday, ${name}!`,
      body: `Wishing you a fantastic day from SmartTasker! Take some time to relax today.`,
      sound: true,
    },
    trigger,
  });

  return identifier;
};
