import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../state";
import { ApplicationDispatch } from "../../store";
import { signIn, signOut } from "../../auth";

export function Login() {
  const session = useSelector((state: ApplicationState) => state.session);
  const dispatch = useDispatch<ApplicationDispatch>();

  function handleSignOut() {
    signOut();
    dispatch({ type: "SIGN_OUT" });
  }

  return (
    <div>
      {session
        ? <button onClick={handleSignOut}>Sign Out</button>
        : <button onClick={signIn}>Sign In</button>
      }
    </div>
  );
}