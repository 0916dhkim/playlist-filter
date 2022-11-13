import { Schema, model } from "mongoose";
export interface ISpotifyAuth {
  _id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const spotifyAuthSchema = new Schema<ISpotifyAuth>({
  _id: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Number, required: true },
});

export const SpotifyAuth = model<ISpotifyAuth>(
  "SpotifyAuth",
  spotifyAuthSchema
);
