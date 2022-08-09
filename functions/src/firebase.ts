import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
export { default as admin } from "firebase-admin";

initializeApp();

export const db = getFirestore();
export const spotifyAuthCollection = db.collection("SpotifyAuth"); // TODO: Wrap in a service
