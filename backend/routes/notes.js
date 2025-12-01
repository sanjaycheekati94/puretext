import express from 'express';
import Note from '../models/Note.js';
import { hashDeleteToken, validateDeleteToken } from '../utils/crypto.js';

const router = express.Router();

/**
 * GET /api/note/:name
 * Check if a note exists and return its encrypted data
 */
router.get('/note/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    // Validate note name
    if (!name || name.length > 100) {
      return res.status(400).json({ error: 'Invalid note name' });
    }

    const note = await Note.findById(name);
    
    if (!note) {
      return res.json({ exists: false });
    }

    return res.json({
      exists: true,
      data: note.data,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    });
  } catch (error) {
    console.error('Error fetching note:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/note/:name
 * Create or update a note with encrypted data
 */
router.post('/note/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { data, deleteTokenHash } = req.body;

    // Validate note name
    if (!name || name.length > 100) {
      return res.status(400).json({ error: 'Invalid note name' });
    }

    // Validate encrypted data structure
    if (!data || !data.salt || !data.iv || !data.ciphertext) {
      return res.status(400).json({ error: 'Invalid encrypted data' });
    }

    // Check if note exists
    const existingNote = await Note.findById(name);

    if (existingNote) {
      // Update existing note
      existingNote.data = data;
      existingNote.updatedAt = new Date();
      await existingNote.save();

      return res.json({
        success: true,
        message: 'Note updated',
        updatedAt: existingNote.updatedAt
      });
    } else {
      // Create new note
      if (!deleteTokenHash) {
        return res.status(400).json({ error: 'Delete token hash required for new notes' });
      }

      const newNote = new Note({
        _id: name,
        data,
        deleteTokenHash
      });

      await newNote.save();

      return res.json({
        success: true,
        message: 'Note created',
        createdAt: newNote.createdAt,
        updatedAt: newNote.updatedAt
      });
    }
  } catch (error) {
    console.error('Error saving note:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * DELETE /api/note/:name
 * Delete a note if the delete token is valid
 */
router.delete('/note/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { deleteToken } = req.body;

    // Validate inputs
    if (!name || !deleteToken) {
      return res.status(400).json({ error: 'Note name and delete token required' });
    }

    const note = await Note.findById(name);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Validate delete token
    const isValid = validateDeleteToken(deleteToken, note.deleteTokenHash);

    if (!isValid) {
      return res.status(403).json({ error: 'Invalid delete token' });
    }

    // Delete the note
    await Note.findByIdAndDelete(name);

    return res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
