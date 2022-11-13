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
    getAuthDoc: (uid: string) => SpotifyAuth.findById(uid).exec(),
    updateAuthDoc: (uid: string, data: Partial<ISpotifyAuth>) =>
      SpotifyAuth.findByIdAndUpdate(uid, data),
    createAuthDoc: (data: ISpotifyAuth) =>
      SpotifyAuth.findOneAndReplace({ _id: data._id }, data, {
        new: true,
      }),
    getAudioFeaturesCache: (trackId: string) =>
      AudioFeaturesCache.findById(trackId).exec(),
    setAudioFeaturesCache: (
      trackId: string,
      data: IAudioFeaturesCache["audioFeatures"]
    ) =>
      AudioFeaturesCache.findOneAndUpdate(
        { _id: trackId },
        {
          expiresAt: CACHE_LIFESPAN + Math.floor(new Date().getTime() / 1000),
          audioFeatures: data,
        },
        {
          new: true,
        }
      ).exec(),
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
