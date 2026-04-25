import * as chrono from 'chrono-node';
import { ParsedTask, Category, Priority, Recurrence } from '../types';

const categoryRules: Record<Category, string[]> = {
  Research:   ['paper', 'arxiv', 'read', 'study', 'literature', 'review', 'research'],
  Work:       ['meeting', 'standup', 'report', 'submit', 'deadline', 'presentation', 'email', 'intern'],
  Learning:   ['learn', 'course', 'tutorial', 'watch', 'practice', 'implement', 'code'],
  Health:     ['gym', 'workout', 'exercise', 'run', 'yoga', 'medicine', 'doctor'],
  Personal:   ['buy', 'call', 'pay', 'bill', 'family', 'friend'],
  General:    [],
};

const priorityRules = {
  high:   ['urgent', 'asap', 'critical', 'important', 'deadline', 'submit', 'due'],
  low:    ['maybe', 'someday', 'eventually', 'whenever', 'low priority'],
  medium: [], 
};

export const parseTaskInput = (input: string): ParsedTask => {
  const parsedResults = chrono.parse(input);
  let title = input;
  let dueDate: string | null = null;
  let dueTime: string | null = null;
  
  if (parsedResults.length > 0) {
    const result = parsedResults[0];
    title = input.replace(result.text, '').trim();
    // Clean up multiple spaces
    title = title.replace(/\s+/g, ' ');
    
    const date = result.start.date();
    dueDate = date.toISOString().split('T')[0];
    
    if (result.start.isCertain('hour')) {
      dueTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  }

  // Detect category
  let detectedCategory: Category = 'General';
  const lowerInput = input.toLowerCase();
  for (const [cat, keywords] of Object.entries(categoryRules)) {
    if (keywords.some(k => lowerInput.includes(k))) {
      detectedCategory = cat as Category;
      break;
    }
  }

  // Detect priority
  let detectedPriority: Priority = 'medium';
  for (const [pri, keywords] of Object.entries(priorityRules)) {
    if (keywords.some(k => lowerInput.includes(k))) {
      detectedPriority = pri as Priority;
      break;
    }
  }
  
  // Detect recurrence
  let isRecurring = false;
  let recurrence: Recurrence = 'none';
  if (lowerInput.includes('every day') || lowerInput.includes('daily')) {
    isRecurring = true;
    recurrence = 'daily';
  } else if (lowerInput.includes('every week') || lowerInput.includes('weekly')) {
    isRecurring = true;
    recurrence = 'weekly';
  } else if (lowerInput.includes('every month') || lowerInput.includes('monthly')) {
    isRecurring = true;
    recurrence = 'monthly';
  }

  return {
    title: title || input, // Fallback if fully parsed away
    due_date: dueDate,
    due_time: dueTime,
    category: detectedCategory,
    priority: detectedPriority,
    tags: [],
    isRecurring,
    recurrence
  };
};
