import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  content: z.string().min(1, 'Content is required').max(10000, 'Content must be less than 10000 characters'),
});

export const updateNoteSchema = z.object({
  id: z.string().min(1, 'Note ID is required'),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  content: z.string().min(1, 'Content is required').max(10000, 'Content must be less than 10000 characters'),
});

export const deleteNoteSchema = z.object({
  id: z.string().min(1, 'Note ID is required'),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>;