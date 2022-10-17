import { FormEvent, ReactElement, useState } from "react";

import { Link } from "react-router-dom";
import { registerUser } from "../firebase";

export default function Register(): ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    registerUser(email, password);
  };

  return (
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
      <p>
        Already a user? <Link to="/signin">Login</Link>
      </p>
    </form>
  );
}
