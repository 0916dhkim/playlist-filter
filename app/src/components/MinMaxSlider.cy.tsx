import { mount } from "cypress/react";
import { atom } from "jotai";
import { ReactNode } from "react";
import MinMaxSlider from "./MinMaxSlider";

type TestContainerProps = {
  dark?: boolean;
  children?: ReactNode;
};

const TestContainer = ({ dark, children }: TestContainerProps) => (
  <div className={dark ? "dark" : ""} style={{ padding: "2rem" }}>
    {children}
  </div>
);

it("0-1", function () {
  const sliderMin = 0;
  const sliderMax = 1;
  const minInputAtom = atom(sliderMin);
  const maxInputAtom = atom(sliderMax);

  mount(
    <TestContainer>
      <MinMaxSlider
        sliderMin={sliderMin}
        sliderMax={sliderMax}
        minInputAtom={minInputAtom}
        maxInputAtom={maxInputAtom}
      />
    </TestContainer>
  );

  cy.argosScreenshot(Cypress.currentTest.title);
});

it("dark 0-1", function () {
  const sliderMin = 0;
  const sliderMax = 1;
  const minInputAtom = atom(sliderMin);
  const maxInputAtom = atom(sliderMax);

  mount(
    <TestContainer dark>
      <MinMaxSlider
        sliderMin={sliderMin}
        sliderMax={sliderMax}
        minInputAtom={minInputAtom}
        maxInputAtom={maxInputAtom}
      />
    </TestContainer>
  );
  cy.pause();

  cy.argosScreenshot(Cypress.currentTest.title);
});

it("30-120", function () {
  const sliderMin = 30;
  const sliderMax = 120;
  const minInputAtom = atom(sliderMin);
  const maxInputAtom = atom(sliderMax);

  mount(
    <TestContainer>
      <MinMaxSlider
        sliderMin={sliderMin}
        sliderMax={sliderMax}
        minInputAtom={minInputAtom}
        maxInputAtom={maxInputAtom}
      />
    </TestContainer>
  );

  cy.argosScreenshot(Cypress.currentTest.title);
});
