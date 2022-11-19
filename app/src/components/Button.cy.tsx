import Button from "./Button";
import { mount } from "cypress/react";

it("default", function () {
  mount(<Button>button</Button>);
  cy.argosScreenshot(Cypress.currentTest.title);
});

it("dark", () => {
  mount(
    <div className="dark">
      <Button>button</Button>
    </div>
  );
  cy.argosScreenshot(Cypress.currentTest.title);
});

it("primary", function () {
  mount(<Button variant="primary">Primary</Button>);
  cy.argosScreenshot(Cypress.currentTest.title);
});

it("dark primary", () => {
  mount(
    <div className="dark">
      <Button variant="primary">button</Button>
    </div>
  );
  cy.argosScreenshot(Cypress.currentTest.title);
});
