import { useState } from "react";

function Interview() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [mode, setMode] = useState("Video");
  const [callLink, setCallLink] = useState(""); // 🔥 NEW

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:8000/interviews/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        candidate_name: name,
        scheduled_time: date, // ✅ FIXED
        mode: mode,
      }),
    });

    const data = await response.json();

    alert("Interview Scheduled!");

    // 🔥 SAVE CALL LINK
    setCallLink(data.call_room);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Schedule Interview</h2>

      <input
        placeholder="Candidate Name"
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="datetime-local"
        onChange={(e) => setDate(e.target.value)}
      />

      <br /><br />

      <select onChange={(e) => setMode(e.target.value)}>
        <option>Video</option>
        <option>Voice</option>
        <option>Chat</option>
      </select>

      <br /><br />

      <button onClick={handleSubmit}>Schedule</button>

      {/* 🔥 SHOW CALL LINK */}
      {callLink && (
        <div style={{ marginTop: "20px" }}>
          <p>Interview Link:</p>

          <button
            onClick={() =>
              (window.location.href = `http://localhost:5173${callLink}`)
            }
            style={{
              padding: "8px 15px",
              backgroundColor: "green",
              color: "white",
              border: "none",
            }}
          >
            Join Call 🎥
          </button>
        </div>
      )}
    </div>
  );
}

export default Interview;