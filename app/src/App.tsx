import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import OAuthCallback from "./pages/OAuthCallback";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";

function App() {
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
