import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import OAuthCallback from "./pages/OAuthCallback";
import { QueryClientProvider } from "@tanstack/react-query";
import SignIn from "./pages/SignIn";
import { queryClient } from "./queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/callback" element={<OAuthCallback />} />
          <Route index element={<Home />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
