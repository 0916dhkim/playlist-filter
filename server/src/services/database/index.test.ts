import { DatabaseService } from ".";
import { returnValueOf, mocked } from "../../../test/deepMock";
import { MockEnvService } from "../env/mock";
import { SpotifyAuth } from "./SpotifyAuth";
jest.mock("mongoose", () =>
  jest.requireActual("../../../test/deepMock").deepMock()
);
jest.mock("./SpotifyAuth", () =>
  jest.requireActual("../../../test/deepMock").deepMock()
);

test("getAuthDoc calls SpotifyAuth.findById", async () => {
  const database = DatabaseService(MockEnvService());

  const actual = await database.getAuthDoc("123");
  const expected = await returnValueOf(
    (
      await returnValueOf(SpotifyAuth.findById)
    ).toObject
  );

  expect(mocked(SpotifyAuth.findById)).toHaveBeenCalledWith("123");

  expect(actual).toBe(expected);
});
