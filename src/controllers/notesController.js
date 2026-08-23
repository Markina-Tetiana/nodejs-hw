import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
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
