import {
  Playlist,
  FullTrack,
  AudioFeatures,
  AudioFeatureKey
} from "./spotify_types";
import { Session } from "./auth";

export type TrackInfo = Omit<FullTrack, "type"> & Omit<AudioFeatures, "type">;

type SessionState = { session?: Session };

export type LandingPageState = { page: "landing" } & SessionState;

export type AudioFeatureRange = {
  [key in AudioFeatureKey]: [number, number]
};

export type PersonalPageState = {
  page: "personal",
  playlists: ReadonlyArray<Playlist>,
  selectedPlaylistId?: string,
  loadingTracks: boolean,
  tracks: ReadonlyArray<TrackInfo>,
  audioFeatureRange: AudioFeatureRange
} & Required<SessionState>;

export type ExportPageState = {
  page: "export",
  tracks: ReadonlyArray<FullTrack>,
  newPlaylistName: string
} & SessionState

export type ApplicationState = PersonalPageState | LandingPageState | ExportPageState;

export const INITIAL_STATE: LandingPageState = { page: "landing" };

export const DEFAULT_AUDIO_FEATURE_RANGE: Record<AudioFeatureKey, [number, number]> = {
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
}
