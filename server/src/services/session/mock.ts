import { RequestHandler } from "express";
import { SessionData } from "express-session";
import { SessionService } from ".";

export const MockSessionService = (): jest.Mocked<SessionService> => {
  return {
    middleware: jest.fn().mockImplementation(
      MockSessionMiddleware({
        uid: "TEST_UID",
      })
    ),
  };
};

export const MockSessionMiddleware =
  (data: Partial<SessionData>): RequestHandler =>
  (req, res, next) => {
    req.session = Object.assign(req.session ?? {}, data);
    next();
  };
