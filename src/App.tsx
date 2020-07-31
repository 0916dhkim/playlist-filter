import React from 'react';
import Auth from "./Auth";
import Controls from "./Controls";
import Playlists from "./Playlists";
import Tracks from './Tracks';
import './App.css';
import { useSelector } from 'react-redux';
import { ApplicationState, SignedInState } from './store';

function SignedInApp() {
  const tracks = useSelector((state: SignedInState) => state.tracks);
  const loadingTracks = useSelector((state: SignedInState) => state.loadingTracks);
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
  const signedIn = useSelector((state: ApplicationState) => state.signedIn);
  return (
    <div>
      <h1>Spotify Filter</h1>
      <Auth />
      {signedIn && <SignedInApp />}
    </div>
  );
}

export default App;
