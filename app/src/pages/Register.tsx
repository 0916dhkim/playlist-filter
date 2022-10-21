import { FormEvent, ReactElement, useState } from "react";

import Button from "../components/Button";
import { Link } from "react-router-dom";
import { StackList } from "../components/StackList";
import StackListItem from "../components/StackListItem";
import TextInput from "../components/TextInput";
import { registerUser } from "../firebase";
import { sprinkles } from "../sprinkles.css";

export default function Register(): ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    registerUser(email, password);
  };

  return (
    <form
      onSubmit={handleRegister}
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
        Make Your Account <i>👋</i>
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
        Register
      </Button>
      <p>
        Already a user? <Link to="/signin">Login</Link>
      </p>
    </form>
  );
}
