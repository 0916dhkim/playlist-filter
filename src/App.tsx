import React from 'react';
import Auth from "./Auth";
import Controls from "./Controls";
import Playlists from "./Playlists";
import Tracks from './Tracks';
import './App.css';
import { useSelector } from 'react-redux';
import { ApplicationState } from './store';

function App() {
  const signedIn = useSelector((state: ApplicationState) => state.signedIn);
  const tracks = useSelector((state: ApplicationState) => state.signedIn ? state.tracks : null);
  return (
    <div>
      <h1>Spotify Filter</h1>
      <Auth />
      {signedIn && (
        <div>
          {tracks && tracks.length > 0 && <Controls />}
          <Playlists />
          {tracks && tracks.length > 0 && <Tracks />}
        </div>
      )}
    </div>
  );
}

export default App;
