import { RequestHandler } from "express";
import { DatabaseService } from "../services/database";

export const ProfileHandler =
  (database: DatabaseService): RequestHandler =>
  async (req, res, next) => {
    if (req.session.uid == null) {
      return res.sendStatus(403);
    }
    try {
      const profile = await database.getProfile(req.session.uid);

      return res.json({
        profile,
      });
    } catch (err) {
      return next(err);
    }
  };
