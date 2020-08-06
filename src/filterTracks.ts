import { AudioFeatureKey } from "./spotify_types";
import { TrackInfo, AudioFeatureRange } from "./state";

/**
 * Filter tracks by audio feature ranges.
 * @param tracks Array of track info.
 * @param range Filter criteria.
 */
export function filterTracks(tracks: ReadonlyArray<TrackInfo>, range: AudioFeatureRange): ReadonlyArray<TrackInfo> {
  return tracks.filter(track => {
    for (const feature of AudioFeatureKey) {
      if (track[feature] < range[feature][0] || track[feature] > range[feature][1]) {
        return false;
      }
    }
    return true;
  });
}
