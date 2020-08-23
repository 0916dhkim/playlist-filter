import { signIn, signOut } from "../../auth";
import { useDispatch, useSelector } from "react-redux";

import { ApplicationDispatch } from "../../store";
import { ApplicationState } from "../../state";
import { Button } from "@material-ui/core";
import React from "react";

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
        ? <Button
            variant={"outlined"}
            color={"primary"}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        : <Button
            variant={"contained"}
            color={"primary"}
            onClick={signIn}
          >
            Sign In With Spotify
          </Button>
      }
    </div>
  );
}