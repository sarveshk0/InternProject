// controller/note.js
const Note = require('../model/Note.js'); // Adjust path as needed

exports.createNote = async (req, res) => {
  try {
    const { title="untitled Note" } = req.body;

    console.log("Decoded user:", req.user); // 🐞 Debug

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newNote = new Note({
      title,
      createdAt: new Date(),
      user: req.user, // ✅ Use userId from decoded token
    });

    await newNote.save();

    res.status(201).json({
      message: "Note created successfully",
      note: newNote,
      noteid: newNote._id,
    });
  } catch (error) {
    console.error("Create Note Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user;

    const note = await Note.findOne({ _id: noteId, user: userId });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found or unauthorized" });
    }

    await note.deleteOne();

    res.status(200).json({ success: true, message: "Note deleted successfully", noteId });
  } catch (error) {
    console.error("Delete Note Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

