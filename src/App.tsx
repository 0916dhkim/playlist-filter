import { ApplicationState, PersonalPageState } from './state';
import React, { useEffect } from 'react';
import { getSession, handleAuthRedirect } from "./auth";
import { useDispatch, useSelector } from 'react-redux';

import { ApplicationDispatch } from './store';
import { CircularProgress } from "@material-ui/core";
import Controls from "./components/Controls/Controls";
import { ExportPage } from "./components/ExportPage/ExportPage";
import { Login } from "./components/Login/Login";
import Playlists from "./components/Playlists/Playlists";
import Tracks from './components/Tracks/Tracks';
import style from './App.module.scss';

function useAuth() {
  const dispatch = useDispatch<ApplicationDispatch>();
  useEffect(() => {
    handleAuthRedirect();

    const session = getSession();
    if (session) {
      dispatch({
        type: "SIGN_IN",
        value: session
      });
    }
  }, [dispatch]);
}

function LandingPage() {
  return (
    <div>
      <h1>Spotify Filter</h1>
      <Login />
    </div>
  );
}

function SignedInApp() {
  const tracks = useSelector((state: PersonalPageState) => state.tracks);
  const loadingTracks = useSelector((state: PersonalPageState) => state.loadingTracks);
  return (
    <div>
      <div className={style.header}>
        <h1 className={style.title}>Spotify Filter</h1>
        <Login />
      </div>
      <div>
        {tracks.length > 0 && <Controls />}
        <Playlists />
        {loadingTracks
          ? <CircularProgress />
          : <Tracks />
        }
      </div>
    </div>
  );
}

function App() {
  const page = useSelector((state: ApplicationState) => state.page);

  useAuth();

  switch (page) {
    case "landing":
      return <LandingPage />;
    case "personal":
      return <SignedInApp />;
    case "export":
      return <ExportPage />;
  }
}

export default App;
