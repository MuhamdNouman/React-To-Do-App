import React, { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const inputRef = useRef(null); // state to store the current input value

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  }, []);

  const [deletedTasks, setDeletedTasks] = useState(() => {
    const saved = localStorage.getItem("deletedTasks");
    return saved ? JSON.parse(saved) : [];
  }, []); // state to store the deleted items

  useEffect(() => {
    (localStorage.setItem("tasks", JSON.stringify(tasks)), [tasks]);
  });

  useEffect(() => {
    (localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks)),
      [deletedTasks]);
  });

  const handleAdd = () => {
    const item = inputRef.current.value.trim(); // Get the current value from the input field and trim whitespace

    if (!item) return;

    const newTask = {
      id: crypto.randomUUID(),
      task: item,
      completed: false,
      isEditing: false,
    };

    setTasks([...tasks, newTask]);
    inputRef.current.value = ""; // Clear input after adding
  };

  const handleDelete = (id) => {
    const taskToDelete = tasks.find((t) => t.id === id); // find the tasks meting the condition

    if (taskToDelete) {
      setDeletedTasks((prevTasks) => [...prevTasks, taskToDelete]);
    }

    // console.log("deleted tasks", deletedTasks);
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
  };

  const handleComplete = (id) => {
    setTasks(
      tasks.map(
        (t) => (t.id === id ? { ...t, completed: !t.completed } : t), // Update its status based on its current status
      ),
    );
  };

  const handleRestore = (id) => {
    setTasks(
      tasks.map(
        (t) => (t.id === id ? { ...t, completed: false } : t), // Update its status to not completed
      ),
    );

    const taskToRestore = deletedTasks.find((t) => t.id === id); // find the tasks meting the condition
    if (taskToRestore) {
      setTasks((prevTasks) => [...prevTasks, taskToRestore]);
    }

    setDeletedTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
  };

  const handleEdit = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === id ? { ...t, isEditing: true } : t)),
    );
  };

  const handleUpdate = (id, newTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id ? { ...t, task: newTask, isEditing: false } : t,
      ),
    );
  };

  const clearAllTasks = () => {
    {
      setTasks([]); // This triggers the useEffect to clear LocalStorage automatically
    }
  };

  const clearTrash = () => {
    setDeletedTasks([]); // This clears the trash state and the trash LocalStorage
  };

  return (
    <>
      <h1 className="app-title">To-Do list</h1>
      <div id="app">
        <div className="card shadow">
          <h2>Add Tasks</h2>
          <div className="input-group">
            <input
              type="text"
              className="input"
              placeholder="Enter a task"
              autoComplete="new-password"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
              ref={inputRef}
            />

            <button onClick={handleAdd}>➕Add</button>

            {tasks.length > 0 && (
              <button onClick={clearAllTasks}>Clear All</button>
            )}
          </div>
          <ol className="task-list">
            {tasks
              .filter((t) => !t.completed)
              .map((t) => (
                <li key={t.id}>
                  {t.isEditing ? (
                    // EDIT MODE
                    <>
                      <input
                        type="text"
                        className="updated-input"
                        defaultValue={t.task}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleUpdate(t.id, e.target.value);
                          if (e.key === "Escape") handleUpdate(t.id, t.task); // Cancel
                        }}
                        autoFocus
                      />
                      <button
                        onClick={(e) =>
                          handleUpdate(t.id, e.target.previousSibling.value)
                        }
                        className="save-button"
                      >
                        💾
                      </button>
                    </>
                  ) : (
                    // READ MODE
                    <>
                      <span className="task-item">{t.task}</span>
                      <div className="action-buttons">
                        <button onClick={() => handleComplete(t.id)}>✅</button>
                        <button onClick={() => handleEdit(t.id)}>✒️</button>
                        <button onClick={() => handleDelete(t.id)}>🗑️</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
          </ol>
        </div>

        <div className="card">
          <h2>Completed Tasks</h2>
          <ol className="completed-task-list">
            {tasks
              .filter((t) => t.completed)
              .map(
                (t) =>
                  t.completed && (
                    <li key={t.id}>
                      ✅{t.task}
                      <div className="action-buttons">
                        <button onClick={() => handleDelete(t.id)}>🗑️</button>
                        <button onClick={() => handleRestore(t.id)}>🔁</button>
                      </div>
                    </li>
                  ),
              )}
          </ol>
        </div>

        <div className="card shadow">
          <h2>Deleted Tasks</h2>
          <ol className="completed-task-list">
            {deletedTasks.map((t) => (
              <li key={t.id}>
                {t.task}
                <div className="action-buttons">
                  <button onClick={() => handleRestore(t.id)}>🔁</button>
                </div>
              </li>
            ))}
          </ol>
          {deletedTasks.length > 0 && (
            <button onClick={clearTrash} className="empty-trash-button">
              🗑️ Empty Trash
            </button>
          )}
        </div>
      </div>
    </>
  );
}
