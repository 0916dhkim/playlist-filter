import { FormEvent, useState } from "react";
import { registerUser, signIn } from "./firebase";

function App() {
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

  return (
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
    </div>
  );
}

export default App;
