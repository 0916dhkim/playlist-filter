import { QueryClientProvider } from "@tanstack/react-query";
import { mount } from "cypress/react";
import { BrowserRouter } from "react-router-dom";
import Home from ".";
import { queryClient } from "../../queryClient";

beforeEach(() => {
  cy.viewport(1000, 500);
});

it("default", () => {
  mount(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </QueryClientProvider>
  );
  cy.get("[data-testid='playlists-item-name']");
  cy.argosScreenshot(Cypress.currentTest.title);
});

it("dark", () => {
  mount(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="dark">
          <Home />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
  cy.get("[data-testid='playlists-item-name']");
  cy.argosScreenshot(Cypress.currentTest.title);
});
