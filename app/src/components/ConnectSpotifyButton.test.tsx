import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import ConnectSpotifyButton from "./ConnectSpotifyButton";
import { getSpotifyLoginUrl } from "../firebase";
import { redirect } from "../browser";
import userEvent from "@testing-library/user-event";

vi.mock("../firebase");
vi.mock("../browser");

test("should fetch Spotify login URL and redirect to that URL", async () => {
  const url = "https://example.com/login/123";
  vi.mocked(getSpotifyLoginUrl).mockResolvedValue(url);

  const user = userEvent.setup();
  render(<ConnectSpotifyButton />);

  await user.click(screen.getByTestId("connect-spotify-button"));

  expect(vi.mocked(redirect)).toHaveBeenCalledWith(url);
});
