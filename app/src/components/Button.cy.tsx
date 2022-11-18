import Button from "./Button";
import { mount } from "cypress/react";

it("default", function () {
  mount(<Button>button</Button>);
  cy.argosScreenshot(Cypress.currentTest.title);
});

it("primary", function () {
  mount(<Button variant="primary">Primary</Button>);
  cy.argosScreenshot(Cypress.currentTest.title);
});
