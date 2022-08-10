import { FormEvent, ReactElement, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signIn } from "../firebase";
import useFirebaseAuth from "../hooks/useFirebaseAuth";

export default function SignIn(): ReactElement {
  const user = useFirebaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    signIn(email, password);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
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
      <p>
        Not a user yet? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
