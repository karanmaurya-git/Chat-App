import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", { message });

    setChat((prev) => [...prev, { message, self: true }]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, { message: data.message, self: false }]);
    });

    return () => socket.off("receive_message");
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>💬 Chat App</h2>

      <div style={{ height: "300px", border: "1px solid black", overflowY: "scroll", padding: "10px" }}>
        {chat.map((msg, i) => (
          <p key={i} style={{ textAlign: msg.self ? "right" : "left" }}>
            {msg.message}
          </p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}