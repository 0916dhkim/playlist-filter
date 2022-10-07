import { CollectionSpec, DocOf, spotifyAuthCollection } from "./collections";
import { getRefreshedToken, getTokenWithAuthorizationCode } from "../spotify";

import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import invariant from "tiny-invariant";

initializeApp();

const db = getFirestore();

export async function getUidByIdToken(idToken: string): Promise<string> {
  const decodedIdToken = await admin.auth().verifyIdToken(idToken);
  return decodedIdToken.uid;
}

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

async function updateDoc<TCollectionSpec extends CollectionSpec<any>>(
  collectionSpec: TCollectionSpec,
  id: string,
  data: Partial<DocOf<TCollectionSpec>>
): Promise<void> {
  const docRef = db.collection(collectionSpec.name).doc(id);
  await docRef.set(data, { merge: true }); // TODO: Should fail if there is no existing doc.
}

/**
 * Get an access token that is not expired.
 */
export async function getValidToken(uid: string): Promise<string> {
  const now = Math.floor(new Date().getTime() / 1000);
  const spotifyAuth = await getDoc(spotifyAuthCollection, uid);
  invariant(spotifyAuth);
  const { accessToken, refreshToken, expiresAt } = spotifyAuth;
  if (expiresAt <= now) {
    const refreshed = await getRefreshedToken(refreshToken);
    await updateDoc(spotifyAuthCollection, uid, {
      accessToken: refreshed.accessToken,
      expiresAt: now + refreshed.expiresIn,
    });
    return refreshed.accessToken;
  }
  return accessToken;
}

export async function connectSpotify(uid: string, code: string): Promise<void> {
  const { accessToken, refreshToken, expiresIn } =
    await getTokenWithAuthorizationCode(code);
  const now = Math.floor(new Date().getTime() / 1000);

  await updateDoc(spotifyAuthCollection, uid, {
    accessToken,
    refreshToken,
    expiresAt: now + expiresIn,
  });
}
