import { expect, test, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

import OAuthCallback from "./OAuthCallback";
import { signIn } from "../api/mutations";
import { useNavigate } from "react-router-dom";

vi.mock("../api/mutations");
vi.mock("react-router-dom");

test("Callback page redirects the user to home after connecting Spotify", async () => {
  const code = "testcodetestcode";
  window.history.pushState({}, "", `/?code=${code}`);
  const mockNavigate = vi.fn();
  vi.mocked(useNavigate).mockReturnValue(mockNavigate);

  render(<OAuthCallback />);

  await waitFor(() => expect(vi.mocked(signIn)).toHaveBeenCalledWith(code));
  expect(mockNavigate).toHaveBeenCalledWith("/");
});
