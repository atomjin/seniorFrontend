import React, { useEffect, useState } from "react";
import API_BASE_URL from "./config";

function App() {
  let [accessToken] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let ast = params.get("access_token");
    if (ast) accessToken = params.get("access_token");
  }, []);

  const copyToClipboard = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken).then(() => {
        alert("WebSocket API Token copied!");
      });
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Streamlabs Authentication</h1>

      <a href={`https://streamlabs.com/api/v2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=donations.read+donations.create`}>
        <button style={{ padding: "10px", margin: "10px", background: "green", color: "white" }}>
          Login with Streamlabs
        </button>
      </a>

      {accessToken && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>WebSocket API Token:</strong></p>
          <input type="text" value={accessToken} readOnly style={{ width: "400px" }} />
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
