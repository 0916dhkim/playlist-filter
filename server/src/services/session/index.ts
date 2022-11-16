import { DatabaseService } from "../../services/database";
import MongoStore from "connect-mongo";
import session from "express-session";
import { EnvService } from "../env";

export const SessionService = (
  env: EnvService,
  databaseService: DatabaseService
) => {
  return {
    middleware: session({
      secret: env.SESSION_SECRET,
      cookie: {},
      store: MongoStore.create({
        clientPromise: databaseService.getClient(),
        collectionName: "Session",
        mongoOptions: {
          serverSelectionTimeoutMS: 1000,
        },
      }),
      // Firebase hosting strips all cookies except "__session".
      // https://firebase.google.com/docs/hosting/manage-cache#using_cookies
      name: "__session",
    }),
  };
};

export type SessionService = ReturnType<typeof SessionService>;
