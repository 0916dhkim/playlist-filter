import React, { useEffect } from 'react';
import { Login } from "./components/Login/Login";
import Controls from "./components/Controls/Controls";
import Playlists from "./components/Playlists/Playlists";
import Tracks from './components/Tracks/Tracks';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState, PersonalPageState } from './state';
import { handleAuthRedirect, getSession } from "./auth";
import { ApplicationDispatch } from './store';

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

function SignedInApp() {
  const tracks = useSelector((state: PersonalPageState) => state.tracks);
  const loadingTracks = useSelector((state: PersonalPageState) => state.loadingTracks);
  return (
    <div>
      {tracks.length > 0 && <Controls />}
      <Playlists />
      {loadingTracks
        ? <p>Loading...</p>
        : <Tracks />
      }
    </div>
  );
}

function App() {
  const page = useSelector((state: ApplicationState) => state.page);

  useAuth();

  switch (page) {
    case "landing":
      return (
        <div>
          <h1>Spotify Filter</h1>
          <Login />
        </div>
      );
    case "personal":
      return (
        <div>
          <h1>Spotify Filter</h1>
          <Login />
          <SignedInApp />
        </div>
      );
  }
}

export default App;
