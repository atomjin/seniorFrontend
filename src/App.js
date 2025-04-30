import React, { useEffect, useState } from "react";
import API_BASE_URL from "./config";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socketToken, setSocketToken] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/status`)
      .then((response) => response.json())
      .then((data) => {
        setIsLoggedIn(data.loggedIn);
      })
      .catch((error) => {
        console.error("Error fetching login status:", error);
        setError("Failed to fetch login status.");
      });
  }, []);

  const fetchSocketToken = () => {
    fetch(`${API_BASE_URL}/api/socket_token`)
      .then((response) => response.json())
      .then((data) => {
        if (data.socket_token) {
          setSocketToken(data.socket_token);
        } else {
          setError("Failed to retrieve WebSocket token.");
        }
      })
      .catch((error) => {
        console.error("Error fetching WebSocket token:", error);
        setError("Error retrieving WebSocket token.");
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(socketToken).then(() => {
      alert("WebSocket API Token copied!");
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Streamlabs Authentication</h1>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {isLoggedIn ? (
        <p style={{ color: "green" }}>✅ You are logged in!</p>
      ) : (
        <p style={{ color: "red" }}>❌ You are NOT logged in. Please log in.</p>
      )}

<a href={`https://streamlabs.com/api/v2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=donations.read+donations.create`}>
  <button>Login with Streamlabs</button>
</a>

      <button
        onClick={fetchSocketToken}
        disabled={!isLoggedIn}
        style={{ padding: "10px", margin: "10px", background: isLoggedIn ? "blue" : "gray", color: "white" }}
      >
        Get WebSocket API Token
      </button>

      {socketToken && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>WebSocket API Token:</strong></p>
          <input type="text" value={socketToken} readOnly style={{ width: "400px" }} />
          <button
            onClick={copyToClipboard}
            style={{ marginLeft: "10px", padding: "5px", background: "black", color: "white" }}
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
