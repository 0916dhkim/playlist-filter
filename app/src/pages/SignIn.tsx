import { FormEvent, ReactElement, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { guestSignIn, signIn, useFirebaseAuthState } from "../firebase";

import Button from "../components/Button";
import { StackList } from "../components/StackList";
import StackListItem from "../components/StackListItem";
import TextInput from "../components/TextInput";
import { sprinkles } from "../sprinkles.css";

export default function SignIn(): ReactElement {
  const hasAuth = useFirebaseAuthState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    signIn(email, password);
  };

  useEffect(() => {
    if (hasAuth) {
      navigate("/unconnected");
    }
  }, [hasAuth]);

  return (
    <form
      onSubmit={handleSignIn}
      className={sprinkles({
        boxSizing: "border-box",
        minHeight: "screen",
        display: "flex",
        flexDirection: "column",
        gap: "lg",
        paddingY: "xxxl",
        paddingX: "xxl",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <h2>
        <i>🖭</i> Spotify Filter <i>🎶</i>
      </h2>
      <StackList>
        <StackListItem icon="✉️">
          <TextInput
            type="email"
            name="email"
            placeholder="Email"
            variant="borderless"
            value={email}
            className={sprinkles({ width: "full" })}
            onChange={(e) => setEmail(e.target.value)}
          />
        </StackListItem>
        <StackListItem icon="🔒">
          <TextInput
            type="password"
            name="password"
            placeholder="Password"
            variant="borderless"
            value={password}
            className={sprinkles({ width: "full" })}
            onChange={(e) => setPassword(e.target.value)}
          />
        </StackListItem>
      </StackList>
      <Button
        variant="primary"
        className={sprinkles({ minWidth: { mobile: "1/2", tablet: "1/4" } })}
      >
        Login
      </Button>
      <Button
        type="button"
        className={sprinkles({ minWidth: { mobile: "1/2", tablet: "1/4" } })}
        onClick={() => guestSignIn()}
      >
        Guest Login
      </Button>
      <p>
        Not a user yet? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
