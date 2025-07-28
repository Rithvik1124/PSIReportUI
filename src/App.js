import React, { useState } from 'react';

const API_URL = "https://YOUR_BACKEND_DOMAIN/analyze";
const PASSWORD = "secure123"; // 🔐 Set your frontend password

function App() {
  const [auth, setAuth] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [docxBlob, setDocxBlob] = useState(null);

  const handleSubmit = async () => {
    setError("");
    setDocxBlob(null);
    if (!url.startsWith("http")) {
      setError("Please enter a valid URL (must start with http)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (!res.ok) throw new Error("Server Error");

      const data = await res.json();

      const docContent = `
        ${data.advice || "No advice returned."}
      `;

      const blob = new Blob([docContent], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      setDocxBlob(blob);
    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  const downloadDoc = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(docxBlob);
    a.download = "psi_advice.docx";
    a.click();
  };

  if (!auth) {
    return (
      <div className="container">
        <h2>🔒 Enter Access Password</h2>
        <input
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={() => setAuth(inputPassword === PASSWORD)}>Enter</button>
        {inputPassword && inputPassword !== PASSWORD && <p className="error">Invalid password</p>}
      </div>
    );
  }

  return (
    <div className="container">
      <h2>🚀 PSI Report Generator</h2>
      <input
        type="text"
        placeholder="Enter your website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Generate Report"}
      </button>

      {loading && <p className="progress">⏳ Processing...</p>}
      {error && <p className="error">{error}</p>}
      {docxBlob && <button onClick={downloadDoc}>📥 Download Advice</button>}
    </div>
  );
}

export default App;
