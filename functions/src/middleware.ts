import { Handler } from "express";
import { admin } from "./firebase";

export const validateFirebaseIdToken: Handler = async (req, res, next) => {
  // Read the ID Token from the Authorization header.
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (idToken == null) {
    return res.sendStatus(401);
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    res.sendStatus(401);
    return;
  }
};
