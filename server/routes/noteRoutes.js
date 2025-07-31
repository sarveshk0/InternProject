const express = require('express');
const router = express.Router();

const {  createNote, deleteNote } = require('../controller/note.js');   
const { auth } = require('../middleware/Auth.js');


router.post('/createnotes', auth, createNote); // Create a new note
router.delete('/deletenotes/:id', auth, deleteNote); // Delete a note by ID

module.exports = router;