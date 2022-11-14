import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import { QueryClientProvider } from "@tanstack/react-query";
import SignIn from "./pages/SignIn";
import { queryClient } from "./queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route index element={<Home />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
