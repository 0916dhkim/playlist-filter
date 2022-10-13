import { App, initializeApp } from "firebase-admin/app";
import {
  CollectionSpec,
  DocOf,
  audioFeaturesCacheCollection,
  spotifyAuthCollection,
} from "./collections";

import admin from "firebase-admin";
import env from "../../env";
import { getFirestore } from "firebase-admin/firestore";

let app: App | null = null;

export const FirebaseService = () => {
  if (app == null) {
    app = initializeApp();
  }
  const db = getFirestore(app);

  async function getDoc<TCollectionSpec extends CollectionSpec<any>>(
    collectionSpec: TCollectionSpec,
    id: string
  ): Promise<DocOf<TCollectionSpec> | undefined> {
    const docRef = db.collection(collectionSpec.name).doc(id);
    const doc = await docRef.get();
    const docData = doc.data();

    if (docData == null) {
      return undefined;
    }
    return collectionSpec.schema.parse(docData);
  }

  async function createDoc<TCollectionSpec extends CollectionSpec<any>>(
    collectionSpec: TCollectionSpec,
    id: string,
    data: DocOf<TCollectionSpec>
  ): Promise<void> {
    const docRef = db.collection(collectionSpec.name).doc(id);
    await docRef.set(data);
  }

  async function updateDoc<TCollectionSpec extends CollectionSpec<any>>(
    collectionSpec: TCollectionSpec,
    id: string,
    data: Partial<DocOf<TCollectionSpec>>
  ): Promise<void> {
    const docRef = db.collection(collectionSpec.name).doc(id);
    await docRef.update(data);
  }

  return {
    async getUidByIdToken(idToken: string): Promise<string> {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      return decodedIdToken.uid;
    },

    getAuthDoc: (uid: string) => getDoc(spotifyAuthCollection, uid),
    updateAuthDoc: (
      uid: string,
      data: Partial<DocOf<typeof spotifyAuthCollection>>
    ) => updateDoc(spotifyAuthCollection, uid, data),
    createAuthDoc: (uid: string, data: DocOf<typeof spotifyAuthCollection>) =>
      createDoc(spotifyAuthCollection, uid, data),
    getAudioFeaturesCache: async (trackId: string) => {
      const doc = await getDoc(audioFeaturesCacheCollection, trackId);
      if (doc == null) {
        return undefined;
      }
      const now = Math.floor(new Date().getTime() / 1000);
      if (doc.expiresAt <= now) {
        return undefined;
      }
      return doc.audioFeatures;
    },
    setAudioFeaturesCache: (
      trackId: string,
      data: DocOf<typeof audioFeaturesCacheCollection>["audioFeatures"]
    ) =>
      createDoc(audioFeaturesCacheCollection, trackId, {
        expiresAt: env.CACHE_LIFESPAN + Math.floor(new Date().getTime() / 1000),
        audioFeatures: data,
      }),
  };
};

export type FirebaseService = ReturnType<typeof FirebaseService>;
