import {
  Playlist,
  AudioFeatureKey,
  FullTrack
} from "./spotify_types"
import { TrackInfo } from "./state";

export type Action = {
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
| {
  type: "RESET_AUDIO_FEATURE_RANGE"
}
| {
  type: "GO_TO_EXPORT_PAGE",
  tracks: ReadonlyArray<FullTrack>
}
| {
  type: "SET_NEW_PLAYLIST_NAME",
  value: string
}
