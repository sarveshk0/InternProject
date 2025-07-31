import React, { useState, useEffect } from "react";
import { MdOutlineDelete } from "react-icons/md";
import top from "../images/top.png";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");

  // Fetch user data and notes on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/api/dashboard", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (
            response.status === 401 &&
            data.message?.includes("Token is invalid or expired")
          ) {
            console.warn("Token expired. Removing from local storage.");
            localStorage.removeItem("token");
            window.location.href = "/signin";
            return;
          }
          throw new Error(data.message || "Failed to fetch user data");
        }

        setUser(data.user);
        setNotes(data.notes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Delete note
  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/notes/deletenotes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete note");
      }

      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (err) {
      console.error("Delete Note Error:", err.message);
      setError("Failed to delete note");
    }
  };

  // Create note
  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/notes/createnotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title: newNoteTitle }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create note");
      }

      setNotes((prev) => [data.note, ...prev]);
      setNewNoteTitle("");
      setShowNoteForm(false);
    } catch (err) {
      console.error("Create Note Error:", err.message);
      setError("Failed to create note");
    }
  };

  // Sign out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  return (
    <div className="max-w-md mx-auto p-4 font-Inter">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <img src={top} alt="Top Icon" />
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        <button
          onClick={handleSignOut}
          className="text-blue-600 hover:underline text-sm"
        >
          Sign Out
        </button>
      </div>

      {/* Error / Loading */}
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Main Content */}
      {!loading && user && (
        <>
          {/* User Info */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-lg text-left font-bold">Welcome, {user.name}!</h3>
            <p className="text-gray-600 text-left text-sm">Email: {user.email}</p>
          </div>

          {/* Create Note Button */}
          <button
            onClick={() => setShowNoteForm(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mb-4"
          >
            Create Note
          </button>

          {/* Note Form */}
          {showNoteForm && (
            <form onSubmit={handleCreateNote} className="mb-4">
              <input
                type="text"
                placeholder="Enter note title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNoteForm(false);
                    setNewNoteTitle("");
                  }}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Notes */}
          <h3 className="text-md text-left font-semibold mb-2">Notes</h3>
          {notes.length === 0 ? (
            <p className="text-gray-400 text-sm">No notes available.</p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-lg shadow-md p-3 flex justify-between items-center mb-2"
              >
                <span className="text-sm">{note.title}</span>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="text-gray-500 hover:text-red-500 text-xl"
                  title="Delete"
                >
                  <MdOutlineDelete />
                </button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
