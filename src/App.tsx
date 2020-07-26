import React from 'react';
import Auth from "./Auth";
import Playlists from "./Playlists";
import './App.css';
import { useSelector } from 'react-redux';
import { ApplicationState } from './store';

function App() {
  const credentials = useSelector((state: ApplicationState) => state.credentials);
  return (
    <div>
      <h1>Spotify Filter</h1>
      <Auth />
      {credentials && <Playlists />}
    </div>
  );
}

export default App;
