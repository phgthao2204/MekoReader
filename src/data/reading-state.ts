import {ReadingState} from '../types/book';

// Seed data for the library screen. Local persistence belongs to feature 5.2.
export const initialReadingStates: ReadingState[] = [
  {bookId: 'meko-001', currentPage: 86, lastReadAt: '2026-09-24T09:30:00.000Z'},
  {bookId: 'meko-002', currentPage: 132, lastReadAt: '2026-09-20T18:12:00.000Z'},
  {bookId: 'meko-004', currentPage: 18, lastReadAt: '2026-09-26T11:05:00.000Z'},
];
