import { AudioFeaturesCache, IAudioFeaturesCache } from "./AudioFeaturesCache";
import { CACHE_LIFESPAN, MONGO_URI } from "../../env";
import { ISpotifyAuth, SpotifyAuth } from "./SpotifyAuth";

import { Profile } from "../../models";
import mongoose from "mongoose";

export const DatabaseService = () => {
  mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 1000 }).catch(() => {
    throw new Error(`Failed to connect MongoDB! Check your MONGO_URI`);
  });

  return {
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
          expiresAt: CACHE_LIFESPAN + Math.floor(new Date().getTime() / 1000),
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
