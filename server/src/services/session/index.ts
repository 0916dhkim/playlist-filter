import { DatabaseService } from "../../services/database";
import MongoStore from "connect-mongo";
import { SESSION_SECRET } from "../../env";
import session from "express-session";

export const SessionService = (databaseService: DatabaseService) => {
  return {
    middleware: session({
      secret: SESSION_SECRET,
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
