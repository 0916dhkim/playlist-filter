import { QueryClientProvider } from "@tanstack/react-query";
import { mount } from "cypress/react18";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";
import { worker } from "../mockHandlers";
import { queryClient } from "../queryClient";
import SignIn from "./SignIn";

it("default", () => {
  worker.use(
    rest.get("/api/profile", (req, res, ctx) => {
      return res(ctx.status(403));
    })
  );

  mount(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    </QueryClientProvider>
  );
  cy.argosScreenshot(Cypress.currentTest.title);
});

it("dark", () => {
  worker.use(
    rest.get("/api/profile", (req, res, ctx) => {
      return res(ctx.status(403));
    })
  );

  mount(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="dark">
          <SignIn />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
  cy.argosScreenshot(Cypress.currentTest.title);
});
