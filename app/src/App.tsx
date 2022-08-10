import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import OAuthCallback from "./pages/OAuthCallback";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import useFirebaseAuth from "./hooks/useFirebaseAuth";

function App() {
  const user = useFirebaseAuth();
  const handleSpotify = async () => {
    if (user == null) {
      throw new Error("User is not logged in");
    }
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/spotify-login-url`,
      {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      }
    );
    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/callback" element={<OAuthCallback />} />
        <Route index element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
