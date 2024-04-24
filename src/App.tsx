import React, { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

//Address of server
const socket = io("http://localhost:3001");
function App() {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    //Receiving message from server
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
      console.log("Message from client", data);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleMessage = () => {
    if (input.trim()) {
      //Sending message to server
      socket.emit("send_message", input);
      setInput("");
    }
  };

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      //Sending username to server
      socket.emit("register", username);
    }
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <div>
            <h1>Chat Application</h1>
          </div>
          <div className="chat-container">
            <div>
              <div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="user-name"
                />
              </div>
              <div>
                <button onClick={handleUsernameSubmit} className="submit-name">
                  Set Username
                </button>
              </div>
            </div>
            <div>
              <div className="chat-text">
                {messages.map((msg, index) => (
                  <p key={index}>
                    <strong>{msg.username}:</strong> {msg.text}
                  </p>
                ))}
              </div>
              <div className="send-message">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleMessage()}
                  className="user-name"
                />
                <button onClick={handleMessage} className="submit-name">
                  Send
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}

export default App;
