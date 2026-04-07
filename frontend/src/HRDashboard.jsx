import { useEffect, useState } from "react";

function HRDashboard() {
  const [tasks, setTasks] = useState([]);
  const [interviews, setInterviews] = useState([]);

  // 🔥 TASK
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("Employer");
  const [priority, setPriority] = useState("Medium");

  // 🔥 INTERVIEW (NEW)
  const [candidate, setCandidate] = useState("");
  const [date, setDate] = useState("");
  const [mode, setMode] = useState("Video");

  const fetchData = () => {
    fetch("http://localhost:8000/tasks/")
      .then((res) => res.json())
      .then((data) => setTasks(data));

    fetch("http://localhost:8000/interviews/")
      .then((res) => res.json())
      .then((data) => setInterviews(data));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 CREATE TASK
  const createTask = async () => {
    await fetch("http://localhost:8000/tasks/", {
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

  // 🔥 CREATE INTERVIEW (MAIN FIX)
  const createInterview = async () => {
    if (!candidate || !date) {
      alert("Enter all fields");
      return;
    }

    await fetch("http://localhost:8000/interviews/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        candidate_name: candidate,
        scheduled_time: date,
        mode: mode,
      }),
    });

    alert("Interview Scheduled & Email Sent ✅");

    setCandidate("");
    setDate("");

    fetchData();
  };

  // 🔥 UPDATE TASK
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:8000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchData();
  };

  const logout = () => {
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>HR Dashboard 👨‍💼</h2>

      <button onClick={logout}>Logout</button>

      {/* 🔥 CREATE TASK */}
      <h3>Create Task</h3>
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select onChange={(e) => setAssignedTo(e.target.value)}>
        <option value="Employer">Employer</option>
        <option value="HR">HR</option>
      </select>

      <select onChange={(e) => setPriority(e.target.value)}>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <button onClick={createTask}>Create Task</button>

      <hr />

      {/* 🔥 CREATE INTERVIEW (NEW UI) */}
      <h3>Schedule Interview 🎥</h3>

      <input
        placeholder="Candidate Name"
        value={candidate}
        onChange={(e) => setCandidate(e.target.value)}
      />

      <br /><br />

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <br /><br />

      <select onChange={(e) => setMode(e.target.value)}>
        <option>Video</option>
        <option>Voice</option>
        <option>Chat</option>
      </select>

      <br /><br />

      <button onClick={createInterview}>
        Schedule Interview
      </button>

      <hr />

      {/* 🔥 TASKS */}
      <h3>Your Tasks</h3>
      {tasks
        .filter((t) => t.assigned_to === "HR")
        .map((task) => (
          <div key={task.id}>
            <h4>{task.title}</h4>
            <p>Status: {task.status}</p>

            <button onClick={() => updateStatus(task.id, "In Progress")}>
              Start
            </button>

            <button onClick={() => updateStatus(task.id, "Completed")}>
              Complete
            </button>
          </div>
        ))}

      <hr />

      {/* 🔥 INTERVIEW LIST */}
      <h3>Interview Notifications 🔔</h3>

      {interviews.map((int) => (
        <div key={int.id}>
          <p>Candidate: {int.candidate_name}</p>
          <p>Time: {new Date(int.scheduled_time).toLocaleString()}</p>

          <button
            onClick={() =>
              (window.location.href = `/call-room/${int.id}`)
            }
          >
            Join Call 🎥
          </button>
        </div>
      ))}
    </div>
  );
}

export default HRDashboard;