import { FirebaseService } from "./services/firebase";
import { Handler } from "express";

const firebaseService = FirebaseService();

export const validateFirebaseIdToken: Handler = async (req, res, next) => {
  // Read the ID Token from the Authorization header.
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (idToken == null) {
    return res.sendStatus(401);
  }

  try {
    req.uid = await firebaseService.getUidByIdToken(idToken);
    next();
    return;
  } catch (error) {
    res.sendStatus(401);
    return;
  }
};
