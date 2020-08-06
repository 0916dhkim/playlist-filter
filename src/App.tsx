import React from 'react';
import Auth from "./components/Auth/Auth";
import Controls from "./components/Controls/Controls";
import Playlists from "./components/Playlists/Playlists";
import Tracks from './components/Tracks/Tracks';
import { useSelector } from 'react-redux';
import { ApplicationState, PersonalPageState } from './state';

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
  switch (page) {
    case "landing":
      return (
        <div>
          <h1>Spotify Filter</h1>
          <Auth />
        </div>
      );
    case "personal":
      return (
        <div>
          <h1>Spotify Filter</h1>
          <Auth />
          <SignedInApp />
        </div>
      );
  }
}

export default App;
