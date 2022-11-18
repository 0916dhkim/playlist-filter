import { QueryClientProvider } from "@tanstack/react-query";
import { mount } from "cypress/react18";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "../queryClient";
import SignIn from "./SignIn";

it("default", () => {
  mount(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    </QueryClientProvider>
  );
  cy.argosScreenshot(Cypress.currentTest.title);
});
