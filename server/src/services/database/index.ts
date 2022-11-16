import { AudioFeaturesCache, IAudioFeaturesCache } from "./AudioFeaturesCache";
import { ISpotifyAuth, SpotifyAuth } from "./SpotifyAuth";

import { Profile } from "../../models";
import mongoose from "mongoose";
import { EnvService } from "../env";

export const DatabaseService = (env: EnvService) => {
  const client$ = mongoose
    .connect(env.MONGO_URI, { serverSelectionTimeoutMS: 1000 })
    .then(({ connection }) => connection.getClient())
    .catch(() => {
      throw new Error(`Failed to connect MongoDB! Check your MONGO_URI`);
    });

  return {
    getClient: () => client$,
    getAuthDoc: async (uid: string) => {
      const authDoc = await SpotifyAuth.findById(uid);
      return authDoc?.toObject();
    },
    updateAuthDoc: async (uid: string, data: Partial<ISpotifyAuth>) => {
      const authDoc = await SpotifyAuth.findByIdAndUpdate(uid, data);
      return authDoc?.toObject();
    },
    createAuthDoc: async (data: ISpotifyAuth) => {
      const authDoc = await SpotifyAuth.findOneAndUpdate(
        { _id: data._id },
        data,
        {
          upsert: true,
          new: true,
        }
      );
      return authDoc.toObject();
    },
    getAudioFeaturesCache: async (trackId: string) => {
      const audioFeaturesDoc = await AudioFeaturesCache.findById(trackId);
      return audioFeaturesDoc?.toObject().audioFeatures;
    },
    setAudioFeaturesCache: async (
      trackId: string,
      data: IAudioFeaturesCache["audioFeatures"]
    ) => {
      const audioFeaturesDoc = await AudioFeaturesCache.findOneAndUpdate(
        { _id: trackId },
        {
          expiresAt:
            env.CACHE_LIFESPAN + Math.floor(new Date().getTime() / 1000),
          audioFeatures: data,
        },
        {
          upsert: true,
          new: true,
        }
      );
      return audioFeaturesDoc.toObject().audioFeatures;
    },
    getProfile: async (uid: string): Promise<Profile> => {
      const authDoc = await SpotifyAuth.findById(uid);
      return {
        id: uid,
        isConnectedToSpotify: authDoc != null,
      };
    },
  };
};

export type DatabaseService = ReturnType<typeof DatabaseService>;
