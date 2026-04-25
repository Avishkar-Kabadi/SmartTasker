import { Category } from '../types';

export const CATEGORIES: { label: Category; icon: string; color: string }[] = [
  { label: 'General', icon: 'list', color: '#60A5FA' },
  { label: 'Research', icon: 'book-open', color: '#8B3FCC' },
  { label: 'Work', icon: 'briefcase', color: '#5B54E8' },
  { label: 'Learning', icon: 'graduation-cap', color: '#FACC15' },
  { label: 'Health', icon: 'heart', color: '#F87171' },
  { label: 'Personal', icon: 'user', color: '#4ADE80' },
];

export const PRIORITY_COLORS = {
  high: '#F87171',
  medium: '#FACC15',
  low: '#4ADE80',
};
