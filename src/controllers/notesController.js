import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const notesQuery = Note.find();
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }
  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }
  const totalNotes = await notesQuery.clone().countDocuments();
  const skip = (page - 1) * perPage;
  const notes = await notesQuery.skip(skip).limit(perPage);
  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalPages,
    totalNotes,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const id_param = await Note.findById(req.params.noteId);
  if (!id_param) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(id_param);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const id_param = await Note.findOneAndDelete({ _id: req.params.noteId });
  if (!id_param) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(id_param);
};

export const updateNote = async (req, res) => {
  const id_param = await Note.findOneAndUpdate(
    { _id: req.params.noteId },
    req.body,
    { returnDocument: 'after' },
  );
  if (!id_param) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(id_param);
};
