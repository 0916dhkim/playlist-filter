import { Schema, model } from "mongoose";

export interface IAudioFeaturesCache {
  _id: string;
  expiresAt: number;
  audioFeatures: {
    accousticness?: number | undefined;
    danceability?: number | undefined;
    duration_ms?: number | undefined;
    energy?: number | undefined;
    instrumentalness?: number | undefined;
    liveness?: number | undefined;
    loudness?: number | undefined;
    mode?: number | undefined;
    speechiness?: number | undefined;
    tempo?: number | undefined;
    time_signature?: number | undefined;
    valence?: number | undefined;
  };
}

const audioFeaturesCacheSchema = new Schema<IAudioFeaturesCache>({
  _id: { type: String, required: true },
  expiresAt: { type: Number, required: true },
  audioFeatures: {
    accousticness: { type: Number, required: false },
    danceability: { type: Number, required: false },
    duration_ms: { type: Number, required: false },
    energy: { type: Number, required: false },
    instrumentalness: { type: Number, required: false },
    liveness: { type: Number, required: false },
    loudness: { type: Number, required: false },
    mode: { type: Number, required: false },
    speechiness: { type: Number, required: false },
    tempo: { type: Number, required: false },
    time_signature: { type: Number, required: false },
    valence: { type: Number, required: false },
  },
});

export const AudioFeaturesCache = model<IAudioFeaturesCache>(
  "AudioFeaturesCache",
  audioFeaturesCacheSchema
);
