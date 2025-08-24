import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createNote, getNotesByUserId, updateNote, deleteNote } from '../notes';
import { prisma } from '../prisma';

type MockedPrisma = typeof prisma & {
  note: {
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

vi.mock('../prisma', () => ({
  prisma: {
    note: {
      findMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('Notes Service', () => {
  const mockUserId = 'user_123';
  const mockNote = {
    id: 'note_123',
    userId: mockUserId,
    title: 'Test Note',
    content: 'This is a test note',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotesByUserId', () => {
    it('should return notes for a specific user', async () => {
      const mockNotes = [mockNote];
      (prisma as MockedPrisma).note.findMany.mockResolvedValue(mockNotes);

      const result = await getNotesByUserId(mockUserId);

      expect(prisma.note.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual(mockNotes);
    });

    it('should return empty array when user has no notes', async () => {
      (prisma as MockedPrisma).note.findMany.mockResolvedValue([]);

      const result = await getNotesByUserId(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const noteData = { title: 'New Note', content: 'New content' };
      (prisma as MockedPrisma).note.create.mockResolvedValue({ ...mockNote, ...noteData });

      const result = await createNote(mockUserId, noteData);

      expect(prisma.note.create).toHaveBeenCalledWith({
        data: {
          ...noteData,
          userId: mockUserId,
        },
      });
      expect(result.title).toBe(noteData.title);
      expect(result.content).toBe(noteData.content);
    });
  });

  describe('updateNote', () => {
    it('should update an existing note', async () => {
      const updateData = { id: mockNote.id, title: 'Updated Title', content: 'Updated content' };
      (prisma as MockedPrisma).note.findFirst.mockResolvedValue(mockNote);
      (prisma as MockedPrisma).note.update.mockResolvedValue({ ...mockNote, ...updateData });

      const result = await updateNote(mockUserId, updateData);

      expect(prisma.note.findFirst).toHaveBeenCalledWith({
        where: { id: updateData.id, userId: mockUserId },
      });
      expect(prisma.note.update).toHaveBeenCalledWith({
        where: { id: updateData.id },
        data: {
          title: updateData.title,
          content: updateData.content,
        },
      });
      expect(result).toEqual({ ...mockNote, ...updateData });
    });

    it('should throw error when note not found', async () => {
      const updateData = { id: 'nonexistent', title: 'Title', content: 'Content' };
      (prisma as MockedPrisma).note.findFirst.mockResolvedValue(null);

      await expect(updateNote(mockUserId, updateData)).rejects.toThrow('Note not found or access denied');
    });
  });

  describe('deleteNote', () => {
    it('should delete an existing note', async () => {
      (prisma as MockedPrisma).note.findFirst.mockResolvedValue(mockNote);
      (prisma as MockedPrisma).note.delete.mockResolvedValue(mockNote);

      const result = await deleteNote(mockUserId, mockNote.id);

      expect(prisma.note.findFirst).toHaveBeenCalledWith({
        where: { id: mockNote.id, userId: mockUserId },
      });
      expect(prisma.note.delete).toHaveBeenCalledWith({
        where: { id: mockNote.id },
      });
      expect(result).toEqual(mockNote);
    });

    it('should throw error when note not found', async () => {
      (prisma as MockedPrisma).note.findFirst.mockResolvedValue(null);

      await expect(deleteNote(mockUserId, 'nonexistent')).rejects.toThrow('Note not found or access denied');
    });
  });
});