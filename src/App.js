import React, { useEffect, useState } from "react";
import { API_BASE_URL, CLIENT_ID, REDIRECT_URI, WEBSOCKET_URL } from "./config";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socketToken, setSocketToken] = useState(null);
  const [error, setError] = useState("");
  const [donations, setDonations] = useState([]);

  // ✅ Check login status
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/status`)
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(data.loggedIn))
      .catch((err) => {
        console.error("Login status fetch failed:", err);
        setError("Failed to check login status.");
      });
  }, []);

  // ✅ Connect to WebSocket donation stream
  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => console.log("🔌 Connected to WebSocket");
    socket.onmessage = (event) => {
      const donation = JSON.parse(event.data);
      console.log("🎁 Donation received:", donation);
      setDonations((prev) => [...prev, donation]);
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);
    socket.onclose = () => console.log("❎ WebSocket disconnected");

    return () => socket.close();
  }, []);

  const fetchSocketToken = () => {
    fetch(`${API_BASE_URL}/api/socket_token`)
      .then((res) => res.json())
      .then((data) => {
        if (data.socket_token) setSocketToken(data.socket_token);
        else setError("Failed to retrieve WebSocket token.");
      })
      .catch((err) => {
        console.error("Token fetch error:", err);
        setError("Could not retrieve token.");
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(socketToken).then(() => {
      alert("WebSocket Token copied!");
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Streamlabs Authentication</h1>
      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {isLoggedIn ? (
        <p style={{ color: "green" }}>✅ You are logged in!</p>
      ) : (
        <p style={{ color: "red" }}>❌ Not logged in.</p>
      )}

      {/* ✅ Login Button */}
      <a
        href={`https://streamlabs.com/api/v2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=donations.read+donations.create`}
      >
        <button style={{ padding: "10px", margin: "10px", background: "green", color: "white" }}>
          Login with Streamlabs
        </button>
      </a>

      {/* ✅ Token Button */}
      <button
        onClick={fetchSocketToken}
        disabled={!isLoggedIn}
        style={{ padding: "10px", margin: "10px", background: isLoggedIn ? "blue" : "gray", color: "white" }}
      >
        Get WebSocket API Token
      </button>

      {/* ✅ Token Display */}
      {socketToken && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>WebSocket Token:</strong></p>
          <input type="text" value={socketToken} readOnly style={{ width: "400px" }} />
          <button
            onClick={copyToClipboard}
            style={{ marginLeft: "10px", padding: "5px", background: "black", color: "white" }}
          >
            Copy
          </button>
        </div>
      )}

      {/* ✅ Live Donations */}
      {donations.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2>Live Donations</h2>
          <ul>
            {donations.map((d, index) => (
              <li key={index}>
                💰 <strong>{d.name}</strong>: {d.amount} {d.currency} – {d.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
