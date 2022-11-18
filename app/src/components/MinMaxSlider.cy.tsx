import { mount } from "cypress/react";
import { atom } from "jotai";
import MinMaxSlider from "./MinMaxSlider";

it("0-1", function () {
  const sliderMin = 0;
  const sliderMax = 1;
  const minInputAtom = atom(sliderMin);
  const maxInputAtom = atom(sliderMax);

  mount(
    <MinMaxSlider
      sliderMin={sliderMin}
      sliderMax={sliderMax}
      minInputAtom={minInputAtom}
      maxInputAtom={maxInputAtom}
    />
  );

  cy.argosScreenshot(Cypress.currentTest.title);
});

it("30-120", function () {
  const sliderMin = 30;
  const sliderMax = 120;
  const minInputAtom = atom(sliderMin);
  const maxInputAtom = atom(sliderMax);

  mount(
    <MinMaxSlider
      sliderMin={sliderMin}
      sliderMax={sliderMax}
      minInputAtom={minInputAtom}
      maxInputAtom={maxInputAtom}
    />
  );

  cy.argosScreenshot(Cypress.currentTest.title);
});
