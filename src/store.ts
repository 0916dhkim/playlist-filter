import { createStore } from "redux";
import { Dispatch } from "react";
import {
  Playlist,
  FullTrack,
  AudioFeatures,
  AudioFeatureKey
} from "./spotify_types";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type TrackInfo = Omit<FullTrack, "type"> & Omit<AudioFeatures, "type">;

export type SignedOutState = {
  signedIn: false
};

export type AudioFeatureRange = {
  [key in AudioFeatureKey]: [number, number]
};

export type SignedInState = {
  signedIn: true
  accessToken: string,
  accessTokenExpiry: number,
  refreshToken: string,
  playlists: ReadonlyArray<Playlist>,
  selectedPlaylistId?: string,
  loadingTracks: boolean,
  tracks: ReadonlyArray<TrackInfo>,
  audioFeatureRange: AudioFeatureRange
};

export type ApplicationState = SignedInState | SignedOutState;

type Action = {
  type: "SIGN_IN",
  value: {
    accessToken: string,
    accessTokenExpiry: number,
    refreshToken: string
  }
}
| {
  type: "SIGN_OUT"
}
| {
  type: "SET_PLAYLISTS",
  value: ReadonlyArray<Playlist>
}
| {
  type: "START_FETCHING_TRACKS"
  playlistId: string
}
| {
  type: "SET_TRACKS",
  value: ReadonlyArray<TrackInfo>
}
| {
  type: "SET_AUDIO_FEATURE_MIN",
  feature: AudioFeatureKey,
  value: number
}
| {
  type: "SET_AUDIO_FEATURE_MAX",
  feature: AudioFeatureKey,
  value: number
}

const INITIAL_STATE: SignedOutState = {
  signedIn: false
};

function signedInReducer(state: SignedInState, action: Action): ApplicationState {
  switch (action.type) {
    case "SIGN_OUT":
      return { signedIn: false };
    case "SET_PLAYLISTS":
      return {
        ...state,
        playlists: action.value
      };
    case "START_FETCHING_TRACKS":
      return {
        ...state,
        selectedPlaylistId: action.playlistId,
        loadingTracks: true
      };
    case "SET_TRACKS":
      return {
        ...state,
        tracks: action.value,
        loadingTracks: false
      };
    case "SET_AUDIO_FEATURE_MIN":
      return {
        ...state,
        audioFeatureRange: {
          ...state.audioFeatureRange,
          [action.feature]: [action.value, state.audioFeatureRange[action.feature][1]]
        }
      }
    case "SET_AUDIO_FEATURE_MAX":
      return {
        ...state,
        audioFeatureRange: {
          ...state.audioFeatureRange,
          [action.feature]: [state.audioFeatureRange[action.feature][0], action.value]
        }
      }
    default:
      return state;
  }
}

function signedOutReducer(state: SignedOutState, action: Action): ApplicationState {
  switch (action.type) {
    case "SIGN_IN":
      return {
        signedIn: true,
        playlists: [],
        loadingTracks: false,
        tracks: [],
        audioFeatureRange: {
          duration_ms: [0, Infinity],
          key: [0, Infinity],
          mode: [0, 1],
          time_signature: [0, Infinity],
          acousticness: [0, 1],
          danceability: [0, 1],
          energy: [0, 1],
          instrumentalness: [0, 1],
          liveness: [0, 1],
          loudness: [-Infinity, Infinity],
          speechiness: [0, 1],
          valence: [0, 1],
          tempo: [0, Infinity]
        },
        ...action.value
      }
    default:
      return state;
  }
}

function reducer(state: ApplicationState = INITIAL_STATE, action: Action): ApplicationState {
  if (state.signedIn) {
    return signedInReducer(state, action);
  }
  return signedOutReducer(state, action);
}

export const store = createStore(reducer);
export type ApplicationDispatch = Dispatch<Action>;
