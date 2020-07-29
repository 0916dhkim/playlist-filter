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
  return (
    <div>
      <h1>Spotify Filter</h1>
      <Auth />
      {signedIn && (
        <div>
          <Controls />
          <Playlists />
          <Tracks />
        </div>
      )}
    </div>
  );
}

export default App;
