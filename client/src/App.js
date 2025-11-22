import React, { useState, useRef, useEffect } from "react";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("https://stack-proj-10.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const botMsg = { role: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Network error!" },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="app-wrapper">
      <div className="top-bar">LUNAR</div>

      {/* Center welcome */}
      {messages.length === 0 && !loading ? (
        <div className="center-screen">
          <div className="welcome-icon">💬</div>
          <div className="welcome-text">Start a new chat</div>
        </div>
      ) : (
        <div className="messages-box">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>
              <div className="bubble">{msg.text}</div>
            </div>
          ))}

          {loading && (
            <div className="typing">LUNAR is typing...</div>
          )}

          <div ref={bottomRef}></div>
        </div>
      )}

      <div className="input-area">
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="send-btn" onClick={sendMessage}>↗</button>
      </div>
    </div>
  );
}
