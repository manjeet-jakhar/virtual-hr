import { useEffect, useState } from "react";

function EmployerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [interviews, setInterviews] = useState([]); // 🔥 NEW
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("HR");
  const [priority, setPriority] = useState("Medium");

  // 🔥 Fetch data
  const fetchData = () => {
    fetch("https://virtual-hr-backend.onrender.com/tasks/")
      .then((res) => res.json())
      .then((data) => setTasks(data));

    fetch("https://virtual-hr-backend.onrender.com/activities/")
      .then((res) => res.json())
      .then((data) => setActivities(data));

    fetch("https://virtual-hr-backend.onrender.com/interviews/")
      .then((res) => res.json())
      .then((data) => setInterviews(data));
  };

  useEffect(() => {
    fetchData();

    // 🔥 Auto refresh every 5 sec
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 Logout
  const logout = () => {
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  // 🔥 CREATE TASK
  const createTask = async () => {
    if (!title) {
      alert("Enter task title");
      return;
    }

    await fetch("https://virtual-hr-backend.onrender.com/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        status: "Pending",
        assigned_to: assignedTo,
        priority,
      }),
    });

    setTitle("");
    fetchData();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Employer Dashboard 👨‍💼</h2>

      {/* 🔥 Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={logout}
          style={{
            marginRight: "10px",
            padding: "8px 15px",
            backgroundColor: "red",
            color: "white",
            border: "none",
          }}
        >
          Logout
        </button>

        <button
          onClick={() => (window.location.href = "/interview")}
          style={{
            padding: "8px 15px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
          }}
        >
          Schedule Interview
        </button>
      </div>

      {/* 🔥 CREATE TASK */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: "10px", padding: "6px" }}
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="HR">HR</option>
          <option value="Employer">Employer</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button onClick={createTask}>Create Task</button>
      </div>

      {/* 🔥 Summary */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Total: {tasks.length}</h3>
        <h3>Pending: {tasks.filter(t => t.status === "Pending").length}</h3>
        <h3>In Progress: {tasks.filter(t => t.status === "In Progress").length}</h3>
        <h3>Completed: {tasks.filter(t => t.status === "Completed").length}</h3>
      </div>

      <hr />

      {/* 🔥 TASKS */}
      <h3>Your Tasks</h3>
      {tasks
        .filter(task => task.assigned_to === "Employer")
        .map((task) => (
          <div key={task.id}>
            <h4>{task.title}</h4>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
          </div>
        ))}

      <hr />

      {/* 🔥 INTERVIEW NOTIFICATION */}
      <h3>Interview Notifications 🔔</h3>

      {interviews.length === 0 && <p>No interviews scheduled</p>}

      {interviews.map((int) => (
        <div
          key={int.id}
          style={{
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p><b>Candidate:</b> {int.candidate_name}</p>
          <p><b>Mode:</b> {int.mode}</p>
          <p>
            <b>Time:</b>{" "}
            {new Date(int.scheduled_time).toLocaleString()}
          </p>

          {/* 🔥 JOIN CALL */}
          <button
            onClick={() =>
              (window.location.href = `/call-room/${int.id}`)
            }
            style={{
              padding: "6px 12px",
              backgroundColor: "green",
              color: "white",
              border: "none",
            }}
          >
            Join Interview 🎥
          </button>
        </div>
      ))}

      <hr />

      {/* 🔥 Activity Feed */}
      <h3>Activity Feed</h3>
      <ul>
        {activities.map((a, i) => (
          <li key={i}>{a.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default EmployerDashboard;