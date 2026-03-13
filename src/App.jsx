import React, { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const inputRef = useRef(null);

  // Task state
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = () => {
    const item = inputRef.current.value.trim();
    if (!item) return;

    const newTask = {
      id: crypto.randomUUID(),
      task: item,
      completed: false,
      isEditing: false,
      isDeleted: false,
    };

    setTasks([...tasks, newTask]);
    inputRef.current.value = "";
  };

  const toggleStatus = (id, key) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, [key]: !t[key] } : t)));
  };

  const handleUpdate = (id, newTaskText) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id ? { ...t, task: newTaskText, isEditing: false } : t,
      ),
    );
  };

  const handleRestore = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, isDeleted: false } : t)));
  };

  const handleDelete = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, isDeleted: true } : t)));
  };

  const clearAllTasks = () => {
    if (confirm("Are you sure you want to delete your all list items"))
      setTasks(tasks.map((t) => ({ ...t, isDeleted: true })));
  };

  const clearTrash = () => {
    if (alert(
        "This will permanently delete all items in the trash. Are you sure?",
        )
    ){
      setTasks(tasks.filter((t) => !t.isDeleted));
    }
  };

  return (
    <>
      <h1 className="app-title">To-Do list</h1>
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
        <button onClick={handleAdd}> ➕ Add </button>
        {/* {tasks.filter((t) => !t.isDeleted).length > 0 && (
          <button onClick={clearAllTasks}>Clear All</button>
        )} */}
      </div>
      <div id="app-container">
        {/* ADD TASKS SECTION */}
        <div className="card">
          <h2>Add Tasks</h2>
          <ol className="task-list">
            {tasks
              .filter((t) => !t.completed && !t.isDeleted) // Only show active, non-deleted
              .map((t) => (
                <li key={t.id}>
                  {t.isEditing ? (
                    <>
                      <input
                        type="text"
                        className="updated-input"
                        defaultValue={t.task}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleUpdate(t.id, e.target.value);
                          if (e.key === "Escape") handleUpdate(t.id, t.task);
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
                    <>
                      <span className="task-item">{t.task}</span>
                      <div className="action-buttons">
                        <button onClick={() => toggleStatus(t.id, "completed")}>
                          ✅
                        </button>
                        <button onClick={() => toggleStatus(t.id, "isEditing")}>
                          ✒️
                        </button>
                        <button onClick={() => handleDelete(t.id)}>🗑️</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
          </ol>
        </div>
        <div className="card">
          <h2>Review Tasks</h2>
        </div>

        <div className="card">
          <h2>Progress Tasks</h2>
        </div>

        {/* COMPLETED TASKS SECTION */}
        <div className="card">
          <h2>Completed Tasks</h2>
          <ol className="task-list">
            {tasks
              .filter((t) => t.completed && !t.isDeleted) // Only show completed, non-deleted
              .map((t) => (
                <li key={t.id}>
                  ✅{t.task}
                  <div className="action-buttons">
                    <button onClick={() => handleDelete(t.id)}>🗑️</button>
                    <button onClick={() => toggleStatus(t.id, "completed")}>
                      🔁
                    </button>
                  </div>
                </li>
              ))}
          </ol>
        </div>

        {/* DELETED TASKS SECTION */}
        <div className="card">
          <h2>Deleted Tasks</h2>
          <ol className="task-list">
            {tasks
              .filter((t) => t.isDeleted) // Show only items marked as deleted
              .map((t) => (
                <li key={t.id}>
                  <span>{t.task}</span>
                  <div className="action-buttons">
                    <button onClick={() => handleRestore(t.id)}>🔁</button>
                  </div>
                </li>
              ))}
          </ol>
          {tasks.filter((t) => t.isDeleted).length > 0 && (
            <button onClick={clearTrash} className="empty-trash-button">
              🗑️ Empty Trash
            </button>
          )}
        </div>
      </div>
    </>
  );
}
