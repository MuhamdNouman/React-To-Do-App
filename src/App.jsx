import React, { useEffect, useRef, useState } from "react";

export default function App() {

  const inputRef = useRef(null); // state to store the current input value

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  }, []); // state to store the list of task

  const [deletedTasks, setDeletedTasks] = useState(()=>{
    const saved = localStorage.getItem("deletedTasks");
    return saved ? JSON.parse(saved) : [];
  },[]); // state to store the deleted items


  useEffect(()=>{
    localStorage.setItem("tasks", JSON.stringify(tasks)), [tasks]
  });

  useEffect(()=>{
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks)), [deletedTasks]
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

  return (
    <>
      <div>
        <h1>Add Tasks</h1>

        <input
          type="Text"
          placeholder="Enter a task"
          autoComplete="new-password"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          ref={inputRef}
        />

        <button onClick={handleAdd} style={{ marginLeft: "10px" }}>
          ➕Add
        </button>

        <ol>
          {tasks
            .filter((t) => !t.completed)
            .map((t) => (
              <li key={t.id}>
                {t.isEditing ? (
                  // EDIT MODE
                  <>
                    <input
                      type="text"
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
                    >
                      💾 Save
                    </button>
                  </>
                ) : (
                  // READ MODE
                  <>
                    <span>{t.task}</span>
                    <button
                      onClick={() => handleDelete(t.id)}
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                    >
                      ❌Delete
                    </button>
                    <button
                      onClick={() => handleComplete(t.id)}
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                    >
                      ✅Complete
                    </button>
                    <button
                      onClick={() => handleEdit(t.id)}
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                    >
                      ✒️Update
                    </button>
                  </>
                )}
              </li>
            ))}
        </ol>
      </div>

      <div>
        <h1>Completed Tasks</h1>
        <ol>
          {tasks
            .filter((t) => t.completed)
            .map(
              (t) =>
                t.completed && (
                  <li key={t.id}>
                    ✅{t.task}
                    <button
                      onClick={() => handleDelete(t.id)}
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                    >
                      ❌Delete
                    </button>
                    <button
                      onClick={() => handleRestore(t.id)}
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                    >
                      🔁Restore
                    </button>
                  </li>
                ),
            )}
        </ol>
      </div>

      <div>
        <h1>Deleted Tasks</h1>
        <ol>
          {deletedTasks.map((t) => (
            <li key={t.id}>
              {t.task}
              <button
                onClick={() => handleRestore(t.id)}
                style={{ marginLeft: "10px", marginTop: "10px" }}
              >
                🔁Restore
              </button>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
