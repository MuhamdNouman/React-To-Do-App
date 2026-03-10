import React, { useRef, useState } from "react";

export default function App() {
  const inputRef = useRef(null); // state to store the current input value
  const [tasks, setTasks] = useState([]); // state to store the list of task
  const [deletedTasks, setDeletedTasks] = useState([]); // state to store the deleted items

  const handleAdd = () => {
    const item = inputRef.current.value.trim(); // Get the current value from the input field and trim whitespace

    if (!item) return;

    const newTask = {
      id: crypto.randomUUID(),
      task: item,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    console.log("Task added:", newTask);
    console.log("Current tasks:", [...tasks, newTask]);

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
    
    const taskToRestore = deletedTasks.find((t) =>t.id === id); // find the tasks meting the condition
    if(taskToRestore){
     setTasks((prevTasks) => [
      ...prevTasks, { ...taskToRestore, completed: false }
    ])
    }
    
     setDeletedTasks((prevTasks) => prevTasks.filter((t) => t.id !== id))
  };

  return (
    <>
      <div>
        <h1>Add Tasks</h1>

        <input type="Text" placeholder="Enter a task" ref={inputRef} />

        <button onClick={handleAdd} style={{ marginLeft: "10px" }}>
          ➕Add
        </button>

        <ol>
          {tasks.map((t) => (
            <li key={t.id}>
              {/* 1. Use conditional styling for the text */}
              <span
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                  color: t.completed ? "gray" : "black",
                }}
              >
                {t.task}
              </span>
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
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h1>Completed Tasks</h1>
        <ol>
          {tasks.map(
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
