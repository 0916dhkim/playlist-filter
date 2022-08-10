import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FormEvent, useState } from "react";
import { registerUser, signIn } from "./firebase";

import OAuthCallback from "./pages/OAuthCallback";
import useFirebaseAuth from "./hooks/useFirebaseAuth";

function App() {
  const user = useFirebaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    registerUser(email, password);
  };

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    signIn(email, password);
  };

  const handleSpotify = async () => {
    if (user == null) {
      throw new Error("User is not logged in");
    }
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/spotify-login-url`,
      {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      }
    );
    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <BrowserRouter>
      <div>
        <form onSubmit={handleRegister}>
          <h1>Register</h1>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button>Register</button>
        </form>
        <form onSubmit={handleSignIn}>
          <h1>Login</h1>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button>Login</button>
        </form>
        <button onClick={handleSpotify}>Connect Spotify</button>
        <Routes>
          <Route path="/callback" element={<OAuthCallback />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
